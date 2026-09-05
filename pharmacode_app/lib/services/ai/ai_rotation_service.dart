import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'ai_config.dart';
import 'ai_key_manager.dart';
import 'pharma_concept_synthesizer.dart';
import 'pharma_knowledge_service.dart';
import 'pharma_prompt_templates.dart';
import 'web_search_service.dart';

class ChatMessage {
  final String id;
  final String content;
  final bool isUser;
  final DateTime timestamp;
  final String? providerUsed;
  final List<SearchResultItem> citations;

  ChatMessage({
    required this.id,
    required this.content,
    required this.isUser,
    required this.timestamp,
    this.providerUsed,
    this.citations = const [],
  });
}

class AiRotationService {
  static final AiRotationService _instance = AiRotationService._internal();
  factory AiRotationService() => _instance;
  AiRotationService._internal();

  final AiKeyManager _keyManager = AiKeyManager();
  final WebSearchService _webSearchService = WebSearchService();
  final PharmaKnowledgeService _knowledgeService = PharmaKnowledgeService();

  /// Send message with multi-tier automatic fallback across free providers
  Future<ChatMessage> sendMessage({
    required String userMessage,
    required List<ChatMessage> history,
    required PharmaChatMode mode,
    bool forceWebSearch = false,
    String? subjectContext,
  }) async {
    final startTime = DateTime.now();

    // 0. Intercept assistant identity questions immediately (0ms latency, 100% accurate persona)
    if (PharmaConceptSynthesizer.isIdentityQuery(userMessage)) {
      return ChatMessage(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        content: PharmaConceptSynthesizer.getPersonaIntroduction(),
        isUser: false,
        timestamp: DateTime.now(),
        providerUsed: 'PharmaLearn AI',
        citations: const [],
      );
    }

    // 1. Gather in-app context (Syllabus, Blogs, FAQs)
    final knowledgeCtx = await _knowledgeService.retrieveContext(userMessage);
    final inAppContext = _knowledgeService.formatForPrompt(knowledgeCtx);

    // 2. Check and gather live web search grounding if needed
    List<SearchResultItem> citations = [];
    String? webContext;
    if (forceWebSearch || mode == PharmaChatMode.webSearch || _webSearchService.shouldTriggerSearch(userMessage)) {
      try {
        citations = await _webSearchService.search(userMessage);
        if (citations.isNotEmpty) {
          webContext = _webSearchService.formatForPrompt(citations);
        }
      } catch (e) {
        debugPrint('[AiRotationService] Web search grounding notice: $e');
      }
    }

    // 3. Build system prompt
    final systemPrompt = PharmaPromptTemplates.buildSystemPrompt(
      mode: mode,
      inAppContext: inAppContext,
      webSearchContext: webContext,
      subjectContext: subjectContext,
    );

    // 4. Format message history
    final messages = _formatHistoryForApi(
      systemPrompt: systemPrompt,
      history: history,
      currentMessage: userMessage,
    );

    // 5. Providers priority order:
    // Google Gemini (Deep reasoning & 8K tokens) -> Groq (Ultra-fast LPU) -> NVIDIA NIM -> OpenRouter -> OVHcloud -> Pollinations
    final providerQueue = [
      AiProvider.gemini,
      AiProvider.groq,
      AiProvider.nvidia,
      AiProvider.openrouter,
      AiProvider.ovhcloud,
      AiProvider.pollinations,
    ];

    // Priority: Providers with active custom keys -> Providers with online system keys -> Inactive/Cooldown providers
    providerQueue.sort((a, b) {
      final aHasCustom = _keyManager.getCustomKey(a) != null && _keyManager.getCustomKey(a)!.isNotEmpty;
      final bHasCustom = _keyManager.getCustomKey(b) != null && _keyManager.getCustomKey(b)!.isNotEmpty;
      if (aHasCustom && !bHasCustom) return -1;
      if (!aHasCustom && bHasCustom) return 1;

      final aAvail = _keyManager.isProviderAvailable(a);
      final bAvail = _keyManager.isProviderAvailable(b);
      if (aAvail && !bAvail) return -1;
      if (!aAvail && bAvail) return 1;
      return 0;
    });

    String? generatedAnswer;
    String? successfulProvider;

    for (final provider in providerQueue) {
      try {
        debugPrint('[AiRotationService] Trying provider: ${provider.name}...');
        final answer = await _executeProviderCall(provider, messages);

        if (answer != null && answer.trim().isNotEmpty) {
          generatedAnswer = answer.trim();
          successfulProvider = AiConfig.providers[provider]?.displayName ?? provider.name;
          _keyManager.markProviderSuccess(provider);
          debugPrint('[AiRotationService] Successfully generated with ${provider.name}');
          break;
        }
      } catch (e) {
        debugPrint('[AiRotationService] Provider ${provider.name} failed: $e. Falling back to next provider...');
        _keyManager.markProviderFailure(provider);
        // Seamlessly continue loop to next tier
      }
    }

    // Final safety fallback if all networks faced harsh timeouts
    if (generatedAnswer == null || generatedAnswer.isEmpty) {
      generatedAnswer = _generateLocalSafetyResponse(
        userMessage,
        knowledgeCtx,
        mode,
        citations: citations,
      );
      successfulProvider = 'PharmaCode Academic Engine';
    }

    final elapsed = DateTime.now().difference(startTime).inMilliseconds;
    debugPrint('[AiRotationService] Response complete in ${elapsed}ms via $successfulProvider');

    return ChatMessage(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      content: generatedAnswer,
      isUser: false,
      timestamp: DateTime.now(),
      providerUsed: successfulProvider,
      citations: citations,
    );
  }

