import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../models/blog_model.dart';
import '../data/career_repository.dart';

final careerRepositoryProvider = Provider<CareerRepository>((ref) {
  return CareerRepository();
});

final careerDomainsProvider = Provider<List<CareerDomain>>((ref) {
  final repo = ref.watch(careerRepositoryProvider);
  return repo.getDomains();
});

final selectedCareerCategoryProvider = StateProvider<String>((ref) => 'ALL');

final filteredGuidesProvider = Provider<List<Blog>>((ref) {
  final category = ref.watch(selectedCareerCategoryProvider);
  final repo = ref.watch(careerRepositoryProvider);
  return repo.getBlogsByCategory(category);
});
