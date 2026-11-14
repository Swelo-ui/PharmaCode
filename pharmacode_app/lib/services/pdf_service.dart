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
    final id = json['id']?.toString() ?? '';
    String title = json['title']?.toString() ?? '';
    String subjectCode = (json['subjectCode']?.toString() ?? '').toUpperCase().trim();
    String subjectName = json['subjectName']?.toString() ?? '';
    String unit = json['unit']?.toString() ?? '';
    String category = json['category']?.toString() ?? 'Notes';
    String description = json['description']?.toString() ?? '';

    String fileSize = json['fileSize']?.toString() ?? '3.5 MB';
    int pages = (json['pages'] is num) ? (json['pages'] as num).toInt() : 20;
    int previewPages = (json['previewPages'] is num) ? (json['previewPages'] as num).toInt() : 3;

    // Remove any trailing "(XX Pages)" or "(XX Pages PDF)" from title if present
    title = title.replaceAll(RegExp(r'\s*\(\d+\s*Pages?(?:\s*PDF)?\)', caseSensitive: false), '').trim();

    // Normalization for official career kits and guides
    if (id == 'pdf-pv-guide') {
      title = 'Pharmacovigilance (PV) Master Interview Guide & ICSR Cases';
      fileSize = '11.6 MB';
      pages = 44;
    } else if (id == 'pdf-ra-guide') {
      title = 'Regulatory Affairs (RA) Complete eCTD Dossier & Filing Guide';
      fileSize = '1.2 MB';
      pages = 26;
    } else if (id == 'pdf-career-free' || id == 'pdf-cro-manual') {
      title = 'CRO Operations Manual – PharmaCode (2026 Edition)';
      subjectCode = 'CRO-OPS';
      subjectName = 'Clinical Research & CRO Operations';
      unit = '15 Chapters & Onboarding Kit';
      category = 'Career Guide';
      fileSize = '4.8 MB';
      pages = 41;
      previewPages = 41;
      description = '15-Chapter Complete CRO Ecosystem Manual: Clinical Trials, CRA, CDM, QA, GCP & 30-Day Onboarding Checklist (100% Free)';
    }

    return AdminPdfItem(
      id: id,
      title: title,
      subjectCode: subjectCode,
      subjectName: subjectName,
      semester: (json['semester'] is num) ? (json['semester'] as num).toInt() : 1,
      unit: unit,
      category: category,
      url: json['url']?.toString() ?? '',
      fileSize: fileSize,
      pages: pages,
      downloadsCount: (json['downloadsCount'] is num) ? (json['downloadsCount'] as num).toInt() : 0,
      isPremium: json['isPremium'] == true,
      playProductId: json['playProductId']?.toString() ?? '',
      priceRupees: (json['priceRupees'] is num) ? (json['priceRupees'] as num).toInt() : 199,
      previewPages: previewPages,
      description: description,
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
        _cachedPdfs = list
            .where((e) {
              final id = e['id']?.toString() ?? '';
              final code = (e['subjectCode']?.toString() ?? '').toUpperCase().trim();
              return id != 'pdf-2' && id != 'pdf-3' && code != 'BP102T' && code != 'BP604T';
            })
            .map((e) => AdminPdfItem.fromJson(e as Map<String, dynamic>))
            .toList();
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
        final List<dynamic> rawList = data['pdfs'] ?? [];
        final filteredList = rawList.where((e) {
          final id = e['id']?.toString() ?? '';
          final code = (e['subjectCode']?.toString() ?? '').toUpperCase().trim();
          return id != 'pdf-2' && id != 'pdf-3' && code != 'BP102T' && code != 'BP604T';
        }).toList();

        _cachedPdfs = filteredList.map((e) => AdminPdfItem.fromJson(e as Map<String, dynamic>)).toList();
        _isLoaded = true;

        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('cached_admin_pdfs', jsonEncode(filteredList));
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
