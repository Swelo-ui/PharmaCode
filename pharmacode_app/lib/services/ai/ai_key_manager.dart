import 'package:flutter/foundation.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'ai_config.dart';

class KeyHealth {
  int failureCount = 0;
  DateTime? cooldownUntil;
  bool get isInCooldown => cooldownUntil != null && DateTime.now().isBefore(cooldownUntil!);

  void recordFailure({int cooldownSeconds = 60}) {
    failureCount++;
    cooldownUntil = DateTime.now().add(Duration(seconds: cooldownSeconds));
  }

  void recordSuccess() {
    failureCount = 0;
    cooldownUntil = null;
  }
}

class AiKeyManager {
  static final AiKeyManager _instance = AiKeyManager._internal();
  factory AiKeyManager() => _instance;
  AiKeyManager._internal();

  final FlutterSecureStorage _secureStorage = const FlutterSecureStorage();
  final Map<AiProvider, KeyHealth> _providerHealth = {
    AiProvider.groq: KeyHealth(),
    AiProvider.gemini: KeyHealth(),
    AiProvider.openrouter: KeyHealth(),
    AiProvider.pollinations: KeyHealth(),
  };

  // Pre-configured XOR-scrambled backup keys with rotation
  // Each key is obfuscated with XOR key 0x5A to prevent plain text extraction in APK
  static const int _xorKey = 0x5A;

  // Groq keys pool (obfuscated)
  static final List<String> _bundledGroqKeys = [
    // Pre-loaded rotating Groq keys
    AiConfig.encodeSecret('gsk_free_demo_key_groq_pharma_1', _xorKey),
    AiConfig.encodeSecret('gsk_free_demo_key_groq_pharma_2', _xorKey),
  ];

  // Gemini keys pool (obfuscated)
  static final List<String> _bundledGeminiKeys = [
    AiConfig.encodeSecret('AIzaSy_demo_gemini_key_pharma_1', _xorKey),
    AiConfig.encodeSecret('AIzaSy_demo_gemini_key_pharma_2', _xorKey),
  ];

  // OpenRouter keys pool (obfuscated)
  static final List<String> _bundledOpenRouterKeys = [
    AiConfig.encodeSecret('sk-or-v1-demo-openrouter-key-1', _xorKey),
  ];

  int _groqIndex = 0;
  int _geminiIndex = 0;
  int _openRouterIndex = 0;

  /// Custom keys saved by student/dev
  String? _customGroqKey;
  String? _customGeminiKey;
  String? _customOpenRouterKey;
  bool _isInitialized = false;

  Future<void> initialize() async {
    if (_isInitialized) return;
    try {
      _customGroqKey = await _secureStorage.read(key: 'custom_groq_key');
      _customGeminiKey = await _secureStorage.read(key: 'custom_gemini_key');
      _customOpenRouterKey = await _secureStorage.read(key: 'custom_openrouter_key');

      // Fallback check SharedPreferences if secure storage is unavailable on some devices
      if (_customGroqKey == null || _customGeminiKey == null || _customOpenRouterKey == null) {
        final prefs = await SharedPreferences.getInstance();
        _customGroqKey ??= prefs.getString('custom_groq_key');
        _customGeminiKey ??= prefs.getString('custom_gemini_key');
        _customOpenRouterKey ??= prefs.getString('custom_openrouter_key');
      }
    } catch (e) {
      debugPrint('AiKeyManager init notice: $e');
    }
    _isInitialized = true;
  }

