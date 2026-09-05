import 'dart:convert';

/// Supported AI Providers
enum AiProvider {
  groq,
  gemini,
  nvidia,
  openrouter,
  ovhcloud,
  pollinations,
}

class AiProviderConfig {
  final AiProvider provider;
  final String displayName;
  final String endpoint;
  final String primaryModel;
  final String fallbackModel;
  final bool requiresKey;
  final String keySignupUrl;
  final String description;

  const AiProviderConfig({
    required this.provider,
    required this.displayName,
    required this.endpoint,
    required this.primaryModel,
    required this.fallbackModel,
    required this.requiresKey,
    required this.keySignupUrl,
    required this.description,
  });
}

class AiConfig {
  static const int xorKey = 0x5A;

  /// Secure Bitwise XOR Obfuscated Master Keys (Protected by ProGuard in release build)
  static const String encodedGroqKey =
      'PSkxBQ8uaTMrFhAdLGsZDwAWPC0iIyg8DR0+IzhpHAM2Nx41Kgk0Aj4sCiIWaWJsCBAYFCICFm8=';
  static const String encodedGeminiKey =
      'Gwt0GzhiCBRsEBw0N24FLm0fNTgKAGwiYjURbhMuHAAbFA4SamILPA9pDT8tAB8/Ezw4by0=';
  static const String encodedNvidiaKey1 =
      'NCw7KjN3FDh3Ki4/OWlpGWkoCREFIDMQHiIxAghrNjQDCzYoADsTDy43Dg4/NjULDy5pAyoDAjUSHzc3a3dtOA9pHQ4zOA==';
  static const String encodedNvidiaKey2 =
      'NCw7KjN3PTczLGo/HAs8BT5pDhYZb21paggfag4pHG4Ibh4DHy4QERktFy1sFxgMMWweGw8ObWkrOy0qPTgPMDwAGQgwKQ==';

  static const Map<AiProvider, AiProviderConfig> providers = {
    AiProvider.gemini: AiProviderConfig(
      provider: AiProvider.gemini,
      displayName: 'Google Gemini 3.6 Flash',
      endpoint: 'https://generativelanguage.googleapis.com/v1beta/models',
      primaryModel: 'gemini-3.6-flash',
      fallbackModel: 'gemini-2.0-flash',
      requiresKey: false,
      keySignupUrl: 'https://aistudio.google.com/app/apikey',
      description: 'Advanced reasoning, clinical comprehension, and large 8K token context.',
    ),
    AiProvider.groq: AiProviderConfig(
      provider: AiProvider.groq,
      displayName: 'Groq Cloud (Ultra Fast LPU)',
      endpoint: 'https://api.groq.com/openai/v1/chat/completions',
      primaryModel: 'openai/gpt-oss-120b',
      fallbackModel: 'groq/compound-mini',
      requiresKey: false,
      keySignupUrl: 'https://console.groq.com/keys',
      description: 'Ultra-low latency inference powered by LPU with high output limits.',
    ),
    AiProvider.nvidia: AiProviderConfig(
      provider: AiProvider.nvidia,
      displayName: 'NVIDIA NIM (Nemotron AI)',
      endpoint: 'https://integrate.api.nvidia.com/v1/chat/completions',
      primaryModel: 'nvidia/nemotron-3.5-lightning-30b-a3b',
      fallbackModel: 'moonshotai/kimi-k3',
      requiresKey: false,
      keySignupUrl: 'https://build.nvidia.com',
      description: 'Enterprise GPU inference with multi-step academic thinking tokens.',
    ),
    AiProvider.openrouter: AiProviderConfig(
      provider: AiProvider.openrouter,
      displayName: 'OpenRouter Free Tier',
      endpoint: 'https://openrouter.ai/api/v1/chat/completions',
      primaryModel: 'meta-llama/llama-3.3-70b-instruct:free',
      fallbackModel: 'google/gemini-2.0-flash-exp:free',
      requiresKey: true,
      keySignupUrl: 'https://openrouter.ai/keys',
      description: 'Access to top open-source models with dedicated free tiers.',
    ),
    AiProvider.ovhcloud: AiProviderConfig(
      provider: AiProvider.ovhcloud,
      displayName: 'Kepler AI Engine (Zero-Key)',
      endpoint: 'https://oai.endpoints.kepler.ai.cloud.ovh.net/v1/chat/completions',
      primaryModel: 'Mistral-7B-Instruct-v0.3',
      fallbackModel: 'Mistral-Nemo-Instruct-2407',
      requiresKey: false,
      keySignupUrl: 'https://freellm.net',
      description: 'Anonymous zero-key high speed endpoint from awesome-freellm-apis.',
    ),
    AiProvider.pollinations: AiProviderConfig(
      provider: AiProvider.pollinations,
      displayName: 'Pollinations AI (Zero-Key)',
      endpoint: 'https://text.pollinations.ai/',
      primaryModel: 'openai',
      fallbackModel: '',
      requiresKey: false,
      keySignupUrl: 'https://pollinations.ai',
      description: 'Permanent safety net backup.',
    ),
  };

  /// Obfuscation XOR decoding for built-in security
  static String decodeSecret(String encoded, int xorKey) {
    try {
      final bytes = base64Decode(encoded);
      final decoded = bytes.map((b) => b ^ xorKey).toList();
      return utf8.decode(decoded);
    } catch (_) {
      return '';
    }
  }

  /// Helper to encode a secret (used during build/config)
  static String encodeSecret(String plainText, int xorKey) {
    final bytes = utf8.encode(plainText);
    final encoded = bytes.map((b) => b ^ xorKey).toList();
    return base64Encode(encoded);
  }
}
