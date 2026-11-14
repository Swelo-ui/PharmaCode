import 'dart:convert';
import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:path_provider/path_provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../services/pdf_service.dart';
import '../security/secure_doc_resolver.dart';

/// Classplus-Style Secure Offline Storage Manager
/// - Files are stored encrypted in the app-private support directory (Inaccessible by 3rd-party file managers).
/// - Plain PDF files are NEVER stored on external storage or public galleries.
/// - When opened, files are decrypted into ephemeral sandbox memory and cleaned up on close.
class OfflineStorageService {
  static final OfflineStorageService _instance = OfflineStorageService._internal();
  factory OfflineStorageService() => _instance;
  OfflineStorageService._internal();

  static OfflineStorageService get instance => _instance;

  static const String _prefsKey = 'offline_saved_documents_registry';

  final ValueNotifier<int> offlineCountNotifier = ValueNotifier<int>(0);

  Future<void> init() async {
    final list = await getDownloadedPdfs();
    offlineCountNotifier.value = list.length;
  }

  Future<Directory> _getSecureDirectory() async {
    final baseDir = await getApplicationSupportDirectory();
    final secureDir = Directory('${baseDir.path}/secure_docs');
    if (!await secureDir.exists()) {
      await secureDir.create(recursive: true);
    }
    return secureDir;
  }

  String _getEncryptedFileName(String id) {
    // Sanitize ID
    final cleanId = id.replaceAll(RegExp(r'[^a-zA-Z0-9_-]'), '_');
    return 'offline_$cleanId.enc';
  }

  /// Checks if a PDF document is currently saved offline and valid
  Future<bool> isPdfDownloaded(String pdfId) async {
    try {
      final secureDir = await _getSecureDirectory();
      final file = File('${secureDir.path}/${_getEncryptedFileName(pdfId)}');
      if (!await file.exists()) return false;

      final prefs = await SharedPreferences.getInstance();
      final raw = prefs.getString(_prefsKey);
      if (raw == null) return false;

      final List<dynamic> list = jsonDecode(raw);
      return list.any((item) => (item is Map) && item['id'] == pdfId);
    } catch (_) {
      return false;
    }
  }

  /// Saves raw PDF bytes encrypted in the private app sandbox
  Future<bool> savePdfOffline(AdminPdfItem item, Uint8List rawBytes) async {
    try {
      final secureDir = await _getSecureDirectory();
      final filePath = '${secureDir.path}/${_getEncryptedFileName(item.id)}';
      final file = File(filePath);

      // 1. Scramble/encrypt bytes before saving to disk
      final encryptedBytes = SecureDocResolver.transformBytes(rawBytes);
      await file.writeAsBytes(encryptedBytes, flush: true);

      // 2. Update metadata registry in SharedPreferences
      final prefs = await SharedPreferences.getInstance();
      final raw = prefs.getString(_prefsKey);
      final List<dynamic> list = raw != null ? jsonDecode(raw) : [];

      // Remove existing entry if any
      list.removeWhere((elem) => (elem is Map) && elem['id'] == item.id);

      final docData = item.toJson();
      docData['savedAt'] = DateTime.now().toIso8601String();
      docData['rawSizeInBytes'] = rawBytes.length;
      list.add(docData);

      await prefs.setString(_prefsKey, jsonEncode(list));
      offlineCountNotifier.value = list.length;

      return true;
    } catch (e) {
      debugPrint('Error saving PDF offline: $e');
      return false;
    }
  }

  /// Decrypts the offline document into a temporary sandbox cache for viewing.
  /// Caller must delete the returned temp file when done.
  Future<File?> getDecryptedOfflineFile(String pdfId) async {
    try {
      final secureDir = await _getSecureDirectory();
      final encFile = File('${secureDir.path}/${_getEncryptedFileName(pdfId)}');
      if (!await encFile.exists()) return null;

      final encryptedBytes = await encFile.readAsBytes();
      final decryptedBytes = SecureDocResolver.transformBytes(encryptedBytes);

      final tempDir = await getTemporaryDirectory();
      final tempFile = File('${tempDir.path}/view_${pdfId}_${DateTime.now().millisecondsSinceEpoch}.pdf');
      await tempFile.writeAsBytes(decryptedBytes, flush: true);

      return tempFile;
    } catch (e) {
      debugPrint('Error decrypting offline PDF: $e');
      return null;
    }
  }

  /// Removes an offline PDF from storage and registry
  Future<bool> removeOfflinePdf(String pdfId) async {
    try {
      final secureDir = await _getSecureDirectory();
      final file = File('${secureDir.path}/${_getEncryptedFileName(pdfId)}');
      if (await file.exists()) {
        await file.delete();
      }

      final prefs = await SharedPreferences.getInstance();
      final raw = prefs.getString(_prefsKey);
      if (raw != null) {
        final List<dynamic> list = jsonDecode(raw);
        list.removeWhere((elem) => (elem is Map) && elem['id'] == pdfId);
        await prefs.setString(_prefsKey, jsonEncode(list));
        offlineCountNotifier.value = list.length;
      }
      return true;
    } catch (e) {
      debugPrint('Error removing offline PDF: $e');
      return false;
    }
  }

  /// Retrieves list of all offline saved documents
  Future<List<AdminPdfItem>> getDownloadedPdfs() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final raw = prefs.getString(_prefsKey);
      if (raw == null) return [];

      final List<dynamic> list = jsonDecode(raw);
      final secureDir = await _getSecureDirectory();

      final List<AdminPdfItem> result = [];
      for (final item in list) {
        if (item is Map<String, dynamic>) {
          final id = item['id']?.toString() ?? '';
          final file = File('${secureDir.path}/${_getEncryptedFileName(id)}');
          if (await file.exists()) {
            result.add(AdminPdfItem.fromJson(item));
          }
        }
      }
      offlineCountNotifier.value = result.length;
      return result;
    } catch (_) {
      return [];
    }
  }

  /// Calculates total size of all offline files combined
  Future<String> getTotalOfflineSizeFormatted() async {
    try {
      final secureDir = await _getSecureDirectory();
      int totalBytes = 0;
      final files = secureDir.listSync();
      for (final f in files) {
        if (f is File && f.path.endsWith('.enc')) {
          totalBytes += await f.length();
        }
      }
      if (totalBytes < 1024 * 1024) {
        return '${(totalBytes / 1024).toStringAsFixed(1)} KB';
      }
      return '${(totalBytes / (1024 * 1024)).toStringAsFixed(1)} MB';
    } catch (_) {
      return '0.0 MB';
    }
  }
}
