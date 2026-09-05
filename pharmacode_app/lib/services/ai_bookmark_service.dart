import 'dart:convert';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../models/ai_bookmark_model.dart';

class AiBookmarkService {
  static final AiBookmarkService instance = AiBookmarkService._internal();
  factory AiBookmarkService() => instance;

  AiBookmarkService._internal() {
    _init();
  }

  static const String _firebaseProjectId = 'pharmacode-f95c9';
  static const String _localPrefPrefix = 'ai_bookmarks_v1_';

  final ValueNotifier<List<AiBookmark>> bookmarksNotifier = ValueNotifier<List<AiBookmark>>([]);
  bool _isInitialized = false;

  List<AiBookmark> get bookmarks => bookmarksNotifier.value;

  String get _currentUserId {
    return FirebaseAuth.instance.currentUser?.uid ?? 'guest';
  }

  String get _prefKey => '$_localPrefPrefix$_currentUserId';

  Future<void> _init() async {
    if (_isInitialized) return;
    _isInitialized = true;

    // Load local bookmarks immediately for instant offline reactivity
    await _loadLocalBookmarks();

    // Listen to Firebase Auth state changes: sync from cloud whenever user logs in
    FirebaseAuth.instance.authStateChanges().listen((user) async {
      await _loadLocalBookmarks();
      if (user != null) {
        // Sync in background without blocking UI
        syncFromCloud().catchError((e) {
          debugPrint('[AiBookmarkService] Cloud sync notice: $e');
        });
      }
    });
  }

