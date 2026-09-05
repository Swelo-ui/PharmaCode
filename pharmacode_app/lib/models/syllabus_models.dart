class SubjectUnit {
  final String num; // I, II, III, IV, V
  final String title;
  final List<String> topics;
  final String hours;

  const SubjectUnit({
    required this.num,
    required this.title,
    required this.topics,
    required this.hours,
  });

  factory SubjectUnit.fromJson(Map<String, dynamic> json) {
    return SubjectUnit(
      num: json['num'] ?? '',
      title: json['title'] ?? '',
      topics: List<String>.from(json['topics'] ?? []),
      hours: json['hours'] ?? '',
    );
  }

  Map<String, dynamic> toJson() => {
    'num': num,
    'title': title,
    'topics': topics,
    'hours': hours,
  };
}

class Subject {
  final String code;
  final String name;
  final int credits;
  final String type; // 'T' (Theory), 'P' (Practical), 'I' (Internship), 'RP' (Research Project)
  final bool highlight;
  final String slug;
  final List<SubjectUnit> units;
  final List<String> objectives;
  final List<String> references;

  const Subject({
    required this.code,
    required this.name,
    required this.credits,
    required this.type,
    this.highlight = false,
    required this.slug,
    required this.units,
    this.objectives = const [],
    this.references = const [],
  });

  String get typeLabel {
    switch (type) {
      case 'T':
        return 'Theory';
      case 'P':
        return 'Practical';
      case 'I':
        return 'Internship';
      case 'RP':
        return 'Research Project';
      default:
        return type;
    }
  }

  factory Subject.fromJson(Map<String, dynamic> json) {
    return Subject(
      code: json['code'] ?? '',
      name: json['name'] ?? '',
      credits: json['credits'] ?? 0,
      type: json['type'] ?? 'T',
      highlight: json['highlight'] ?? false,
      slug: json['slug'] ?? '',
      units: (json['units'] as List<dynamic>? ?? [])
          .map((u) => SubjectUnit.fromJson(u))
          .toList(),
      objectives: List<String>.from(json['objectives'] ?? []),
      references: List<String>.from(json['references'] ?? []),
    );
  }

  Map<String, dynamic> toJson() => {
    'code': code,
    'name': name,
    'credits': credits,
    'type': type,
    'highlight': highlight,
    'slug': slug,
    'units': units.map((u) => u.toJson()).toList(),
    'objectives': objectives,
    'references': references,
  };
}

class Semester {
  final int num;
  final int credits;
  final String colorHex;
  final String bgHex;
  final String badgeHex;
  final String label;
  final List<Subject> subjects;

  const Semester({
    required this.num,
    required this.credits,
    required this.colorHex,
    required this.bgHex,
    required this.badgeHex,
    required this.label,
    required this.subjects,
  });

  factory Semester.fromJson(Map<String, dynamic> json) {
    return Semester(
      num: json['num'] ?? 1,
      credits: json['credits'] ?? 0,
      colorHex: json['color'] ?? '#4C6EF5',
      bgHex: json['bg'] ?? '#EEF2FF',
      badgeHex: json['badge'] ?? '#DBEAFE',
      label: json['label'] ?? '',
      subjects: (json['subjects'] as List<dynamic>? ?? [])
          .map((s) => Subject.fromJson(s))
          .toList(),
    );
  }
}
