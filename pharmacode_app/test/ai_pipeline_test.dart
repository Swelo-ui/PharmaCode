import 'package:flutter_test/flutter_test.dart';
import 'package:pharmacode_app/services/ai/ai_config.dart';
import 'package:pharmacode_app/services/ai/ai_key_manager.dart';
import 'package:pharmacode_app/services/ai/pharma_concept_synthesizer.dart';
import 'package:pharmacode_app/services/ai/pharma_knowledge_service.dart';
import 'package:pharmacode_app/services/ai/pharma_prompt_templates.dart';
import 'package:pharmacode_app/services/ai/web_search_service.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('AI Config & Providers', () {
    test('Providers are correctly configured with models and endpoints', () {
      expect(AiConfig.providers.containsKey(AiProvider.groq), isTrue);
      expect(AiConfig.providers.containsKey(AiProvider.gemini), isTrue);
      expect(AiConfig.providers.containsKey(AiProvider.nvidia), isTrue);
      expect(AiConfig.providers.containsKey(AiProvider.openrouter), isTrue);
      expect(AiConfig.providers.containsKey(AiProvider.ovhcloud), isTrue);
      expect(AiConfig.providers.containsKey(AiProvider.pollinations), isTrue);

      final groq = AiConfig.providers[AiProvider.groq]!;
      expect(groq.endpoint, contains('api.groq.com'));
      expect(groq.primaryModel, contains('gpt-oss'));
      expect(groq.requiresKey, isFalse);

      final gemini = AiConfig.providers[AiProvider.gemini]!;
      expect(gemini.primaryModel, contains('gemini'));

      final nvidia = AiConfig.providers[AiProvider.nvidia]!;
      expect(nvidia.endpoint, contains('integrate.api.nvidia.com'));
      expect(nvidia.primaryModel, contains('nemotron'));

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

      // Verify system keys decode to valid prefixes
      final groqKey = AiConfig.decodeSecret(AiConfig.encodedGroqKey, AiConfig.xorKey);
      expect(groqKey.startsWith('gsk_'), isTrue);

      final geminiKey = AiConfig.decodeSecret(AiConfig.encodedGeminiKey, AiConfig.xorKey);
      expect(geminiKey.startsWith('AQ.'), isTrue);

      final nvKey1 = AiConfig.decodeSecret(AiConfig.encodedNvidiaKey1, AiConfig.xorKey);
      expect(nvKey1.startsWith('nvapi-'), isTrue);
    });
  });

  group('AI Key Manager & Failover Tracking', () {
    late AiKeyManager keyManager;

    setUp(() {
      keyManager = AiKeyManager();
    });

    test('Zero-key and built-in system providers report online', () {
      final statuses = keyManager.getProviderStatuses();
      expect(statuses.containsKey(AiProvider.groq), isTrue);
      expect(statuses[AiProvider.groq], equals('Online'));
      expect(statuses[AiProvider.gemini], equals('Online'));
      expect(statuses[AiProvider.nvidia], equals('Online'));
      expect(statuses[AiProvider.ovhcloud], equals('Online'));
      expect(statuses[AiProvider.pollinations], equals('Online'));
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

    test('Suppresses web search for meta/persona and jailbreak questions', () {
      expect(webSearch.isGreetingOrCasual('who are you'), isTrue);
      expect(webSearch.shouldTriggerSearch('who are you'), isFalse);
      expect(webSearch.isGreetingOrCasual('what is your name'), isTrue);
      expect(webSearch.isGreetingOrCasual('tum kaun ho'), isTrue);
      expect(webSearch.isGreetingOrCasual('now i give you google access'), isTrue);
      expect(webSearch.shouldTriggerSearch('now i give you google access'), isFalse);
      expect(webSearch.isGreetingOrCasual('tell me a story'), isTrue);
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

  group('Pharma Concept Synthesizer & Answering Engine', () {
    test('Correctly identifies identity queries', () {
      expect(PharmaConceptSynthesizer.isIdentityQuery('who are you'), isTrue);
      expect(PharmaConceptSynthesizer.isIdentityQuery('tum kaun ho'), isTrue);
      expect(PharmaConceptSynthesizer.isIdentityQuery('what can you do'), isTrue);
      expect(PharmaConceptSynthesizer.isIdentityQuery('who made you'), isTrue);
      expect(PharmaConceptSynthesizer.isIdentityQuery('what are you'), isTrue);
      expect(PharmaConceptSynthesizer.isIdentityQuery('kya naam hai'), isTrue);
      expect(PharmaConceptSynthesizer.isIdentityQuery('tell me about bioavailability'), isFalse);
    });

    test('Persona intro contains PharmaCode AI Tutor identity and no ChatGPT', () {
      final intro = PharmaConceptSynthesizer.getPersonaIntroduction();
      expect(intro, contains('PharmaCode AI Tutor'));
      expect(intro, contains('PharmaLearn AI'));
      expect(intro, contains('PharmaCode'));
      expect(intro, isNot(contains('ChatGPT')));
      expect(intro, isNot(contains('OpenAI')));
    });

    test('Bioavailability answer provides full academic explanation with formulas and suggestions', () async {
      final knowledgeService = PharmaKnowledgeService();
      final ctx = await knowledgeService.retrieveContext('Bioavailability');

      final answer = PharmaConceptSynthesizer.synthesizeAnswer(
        query: 'tell me about bioavailability',
        mode: PharmaChatMode.tutorHinglish,
        ctx: ctx,
      );

      // Must actually answer the question with academic depth
      expect(answer, contains('rate and extent'));
      expect(answer, contains('Absolute Bioavailability'));
      expect(answer, contains('AUC'));
      expect(answer, contains('First-Pass'));
      expect(answer, contains('Bioequivalence'));
      expect(answer, contains('Suggested In-App Syllabus & Study Links:'));
    });

    test('Blood definition answer provides fluid connective tissue, cells, and functions without generic template', () async {
      final knowledgeService = PharmaKnowledgeService();
      final ctx = await knowledgeService.retrieveContext('blood');

      final answer = PharmaConceptSynthesizer.synthesizeAnswer(
        query: 'blood ki defination',
        mode: PharmaChatMode.tutorHinglish,
        ctx: ctx,
      );

      expect(answer, contains('fluid connective tissue'));
      expect(answer, contains('Plasma'));
      expect(answer, contains('Erythrocytes'));
      expect(answer, contains('Leukocytes'));
      expect(answer, contains('Platelets'));
      expect(answer, isNot(contains('Scientific Principle: Har pharmaceutical formulation')));
    });

    test('New drugs answer provides actual recent approved drugs without generic template', () async {
      final knowledgeService = PharmaKnowledgeService();
      final ctx = await knowledgeService.retrieveContext('new drugs names');

      final answer = PharmaConceptSynthesizer.synthesizeAnswer(
        query: 'new drugs names',
        mode: PharmaChatMode.tutorHinglish,
        ctx: ctx,
      );

      expect(answer, contains('Tirzepatide'));
      expect(answer, contains('Donanemab'));
      expect(answer, contains('Lecanemab'));
      expect(answer, isNot(contains('Scientific Principle: Har pharmaceutical formulation')));
    });

    test('Tissues answer provides complete Epithelial, Connective, Muscular, Nervous breakdown', () async {
      final knowledgeService = PharmaKnowledgeService();
      final ctx = await knowledgeService.retrieveContext('Explain tissues in detail');

      final answer = PharmaConceptSynthesizer.synthesizeAnswer(
        query: 'Explain tissues in detail',
        mode: PharmaChatMode.tutorHinglish,
        ctx: ctx,
      );

      expect(answer, contains('Epithelial Tissue'));
      expect(answer, contains('Connective Tissue'));
      expect(answer, contains('Muscular Tissue'));
      expect(answer, contains('Nervous Tissue'));
      expect(answer, contains('Dense Regular Connective Tissue'));
      expect(answer, contains('Tendons'));
      expect(answer, contains('Ligaments'));
      expect(answer, contains('Intercalated discs'));
      expect(answer, contains('Important University Exam Questions'));
    });
  });
}
