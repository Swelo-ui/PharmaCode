import 'dart:convert';

class AiBookmark {
  final String id;
  final String userId;
  final String question;
  final String answer;
  final String? subjectCode;
  final String? subjectName;
  final String mode;
  final String? providerUsed;
  final DateTime timestamp;

  AiBookmark({
    required this.id,
    required this.userId,
    required this.question,
    required this.answer,
    this.subjectCode,
    this.subjectName,
    this.mode = 'tutorHinglish',
    this.providerUsed,
    required this.timestamp,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'userId': userId,
      'question': question,
      'answer': answer,
      'subjectCode': subjectCode,
      'subjectName': subjectName,
      'mode': mode,
      'providerUsed': providerUsed,
      'timestamp': timestamp.toIso8601String(),
    };
  }

  factory AiBookmark.fromMap(Map<String, dynamic> map) {
    return AiBookmark(
      id: map['id'] as String? ?? '',
      userId: map['userId'] as String? ?? '',
      question: map['question'] as String? ?? '',
      answer: map['answer'] as String? ?? '',
      subjectCode: map['subjectCode'] as String?,
      subjectName: map['subjectName'] as String?,
      mode: map['mode'] as String? ?? 'tutorHinglish',
      providerUsed: map['providerUsed'] as String?,
      timestamp: map['timestamp'] != null
          ? DateTime.tryParse(map['timestamp'] as String) ?? DateTime.now()
          : DateTime.now(),
    );
  }

  String toJson() => jsonEncode(toMap());

  factory AiBookmark.fromJson(String source) =>
      AiBookmark.fromMap(jsonDecode(source) as Map<String, dynamic>);

  /// Format as Firestore REST API fields payload
  Map<String, dynamic> toFirestoreDocument() {
    return {
      'fields': {
        'id': {'stringValue': id},
        'userId': {'stringValue': userId},
        'question': {'stringValue': question},
        'answer': {'stringValue': answer},
        'subjectCode': {'stringValue': subjectCode ?? ''},
        'subjectName': {'stringValue': subjectName ?? ''},
        'mode': {'stringValue': mode},
        'providerUsed': {'stringValue': providerUsed ?? ''},
        'timestamp': {'timestampValue': timestamp.toUtc().toIso8601String()},
      }
    };
  }

  /// Parse from Firestore REST document structure
  factory AiBookmark.fromFirestoreDocument(Map<String, dynamic> doc) {
    final name = doc['name'] as String? ?? '';
    final docId = name.split('/').last;
    final fields = (doc['fields'] as Map<String, dynamic>?) ?? {};

    String extractString(String key, [String fallback = '']) {
      final f = fields[key];
      if (f is Map && f.containsKey('stringValue')) {
        return f['stringValue'] as String;
      }
      return fallback;
    }

    DateTime extractDate(String key) {
      final f = fields[key];
      if (f is Map && f.containsKey('timestampValue')) {
        return DateTime.tryParse(f['timestampValue'] as String) ?? DateTime.now();
      }
      return DateTime.now();
    }

    final id = extractString('id', docId);
    final userId = extractString('userId');
    final question = extractString('question');
    final answer = extractString('answer');
    final subjectCode = extractString('subjectCode');
    final subjectName = extractString('subjectName');
    final mode = extractString('mode', 'tutorHinglish');
    final providerUsed = extractString('providerUsed');
    final timestamp = extractDate('timestamp');

    return AiBookmark(
      id: id,
      userId: userId,
      question: question,
      answer: answer,
      subjectCode: subjectCode.isNotEmpty ? subjectCode : null,
      subjectName: subjectName.isNotEmpty ? subjectName : null,
      mode: mode,
      providerUsed: providerUsed.isNotEmpty ? providerUsed : null,
      timestamp: timestamp,
    );
  }
}