  /// Dispatch request to specific provider
  Future<String?> _executeProviderCall(
    AiProvider provider,
    List<Map<String, String>> messages,
  ) async {
    final config = AiConfig.providers[provider]!;
    final apiKey = await _keyManager.getKey(provider);

    // If provider requires key and none available, move to next
    if (config.requiresKey && (apiKey == null || apiKey.isEmpty)) {
      return null;
    }

    switch (provider) {
      case AiProvider.groq:
        return _callOpenAiCompatible(
          endpoint: config.endpoint,
          apiKey: apiKey ?? '',
          model: config.primaryModel,
          fallbackModel: config.fallbackModel,
          messages: messages,
          provider: provider,
        );

      case AiProvider.gemini:
        return _callGeminiNative(
          config: config,
          apiKey: apiKey ?? '',
          messages: messages,
          provider: provider,
        );

      case AiProvider.nvidia:
        return _callOpenAiCompatible(
          endpoint: config.endpoint,
          apiKey: apiKey ?? '',
          model: config.primaryModel,
          fallbackModel: config.fallbackModel,
          messages: messages,
          provider: provider,
        );

      case AiProvider.openrouter:
        return _callOpenAiCompatible(
          endpoint: config.endpoint,
          apiKey: apiKey ?? '',
          model: config.primaryModel,
          fallbackModel: config.fallbackModel,
          messages: messages,
          provider: provider,
          extraHeaders: {
            'HTTP-Referer': 'https://pharmacode.vercel.app',
            'X-Title': 'PharmaCode B.Pharm AI',
          },
        );

      case AiProvider.ovhcloud:
        return _callOpenAiCompatible(
          endpoint: config.endpoint,
          apiKey: '',
          model: config.primaryModel,
          fallbackModel: config.fallbackModel,
          messages: messages,
          provider: provider,
        );

      case AiProvider.pollinations:
        return _callPollinations(messages);
    }
  }

  /// Native Google Gemini REST API call
  Future<String?> _callGeminiNative({
    required AiProviderConfig config,
    required String apiKey,
    required List<Map<String, String>> messages,
    required AiProvider provider,
  }) async {
    final modelsToTry = [config.primaryModel, config.fallbackModel];

    for (final model in modelsToTry) {
      try {
        final uri = Uri.parse(
          'https://generativelanguage.googleapis.com/v1beta/models/$model:generateContent?key=$apiKey',
        );

        final contents = <Map<String, dynamic>>[];
        String? systemInstructionText;

        for (final m in messages) {
          if (m['role'] == 'system') {
            systemInstructionText = m['content'];
            continue;
          }
          final role = m['role'] == 'assistant' ? 'model' : 'user';
          contents.add({
            'role': role,
            'parts': [
              {'text': m['content'] ?? ''}
            ]
          });
        }

        final payload = <String, dynamic>{
          if (systemInstructionText != null && systemInstructionText.isNotEmpty)
            'systemInstruction': {
              'parts': [
                {'text': systemInstructionText}
              ]
            },
          'contents': contents.isEmpty
              ? [
                  {
                    'role': 'user',
                    'parts': [
                      {'text': 'Hello'}
                    ]
                  }
                ]
              : contents,
          'generationConfig': {
            'temperature': 0.7,
            'maxOutputTokens': 4096,
          },
        };

        final res = await http.post(
          uri,
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode(payload),
        ).timeout(const Duration(seconds: 14));

        if (res.statusCode == 200) {
          final data = jsonDecode(utf8.decode(res.bodyBytes));
          final candidates = data['candidates'] as List?;
          if (candidates != null && candidates.isNotEmpty) {
            final parts = candidates[0]['content']?['parts'] as List?;
            if (parts != null && parts.isNotEmpty) {
              return parts[0]['text'] as String?;
            }
          }
        }

        if (res.statusCode == 429) {
          _keyManager.markProviderFailure(provider, statusCode: 429);
          throw Exception('Gemini HTTP 429 rate limit');
        }
      } catch (e) {
        debugPrint('[AiRotationService] Gemini $model attempt notice: $e');
      }
    }

    throw Exception('Gemini failed across all attempted models');
  }