  /// Load bookmarks from local SharedPreferences
  Future<void> _loadLocalBookmarks() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final rawList = prefs.getStringList(_prefKey) ?? [];
      final list = <AiBookmark>[];
      for (final item in rawList) {
        try {
          list.add(AiBookmark.fromJson(item));
        } catch (_) {}
      }
      // Sort newest first
      list.sort((a, b) => b.timestamp.compareTo(a.timestamp));
      bookmarksNotifier.value = list;
    } catch (e) {
      debugPrint('[AiBookmarkService] Error loading local bookmarks: $e');
    }
  }

  /// Save current list to local storage
  Future<void> _saveLocalBookmarks(List<AiBookmark> list) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final rawList = list.map((b) => b.toJson()).toList();
      await prefs.setStringList(_prefKey, rawList);
    } catch (e) {
      debugPrint('[AiBookmarkService] Error persisting local bookmarks: $e');
    }
  }

  /// Check if an answer is already bookmarked
  bool isBookmarked(String answerContent) {
    final clean = answerContent.trim();
    return bookmarksNotifier.value.any((b) => b.answer.trim() == clean);
  }

  /// Check if a bookmark ID exists
  bool isBookmarkedById(String id) {
    return bookmarksNotifier.value.any((b) => b.id == id);
  }

  /// Toggle bookmark for an AI response
  /// Returns true if added, false if removed
  Future<bool> toggleBookmark({
    required String question,
    required String answer,
    String? subjectCode,
    String? subjectName,
    String mode = 'tutorHinglish',
    String? providerUsed,
  }) async {
    final cleanAnswer = answer.trim();
    final existingIndex = bookmarksNotifier.value.indexWhere((b) => b.answer.trim() == cleanAnswer);

    final currentList = List<AiBookmark>.from(bookmarksNotifier.value);

    if (existingIndex >= 0) {
      // Remove bookmark
      final removed = currentList.removeAt(existingIndex);
      bookmarksNotifier.value = currentList;
      await _saveLocalBookmarks(currentList);
      _deleteFromCloudAsync(removed.id);
      return false;
    } else {
      // Add new bookmark
      final newBookmark = AiBookmark(
        id: 'bm_${DateTime.now().millisecondsSinceEpoch}_${question.hashCode.abs()}',
        userId: _currentUserId,
        question: question.trim(),
        answer: cleanAnswer,
        subjectCode: subjectCode,
        subjectName: subjectName,
        mode: mode,
        providerUsed: providerUsed,
        timestamp: DateTime.now(),
      );

      currentList.insert(0, newBookmark);
      bookmarksNotifier.value = currentList;
      await _saveLocalBookmarks(currentList);
      _syncToCloudAsync(newBookmark);
      return true;
    }
  }

  /// Delete a bookmark by ID
  Future<void> deleteBookmark(String id) async {
    final currentList = List<AiBookmark>.from(bookmarksNotifier.value);
    final index = currentList.indexWhere((b) => b.id == id);
    if (index >= 0) {
      currentList.removeAt(index);
      bookmarksNotifier.value = currentList;
      await _saveLocalBookmarks(currentList);
      _deleteFromCloudAsync(id);
    }
  }

  /// Sync local bookmarks with Firebase Cloud Firestore REST API
  Future<void> syncFromCloud() async {
    final user = FirebaseAuth.instance.currentUser;
    if (user == null) return;

    try {
      final token = await user.getIdToken();
      if (token == null || token.isEmpty) return;

      final url = Uri.parse(
        'https://firestore.googleapis.com/v1/projects/$_firebaseProjectId/databases/(default)/documents/users/${user.uid}/ai_bookmarks',
      );

      final res = await http.get(url, headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      }).timeout(const Duration(seconds: 8));

      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);
        final documents = data['documents'] as List?;
        if (documents != null) {
          final cloudBookmarks = <AiBookmark>[];
          for (final doc in documents) {
            try {
              cloudBookmarks.add(AiBookmark.fromFirestoreDocument(doc));
            } catch (_) {}
          }

          // Merge local and cloud (union by id, newest timestamp wins)
          final Map<String, AiBookmark> mergedMap = {};
          for (final b in bookmarksNotifier.value) {
            mergedMap[b.id] = b;
          }
          for (final b in cloudBookmarks) {
            if (!mergedMap.containsKey(b.id) || b.timestamp.isAfter(mergedMap[b.id]!.timestamp)) {
              mergedMap[b.id] = b;
            }
          }

          final mergedList = mergedMap.values.toList()
            ..sort((a, b) => b.timestamp.compareTo(a.timestamp));

          bookmarksNotifier.value = mergedList;
          await _saveLocalBookmarks(mergedList);
          debugPrint('[AiBookmarkService] Synced ${cloudBookmarks.length} bookmarks from cloud.');
        }
      }
    } catch (e) {
      debugPrint('[AiBookmarkService] Cloud fetch notice: $e');
    }
  }

  /// Fire-and-forget sync of single bookmark to Cloud Firestore
  void _syncToCloudAsync(AiBookmark bookmark) {
    Future(() async {
      final user = FirebaseAuth.instance.currentUser;
      if (user == null) return;

      try {
        final token = await user.getIdToken();
        if (token == null || token.isEmpty) return;

        // PATCH or create document in Firestore REST
        final url = Uri.parse(
          'https://firestore.googleapis.com/v1/projects/$_firebaseProjectId/databases/(default)/documents/users/${user.uid}/ai_bookmarks/${bookmark.id}',
        );

        final payload = jsonEncode(bookmark.toFirestoreDocument());

        await http.patch(
          url,
          headers: {
            'Authorization': 'Bearer $token',
            'Content-Type': 'application/json',
          },
          body: payload,
        ).timeout(const Duration(seconds: 6));
      } catch (e) {
        debugPrint('[AiBookmarkService] Cloud push notice: $e');
      }
    });
  }

  /// Fire-and-forget deletion from Cloud Firestore
  void _deleteFromCloudAsync(String id) {
    Future(() async {
      final user = FirebaseAuth.instance.currentUser;
      if (user == null) return;

      try {
        final token = await user.getIdToken();
        if (token == null || token.isEmpty) return;

        final url = Uri.parse(
          'https://firestore.googleapis.com/v1/projects/$_firebaseProjectId/databases/(default)/documents/users/${user.uid}/ai_bookmarks/$id',
        );

        await http.delete(
          url,
          headers: {'Authorization': 'Bearer $token'},
        ).timeout(const Duration(seconds: 6));
      } catch (e) {
        debugPrint('[AiBookmarkService] Cloud delete notice: $e');
      }
    });
  }
}
