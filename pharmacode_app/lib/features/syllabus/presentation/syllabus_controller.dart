import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../models/syllabus_models.dart';
import '../data/syllabus_repository.dart';

final syllabusRepositoryProvider = Provider<SyllabusRepository>((ref) {
  return SyllabusRepository();
});

final semestersFutureProvider = FutureProvider<List<Semester>>((ref) async {
  final repository = ref.watch(syllabusRepositoryProvider);
  return await repository.loadSemesters();
});

final selectedSemesterProvider = StateProvider<int>((ref) => 1);

final currentSemesterSubjectsProvider = Provider<List<Subject>>((ref) {
  final targetSem = ref.watch(selectedSemesterProvider);
  final semestersAsync = ref.watch(semestersFutureProvider);

  return semestersAsync.when(
    data: (semesters) {
      try {
        final sem = semesters.firstWhere((s) => s.num == targetSem);
        return sem.subjects;
      } catch (_) {
        return const [];
      }
    },
    loading: () => const [],
    error: (err, stack) => const [],
  );
});

final subjectSearchQueryProvider = StateProvider<String>((ref) => '');

final searchedSubjectsProvider = Provider<List<Subject>>((ref) {
  final query = ref.watch(subjectSearchQueryProvider);
  if (query.trim().isEmpty) return const [];
  final repo = ref.watch(syllabusRepositoryProvider);
  return repo.searchSubjects(query);
});
