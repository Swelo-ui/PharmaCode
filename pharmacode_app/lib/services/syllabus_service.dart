import 'dart:convert';
import 'package:flutter/services.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/syllabus_models.dart';

class SyllabusService {
  static final SyllabusService _instance = SyllabusService._internal();
  factory SyllabusService() => _instance;
  SyllabusService._internal();

  List<Semester> _semesters = [];
  final Set<String> _bookmarkedCodes = {};
  bool _isLoaded = false;

  bool get isLoaded => _isLoaded;
  List<Semester> get semesters => List.unmodifiable(_semesters);

  int get totalCredits => _semesters.fold(0, (sum, sem) => sum + sem.credits);
  int get totalSubjects => _semesters.fold(0, (sum, sem) => sum + sem.subjects.length);

  Future<void> initialize() async {
    if (_isLoaded) return;
    try {
      final jsonString = await rootBundle.loadString('assets/data/syllabus.json');
      final List<dynamic> parsedList = jsonDecode(jsonString);
      _semesters = parsedList.map((item) => Semester.fromJson(item)).toList();
      _isLoaded = true;

      final prefs = await SharedPreferences.getInstance();
      final savedBookmarks = prefs.getStringList('saved_bookmarks') ?? [];
      _bookmarkedCodes.clear();
      _bookmarkedCodes.addAll(savedBookmarks);
    } catch (e) {
      // Fallback or error logging
      _isLoaded = false;
    }
  }

  Semester? getSemester(int num) {
    try {
      return _semesters.firstWhere((s) => s.num == num);
    } catch (_) {
      return null;
    }
  }

  Subject? getSubjectByCode(String code) {
    for (var sem in _semesters) {
      for (var sub in sem.subjects) {
        if (sub.code.toLowerCase() == code.toLowerCase()) {
          return sub;
        }
      }
    }
    return null;
  }

  List<Subject> searchSubjects(String query) {
    if (query.trim().isEmpty) return [];
    final q = query.toLowerCase().trim();

    final List<Subject> results = [];
    for (var sem in _semesters) {
      for (var sub in sem.subjects) {
        final matchesCode = sub.code.toLowerCase().contains(q);
        final matchesName = sub.name.toLowerCase().contains(q);
        final matchesTopic = sub.units.any((u) =>
            u.title.toLowerCase().contains(q) ||
            u.topics.any((t) => t.toLowerCase().contains(q)));

        if (matchesCode || matchesName || matchesTopic) {
          results.add(sub);
        }
      }
    }
    return results;
  }

  bool isBookmarked(String code) => _bookmarkedCodes.contains(code);

  Future<bool> toggleBookmark(String code) async {
    if (_bookmarkedCodes.contains(code)) {
      _bookmarkedCodes.remove(code);
    } else {
      _bookmarkedCodes.add(code);
    }
    final prefs = await SharedPreferences.getInstance();
    await prefs.setStringList('saved_bookmarks', _bookmarkedCodes.toList());
    return _bookmarkedCodes.contains(code);
  }

  List<Subject> getBookmarkedSubjects() {
    final List<Subject> list = [];
    for (var code in _bookmarkedCodes) {
      final sub = getSubjectByCode(code);
      if (sub != null) list.add(sub);
    }
    return list;
  }
}
