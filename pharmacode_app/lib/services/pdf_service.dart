import 'dart:async';
import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class AdminPdfItem {
  final String id;
  final String title;
  final String subjectCode;
  final String subjectName;
  final int semester;
  final String unit;
  final String category;
  final String url;
  final String fileSize;
  final int pages;
  final int downloadsCount;
  final bool isPremium;
  final String playProductId;
  final int priceRupees;
  final int previewPages;
  final String description;

  AdminPdfItem({
    required this.id,
    required this.title,
    required this.subjectCode,
    required this.subjectName,
    required this.semester,
    required this.unit,
    required this.category,
    required this.url,
    required this.fileSize,
    required this.pages,
    required this.downloadsCount,
    this.isPremium = false,
    this.playProductId = '',
    this.priceRupees = 199,
    this.previewPages = 3,
    this.description = '',
  });

  factory AdminPdfItem.fromJson(Map<String, dynamic> json) {
    return AdminPdfItem(
      id: json['id']?.toString() ?? '',
      title: json['title']?.toString() ?? '',
      subjectCode: (json['subjectCode']?.toString() ?? '').toUpperCase().trim(),
      subjectName: json['subjectName']?.toString() ?? '',
      semester: (json['semester'] is num) ? (json['semester'] as num).toInt() : 1,
      unit: json['unit']?.toString() ?? '',
      category: json['category']?.toString() ?? 'Notes',
      url: json['url']?.toString() ?? '',
      fileSize: json['fileSize']?.toString() ?? '3.5 MB',
      pages: (json['pages'] is num) ? (json['pages'] as num).toInt() : 20,
      downloadsCount: (json['downloadsCount'] is num) ? (json['downloadsCount'] as num).toInt() : 0,
      isPremium: json['isPremium'] == true,
      playProductId: json['playProductId']?.toString() ?? '',
      priceRupees: (json['priceRupees'] is num) ? (json['priceRupees'] as num).toInt() : 199,
      previewPages: (json['previewPages'] is num) ? (json['previewPages'] as num).toInt() : 3,
      description: json['description']?.toString() ?? '',
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'title': title,
    'subjectCode': subjectCode,
    'subjectName': subjectName,
    'semester': semester,
    'unit': unit,
    'category': category,
    'url': url,
    'fileSize': fileSize,
    'pages': pages,
    'downloadsCount': downloadsCount,
    'isPremium': isPremium,
    'playProductId': playProductId,
    'priceRupees': priceRupees,
    'previewPages': previewPages,
    'description': description,
  };
}

class PdfService {
  static final PdfService _instance = PdfService._internal();
  factory PdfService() => _instance;
  PdfService._internal();

  static PdfService get instance => _instance;

  List<AdminPdfItem> _cachedPdfs = [];
  bool _isLoaded = false;

  bool get isLoaded => _isLoaded;
  List<AdminPdfItem> get allPdfs => List.unmodifiable(_cachedPdfs);

  Future<void> initialize() async {
    await _loadFromCache();
    unawaited(fetchPdfs());
  }

  Future<void> _loadFromCache() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final raw = prefs.getString('cached_admin_pdfs');
      if (raw != null) {
        final List<dynamic> list = jsonDecode(raw);
        _cachedPdfs = list.map((e) => AdminPdfItem.fromJson(e as Map<String, dynamic>)).toList();
        _isLoaded = true;
      }
    } catch (_) {}
  }

  Future<List<AdminPdfItem>> fetchPdfs() async {
    try {
      final uri = Uri.parse('https://pharmacode.vercel.app/api/pdfs/?t=${DateTime.now().millisecondsSinceEpoch}');
      final res = await http.get(uri).timeout(const Duration(seconds: 6));
      if (res.statusCode == 200) {
        final Map<String, dynamic> data = jsonDecode(res.body);
        final List<dynamic> list = data['pdfs'] ?? [];
        _cachedPdfs = list.map((e) => AdminPdfItem.fromJson(e as Map<String, dynamic>)).toList();
        _isLoaded = true;

        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('cached_admin_pdfs', jsonEncode(list));
      }
    } catch (e) {
      debugPrint('PdfService sync note (offline): $e');
    }
    return _cachedPdfs;
  }

  AdminPdfItem? getPdfForSubject(String subjectCode, {String? unit}) {
    final cleanCode = subjectCode.toUpperCase().trim();
    if (_cachedPdfs.isEmpty) return null;

    if (unit != null && unit.isNotEmpty) {
      final cleanUnit = unit.toLowerCase();
      final matchWithUnit = _cachedPdfs.firstWhere(
        (p) => p.subjectCode == cleanCode && (p.unit.toLowerCase().contains(cleanUnit) || cleanUnit.contains(p.unit.toLowerCase())),
        orElse: () => _cachedPdfs.firstWhere(
          (p) => p.subjectCode == cleanCode,
          orElse: () => AdminPdfItem(
            id: '',
            title: '',
            subjectCode: '',
            subjectName: '',
            semester: 1,
            unit: '',
            category: '',
            url: '',
            fileSize: '',
            pages: 0,
            downloadsCount: 0,
          ),
        ),
      );
      return matchWithUnit.id.isNotEmpty ? matchWithUnit : null;
    }

    final match = _cachedPdfs.firstWhere(
      (p) => p.subjectCode == cleanCode,
      orElse: () => AdminPdfItem(
        id: '',
        title: '',
        subjectCode: '',
        subjectName: '',
        semester: 1,
        unit: '',
        category: '',
        url: '',
        fileSize: '',
        pages: 0,
        downloadsCount: 0,
      ),
    );
    return match.id.isNotEmpty ? match : null;
  }

  String getTrackedDownloadUrl(String id) {
    return 'https://pharmacode.vercel.app/api/pdfs/download/?id=$id';
  }
}
