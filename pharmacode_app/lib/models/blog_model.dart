class Blog {
  final String id;
  final String tag;
  final String title;
  final String date;
  final String colorHex;
  final String bgHex;
  final String description;
  final String readTime;
  final String content;
  final String actionUrl;
  final String actionLabel;
  final bool isNew;
  final String category; // 'DOMAIN', 'KIT', 'COURSE', 'SYLLABUS', 'TECH'

  const Blog({
    required this.id,
    required this.tag,
    required this.title,
    required this.date,
    required this.colorHex,
    required this.bgHex,
    required this.description,
    required this.readTime,
    required this.content,
    this.actionUrl = '',
    this.actionLabel = 'Explore Guide',
    this.isNew = false,
    this.category = 'KIT',
  });
}

class CareerDomain {
  final String id;
  final String title;
  final String shortName;
  final String tag;
  final String description;
  final String colorHex;
  final String bgHex;
  final String iconType; // 'pv', 'ra', 'qa', 'cro', 'ai', 'prod'
  final List<String> topRoles;
  final List<String> coreSkills;
  final String targetGuideId;
  final String eligibility;
  final String avgSalary;
  final String detailedOverview;

  const CareerDomain({
    required this.id,
    required this.title,
    required this.shortName,
    required this.tag,
    required this.description,
    required this.colorHex,
    required this.bgHex,
    required this.iconType,
    required this.topRoles,
    required this.coreSkills,
    required this.targetGuideId,
    required this.eligibility,
    required this.avgSalary,
    required this.detailedOverview,
  });
}