  /// Get active API key for a provider
  Future<String?> getKey(AiProvider provider) async {
    await initialize();

    switch (provider) {
      case AiProvider.groq:
        if (_customGroqKey != null && _customGroqKey!.trim().isNotEmpty) {
          return _customGroqKey!.trim();
        }
        if (_bundledGroqKeys.isNotEmpty) {
          final encoded = _bundledGroqKeys[_groqIndex % _bundledGroqKeys.length];
          return AiConfig.decodeSecret(encoded, _xorKey);
        }
        return null;

      case AiProvider.gemini:
        if (_customGeminiKey != null && _customGeminiKey!.trim().isNotEmpty) {
          return _customGeminiKey!.trim();
        }
        if (_bundledGeminiKeys.isNotEmpty) {
          final encoded = _bundledGeminiKeys[_geminiIndex % _bundledGeminiKeys.length];
          return AiConfig.decodeSecret(encoded, _xorKey);
        }
        return null;

      case AiProvider.openrouter:
        if (_customOpenRouterKey != null && _customOpenRouterKey!.trim().isNotEmpty) {
          return _customOpenRouterKey!.trim();
        }
        if (_bundledOpenRouterKeys.isNotEmpty) {
          final encoded = _bundledOpenRouterKeys[_openRouterIndex % _bundledOpenRouterKeys.length];
          return AiConfig.decodeSecret(encoded, _xorKey);
        }
        return null;

      case AiProvider.pollinations:
        return null; // Zero key needed
    }
  }

  /// Rotate to next key within a provider
  void rotateProviderKey(AiProvider provider) {
    switch (provider) {
      case AiProvider.groq:
        _groqIndex++;
        break;
      case AiProvider.gemini:
        _geminiIndex++;
        break;
      case AiProvider.openrouter:
        _openRouterIndex++;
        break;
      case AiProvider.pollinations:
        break;
    }
  }

  /// Save custom key entered by user
  Future<void> setCustomKey(AiProvider provider, String? key) async {
    final cleaned = key?.trim().isEmpty == true ? null : key?.trim();
    final keyName = 'custom_${provider.name}_key';
    
    try {
      if (cleaned != null) {
        await _secureStorage.write(key: keyName, value: cleaned);
      } else {
        await _secureStorage.delete(key: keyName);
      }
    } catch (_) {}

    try {
      final prefs = await SharedPreferences.getInstance();
      if (cleaned != null) {
        await prefs.setString(keyName, cleaned);
      } else {
        await prefs.remove(keyName);
      }
    } catch (_) {}

    switch (provider) {
      case AiProvider.groq:
        _customGroqKey = cleaned;
        break;
      case AiProvider.gemini:
        _customGeminiKey = cleaned;
        break;
      case AiProvider.openrouter:
        _customOpenRouterKey = cleaned;
        break;
      case AiProvider.pollinations:
        break;
    }

    // Reset health for this provider
    _providerHealth[provider]?.recordSuccess();
  }

  String? getCustomKey(AiProvider provider) {
    switch (provider) {
      case AiProvider.groq:
        return _customGroqKey;
      case AiProvider.gemini:
        return _customGeminiKey;
      case AiProvider.openrouter:
        return _customOpenRouterKey;
      case AiProvider.pollinations:
        return null;
    }
  }

  /// Record rate-limit or error on a provider
  void markProviderFailure(AiProvider provider, {int statusCode = 500}) {
    rotateProviderKey(provider);
    final cooldown = statusCode == 429 ? 90 : 45; // 90s cooldown on 429
    _providerHealth[provider]?.recordFailure(cooldownSeconds: cooldown);
    debugPrint('[AiKeyManager] Provider ${provider.name} failed with $statusCode. Cooldown: ${cooldown}s');
  }

  /// Record success on a provider
  void markProviderSuccess(AiProvider provider) {
    _providerHealth[provider]?.recordSuccess();
  }

  /// Check if provider is available (not in cooldown)
  bool isProviderAvailable(AiProvider provider) {
    if (provider == AiProvider.pollinations) return true; // Always available
    final health = _providerHealth[provider];
    if (health == null) return true;
    return !health.isInCooldown;
  }

  /// Provider diagnostics status
  Map<AiProvider, String> getProviderStatuses() {
    final Map<AiProvider, String> result = {};
    for (final p in AiProvider.values) {
      if (p == AiProvider.pollinations) {
        result[p] = '100% Online (Zero-Key Backup)';
      } else {
        final health = _providerHealth[p];
        if (health != null && health.isInCooldown) {
          final sec = health.cooldownUntil!.difference(DateTime.now()).inSeconds;
          result[p] = 'Rate Limited (cooldown ${sec}s)';
        } else {
          final hasCustom = getCustomKey(p) != null;
          result[p] = hasCustom ? 'Active (Custom Key)' : 'Active (Free Tier)';
        }
      }
    }
    return result;
  }
}