  /// Standard OpenAI-compatible Chat Completions API with automatic fallback model
  Future<String?> _callOpenAiCompatible({
    required String endpoint,
    required String apiKey,
    required String model,
    required String fallbackModel,
    required List<Map<String, String>> messages,
    required AiProvider provider,
    Map<String, String>? extraHeaders,
  }) async {
    final headers = {
      'Content-Type': 'application/json',
      if (apiKey.isNotEmpty) 'Authorization': 'Bearer $apiKey',
      ...?extraHeaders,
    };

    final modelsToTry = [model, if (fallbackModel.isNotEmpty && fallbackModel != model) fallbackModel];

    for (final currentModel in modelsToTry) {
      try {
        final body = jsonEncode({
          'model': currentModel,
          'messages': messages,
          'temperature': 0.7,
          'max_tokens': 2800,
        });

        final res = await http.post(
          Uri.parse(endpoint),
          headers: headers,
          body: body,
        ).timeout(const Duration(seconds: 14));

        if (res.statusCode == 200) {
          final data = jsonDecode(utf8.decode(res.bodyBytes));
          final choices = data['choices'] as List?;
          if (choices != null && choices.isNotEmpty) {
            final msg = choices[0]['message'];
            final finishReason = choices[0]['finish_reason'];
            String? content = msg['content'] as String?;
            if (content != null && content.isNotEmpty) {
              // If the model was stopped mid-sentence due to token budget:
              if (finishReason == 'length') {
                final lastSpace = content.lastIndexOf(' ');
                if (lastSpace > 0 && !RegExp(r'[.!?:;]$').hasMatch(content.trim())) {
                  content = content.substring(0, lastSpace).trim();
                }
                content = '$content\n\n*(Aage ke points janne ke liye "Continue" ya specific topic type karein).*';
              }
              return content;
            }
          }
        }

        // On 429 (Rate Limit), notify key manager and break
        if (res.statusCode == 429) {
          _keyManager.markProviderFailure(provider, statusCode: res.statusCode);
          throw Exception('Provider $provider returned HTTP 429');
        }
      } catch (e) {
        debugPrint('[AiRotationService] $provider model $currentModel notice: $e');
      }
    }

    throw Exception('Provider $provider failed on all model tiers');
  }

  /// Pollinations Zero-Key Serverless Fallback
  Future<String?> _callPollinations(List<Map<String, String>> messages) async {
    try {
      final lastUserMessage = messages.lastWhere((m) => m['role'] == 'user', orElse: () => {'content': ''})['content'] ?? '';
      if (lastUserMessage.isEmpty) return null;

      final prompt = Uri.encodeComponent(lastUserMessage);
      final uri = Uri.parse('https://text.pollinations.ai/$prompt?model=openai');

      final res = await http.get(uri, headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 PharmaCode/1.0',
      }).timeout(const Duration(seconds: 10));

      if (res.statusCode == 200) {
        final text = utf8.decode(res.bodyBytes).trim();
        if (text.isNotEmpty &&
            !text.startsWith('{') &&
            !text.contains('"error"') &&
            !text.contains('OpenAI') &&
            !text.contains("ChatGPT")) {
          return text;
        }
      }
      return null;
    } catch (_) {
      return null;
    }
  }

  /// Format messages array for chat completions API
  List<Map<String, String>> _formatHistoryForApi({
    required String systemPrompt,
    required List<ChatMessage> history,
    required String currentMessage,
  }) {
    final result = <Map<String, String>>[];

    result.add({'role': 'system', 'content': systemPrompt});

    // Take last 6 messages to stay within token budgets
    final recentHistory = history.length > 6 ? history.sublist(history.length - 6) : history;
    for (final m in recentHistory) {
      result.add({
        'role': m.isUser ? 'user' : 'assistant',
        'content': m.content,
      });
    }

    result.add({'role': 'user', 'content': currentMessage});
    return result;
  }

  /// Local intelligent academic response
  String _generateLocalSafetyResponse(
    String query,
    PharmaKnowledgeContext ctx,
    PharmaChatMode mode, {
    List<SearchResultItem> citations = const [],
  }) {
    return PharmaConceptSynthesizer.synthesizeAnswer(
      query: query,
      mode: mode,
      ctx: ctx,
      citations: citations,
    );
  }
}
