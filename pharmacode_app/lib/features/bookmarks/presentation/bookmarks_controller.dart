import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../models/syllabus_models.dart';
import '../../../services/syllabus_service.dart';
import '../../syllabus/presentation/syllabus_controller.dart';
import '../data/bookmarks_repository.dart';

final bookmarksRepositoryProvider = Provider<BookmarksRepository>((ref) {
  return BookmarksRepository();
});

class BookmarksController extends StateNotifier<Set<String>> {
  final BookmarksRepository _repository;

  BookmarksController(this._repository) : super({}) {
    _load();
  }

  Future<void> _load() async {
    final saved = await _repository.loadBookmarks();
    state = saved;
  }

  Future<bool> toggleBookmark(String code) async {
    final next = Set<String>.from(state);
    final isAdded = !next.contains(code);
    if (isAdded) {
      next.add(code);
    } else {
      next.remove(code);
    }
    state = next;
    await _repository.saveBookmarks(next);

    // Keep SyllabusService cache aligned
    final syllabusSvc = SyllabusService();
    if (isAdded && !syllabusSvc.isBookmarked(code)) {
      await syllabusSvc.toggleBookmark(code);
    } else if (!isAdded && syllabusSvc.isBookmarked(code)) {
      await syllabusSvc.toggleBookmark(code);
    }

    return isAdded;
  }

  bool isBookmarked(String code) => state.contains(code);
}

final bookmarksProvider = StateNotifierProvider<BookmarksController, Set<String>>((ref) {
  return BookmarksController(ref.watch(bookmarksRepositoryProvider));
});

final bookmarkedSubjectsProvider = Provider<List<Subject>>((ref) {
  final codes = ref.watch(bookmarksProvider);
  final repo = ref.watch(syllabusRepositoryProvider);

  final List<Subject> list = [];
  for (var code in codes) {
    final sub = repo.getSubjectByCode(code);
    if (sub != null) list.add(sub);
  }
  return list;
});
