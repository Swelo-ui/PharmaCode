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
    AiProvider.nvidia: KeyHealth(),
    AiProvider.openrouter: KeyHealth(),
    AiProvider.ovhcloud: KeyHealth(),
    AiProvider.pollinations: KeyHealth(),
  };

  /// Custom keys saved by student/dev (optional overrides)
  String? _customGroqKey;
  String? _customGeminiKey;
  String? _customNvidiaKey;
  String? _customOpenRouterKey;
  bool _isInitialized = false;

  /// Secondary rotation state for NVIDIA
  int _nvidiaKeyIndex = 0;

  Future<void> initialize() async {
    if (_isInitialized) return;
    try {
      _customGroqKey = await _secureStorage.read(key: 'custom_groq_key');
      _customGeminiKey = await _secureStorage.read(key: 'custom_gemini_key');
      _customNvidiaKey = await _secureStorage.read(key: 'custom_nvidia_key');
      _customOpenRouterKey = await _secureStorage.read(key: 'custom_openrouter_key');

      // Fallback check SharedPreferences if secure storage is unavailable on some devices
      final prefs = await SharedPreferences.getInstance();
      _customGroqKey ??= prefs.getString('custom_groq_key');
      _customGeminiKey ??= prefs.getString('custom_gemini_key');
      _customNvidiaKey ??= prefs.getString('custom_nvidia_key');
      _customOpenRouterKey ??= prefs.getString('custom_openrouter_key');
    } catch (e) {
      debugPrint('AiKeyManager init notice: $e');
    }
    _isInitialized = true;
  }

  /// Get active API key for a provider. Prioritizes custom key, falls back to built-in system key.
  Future<String?> getKey(AiProvider provider) async {
    await initialize();

    switch (provider) {
      case AiProvider.groq:
        if (_customGroqKey != null && _customGroqKey!.trim().isNotEmpty) {
          return _customGroqKey!.trim();
        }
        return AiConfig.decodeSecret(AiConfig.encodedGroqKey, AiConfig.xorKey);

      case AiProvider.gemini:
        if (_customGeminiKey != null && _customGeminiKey!.trim().isNotEmpty) {
          return _customGeminiKey!.trim();
        }
        return AiConfig.decodeSecret(AiConfig.encodedGeminiKey, AiConfig.xorKey);

      case AiProvider.nvidia:
        if (_customNvidiaKey != null && _customNvidiaKey!.trim().isNotEmpty) {
          return _customNvidiaKey!.trim();
        }
        final encodedKey = _nvidiaKeyIndex == 0
            ? AiConfig.encodedNvidiaKey1
            : AiConfig.encodedNvidiaKey2;
        return AiConfig.decodeSecret(encodedKey, AiConfig.xorKey);

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

  /// Rotate secondary provider keys (e.g., between NVIDIA key 1 and key 2)
  void rotateProviderKey(AiProvider provider) {
    if (provider == AiProvider.nvidia) {
      _nvidiaKeyIndex = (_nvidiaKeyIndex + 1) % 2;
      debugPrint('[AiKeyManager] Switched NVIDIA key index to: $_nvidiaKeyIndex');
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
      case AiProvider.nvidia:
        _customNvidiaKey = cleaned;
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
      case AiProvider.nvidia:
        return _customNvidiaKey;
      case AiProvider.openrouter:
        return _customOpenRouterKey;
      case AiProvider.ovhcloud:
      case AiProvider.pollinations:
        return null;
    }
  }

  /// Record rate-limit or error on a provider
  void markProviderFailure(AiProvider provider, {int statusCode = 500}) {
    // If NVIDIA fails, also toggle key index
    if (provider == AiProvider.nvidia) {
      rotateProviderKey(provider);
    }

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
    final health = _providerHealth[provider];
    if (health != null && health.isInCooldown) return false;

    switch (provider) {
      case AiProvider.groq:
      case AiProvider.gemini:
      case AiProvider.nvidia:
      case AiProvider.ovhcloud:
      case AiProvider.pollinations:
        return true; // Active built-in verified system keys / zero-key
      case AiProvider.openrouter:
        final hasCustom = getCustomKey(provider) != null && getCustomKey(provider)!.isNotEmpty;
        return hasCustom;
    }
  }

  /// Provider diagnostics status
  Map<AiProvider, String> getProviderStatuses() {
    final Map<AiProvider, String> result = {};
    for (final p in AiProvider.values) {
      final hasCustom = getCustomKey(p) != null && getCustomKey(p)!.isNotEmpty;
      final health = _providerHealth[p];

      if (health != null && health.isInCooldown) {
        final sec = health.cooldownUntil!.difference(DateTime.now()).inSeconds;
        result[p] = 'Cooldown (${sec}s)';
        continue;
      }

      if (hasCustom) {
        result[p] = 'Active (Custom)';
      } else if (p == AiProvider.groq || p == AiProvider.gemini || p == AiProvider.nvidia) {
        result[p] = 'Online';
      } else if (p == AiProvider.ovhcloud || p == AiProvider.pollinations) {
        result[p] = 'Online';
      } else {
        result[p] = 'Add Key';
      }
    }
    return result;
  }
}
