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
      expect(AiConfig.providers.containsKey(AiProvider.ovhcloud), isTrue);
      expect(AiConfig.providers.containsKey(AiProvider.pollinations), isTrue);

      final groq = AiConfig.providers[AiProvider.groq]!;
      expect(groq.endpoint, contains('api.groq.com'));
      expect(groq.primaryModel, contains('llama'));
      expect(groq.requiresKey, isTrue);

      final ovh = AiConfig.providers[AiProvider.ovhcloud]!;
      expect(ovh.requiresKey, isFalse);
      expect(ovh.endpoint, contains('ovh.net'));

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

    test('Zero-key providers report online', () {
      final statuses = keyManager.getProviderStatuses();
      expect(statuses.containsKey(AiProvider.groq), isTrue);
      expect(statuses[AiProvider.ovhcloud], contains('Online'));
      expect(statuses[AiProvider.pollinations], contains('Online'));
    });

    test('Custom key handling works seamlessly', () async {
      await keyManager.setCustomKey(AiProvider.groq, 'gsk_custom_test_123');
      expect(keyManager.getCustomKey(AiProvider.groq), equals('gsk_custom_test_123'));
      expect(keyManager.isProviderAvailable(AiProvider.groq), isTrue);

      keyManager.markProviderFailure(AiProvider.groq, statusCode: 429);
      expect(keyManager.isProviderAvailable(AiProvider.groq), isFalse);

      keyManager.markProviderSuccess(AiProvider.groq);
      expect(keyManager.isProviderAvailable(AiProvider.groq), isTrue);
    });
  });

  group('Pharma Prompt Templates & Persona', () {
    test('Initial greeting is strictly professional without emojis', () {
      final greeting = PharmaPromptTemplates.getInitialGreeting();
      expect(greeting, contains('PharmaHelper'));
      expect(greeting, contains('Hinglish'));
      expect(greeting, isNot(contains('💊')));
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
      expect(webSearch.shouldTriggerSearch('hi'), isFalse);
      expect(webSearch.shouldTriggerSearch('hello'), isFalse);
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
