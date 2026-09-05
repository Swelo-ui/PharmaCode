import '../../data/blogs_data.dart';
import '../../data/faqs_data.dart';
import '../syllabus_service.dart';

class PharmaKnowledgeContext {
  final List<String> syllabusMatches;
  final List<String> blogMatches;
  final List<String> careerMatches;
  final List<String> faqMatches;

  const PharmaKnowledgeContext({
    this.syllabusMatches = const [],
    this.blogMatches = const [],
    this.careerMatches = const [],
    this.faqMatches = const [],
  });

  bool get isEmpty =>
      syllabusMatches.isEmpty &&
      blogMatches.isEmpty &&
      careerMatches.isEmpty &&
      faqMatches.isEmpty;
}

class PharmaKnowledgeService {
  static final PharmaKnowledgeService _instance = PharmaKnowledgeService._internal();
  factory PharmaKnowledgeService() => _instance;
  PharmaKnowledgeService._internal();

  final SyllabusService _syllabusService = SyllabusService();

  /// Retrieve relevant context from all app data based on user query
  Future<PharmaKnowledgeContext> retrieveContext(String query) async {
    await _syllabusService.initialize();

    final cleanQuery = query.toLowerCase().trim();
    final words = cleanQuery
        .replaceAll(RegExp(r'[^\w\s]'), ' ')
        .split(RegExp(r'\s+'))
        .where((w) => w.length > 2)
        .toList();

    if (words.isEmpty) {
      return const PharmaKnowledgeContext();
    }

    final List<String> syllabusMatches = [];
    final List<String> blogMatches = [];
    final List<String> careerMatches = [];
    final List<String> faqMatches = [];

    // 1. Search Syllabus (Semesters, Subjects, Units, Topics)
    for (final sem in _syllabusService.semesters) {
      final bool semMatch = cleanQuery.contains('sem ${sem.num}') ||
          cleanQuery.contains('semester ${sem.num}');

      for (final sub in sem.subjects) {
        final codeMatch = cleanQuery.contains(sub.code.toLowerCase());
        final nameMatch = words.any((w) => sub.name.toLowerCase().contains(w));

        bool unitOrTopicMatch = false;
        final List<String> matchingUnits = [];

        for (final unit in sub.units) {
          final unitTitleMatch = words.any((w) => unit.title.toLowerCase().contains(w));
          final matchingTopics = unit.topics
              .where((t) => words.any((w) => t.toLowerCase().contains(w)))
              .take(3)
              .toList();

          if (unitTitleMatch || matchingTopics.isNotEmpty) {
            unitOrTopicMatch = true;
            final topicsStr = matchingTopics.isNotEmpty
                ? 'Topics: ${matchingTopics.join(", ")}'
                : 'Unit Title: ${unit.title}';
            matchingUnits.add('Unit ${unit.num} (${unit.title}) -> $topicsStr');
          }
        }

        if (codeMatch || (semMatch && nameMatch) || unitOrTopicMatch) {
          final details = StringBuffer();
          details.writeln('• [Sem ${sem.num}] ${sub.code}: ${sub.name} (${sub.typeLabel}, ${sub.credits} Credits)');
          if (matchingUnits.isNotEmpty) {
            for (final mu in matchingUnits.take(2)) {
              details.writeln('   - $mu');
            }
          }
          syllabusMatches.add(details.toString().trim());
          if (syllabusMatches.length >= 3) break;
        }
      }
      if (syllabusMatches.length >= 3) break;
    }

    // 2. Search Blogs Data (Interview kits, 15-chapter curriculum, solved Q&As)
    for (final blog in blogsData) {
      final titleMatch = words.any((w) => blog.title.toLowerCase().contains(w));
      final descMatch = words.any((w) => blog.description.toLowerCase().contains(w));
      final contentMatch = words.any((w) => blog.content.toLowerCase().contains(w));

      if (titleMatch || descMatch || contentMatch) {
        // Extract relevant line from content
        String snippet = blog.description;
        final lines = blog.content.split('\n');
        for (final l in lines) {
          if (words.any((w) => l.toLowerCase().contains(w)) && l.trim().length > 20) {
            snippet = l.trim();
            break;
          }
        }

        blogMatches.add('• Guide: ${blog.title}\n  Summary: $snippet');
        if (blogMatches.length >= 2) break;
      }
    }

    // 3. Search Career Domains
    for (final domain in careerDomainsData) {
      final titleMatch = cleanQuery.contains(domain.shortName.toLowerCase()) ||
          words.any((w) => domain.title.toLowerCase().contains(w));
      final skillMatch = domain.coreSkills.any((s) => words.any((w) => s.toLowerCase().contains(w)));

      if (titleMatch || skillMatch) {
        careerMatches.add(
          '• Career Domain: ${domain.title} (${domain.shortName})\n'
          '  Eligibility: ${domain.eligibility}\n'
          '  Top Roles: ${domain.topRoles.take(3).join(", ")}\n'
          '  Core Skills: ${domain.coreSkills.take(4).join(", ")}\n'
          '  Salary: ${domain.avgSalary}',
        );
        if (careerMatches.length >= 2) break;
      }
    }

    // 4. Search FAQs
    for (final faq in faqsData) {
      final qMatch = words.any((w) => faq.question.toLowerCase().contains(w));
      if (qMatch) {
        faqMatches.add('• Q: ${faq.question}\n  A: ${faq.answer}');
        if (faqMatches.length >= 2) break;
      }
    }

    return PharmaKnowledgeContext(
      syllabusMatches: syllabusMatches,
      blogMatches: blogMatches,
      careerMatches: careerMatches,
      faqMatches: faqMatches,
    );
  }

  /// Format context into prompt section
  String formatForPrompt(PharmaKnowledgeContext ctx) {
    if (ctx.isEmpty) return '';

    final buffer = StringBuffer();
    buffer.writeln('=== PHARMACODE IN-APP KNOWLEDGE & SYLLABUS GROUNDING ===');
    buffer.writeln('The user query matches the following official PharmaCode materials:');

    if (ctx.syllabusMatches.isNotEmpty) {
      buffer.writeln('\n[B.Pharm NEP 2020 Syllabus Units & Subjects]:');
      for (final s in ctx.syllabusMatches) {
        buffer.writeln(s);
      }
    }

    if (ctx.blogMatches.isNotEmpty) {
      buffer.writeln('\n[PharmaCode Study Kits & Career Guides]:');
      for (final b in ctx.blogMatches) {
        buffer.writeln(b);
      }
    }

    if (ctx.careerMatches.isNotEmpty) {
      buffer.writeln('\n[Pharma Industry Career Domains]:');
      for (final c in ctx.careerMatches) {
        buffer.writeln(c);
      }
    }

    if (ctx.faqMatches.isNotEmpty) {
      buffer.writeln('\n[PharmaCode FAQs]:');
      for (final f in ctx.faqMatches) {
        buffer.writeln(f);
      }
    }

    buffer.writeln('========================================================');
    return buffer.toString();
  }
}
