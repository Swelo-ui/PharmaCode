import 'package:shared_preferences/shared_preferences.dart';

class BookmarksRepository {
  static const String _key = 'saved_bookmarks';

  Future<Set<String>> loadBookmarks() async {
    final prefs = await SharedPreferences.getInstance();
    final list = prefs.getStringList(_key) ?? [];
    return list.toSet();
  }

  Future<void> saveBookmarks(Set<String> codes) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setStringList(_key, codes.toList());
  }
}
