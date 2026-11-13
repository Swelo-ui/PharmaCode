import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';

/// Service to enforce Android WindowManager.LayoutParams.FLAG_SECURE
/// Prevents screenshots, screen recording, HDMI/miracast output, and hides
/// protected PDF content from Android's Recent Apps overview.
class SecurityService {
  static final SecurityService _instance = SecurityService._internal();
  factory SecurityService() => _instance;
  SecurityService._internal();

  static const MethodChannel _channel = MethodChannel('com.pharmacode.bpharm/security');
  bool _isSecure = false;

  bool get isSecure => _isSecure;

  /// Enable native FLAG_SECURE on Android window
  Future<bool> enableSecureMode() async {
    try {
      final bool? success = await _channel.invokeMethod<bool>('enableSecureScreen');
      _isSecure = success ?? true;
      if (kDebugMode) {
        debugPrint('[SecurityService] Native FLAG_SECURE ENABLED: $_isSecure');
      }
      return _isSecure;
    } catch (e) {
      if (kDebugMode) {
        debugPrint('[SecurityService] Failed to enable secure mode: $e');
      }
      return false;
    }
  }

  /// Disable native FLAG_SECURE on Android window
  Future<bool> disableSecureMode() async {
    try {
      final bool? success = await _channel.invokeMethod<bool>('disableSecureScreen');
      _isSecure = !(success ?? true);
      if (kDebugMode) {
        debugPrint('[SecurityService] Native FLAG_SECURE DISABLED: isSecure=$_isSecure');
      }
      return !_isSecure;
    } catch (e) {
      if (kDebugMode) {
        debugPrint('[SecurityService] Failed to disable secure mode: $e');
      }
      return false;
    }
  }
}
