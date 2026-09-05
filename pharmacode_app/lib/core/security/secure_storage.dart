import 'package:flutter/foundation.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

/// Production Secure Storage Wrapper for credentials and sensitive tokens
class SecureStorageService {
  static final SecureStorageService _instance = SecureStorageService._internal();
  factory SecureStorageService() => _instance;
  SecureStorageService._internal();

  final FlutterSecureStorage _storage = const FlutterSecureStorage(
    aOptions: AndroidOptions(),
  );

  static const String _keyAuthToken = 'secure_auth_token';
  static const String _keyUserId = 'secure_user_id';
  static const String _keyUserEmail = 'secure_user_email';

  Future<void> saveAuthToken(String token) async {
    try {
      await _storage.write(key: _keyAuthToken, value: token);
    } catch (e) {
      debugPrint('SecureStorage write error: $e');
    }
  }

  Future<String?> getAuthToken() async {
    try {
      return await _storage.read(key: _keyAuthToken);
    } catch (e) {
      debugPrint('SecureStorage read error: $e');
      return null;
    }
  }

  Future<void> saveUserSession({required String uid, required String email}) async {
    try {
      await _storage.write(key: _keyUserId, value: uid);
      await _storage.write(key: _keyUserEmail, value: email);
    } catch (e) {
      debugPrint('SecureStorage session error: $e');
    }
  }

  Future<Map<String, String?>> getUserSession() async {
    try {
      final uid = await _storage.read(key: _keyUserId);
      final email = await _storage.read(key: _keyUserEmail);
      return {'uid': uid, 'email': email};
    } catch (e) {
      debugPrint('SecureStorage read session error: $e');
      return {'uid': null, 'email': null};
    }
  }

  Future<void> clearAll() async {
    try {
      await _storage.deleteAll();
    } catch (e) {
      debugPrint('SecureStorage clear error: $e');
    }
  }
}
