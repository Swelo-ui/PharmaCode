import 'dart:convert';

/// Supported AI Providers
enum AiProvider {
  groq,
  gemini,
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
  static const Map<AiProvider, AiProviderConfig> providers = {
    AiProvider.groq: AiProviderConfig(
      provider: AiProvider.groq,
      displayName: 'Groq Cloud (Ultra Fast)',
      endpoint: 'https://api.groq.com/openai/v1/chat/completions',
      primaryModel: 'llama-3.3-70b-versatile',
      fallbackModel: 'llama-3.1-8b-instant',
      requiresKey: true,
      keySignupUrl: 'https://console.groq.com/keys',
      description: 'Ultra-low latency inference powered by LPU, generous free tier.',
    ),
    AiProvider.gemini: AiProviderConfig(
      provider: AiProvider.gemini,
      displayName: 'Google Gemini 2.0',
      endpoint: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
      primaryModel: 'gemini-2.0-flash',
      fallbackModel: 'gemini-1.5-flash',
      requiresKey: true,
      keySignupUrl: 'https://aistudio.google.com/app/apikey',
      description: 'Advanced reasoning, high context window, great for complex pharma concepts.',
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
      primaryModel: 'openai-fast',
      fallbackModel: 'openai',
      requiresKey: false,
      keySignupUrl: 'https://pollinations.ai',
      description: '100% Free permanent safety net. Zero API key needed.',
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
