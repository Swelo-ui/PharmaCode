import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import '../../../models/syllabus_models.dart';

class SyllabusRepository {
  List<Semester> _cachedSemesters = [];
  bool _isLoaded = false;

  bool get isLoaded => _isLoaded;
  List<Semester> get semesters => List.unmodifiable(_cachedSemesters);

  Future<List<Semester>> loadSemesters() async {
    if (_isLoaded && _cachedSemesters.isNotEmpty) {
      return _cachedSemesters;
    }
    try {
      final jsonString = await rootBundle.loadString('assets/data/syllabus.json');
      final List<dynamic> parsedList = jsonDecode(jsonString);
      _cachedSemesters = parsedList.map((item) => Semester.fromJson(item)).toList();
      _isLoaded = true;
      return _cachedSemesters;
    } catch (e) {
      debugPrint('Error loading syllabus asset: $e');
      rethrow;
    }
  }

  Semester? getSemester(int num) {
    try {
      return _cachedSemesters.firstWhere((s) => s.num == num);
    } catch (_) {
      return null;
    }
  }

  Subject? getSubjectByCode(String code) {
    final lower = code.toLowerCase().trim();
    for (var sem in _cachedSemesters) {
      for (var sub in sem.subjects) {
        if (sub.code.toLowerCase().trim() == lower) {
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
    for (var sem in _cachedSemesters) {
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
}
