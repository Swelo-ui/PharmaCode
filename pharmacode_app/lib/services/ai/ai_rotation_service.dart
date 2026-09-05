import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'ai_config.dart';
import 'ai_key_manager.dart';
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
  }) async {
    final startTime = DateTime.now();

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
    );

    // 4. Format message history
    final messages = _formatHistoryForApi(
      systemPrompt: systemPrompt,
      history: history,
      currentMessage: userMessage,
    );

    // 5. Providers priority order:
    // Custom Keys (Groq / Gemini / OpenRouter) -> OVHcloud Kepler (Zero-Key) -> Pollinations (Zero-Key)
    final providerQueue = [
      AiProvider.groq,
      AiProvider.gemini,
      AiProvider.openrouter,
      AiProvider.ovhcloud,
      AiProvider.pollinations,
    ];

    // Priority: Providers with active custom keys -> Keyless providers -> Inactive providers
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
      generatedAnswer = _generateLocalSafetyResponse(userMessage, knowledgeCtx, mode);
      successfulProvider = 'PharmaCode Local Engine';
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
          apiKey: apiKey!,
          model: config.primaryModel,
          fallbackModel: config.fallbackModel,
          messages: messages,
          provider: provider,
        );

      case AiProvider.gemini:
        return _callOpenAiCompatible(
          endpoint: config.endpoint,
          apiKey: apiKey!,
          model: config.primaryModel,
          fallbackModel: config.fallbackModel,
          messages: messages,
          provider: provider,
        );

      case AiProvider.openrouter:
        return _callOpenAiCompatible(
          endpoint: config.endpoint,
          apiKey: apiKey!,
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

  /// Standard OpenAI-compatible Chat Completions API
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

    final body = jsonEncode({
      'model': model,
      'messages': messages,
      'temperature': 0.7,
      'max_tokens': 1500,
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
        return msg['content'] as String?;
      }
    }

    // On 429 (Rate Limit), notify key manager and throw
    if (res.statusCode == 429) {
      _keyManager.markProviderFailure(provider, statusCode: res.statusCode);
      throw Exception('Provider $provider returned HTTP 429');
    }

    throw Exception('Provider $provider failed with HTTP ${res.statusCode}: ${res.body}');
  }

  /// Pollinations Zero-Key Serverless Fallback
  Future<String?> _callPollinations(List<Map<String, String>> messages) async {
    try {
      final lastUserMessage = messages.lastWhere((m) => m['role'] == 'user', orElse: () => {'content': ''})['content'] ?? '';
      if (lastUserMessage.isEmpty) return null;

      final prompt = Uri.encodeComponent(lastUserMessage);
      final uri = Uri.parse('https://text.pollinations.ai/$prompt?model=openai-fast');

      final res = await http.get(uri, headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 PharmaCode/1.0',
      }).timeout(const Duration(seconds: 10));

      if (res.statusCode == 200) {
        final text = utf8.decode(res.bodyBytes).trim();
        if (text.isNotEmpty && !text.startsWith('{') && !text.contains('"error"')) {
          return text;
        }
      }
    } catch (e) {
      debugPrint('[AiRotationService] Pollinations fallback notice: $e');
    }

    return null;
  }

  /// Format last 6 messages into API format
  List<Map<String, String>> _formatHistoryForApi({
    required String systemPrompt,
    required List<ChatMessage> history,
    required String currentMessage,
  }) {
    final List<Map<String, String>> result = [
      {'role': 'system', 'content': systemPrompt},
    ];

    // Take last 4 messages to preserve tokens & latency
    final recent = history.length > 4 ? history.sublist(history.length - 4) : history;
    for (final msg in recent) {
      result.add({
        'role': msg.isUser ? 'user' : 'assistant',
        'content': msg.content,
      });
    }

    result.add({'role': 'user', 'content': currentMessage});
    return result;
  }

  /// Local intelligent response if user is completely offline without internet
  String _generateLocalSafetyResponse(
    String query,
    PharmaKnowledgeContext ctx,
    PharmaChatMode mode,
  ) {
    final buffer = StringBuffer();
    buffer.writeln('### PharmaHelper (Offline Study Guide)\n');
    buffer.writeln('Main abhi aapke device ke offline database se information retrieve kar raha hoon:\n');

    if (!ctx.isEmpty) {
      if (ctx.syllabusMatches.isNotEmpty) {
        buffer.writeln('**Aapke B.Pharm NEP 2020 Syllabus me yeh topic yahan hai:**');
        for (final s in ctx.syllabusMatches) {
          buffer.writeln('$s\n');
        }
      }
      if (ctx.blogMatches.isNotEmpty) {
        buffer.writeln('**PharmaCode Career & Study Kits:**');
        for (final b in ctx.blogMatches) {
          buffer.writeln('$b\n');
        }
      }
      if (ctx.faqMatches.isNotEmpty) {
        buffer.writeln('**Related Q&A:**');
        for (final f in ctx.faqMatches) {
          buffer.writeln('$f\n');
        }
      }
    } else {
      buffer.writeln('Aapka question study material me match hua hai! Detailed AI explanation ke liye kripya internet connection check karein ya AI Settings se apna custom Groq/Gemini key connect karein.');
    }

    return buffer.toString();
  }
}
