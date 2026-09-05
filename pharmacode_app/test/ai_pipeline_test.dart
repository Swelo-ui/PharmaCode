import 'package:flutter_test/flutter_test.dart';
import 'package:pharmacode_app/services/ai/ai_config.dart';
import 'package:pharmacode_app/services/ai/ai_key_manager.dart';
import 'package:pharmacode_app/services/ai/pharma_knowledge_service.dart';
import 'package:pharmacode_app/services/ai/pharma_prompt_templates.dart';
import 'package:pharmacode_app/services/ai/web_search_service.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('AI Config & Providers', () {
    test('Providers are correctly configured with models and endpoints', () {
      expect(AiConfig.providers.containsKey(AiProvider.groq), isTrue);
      expect(AiConfig.providers.containsKey(AiProvider.gemini), isTrue);
      expect(AiConfig.providers.containsKey(AiProvider.openrouter), isTrue);
      expect(AiConfig.providers.containsKey(AiProvider.pollinations), isTrue);

      final groq = AiConfig.providers[AiProvider.groq]!;
      expect(groq.endpoint, contains('api.groq.com'));
      expect(groq.primaryModel, contains('llama'));
      expect(groq.requiresKey, isTrue);

      final pollinations = AiConfig.providers[AiProvider.pollinations]!;
      expect(pollinations.requiresKey, isFalse);
      expect(pollinations.endpoint, contains('pollinations.ai'));
    });

    test('Bitwise XOR obfuscation correctly encodes and decodes secrets', () {
      const plain = 'gsk_test_api_key_12345';
      final encoded = AiConfig.encodeSecret(plain, 0x5A);
      final decoded = AiConfig.decodeSecret(encoded, 0x5A);
      expect(decoded, equals(plain));
    });
  });

  group('AI Key Manager & Failover Tracking', () {
    late AiKeyManager keyManager;

    setUp(() {
      keyManager = AiKeyManager();
    });

    test('Initial key resolution returns valid keys', () async {
      final groqKey = await keyManager.getKey(AiProvider.groq);
      expect(groqKey, isNotNull);
      expect(groqKey!.startsWith('gsk_'), isTrue);

      final polKey = await keyManager.getKey(AiProvider.pollinations);
      expect(polKey, isNull); // Pollinations is zero-key
    });

    test('Provider statuses report online initially', () {
      final statuses = keyManager.getProviderStatuses();
      expect(statuses.containsKey(AiProvider.groq), isTrue);
      expect(statuses[AiProvider.pollinations], contains('Online'));
    });

    test('429 Rate limit triggers cooldown and records failure', () {
      keyManager.markProviderFailure(AiProvider.groq, statusCode: 429);
      final statuses = keyManager.getProviderStatuses();
      expect(statuses[AiProvider.groq], contains('Rate Limited'));
      expect(keyManager.isProviderAvailable(AiProvider.groq), isFalse);

      keyManager.markProviderSuccess(AiProvider.groq);
      expect(keyManager.isProviderAvailable(AiProvider.groq), isTrue);
    });
  });

  group('Pharma Prompt Templates & Persona', () {
    test('Initial greeting contains capsule mascot welcoming text', () {
      final greeting = PharmaPromptTemplates.getInitialGreeting();
      expect(greeting, contains('PharmaHelper'));
      expect(greeting, contains('💊'));
      expect(greeting, contains('Hinglish'));
    });

    test('System prompt builds successfully with mode instructions', () {
      final promptHinglish = PharmaPromptTemplates.buildSystemPrompt(
        mode: PharmaChatMode.tutorHinglish,
        inAppContext: 'Tablet compression defects: Capping and Lamination.',
      );
      expect(promptHinglish, contains('Hinglish'));
      expect(promptHinglish, contains('Tablet compression defects'));

      final promptExam = PharmaPromptTemplates.buildSystemPrompt(
        mode: PharmaChatMode.examPrep,
      );
      expect(promptExam, contains('5-Mark'));
    });
  });

  group('Web Search Heuristics', () {
    final webSearch = WebSearchService();

    test('Triggers search on clinical, FDA, CDSCO, or latest queries', () {
      expect(webSearch.shouldTriggerSearch('latest fda approvals 2026'), isTrue);
      expect(webSearch.shouldTriggerSearch('cdsco recent circular on cosmetics'), isTrue);
      expect(webSearch.shouldTriggerSearch('recent clinical trial phases update'), isTrue);
      expect(webSearch.shouldTriggerSearch('what is simple tablet definition'), isFalse);
    });
  });

  group('Pharma Knowledge Service (RAG)', () {
    final knowledgeService = PharmaKnowledgeService();

    test('Context retrieval finds relevant syllabus or blog data', () async {
      final ctx = await knowledgeService.retrieveContext('Bioavailability');
      final formatted = knowledgeService.formatForPrompt(ctx);
      expect(formatted, isNotEmpty);
      expect(formatted.toLowerCase(), contains('pharmacode'));
    });
  });
}
