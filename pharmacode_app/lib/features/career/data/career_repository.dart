import '../../../data/blogs_data.dart';
import '../../../models/blog_model.dart';

class CareerRepository {
  List<CareerDomain> getDomains() => List.unmodifiable(careerDomainsData);

  List<Blog> getBlogs() => List.unmodifiable(blogsData);

  List<Blog> getBlogsByCategory(String category) {
    if (category == 'ALL') return getBlogs();
    if (category == 'DOMAINS') return const [];
    return blogsData.where((b) {
      if (category == 'KIT') return b.category == 'KIT';
      if (category == 'COURSE') return b.category == 'COURSE';
      if (category == 'TECH') return b.category == 'TECH' || b.category == 'SYLLABUS';
      return true;
    }).toList();
  }

  Blog? getBlogById(String id) {
    try {
      return blogsData.firstWhere((b) => b.id == id);
    } catch (_) {
      return null;
    }
  }

  CareerDomain? getDomainById(String id) {
    try {
      return careerDomainsData.firstWhere((d) => d.id == id);
    } catch (_) {
      return null;
    }
  }
}
