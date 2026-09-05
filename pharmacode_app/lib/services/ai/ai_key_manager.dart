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
    AiProvider.ovhcloud: KeyHealth(),
    AiProvider.pollinations: KeyHealth(),
  };

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
        return null;

      case AiProvider.gemini:
        if (_customGeminiKey != null && _customGeminiKey!.trim().isNotEmpty) {
          return _customGeminiKey!.trim();
        }
        return null;

      case AiProvider.openrouter:
        if (_customOpenRouterKey != null && _customOpenRouterKey!.trim().isNotEmpty) {
          return _customOpenRouterKey!.trim();
        }
        return null;

      case AiProvider.ovhcloud:
      case AiProvider.pollinations:
        return null; // Zero key needed
    }
  }

  /// Rotate or mark provider state
  void rotateProviderKey(AiProvider provider) {}

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
      case AiProvider.ovhcloud:
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
      case AiProvider.ovhcloud:
      case AiProvider.pollinations:
        return null;
    }
  }

  /// Record rate-limit or error on a provider
  void markProviderFailure(AiProvider provider, {int statusCode = 500}) {
    // Only apply a brief 15s cooldown on true HTTP 429 rate limit
    if (statusCode == 429) {
      _providerHealth[provider]?.recordFailure(cooldownSeconds: 15);
      debugPrint('[AiKeyManager] Provider ${provider.name} rate limited (429). Cooldown: 15s');
    } else {
      debugPrint('[AiKeyManager] Provider ${provider.name} failed with $statusCode.');
    }
  }

  /// Record success on a provider
  void markProviderSuccess(AiProvider provider) {
    _providerHealth[provider]?.recordSuccess();
  }

  /// Check if provider is available
  bool isProviderAvailable(AiProvider provider) {
    if (provider == AiProvider.ovhcloud || provider == AiProvider.pollinations) {
      return true; // Always available zero-key endpoints
    }
    final health = _providerHealth[provider];
    if (health != null && health.isInCooldown) return false;

    // Providers requiring keys are available if a custom key is saved
    final hasKey = getCustomKey(provider) != null && getCustomKey(provider)!.isNotEmpty;
    return hasKey;
  }

  /// Provider diagnostics status
  Map<AiProvider, String> getProviderStatuses() {
    final Map<AiProvider, String> result = {};
    for (final p in AiProvider.values) {
      if (p == AiProvider.ovhcloud || p == AiProvider.pollinations) {
        result[p] = 'Online';
      } else {
        final hasCustom = getCustomKey(p) != null && getCustomKey(p)!.isNotEmpty;
        final health = _providerHealth[p];
        if (hasCustom) {
          if (health != null && health.isInCooldown) {
            final sec = health.cooldownUntil!.difference(DateTime.now()).inSeconds;
            result[p] = 'Cooldown (${sec}s)';
          } else {
            result[p] = 'Active';
          }
        } else {
          result[p] = 'Add Key';
        }
      }
    }
    return result;
  }
}
