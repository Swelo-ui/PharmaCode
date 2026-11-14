import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:share_plus/share_plus.dart';
import '../../core/ads/ad_service.dart';
import '../../core/animations.dart';
import '../../core/billing/in_app_purchase_service.dart';
import '../../core/security/secure_doc_resolver.dart';
import '../../core/theme.dart';
import '../../core/widgets/prebook_vip_sheet.dart';
import '../../services/auth_service.dart';
import '../../services/pdf_service.dart';
import '../notes/secure_pdf_reader_screen.dart';

/// Production Guide Detail & In-App Purchase Screen
/// Directly mirrors the high-conversion, professional website blog pages:
/// - PV Kit: /blog/pharmacovigilance-interview-preparation-kit/
/// - RA Kit: /blog/regulatory-affairs-complete-guide/
/// - CRO Manual: /career/ Clinical Research & Trial Operations
class GuideDetailScreen extends StatefulWidget {
  final String guideType; // 'pv', 'ra', or 'cro'
  final AdminPdfItem? pdfItem;

  const GuideDetailScreen({
    super.key,
    required this.guideType,
    this.pdfItem,
  });

  @override
  State<GuideDetailScreen> createState() => _GuideDetailScreenState();
}

class _GuideDetailScreenState extends State<GuideDetailScreen> {
  final InAppPurchaseService _billing = InAppPurchaseService.instance;
  final Set<int> _expandedQuestions = {}; // All questions collapsed by default; tap to open/close

  bool get _isPv => widget.guideType.toLowerCase() == 'pv';
  bool get _isCro => widget.guideType.toLowerCase() == 'cro';

  String get _productId => _isPv ? PlayProducts.guidePvInterview : PlayProducts.guideRaDossier;

  AdminPdfItem get _resolvedItem {
    if (widget.pdfItem != null) return widget.pdfItem!;
    final all = PdfService.instance.allPdfs;

    if (_isCro) {
      return all.firstWhere(
        (p) => p.id == 'pdf-career-free' || p.id == 'pdf-cro-manual',
        orElse: () => _defaultCroItem,
      );
    }

    return all.firstWhere(
      (p) => p.playProductId == _productId || (_isPv ? p.id == 'pdf-pv-guide' : p.id == 'pdf-ra-guide'),
      orElse: () => _isPv ? _defaultPvItem : _defaultRaItem,
    );
  }

  static final AdminPdfItem _defaultPvItem = AdminPdfItem(
    id: 'pdf-pv-guide',
    title: 'Pharmacovigilance (PV) Master Interview Guide & ICSR Cases',
    subjectCode: 'BP805ET',
    subjectName: 'Pharmacovigilance',
    semester: 8,
    unit: 'Complete Interview Kit',
    category: 'Notes',
    url: '',
    fileSize: '11.6 MB',
    pages: 44,
    downloadsCount: 340,
    isPremium: true,
    playProductId: PlayProducts.guidePvInterview,
    priceRupees: 49,
    previewPages: 8,
    description: 'PV Interview Questions, Argus & MedDRA Case Studies (Included in ₹199 VIP Pass)',
  );

  static final AdminPdfItem _defaultRaItem = AdminPdfItem(
    id: 'pdf-ra-guide',
    title: 'Regulatory Affairs (RA) Complete eCTD Dossier & Filing Guide',
    subjectCode: 'BP707T',
    subjectName: 'Regulatory Affairs',
    semester: 7,
    unit: 'Modules 1-5 Dossier Kit',
    category: 'Notes',
    url: '',
    fileSize: '1.2 MB',
    pages: 26,
    downloadsCount: 280,
    isPremium: true,
    playProductId: PlayProducts.guideRaDossier,
    priceRupees: 99,
    previewPages: 6,
    description: 'eCTD Modules 1-5, USFDA 21 CFR, DMF, ANDA & CDSCO Approval Guide (Included in ₹199 VIP Pass)',
  );

  static final AdminPdfItem _defaultCroItem = AdminPdfItem(
    id: 'pdf-career-free',
    title: 'CRO Operations Manual – PharmaCode (2026 Edition)',
    subjectCode: 'CRO-OPS',
    subjectName: 'Clinical Research & CRO Operations',
    semester: 8,
    unit: '15 Chapters & Onboarding Kit',
    category: 'Career Guide',
    url: SecureDocResolver.resolveSecureUrl('pdf-career-free'),
    fileSize: '4.8 MB',
    pages: 41,
    downloadsCount: 520,
    isPremium: false,
    priceRupees: 0,
    previewPages: 41,
    description: 'CRO Ecosystem Manual: Clinical Trials, CRA, CDM, QA, GCP & 30-Day Onboarding Checklist (100% Free)',
  );

  // ─── VERIFIED SAMPLE PREVIEW DATA (Mirrors Official Website Previews & Curriculum) ─────────
  static final List<Map<String, String>> _raPreviews = [
    {
      'title': 'Official Cover & Overview',
      'tag': 'Cover',
      'desc': 'PharmaCode Learning Series: From Dossier to Drug Approval, Simplified.',
      'asset': 'assets/images/ra_preview/ra-01.png',
      'url': 'https://res.cloudinary.com/dhf7udqhi/image/upload/v1788238873/48909edc-90b9-4e4f-ae81-64c3dd81a507.png',
    },
    {
      'title': 'Contents & Curriculum',
      'tag': 'Curriculum',
      'desc': 'Complete 20-section roadmap, 9 regulatory body corrections & study guide.',
      'asset': 'assets/images/ra_preview/ra-02.png',
      'url': 'https://res.cloudinary.com/dhf7udqhi/image/upload/v1788238888/70da3ac5-beb7-47d2-b2e9-1c8620faeab1.png',
    },
    {
      'title': 'What Is Regulatory Affairs?',
      'tag': 'Section 01',
      'desc': 'Core definition, RA vs QA vs PV comparison & role inside pharma.',
      'asset': 'assets/images/ra_preview/ra-03.png',
      'url': 'https://res.cloudinary.com/dhf7udqhi/image/upload/v1788239051/df5f1141-d700-4a9e-b96a-05a43b7b51c2.png',
    },
    {
      'title': 'Regulatory Bodies of the World',
      'tag': 'Section 03',
      'desc': 'Country-wise list (FDA, EMA, MHRA, CDSCO) & updated agency names.',
      'asset': 'assets/images/ra_preview/ra-04.png',
      'url': 'https://res.cloudinary.com/dhf7udqhi/image/upload/v1788238979/4dd3e64a-5c50-481e-9fcb-2a97ebd08cb2.png',
    },
    {
      'title': 'The CTD Triangle & Modules 1–5',
      'tag': 'Section 08',
      'desc': 'Visual dossier hierarchy, Module 1 regional admin vs Modules 2–5 scientific data.',
      'asset': 'assets/images/ra_preview/ra-05.png',
      'url': 'https://res.cloudinary.com/dhf7udqhi/image/upload/v1788239079/3716fc61-19db-4892-9db5-2d7a1a27b1e1.png',
    },
    {
      'title': '10 Real RA Interview Questions',
      'tag': 'Section 17',
      'desc': 'Model answers for freshers: NDA vs MAA, CTD in 30s, eCTD & DMF.',
      'asset': 'assets/images/ra_preview/ra-06.png',
      'url': 'https://res.cloudinary.com/dhf7udqhi/image/upload/v1788239152/a98654b1-c24e-4365-b4cc-3c3c58059fb7.png',
    },
  ];

  static final List<Map<String, String>> _pvPreviews = [
    {
      'title': 'Cover & Positioning',
      'tag': 'Page 1',
      'desc': 'Official PharmaCode guide positioning for B.Pharm freshers.',
      'asset': 'assets/images/pv_preview/demo-01.png',
      'url': 'https://pharmacode.vercel.app/blog/pv-kit/demo-01.png',
    },
    {
      'title': '15-Chapter Table of Contents',
      'tag': 'Pages 2-3',
      'desc': 'Structured sequence from PV basics to advanced Q&A.',
      'asset': 'assets/images/pv_preview/demo-02.png',
      'url': 'https://pharmacode.vercel.app/blog/pv-kit/demo-02.png',
    },
    {
      'title': 'How to Use the Kit',
      'tag': 'Page 4',
      'desc': 'Maximizing your preparation strategy for MNC interviews.',
      'asset': 'assets/images/pv_preview/demo-03.png',
      'url': 'https://pharmacode.vercel.app/blog/pv-kit/demo-03.png',
    },
    {
      'title': 'Chapter 01 — PV Foundations',
      'tag': 'Pages 5-7',
      'desc': 'Core terminology, definitions, Thalidomide tragedy & evolution.',
      'asset': 'assets/images/pv_preview/demo-04.png',
      'url': 'https://pharmacode.vercel.app/blog/pv-kit/demo-04.png',
    },
    {
      'title': 'MedDRA & Signal Detection',
      'tag': 'Pages 8-11',
      'desc': '5-tier hierarchy, coding conventions & signal management.',
      'asset': 'assets/images/pv_preview/demo-05.png',
      'url': 'https://pharmacode.vercel.app/blog/pv-kit/demo-05.png',
    },
    {
      'title': 'ICSR & Case Processing',
      'tag': 'Pages 12-15',
      'desc': 'End-to-end flowchart from case receipt to regulatory submission.',
      'asset': 'assets/images/pv_preview/demo-06.png',
      'url': 'https://pharmacode.vercel.app/blog/pv-kit/demo-06.png',
    },
    {
      'title': 'Causality Assessment WHO-UMC',
      'tag': 'Pages 16-19',
      'desc': 'WHO-UMC criteria, Naranjo scoring & decision matrix.',
      'asset': 'assets/images/pv_preview/demo-07.png',
      'url': 'https://pharmacode.vercel.app/blog/pv-kit/demo-07.png',
    },
    {
      'title': 'Interview Questions Solved',
      'tag': 'Pages 20-25',
      'desc': 'High-yield technical and HR interview questions answered.',
      'asset': 'assets/images/pv_preview/demo-08.png',
      'url': 'https://pharmacode.vercel.app/blog/pv-kit/demo-08.png',
    },
  ];

  static final List<Map<String, String>> _croPreviews = [
    {
      'title': 'Official Cover & 2026 Edition',
      'tag': 'Cover',
      'desc': "A Fresher's Field Guide to Contract Research Organizations & Clinical Trial Operations (ICH E6(R3)-aligned).",
      'asset': 'assets/images/cro_preview/cro-01.png',
      'url': '',
    },
    {
      'title': 'Table of Contents & Structure',
      'tag': 'Page 1',
      'desc': '15 structured chapters: What is a CRO, Anatomy, BD & Trial Lifecycle Roadmap.',
      'asset': 'assets/images/cro_preview/cro-02.png',
      'url': '',
    },
    {
      'title': 'Definition & 4 Types of CROs',
      'tag': 'Page 6',
      'desc': 'Full-Service CRO, Functional Service Provider (FSP), Boutique & Virtual CRO comparison.',
      'asset': 'assets/images/cro_preview/cro-03.png',
      'url': '',
    },
    {
      'title': 'The Clinical Trial Journey',
      'tag': 'Page 12',
      'desc': 'Phases I-IV breakdown, study lifecycle from protocol design to closeout & key terms.',
      'asset': 'assets/images/cro_preview/cro-04.png',
      'url': '',
    },
    {
      'title': 'Glossary of CRO Abbreviations',
      'tag': 'Page 36',
      'desc': 'Essential shorthand used in SOPs: CRA, CRF, ALCOA+, CTMS, MedDRA, and SAE.',
      'asset': 'assets/images/cro_preview/cro-05.png',
      'url': '',
    },
  ];

  void _handlePrimaryAction(bool isUnlocked) async {
    AppHaptics.selectionClick();

    if (_isCro) {
      AdService.instance.showInterstitialAd(
        onDismissed: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => SecurePdfReaderScreen(pdfItem: _resolvedItem),
            ),
          );
        },
      );
      return;
    }

    if (isUnlocked) {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) => SecurePdfReaderScreen(pdfItem: _resolvedItem),
        ),
      );
      return;
    }

    final user = AuthService().currentUser;
    if (user == null) {
      final cred = await AuthService().signInWithGoogle();
      if (cred != null && mounted) {
        await _billing.syncUserEntitlements(cred.user?.uid ?? '');
        if (!mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Logged in as ${AuthService().displayName}. Ready to purchase guide!'),
            backgroundColor: const Color(0xFF059669),
          ),
        );
      }
      return;
    }

    // Direct Google Play checkout
    _billing.buyProductById(_productId);
  }

  void _shareGuide() {
    final url = _isPv
        ? 'https://pharmacode.vercel.app/blog/pharmacovigilance-interview-preparation-kit/'
        : _isCro
            ? 'https://pharmacode.vercel.app/career/'
            : 'https://pharmacode.vercel.app/blog/regulatory-affairs-complete-guide/';
    final title = _isPv
        ? 'Pharmacovigilance Complete Guide & Interview Preparation Kit'
        : _isCro
            ? 'CRO Operations Manual – PharmaCode (2026 Edition)'
            : 'Regulatory Affairs (RA) Complete Guide — From Dossier to Drug Approval';

    SharePlus.instance.share(
      ShareParams(
        text: '📖 $title\n\n'
            'Check out this verified study guide on PharmaCode:\n$url',
        subject: title,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<Set<String>>(
      valueListenable: _billing.unlockedNotifier,
      builder: (context, unlockedSet, _) {
        final isUnlocked = _isCro ? true : _billing.isUnlocked(_productId);
        final primaryColor = _isPv
            ? const Color(0xFFDC2626)
            : _isCro
                ? const Color(0xFF059669)
                : const Color(0xFF2563EB);
        final gradientColors = _isPv
            ? [const Color(0xFF991B1B), const Color(0xFFDC2626)]
            : _isCro
                ? [const Color(0xFF065F46), const Color(0xFF059669)]
                : [const Color(0xFF1E3A8A), const Color(0xFF2563EB)];

        return Scaffold(
          backgroundColor: AppTheme.background,
          appBar: AppBar(
            title: Text(
              _isPv
                  ? 'PV Interview Kit'
                  : _isCro
                      ? 'CRO Operations Manual'
                      : 'RA Complete Guide',
              style: GoogleFonts.dmSans(
                color: AppTheme.primaryNavy,
                fontWeight: FontWeight.w900,
                fontSize: 17,
              ),
            ),
            actions: [
              IconButton(
                icon: const Icon(Icons.share_rounded, size: 20),
                onPressed: _shareGuide,
                tooltip: 'Share Guide',
              ),
            ],
          ),
          bottomNavigationBar: _buildStickyBottomBar(isUnlocked, primaryColor),
          body: SingleChildScrollView(
            physics: const BouncingScrollPhysics(),
            padding: const EdgeInsets.only(bottom: 30),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // 1. HERO HEADER
                _buildHeroBanner(gradientColors, isUnlocked),

                const SizedBox(height: 18),

                // 2. KEY VALUE PILLS & STATS
                _buildFeaturesGrid(primaryColor),

                const SizedBox(height: 22),

                // 3. SAMPLE PREVIEW CARDS (Real Previews With Zoom Lightbox)
                _buildSamplePreviewSection(primaryColor),

                const SizedBox(height: 24),

                // 4. CHAPTER ROADMAP (Complete Curriculum)
                _buildChapterRoadmap(primaryColor),

                const SizedBox(height: 24),

                // 5. INTERVIEW Q&A PREVIEW
                _buildInterviewQnAPreview(primaryColor),

                const SizedBox(height: 24),

                // 6. VALUE PROPOSITION / TRUST CARD
                _buildTrustCard(primaryColor, isUnlocked),

                const SizedBox(height: 16),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildHeroBanner(List<Color> gradientColors, bool isUnlocked) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.fromLTRB(16, 8, 16, 0),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: gradientColors,
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: gradientColors.first.withValues(alpha: 0.28),
            blurRadius: 16,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Flexible(
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3.5),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    _isPv
                        ? 'OFFICIAL INTERVIEW PREP KIT'
                        : _isCro
                            ? 'CRO OPERATIONS MANUAL'
                            : 'COMPLETE DOSSIER & REGULATORY KIT',
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: GoogleFonts.dmSans(
                      color: gradientColors.first,
                      fontSize: 10,
                      fontWeight: FontWeight.w900,
                      letterSpacing: 0.3,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              if (isUnlocked)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3.5),
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.2),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.check_circle_rounded, color: Colors.white, size: 13),
                      const SizedBox(width: 4),
                      Text(
                        _isCro ? '100% FREE ACCESS' : 'UNLOCKED',
                        style: GoogleFonts.dmSans(
                          color: Colors.white,
                          fontSize: 10,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                    ],
                  ),
                ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            _isPv
                ? 'Pharmacovigilance (PV) Master Interview Guide'
                : _isCro
                    ? 'CRO Operations Manual (2026 Edition)'
                    : 'Regulatory Affairs (RA) Complete eCTD Guide',
            style: GoogleFonts.dmSans(
              color: Colors.white,
              fontSize: 21,
              fontWeight: FontWeight.w900,
              height: 1.2,
              letterSpacing: -0.4,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            _isPv
                ? 'The definitive handbook covering ICSR case processing, MedDRA coding, WHO-UMC causality, and 100+ solved interview questions.'
                : _isCro
                    ? 'Comprehensive operational manual covering ICH-GCP E6(R2), clinical trial monitoring, SAE reporting, TMF management, and 50+ interview Q&As.'
                    : 'The complete eCTD handbook covering Modules 1-5, USFDA 21 CFR, DMF, ANDA filing pathways, CDSCO regulations, and MNC interview Q&As.',
            style: GoogleFonts.dmSans(
              color: Colors.white.withValues(alpha: 0.9),
              fontSize: 12,
              height: 1.4,
            ),
          ),
          const SizedBox(height: 14),
          Wrap(
            spacing: 6,
            runSpacing: 6,
            children: [
              _buildWhiteTag(_isPv ? 'Interview Kit' : _isCro ? 'Free Manual' : 'eCTD Dossier'),
              _buildWhiteTag(_isPv ? '15 Chapters' : _isCro ? '15 Chapters' : '20 Sections'),
              _buildWhiteTag(_isPv ? 'Argus & MedDRA' : _isCro ? 'CRA & GCP Manual' : 'Modules 1-5 eCTD'),
              _buildWhiteTag(_isCro ? '100% Free Access' : 'Offline Reading Enabled'),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildWhiteTag(String label) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3.5),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.16),
        borderRadius: BorderRadius.circular(6),
      ),
      child: Text(
        label,
        style: GoogleFonts.dmSans(
          color: Colors.white,
          fontSize: 10.5,
          fontWeight: FontWeight.w700,
        ),
      ),
    );
  }

  Widget _buildFeaturesGrid(Color primaryColor) {
    final features = _isPv
        ? [
            {'icon': Icons.psychology_rounded, 'title': '100% Fresher Friendly', 'desc': 'Simple English with no gatekeeping jargon'},
            {'icon': Icons.assignment_turned_in_rounded, 'title': 'Real ICSR Cases', 'desc': 'WHO-UMC & Naranjo algorithm walk-throughs'},
            {'icon': Icons.forum_rounded, 'title': 'HR & Technical Q&A', 'desc': '100+ Solved questions asked by TCS, IQVIA, Cognizant'},
            {'icon': Icons.offline_pin_rounded, 'title': 'Offline Smart Reader', 'desc': 'Read anytime with zero mobile data inside PharmaCode'},
          ]
        : _isCro
            ? [
                {'icon': Icons.biotech_rounded, 'title': '100% Free & Open', 'desc': 'Complete sponsored access with zero registration'},
                {'icon': Icons.verified_user_rounded, 'title': 'ICH-GCP E6(R2) Ready', 'desc': 'Site selection, protocol, ICF, and SDV checklists'},
                {'icon': Icons.assignment_turned_in_rounded, 'title': 'Real Case Scenarios', 'desc': '24hr SAE escalation, deviation logs & query tracking'},
                {'icon': Icons.forum_rounded, 'title': 'MNC Interview Prep', 'desc': '50+ Solved scenario questions for CRA & CRC trainees'},
              ]
            : [
                {'icon': Icons.account_tree_rounded, 'title': 'eCTD 5 Modules', 'desc': 'Complete ICH M4 dossier architecture explained'},
                {'icon': Icons.gavel_rounded, 'title': 'Global Regulations', 'desc': 'USFDA 21 CFR, EMA Centralised & CDSCO Sugam'},
                {'icon': Icons.folder_special_rounded, 'title': 'DMF & ANDA Filings', 'desc': 'Bioequivalence criteria, SUPAC & stability'},
                {'icon': Icons.verified_rounded, 'title': 'Industry Verified Notes', 'desc': 'ICH CTD dossiers, DMF templates & submission checklists'},
              ];

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Key Highlights & Inclusions',
            style: GoogleFonts.dmSans(
              color: AppTheme.primaryNavy,
              fontSize: 16,
              fontWeight: FontWeight.w900,
              letterSpacing: -0.3,
            ),
          ),
          const SizedBox(height: 10),
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              crossAxisSpacing: 10,
              mainAxisSpacing: 10,
              childAspectRatio: 1.65,
            ),
            itemCount: features.length,
            itemBuilder: (context, i) {
              final f = features[i];
              return Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: AppTheme.borderSoft),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.02),
                      blurRadius: 6,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Icon(f['icon'] as IconData, size: 20, color: primaryColor),
                    const SizedBox(height: 6),
                    Text(
                      f['title'] as String,
                      style: GoogleFonts.dmSans(
                        fontWeight: FontWeight.w800,
                        fontSize: 12,
                        color: AppTheme.primaryNavy,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 2),
                    Text(
                      f['desc'] as String,
                      style: GoogleFonts.dmSans(
                        fontSize: 10.5,
                        color: AppTheme.textMuted,
                        height: 1.25,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  // ─── VERIFIED SAMPLE PREVIEW SECTION WITH REAL DOCUMENT IMAGES ───────────────
  Widget _buildSamplePreviewSection(Color primaryColor) {
    final items = _isPv
        ? _pvPreviews
        : _isCro
            ? _croPreviews
            : _raPreviews;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Inside the PDF · Verified Samples',
                    style: GoogleFonts.dmSans(
                      color: AppTheme.primaryNavy,
                      fontSize: 16,
                      fontWeight: FontWeight.w900,
                      letterSpacing: -0.3,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    'Tap any sample to zoom & preview high-res pages',
                    style: GoogleFonts.dmSans(
                      color: AppTheme.textMuted,
                      fontSize: 11,
                    ),
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: primaryColor.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  '${items.length} Samples',
                  style: GoogleFonts.dmSans(
                    color: primaryColor,
                    fontSize: 11,
                    fontWeight: FontWeight.w800,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          // Horizontal carousel of sample preview cards with real document images
          SizedBox(
            height: 245,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              physics: const BouncingScrollPhysics(),
              itemCount: items.length,
              itemBuilder: (context, i) {
                final item = items[i];
                return GestureDetector(
                  onTap: () => _openLightbox(items, i, primaryColor),
                  child: Container(
                    width: 180,
                    margin: const EdgeInsets.only(right: 12),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: AppTheme.borderSoft),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.04),
                          blurRadius: 8,
                          offset: const Offset(0, 3),
                        ),
                      ],
                    ),
                    clipBehavior: Clip.antiAlias,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Document page image container
                        SizedBox(
                          height: 145,
                          width: double.infinity,
                          child: Stack(
                            fit: StackFit.expand,
                            children: [
                              _buildPreviewImage(item),
                              // Top page badge
                              Positioned(
                                top: 8,
                                left: 8,
                                child: Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2.5),
                                  decoration: BoxDecoration(
                                    color: Colors.black.withValues(alpha: 0.72),
                                    borderRadius: BorderRadius.circular(5),
                                  ),
                                  child: Text(
                                    item['tag'] ?? '',
                                    style: GoogleFonts.dmSans(
                                      color: Colors.white,
                                      fontSize: 10,
                                      fontWeight: FontWeight.w800,
                                    ),
                                  ),
                                ),
                              ),
                              // Zoom hint badge
                              Positioned(
                                top: 8,
                                right: 8,
                                child: Container(
                                  padding: const EdgeInsets.all(4),
                                  decoration: BoxDecoration(
                                    color: Colors.black.withValues(alpha: 0.55),
                                    shape: BoxShape.circle,
                                  ),
                                  child: const Icon(
                                    Icons.zoom_in_rounded,
                                    color: Colors.white,
                                    size: 14,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                        // Title and Description
                        Expanded(
                          child: Padding(
                            padding: const EdgeInsets.all(10),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  item['title'] ?? '',
                                  style: GoogleFonts.dmSans(
                                    color: AppTheme.primaryNavy,
                                    fontWeight: FontWeight.w800,
                                    fontSize: 12,
                                    height: 1.2,
                                  ),
                                  maxLines: 2,
                                  overflow: TextOverflow.ellipsis,
                                ),
                                const SizedBox(height: 3),
                                Expanded(
                                  child: Text(
                                    item['desc'] ?? '',
                                    style: GoogleFonts.dmSans(
                                      color: AppTheme.textMuted,
                                      fontSize: 10.5,
                                      height: 1.25,
                                    ),
                                    maxLines: 2,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPreviewImage(Map<String, String> item, {BoxFit fit = BoxFit.cover}) {
    final asset = item['asset'];
    final url = item['url'];

    if (asset != null && asset.isNotEmpty) {
      return Image.asset(
        asset,
        fit: fit,
        errorBuilder: (context, error, stackTrace) {
          if (url != null && url.isNotEmpty) {
            return CachedNetworkImage(
              imageUrl: url,
              fit: fit,
              placeholder: (context, url) => Container(
                color: const Color(0xFFF1F5F9),
                child: const Center(
                  child: SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  ),
                ),
              ),
              errorWidget: (context, url, error) => _buildPlaceholderTile(item),
            );
          }
          return _buildPlaceholderTile(item);
        },
      );
    } else if (url != null && url.isNotEmpty) {
      return CachedNetworkImage(
        imageUrl: url,
        fit: fit,
        placeholder: (context, url) => Container(
          color: const Color(0xFFF1F5F9),
          child: const Center(
            child: SizedBox(
              width: 20,
              height: 20,
              child: CircularProgressIndicator(strokeWidth: 2),
            ),
          ),
        ),
        errorWidget: (context, url, error) => _buildPlaceholderTile(item),
      );
    }
    return _buildPlaceholderTile(item);
  }

  Widget _buildPlaceholderTile(Map<String, String> item) {
    return Container(
      color: const Color(0xFFEEF2FF),
      alignment: Alignment.center,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.picture_as_pdf_rounded, color: Color(0xFF4C6EF5), size: 28),
          const SizedBox(height: 4),
          Text(
            item['tag'] ?? 'Preview',
            style: GoogleFonts.dmSans(
              color: const Color(0xFF4C6EF5),
              fontWeight: FontWeight.w700,
              fontSize: 10,
            ),
          ),
        ],
      ),
    );
  }

  void _openLightbox(List<Map<String, String>> items, int initialIndex, Color primaryColor) {
    showDialog(
      context: context,
      barrierColor: Colors.black.withValues(alpha: 0.92),
      builder: (ctx) => _SampleLightboxDialog(
        items: items,
        initialIndex: initialIndex,
        primaryColor: primaryColor,
        isUnlocked: _isCro ? true : _billing.isUnlocked(_productId),
        onPrimaryAction: () {
          Navigator.pop(ctx);
          _handlePrimaryAction(_isCro ? true : _billing.isUnlocked(_productId));
        },
        actionButtonText: _isCro
            ? 'Read CRO Manual (Free)'
            : (_billing.isUnlocked(_productId)
                ? 'Read Full PDF'
                : (_isPv ? 'Unlock Guide · ₹49' : 'Unlock Guide · ₹99')),
      ),
    );
  }

  Widget _buildChapterRoadmap(Color primaryColor) {
    final pvChapters = [
      {'ch': '01', 'title': 'PV Fundamentals & Terminology', 'desc': 'Core concepts, definitions, Thalidomide tragedy & industry evolution.'},
      {'ch': '02', 'title': 'Global & Indian Regulatory Framework', 'desc': 'WHO, US FDA 21 CFR, EMA, CDSCO regulations & PvPI.'},
      {'ch': '03', 'title': 'ICSR & Case Processing Workflow', 'desc': 'Case intake, triage, duplicate check, data entry & quality review.'},
      {'ch': '04', 'title': 'Four Minimum Criteria for Valid Case', 'desc': 'Identifiable patient, reporter, suspect drug & adverse event rules.'},
      {'ch': '05', 'title': 'MedDRA & WHODrug Concepts', 'desc': '5-tier hierarchy (SOC, HLGT, HLT, PT, LLT) & dictionary coding.'},
      {'ch': '06', 'title': 'Causality Assessment Algorithms', 'desc': 'Step-by-step WHO-UMC criteria & Naranjo score calculation.'},
      {'ch': '07', 'title': 'Safety Signal Detection & Management', 'desc': 'Disproportionality analysis, PRR, ROR & post-marketing surveillance.'},
      {'ch': '08', 'title': 'PSUR / PBRER / DSUR Aggregate Reports', 'desc': 'Periodic safety update report structures and regulatory timelines.'},
      {'ch': '09', 'title': 'Risk Management Plans (RMP & REMS)', 'desc': 'Proactive risk mitigation, educational materials & safety alerts.'},
      {'ch': '10', 'title': 'Good Pharmacovigilance Practices (GVP)', 'desc': 'EU GVP modules I-XVI and inspection readiness standard.'},
      {'ch': '11', 'title': 'PV Databases (Argus Safety & ArisGlobal)', 'desc': 'Software navigation, audit trails & E2B(R3) electronic transmission.'},
      {'ch': '12', 'title': 'HR Interview Behavioral Questions', 'desc': 'Situational questions with STAR technique model answers.'},
      {'ch': '13', 'title': 'Core Technical Interview Q&A', 'desc': '50+ High-frequency technical questions asked in pharma MNCs.'},
      {'ch': '14', 'title': 'Real-World Scenarios & Case Studies', 'desc': 'Complex case studies: multiple suspects, pregnancy & off-label use.'},
      {'ch': '15', 'title': 'ATS Resume Templates & Mock Strategy', 'desc': 'Keywords, resume builder checklist & final day revision sheet.'},
    ];

    final croChapters = [
      {'ch': '01', 'title': 'Welcome: What Exactly Is a CRO?', 'desc': 'Definition, why the industry exists, 4 types of CROs & fresher entry points.'},
      {'ch': '02', 'title': 'Anatomy of a CRO — Where Freshers Fit', 'desc': 'Core departments, career ladders, governance & the SOP hierarchy.'},
      {'ch': '03', 'title': 'Business Development & Contracts', 'desc': 'RFP lifecycle, winning proposals, contract models & change orders.'},
      {'ch': '04', 'title': 'The Clinical Trial Journey', 'desc': 'Phases I to IV, trial lifecycle end-to-end & key daily terminology.'},
      {'ch': '05', 'title': 'ICH-GCP Guidelines & Ethical Oversight', 'desc': '13 Core principles, Institutional Ethics Committees & participant rights.'},
      {'ch': '06', 'title': 'Site Selection & Feasibility Assessment', 'desc': 'Investigator capabilities, site infrastructure & greenlight qualifications.'},
      {'ch': '07', 'title': 'Site Initiation Visits (SIV)', 'desc': 'Site activation checklist, staff training, delegation logs & readiness sign-off.'},
      {'ch': '08', 'title': 'Investigational Medicinal Products (IMP)', 'desc': 'Accountability logs, temperature management, dispensing & drug returns.'},
      {'ch': '09', 'title': 'Interim Monitoring Visits (IMV)', 'desc': 'On-site monitoring workflows, finding classifications & visit reports.'},
      {'ch': '10', 'title': 'Source Document Verification (SDV)', 'desc': 'ALCOA+ principles, hospital source verification & data discrepancy queries.'},
      {'ch': '11', 'title': 'Safety Desk & SAE Expedited Reporting', 'desc': '24-Hour regulatory clock for fatal/unexpected events & CIOMS-I reporting.'},
      {'ch': '12', 'title': 'Clinical Data Management (CDM)', 'desc': 'eCRF specifications, automated edit checks, query resolution & DB lock.'},
      {'ch': '13', 'title': 'Trial Master File (TMF / eTMF)', 'desc': 'DIA reference model, essential document archiving & audit readiness.'},
      {'ch': '14', 'title': 'Close-Out Visits (COV) & Archiving', 'desc': 'Site closeout, 25-year record retention & clinical study reports (CSR).'},
      {'ch': '15', 'title': 'Your Career Roadmap & 90-Day Blueprint', 'desc': '50+ Interview Q&As for CRA/CRC freshers, resume tips & onboarding survival.'},
    ];

    final raSections = [
      {'ch': '01', 'title': 'What Is Regulatory Affairs?', 'desc': 'Clear definition, purpose and scope — why RA exists and what the function actually does.'},
      {'ch': '02', 'title': 'Role of the RA Professional', 'desc': 'What an RA person does day-to-day across submission, review, labelling and lifecycle.'},
      {'ch': '03', 'title': 'Regulatory Bodies of the World', 'desc': 'FDA, EMA, MHRA, PMDA, NMPA, ANVISA and all major regulators — mapped and explained.'},
      {'ch': '04', 'title': 'India Spotlight — CDSCO', 'desc': "India's central drug regulatory body — structure, DCGI, licensing and enforcement."},
      {'ch': '05', 'title': 'India 2026 Update & ICH Status', 'desc': "Latest regulatory updates, India's ICH membership progress and what it means."},
      {'ch': '06', 'title': 'Dossier & Drug Master File (DMF)', 'desc': 'What is a dossier? Types of DMFs, contents and how they feed into applications.'},
      {'ch': '07', 'title': 'Common Technical Document (CTD)', 'desc': 'The globally harmonised dossier format — purpose, structure and ICH M4 guidance.'},
      {'ch': '08', 'title': 'CTD Triangle & Module 1', 'desc': 'Visual CTD triangle explained module-by-module, including the region-specific Module 1.'},
      {'ch': '09', 'title': 'eCTD — Electronic Submissions', 'desc': 'Electronic CTD format, backbone, sequence numbering and regulatory expectations.'},
      {'ch': '10', 'title': 'New Drug Application (NDA)', 'desc': 'US NDA process — when to file, what sections are required and the FDA review pathway.'},
      {'ch': '11', 'title': 'IND, ANDA & BLA Explained', 'desc': 'Investigational, generic and biologics application types — clearly differentiated.'},
      {'ch': '12', 'title': 'Marketing Authorisation Application (MAA)', 'desc': 'EU MAA filing — EMA procedures, CHMP, centralised vs decentralised pathways.'},
      {'ch': '13', 'title': 'US vs EU vs India — Quick Compare', 'desc': 'Side-by-side comparison table for key regulatory requirements, timelines and terminology.'},
      {'ch': '14', 'title': 'RA Across the Product Lifecycle', 'desc': "RA's role from clinical development through approval to post-marketing variations."},
      {'ch': '15', 'title': 'Skills & Career Ladder', 'desc': 'Skills the industry looks for and the career path from associate to director.'},
      {'ch': '16', 'title': 'Who Hires RA Professionals?', 'desc': 'Innovator pharma, generics, biotech, CROs, consultancies — the full hiring landscape.'},
      {'ch': '17', 'title': 'Interview Preparation', 'desc': '10 real RA interview questions with model answers and explanation strategies.'},
      {'ch': '18', 'title': 'End-to-End Submission Flow', 'desc': 'Visual flowchart from pre-clinical studies through IND, dossier, review to approval.'},
      {'ch': '19', 'title': 'Tricky Points & Mix-Ups', 'desc': 'Common confusions cleared — CTD vs eCTD, NDA vs MAA, CDSCO vs DCGI and more.'},
      {'ch': '20', 'title': 'Glossary — Quick Reference', 'desc': 'All key terms, abbreviations and acronyms in one clean, scannable glossary.'},
    ];

    final chapters = _isPv
        ? pvChapters
        : _isCro
            ? croChapters
            : raSections;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                _isPv
                    ? '15-Chapter Curriculum'
                    : _isCro
                        ? '15-Chapter Curriculum'
                        : '20-Section Curriculum',
                style: GoogleFonts.dmSans(
                  color: AppTheme.primaryNavy,
                  fontSize: 16,
                  fontWeight: FontWeight.w900,
                  letterSpacing: -0.3,
                ),
              ),
              Text(
                'Complete PDF',
                style: GoogleFonts.dmSans(
                  color: primaryColor,
                  fontSize: 12,
                  fontWeight: FontWeight.w800,
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: chapters.length,
            separatorBuilder: (context, index) => const SizedBox(height: 8),
            itemBuilder: (context, i) {
              final ch = chapters[i];
              return Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppTheme.borderSoft),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      width: 28,
                      height: 28,
                      alignment: Alignment.center,
                      decoration: BoxDecoration(
                        color: primaryColor.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        ch['ch']!,
                        style: GoogleFonts.dmSans(
                          color: primaryColor,
                          fontWeight: FontWeight.w900,
                          fontSize: 11,
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            ch['title']!,
                            style: GoogleFonts.dmSans(
                              color: AppTheme.primaryNavy,
                              fontWeight: FontWeight.w800,
                              fontSize: 13,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            ch['desc']!,
                            style: GoogleFonts.dmSans(
                              color: AppTheme.textMuted,
                              fontSize: 11.5,
                              height: 1.3,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildInterviewQnAPreview(Color primaryColor) {
    final pvQuestions = <Map<String, dynamic>>[
      {
        'q': 'What are the 4 mandatory criteria for an ICSR to be valid?',
        'lead': 'For an Individual Case Safety Report (ICSR) to be accepted and processed by drug regulatory agencies (USFDA, EMA, CDSCO), all 4 criteria must be present simultaneously:',
        'numbered': [
          'Identifiable Patient: Initials, age, sex, date of birth, or patient hospital ID number.',
          'Identifiable Reporter: Primary reporting source name, qualifications (physician, pharmacist, nurse, or consumer), and contact details.',
          'At least one Suspect Drug: Specific medicinal product name suspected of causing the adverse reaction.',
          'At least one Adverse Event: Verifiable sign, symptom, disease, or unexpected medical outcome.',
        ],
        'note': '⚠️ Critical Rule: If ANY of these 4 criteria is missing, the case is considered non-valid and cannot be expedited until necessary follow-up queries are answered.',
      },
      {
        'q': 'What is the difference between an Adverse Event (AE) and an Adverse Drug Reaction (ADR)?',
        'lead': 'Understanding causality is the cornerstone of drug safety evaluations:',
        'bullets': [
          {
            'label': 'Adverse Event (AE)',
            'desc': 'ANY untoward medical occurrence in a patient administered a pharmaceutical product, which does NOT necessarily have a causal relationship with the treatment. (e.g. Patient on antihypertensives fractures a limb in an accident).',
          },
          {
            'label': 'Adverse Drug Reaction (ADR)',
            'desc': 'A response to a medicinal product which is noxious and unintended, occurring at normal doses, where a reasonable possibility of a causal relationship exists. (e.g. Anaphylactic shock 15 minutes after penicillin).',
          },
        ],
        'note': 'Key takeaway: All ADRs are Adverse Events, but NOT all Adverse Events are Adverse Drug Reactions.',
      },
      {
        'q': 'What are the regulatory reporting timelines for expedited serious ICSRs?',
        'lead': 'According to ICH E2A guidelines and global regulatory agencies (FDA 21 CFR 314.80, EMA GVP Module VI):',
        'numbered': [
          'Fatal or Life-Threatening Unexpected ADRs: Must be reported within 7 calendar days to the authority, followed by a complete report within 8 additional calendar days.',
          'All Other Serious Unexpected ADRs (SUSARs): Must be submitted within 15 calendar days from first receipt by the marketing authorization holder.',
          'Non-Serious Adverse Reactions: Documented and submitted periodically via Periodic Safety Update Reports (PSUR / PBRER), not expedited.',
        ],
      },
    ];

    final croQuestions = <Map<String, dynamic>>[
      {
        'q': 'What are the 13 core ethical principles of ICH-GCP E6(R2)?',
        'lead': 'ICH-GCP E6(R2) Section 2 outlines the 13 non-negotiable ethical and scientific principles governing all clinical trials worldwide:',
        'numbered': [
          'Declaration of Helsinki: Clinical trials must be conducted in accordance with the ethical principles rooted in the Declaration of Helsinki.',
          'Risk vs Benefit: Foreseeable risks and inconveniences must be weighed against anticipated benefits for the trial subject and society.',
          'Subject Well-Being: Rights, safety, and well-being of trial subjects are the most important considerations and prevail over science and society.',
          'Nonclinical & Clinical Support: Available nonclinical and clinical information on an investigational medicinal product (IMP) must adequately support the proposed trial.',
          'Sound Protocol: Clinical trials must be scientifically sound and described in a clear, detailed protocol.',
          'Ethics Approval (IEC/IRB): Prior approval from an independent Institutional Ethics Committee must be obtained before initiating any trial procedure.',
          'Medical Decisions: Medical care and decisions on behalf of subjects must always be the responsibility of a qualified physician.',
          'Qualified Personnel: Each individual conducting the trial must be qualified by education, training, and experience to perform assigned tasks.',
          'Freely Given Informed Consent: Freely given informed consent must be documented from every subject prior to clinical trial participation.',
          'Accurate Documentation: All trial information must be recorded, handled, and stored to allow accurate reporting, interpretation, and verification (ALCOA+).',
          'Subject Confidentiality: The confidentiality of records identifying subjects must be strictly protected in compliance with privacy laws.',
          'GMP Manufacturing: Investigational products must be manufactured, handled, and stored in accordance with Good Manufacturing Practice (GMP).',
          'Quality Systems: Systems with procedures assuring quality across every aspect of the trial must be implemented.',
        ],
      },
      {
        'q': 'What is the expedited reporting timeline for a Serious Adverse Event (SAE)?',
        'lead': 'In clinical trials governed by ICH-GCP and CDSCO New Drugs & Clinical Trials Rules 2019, reporting adheres to strict emergency timelines:',
        'bullets': [
          {
            'badge': '24h',
            'label': 'Investigator → Sponsor & Ethics Committee (IEC)',
            'desc': 'The Principal Investigator must report ANY Serious Adverse Event (SAE) to both the trial Sponsor and the Ethics Committee within 24 HOURS of becoming aware of the occurrence.',
          },
          {
            'badge': '7d',
            'label': 'Fatal or Life-Threatening SUSAR to Authority',
            'desc': 'Sponsor/CRO must report to the licensing authority (CDSCO / USFDA) within 7 calendar days, followed by a detailed complete investigation report within 14 calendar days.',
          },
          {
            'badge': '15d',
            'label': 'Other Serious Unexpected ADRs to Authority',
            'desc': 'All other serious unexpected adverse reactions must be submitted to the regulatory authority within 15 calendar days.',
          },
        ],
      },
      {
        'q': 'What is the difference between CRA, CRC, and CDM roles?',
        'lead': 'Clinical trial operations rely on three distinct foundational roles spanning trial site, monitoring, and data management:',
        'bullets': [
          {
            'badge': 'CRC',
            'label': 'Clinical Research Coordinator (Site / Hospital-Based)',
            'desc': 'Works under the Principal Investigator at the trial site. Manages subject recruitment, informed consent documentation, patient visit schedules, drug accountability, and source data entry into eCRFs.',
          },
          {
            'badge': 'CRA',
            'label': 'Clinical Research Associate / Monitor (CRO / Sponsor)',
            'desc': 'Travels across hospital trial sites. Acts as the primary bridge between sponsor and site, performing Source Data Verification (SDV), investigational product accountability, and GCP compliance audits.',
          },
          {
            'badge': 'CDM',
            'label': 'Clinical Data Manager (Office / Tech-Based)',
            'desc': 'Technical role designing Electronic Case Report Forms (eCRF), programming automated edit checks, issuing data queries to sites, resolving discrepancies, and executing final database lock.',
          },
        ],
      },
    ];

    final raQuestions = <Map<String, dynamic>>[
      {
        'q': 'What is the 5-module structure of the Common Technical Document (CTD)?',
        'lead': 'The ICH M4 guideline defines the Common Technical Document (CTD) triangle format used for filing drug dossiers across US, EU, and Japan:',
        'bullets': [
          {
            'badge': 'M1',
            'label': 'Module 1: Administrative Information',
            'desc': 'Region-specific legal paperwork: application forms, proposed prescribing label, packaging mockups, and cover letters (non-harmonized per country).',
          },
          {
            'badge': 'M2',
            'label': 'Module 2: CTD Summaries',
            'desc': 'Executive scientific summaries: Quality Overall Summary (QOS), Nonclinical Overview & Summary, and Clinical Overview & Summary.',
          },
          {
            'badge': 'M3',
            'label': 'Module 3: Quality (CMC)',
            'desc': 'Chemistry, Manufacturing & Controls data for Drug Substance (API synthesis, impurities, stability) and Drug Product (formulation, batch records, packaging).',
          },
          {
            'badge': 'M4',
            'label': 'Module 4: Nonclinical Study Reports',
            'desc': 'Full study reports for animal pharmacology, pharmacokinetics (ADME), toxicology, genotoxicity, and carcinogenicity.',
          },
          {
            'badge': 'M5',
            'label': 'Module 5: Clinical Study Reports',
            'desc': 'Comprehensive reports of Phase I-III clinical trials in humans, bioequivalence study data, and post-marketing clinical safety records.',
          },
        ],
      },
      {
        'q': 'What is the difference between an NDA and an ANDA?',
        'lead': 'Under US FDA regulations, drug applications are divided based on innovation versus generic equivalence:',
        'bullets': [
          {
            'label': 'NDA (New Drug Application)',
            'desc': 'Filed under US FDA Section 505(b)(1) for new chemical entities (innovator drugs). Requires comprehensive original preclinical animal studies and Phase I-III human clinical trials costing hundreds of millions of dollars.',
          },
          {
            'label': 'ANDA (Abbreviated New Drug Application)',
            'desc': 'Filed under US FDA Section 505(j) for generic copies of already approved reference drugs (RLD). Bypasses animal toxicology and Phase II/III clinical efficacy trials; only requires demonstrating pharmaceutical equivalence and Bioequivalence (80.00% – 125.00% 90% CI).',
          },
        ],
        'note': 'Key Benefit: ANDAs allow generic medicines to reach the market at a fraction of the cost while ensuring identical safety and clinical efficacy.',
      },
      {
        'q': 'What is a Drug Master File (DMF) and what are its components?',
        'lead': 'A Drug Master File (DMF) is a confidential submission to health authorities (FDA / EMA / CDSCO) providing proprietary chemistry and manufacturing details for APIs or packaging without exposing trade secrets to drug formulation partners:',
        'bullets': [
          {
            'label': 'Open Part (Applicant\'s Part)',
            'desc': 'Supplied directly to the generic drug formulation manufacturer. Contains non-confidential chemical structure, specifications, stability data, analytical test methods, and certificates of analysis.',
          },
          {
            'label': 'Closed Part (Restricted Part)',
            'desc': 'Confidential section submitted solely to the regulatory agency. Contains proprietary synthetic route, critical process parameters, reaction mechanisms, solvent recoverability, and internal impurity profiles.',
          },
        ],
      },
    ];

    final questions = _isPv
        ? pvQuestions
        : _isCro
            ? croQuestions
            : raQuestions;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.help_outline_rounded, size: 18, color: Color(0xFFD97706)),
              const SizedBox(width: 8),
              Text(
                'Sample Solved Interview Questions',
                style: GoogleFonts.dmSans(
                  color: AppTheme.primaryNavy,
                  fontSize: 16,
                  fontWeight: FontWeight.w900,
                  letterSpacing: -0.3,
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          ...questions.asMap().entries.map((entry) {
            final idx = entry.key;
            final item = entry.value;
            final isExpanded = _expandedQuestions.contains(idx);

            return Container(
              margin: const EdgeInsets.only(bottom: 8),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: isExpanded ? primaryColor.withValues(alpha: 0.3) : AppTheme.borderSoft,
                ),
              ),
              child: Theme(
                data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
                child: ExpansionTile(
                  key: Key('q_$idx'),
                  initiallyExpanded: isExpanded,
                  onExpansionChanged: (open) {
                    setState(() {
                      if (open) {
                        _expandedQuestions.add(idx);
                      } else {
                        _expandedQuestions.remove(idx);
                      }
                    });
                  },
                  tilePadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
                  title: Text(
                    item['q'] as String,
                    style: GoogleFonts.dmSans(
                      color: AppTheme.primaryNavy,
                      fontWeight: FontWeight.w800,
                      fontSize: 13,
                    ),
                  ),
                  children: [
                    Padding(
                      padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                      child: _buildStructuredAnswer(item, primaryColor),
                    ),
                  ],
                ),
              ),
            );
          }),
        ],
      ),
    );
  }

  Widget _buildStructuredAnswer(Map<String, dynamic> item, Color primaryColor) {
    final lead = item['lead'] as String?;
    final numbered = item['numbered'] as List<String>?;
    final bullets = item['bullets'] as List<Map<String, String>>?;
    final note = item['note'] as String?;
    final rawAnswer = item['a'] as String?;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Divider(height: 1, thickness: 1, color: Color(0xFFF1F5F9)),
        const SizedBox(height: 12),
        if (lead != null && lead.isNotEmpty) ...[
          Text(
            lead,
            style: GoogleFonts.dmSans(
              color: const Color(0xFF1E293B),
              fontSize: 12.5,
              fontWeight: FontWeight.w700,
              height: 1.4,
            ),
          ),
          const SizedBox(height: 10),
        ],
        if (numbered != null && numbered.isNotEmpty) ...[
          ...numbered.asMap().entries.map((entry) {
            final i = entry.key;
            final point = entry.value;
            final colonIndex = point.indexOf(': ');
            final hasPrefix = colonIndex != -1;
            final prefix = hasPrefix ? point.substring(0, colonIndex + 2) : '';
            final suffix = hasPrefix ? point.substring(colonIndex + 2) : point;

            return Padding(
              padding: const EdgeInsets.only(bottom: 9),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    width: 24,
                    height: 24,
                    alignment: Alignment.center,
                    decoration: BoxDecoration(
                      color: primaryColor.withValues(alpha: 0.12),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text(
                      (i + 1).toString().padLeft(2, '0'),
                      style: GoogleFonts.dmSans(
                        color: primaryColor,
                        fontWeight: FontWeight.w900,
                        fontSize: 10.5,
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text.rich(
                      TextSpan(
                        children: [
                          if (hasPrefix)
                            TextSpan(
                              text: prefix,
                              style: GoogleFonts.dmSans(
                                color: AppTheme.primaryNavy,
                                fontWeight: FontWeight.w800,
                                fontSize: 12.5,
                                height: 1.4,
                              ),
                            ),
                          TextSpan(
                            text: suffix,
                            style: GoogleFonts.dmSans(
                              color: const Color(0xFF334155),
                              fontWeight: FontWeight.w500,
                              fontSize: 12,
                              height: 1.45,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            );
          }),
        ],
        if (bullets != null && bullets.isNotEmpty) ...[
          ...bullets.map((b) {
            final badge = b['badge'];
            final label = b['label'] ?? '';
            final desc = b['desc'] ?? '';

            return Padding(
              padding: const EdgeInsets.only(bottom: 10),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      if (badge != null && badge.isNotEmpty) ...[
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: primaryColor,
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: Text(
                            badge,
                            style: GoogleFonts.dmSans(
                              color: Colors.white,
                              fontSize: 10,
                              fontWeight: FontWeight.w900,
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                      ] else ...[
                        Icon(Icons.check_circle_rounded, size: 14, color: primaryColor),
                        const SizedBox(width: 6),
                      ],
                      Expanded(
                        child: Text(
                          label,
                          style: GoogleFonts.dmSans(
                            color: AppTheme.primaryNavy,
                            fontWeight: FontWeight.w800,
                            fontSize: 12.5,
                          ),
                        ),
                      ),
                    ],
                  ),
                  if (desc.isNotEmpty) ...[
                    const SizedBox(height: 3),
                    Padding(
                      padding: const EdgeInsets.only(left: 4),
                      child: Text(
                        desc,
                        style: GoogleFonts.dmSans(
                          color: const Color(0xFF475569),
                          fontSize: 12,
                          height: 1.45,
                        ),
                      ),
                    ),
                  ],
                ],
              ),
            );
          }),
        ],
        if (rawAnswer != null && rawAnswer.isNotEmpty && (numbered == null || numbered.isEmpty) && (bullets == null || bullets.isEmpty)) ...[
          Text(
            rawAnswer,
            style: GoogleFonts.dmSans(
              color: const Color(0xFF334155),
              fontSize: 12.5,
              height: 1.45,
            ),
          ),
        ],
        if (note != null && note.isNotEmpty) ...[
          Container(
            margin: const EdgeInsets.only(top: 4),
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 9),
            decoration: BoxDecoration(
              color: const Color(0xFFFFFBEB),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Icon(Icons.tips_and_updates_rounded, color: Color(0xFFD97706), size: 15),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    note,
                    style: GoogleFonts.dmSans(
                      color: const Color(0xFF92400E),
                      fontSize: 11.5,
                      fontWeight: FontWeight.w700,
                      height: 1.4,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ],
    );
  }

  Widget _buildTrustCard(Color primaryColor, bool isUnlocked) {
    if (_isCro) {
      return Container(
        margin: const EdgeInsets.symmetric(horizontal: 16),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: const Color(0xFFF0FDF4),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: const Color(0xFFBBF7D0)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: const [
                Icon(Icons.verified_rounded, size: 18, color: Color(0xFF059669)),
                SizedBox(width: 8),
                Text(
                  '100% Free Sponsored Clinical Manual',
                  style: TextStyle(
                    fontFamily: 'Nunito',
                    fontSize: 13,
                    fontWeight: FontWeight.w800,
                    color: Color(0xFF065F46),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 6),
            Text(
              '• 100% Free full in-app access sponsored by short non-intrusive ads.\n'
              '• Complete 15 chapters covering ICH-GCP, site monitoring, and TMF workflows.\n'
              '• Includes 50+ solved interview questions for CRA, CRC & CDM roles.\n'
              '• Read anytime inside PharmaCode with zero registration hurdles.',
              style: GoogleFonts.dmSans(
                fontSize: 11.5,
                color: const Color(0xFF047857),
                height: 1.45,
              ),
            ),
          ],
        ),
      );
    }

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFFF8FAFC),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: const [
              Icon(Icons.verified_user_rounded, size: 18, color: Color(0xFF059669)),
              SizedBox(width: 8),
              Text(
                '100% Official Google Play Purchase',
                style: TextStyle(
                  fontFamily: 'Nunito',
                  fontSize: 13,
                  fontWeight: FontWeight.w800,
                  color: Color(0xFF0F172A),
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          Text(
            '• Permanent lifetime access bound to your Google account.\n'
            '• Read anytime inside PharmaCode with zero mobile data (offline mode).\n'
            '• Curated by industry veterans matching top pharma MNC interview standards.\n'
            '• Also unlocked automatically for all ₹199 VIP Pass holders.',
            style: GoogleFonts.dmSans(
              fontSize: 11.5,
              color: const Color(0xFF64748B),
              height: 1.45,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStickyBottomBar(bool isUnlocked, Color primaryColor) {
    if (_isCro) {
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: Colors.white,
          border: const Border(top: BorderSide(color: AppTheme.borderSoft)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.05),
              blurRadius: 10,
              offset: const Offset(0, -3),
            ),
          ],
        ),
        child: SafeArea(
          child: Row(
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    '100% FREE',
                    style: GoogleFonts.dmSans(
                      color: const Color(0xFF059669),
                      fontWeight: FontWeight.w900,
                      fontSize: 18,
                      height: 1,
                    ),
                  ),
                  Text(
                    'Complete Industry Manual',
                    style: GoogleFonts.dmSans(
                      color: const Color(0xFF64748B),
                      fontSize: 10.5,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
              const SizedBox(width: 16),
              Expanded(
                child: SizedBox(
                  height: 48,
                  child: ElevatedButton.icon(
                    onPressed: () => _handlePrimaryAction(true),
                    icon: const Icon(Icons.menu_book_rounded, size: 18),
                    label: Text(
                      'Read CRO Manual (Free)',
                      style: GoogleFonts.dmSans(
                        fontWeight: FontWeight.w900,
                        fontSize: 14,
                      ),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF059669),
                      foregroundColor: Colors.white,
                      elevation: 2,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      );
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        border: const Border(top: BorderSide(color: AppTheme.borderSoft)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 10,
            offset: const Offset(0, -3),
          ),
        ],
      ),
      child: SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Row(
              children: [
                if (!isUnlocked) ...[
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Row(
                        children: [
                          Text(
                            _isPv ? '₹49' : '₹99',
                            style: GoogleFonts.dmSans(
                              color: primaryColor,
                              fontWeight: FontWeight.w900,
                              fontSize: 22,
                              height: 1,
                            ),
                          ),
                          const SizedBox(width: 6),
                          Text(
                            _isPv ? '₹499' : '₹699',
                            style: GoogleFonts.dmSans(
                              color: const Color(0xFF94A3B8),
                              decoration: TextDecoration.lineThrough,
                              fontSize: 13,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                      Text(
                        _isPv
                            ? 'Lifetime In-App Access'
                            : _isCro
                                ? '100% Free · Lifetime Access'
                                : 'Lifetime In-App Access',
                        style: GoogleFonts.dmSans(
                          color: const Color(0xFF64748B),
                          fontSize: 10.5,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(width: 16),
                ],
                Expanded(
                  child: SizedBox(
                    height: 48,
                    child: ElevatedButton.icon(
                      onPressed: () => _handlePrimaryAction(isUnlocked),
                      icon: Icon(
                        isUnlocked ? Icons.menu_book_rounded : Icons.shopping_bag_rounded,
                        size: 18,
                      ),
                      label: Text(
                        isUnlocked
                            ? 'Open Full PDF Reader'
                            : (_isPv ? 'Unlock Guide · ₹49' : 'Unlock Guide · ₹99'),
                        style: GoogleFonts.dmSans(
                          fontWeight: FontWeight.w900,
                          fontSize: 14,
                        ),
                      ),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: isUnlocked ? const Color(0xFF059669) : primaryColor,
                        foregroundColor: Colors.white,
                        elevation: 2,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                    ),
                  ),
                ),
              ],
            ),
            if (!isUnlocked) ...[
              const SizedBox(height: 6),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  GestureDetector(
                    onTap: () => showPreBookVipSheet(context),
                    child: Text(
                      'Or unlock BOTH + All Notes with ₹199 VIP Pass',
                      style: GoogleFonts.dmSans(
                        fontSize: 11,
                        fontWeight: FontWeight.w800,
                        color: const Color(0xFFD97706),
                        decoration: TextDecoration.underline,
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  const Text('•', style: TextStyle(color: Color(0xFFCBD5E1), fontSize: 11)),
                  const SizedBox(width: 8),
                  GestureDetector(
                    onTap: () => _billing.restorePurchases(),
                    child: Text(
                      'Restore',
                      style: GoogleFonts.dmSans(
                        fontSize: 11,
                        fontWeight: FontWeight.w700,
                        color: const Color(0xFF64748B),
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }
}

/// Fullscreen Interactive Sample Lightbox Dialog with Double-Tap Zoom & Pan
class _SampleLightboxDialog extends StatefulWidget {
  final List<Map<String, String>> items;
  final int initialIndex;
  final Color primaryColor;
  final bool isUnlocked;
  final VoidCallback onPrimaryAction;
  final String actionButtonText;

  const _SampleLightboxDialog({
    required this.items,
    required this.initialIndex,
    required this.primaryColor,
    required this.isUnlocked,
    required this.onPrimaryAction,
    required this.actionButtonText,
  });

  @override
  State<_SampleLightboxDialog> createState() => _SampleLightboxDialogState();
}

class _SampleLightboxDialogState extends State<_SampleLightboxDialog> {
  late PageController _pageController;
  late int _currentIndex;
  bool _isZoomed = false;

  @override
  void initState() {
    super.initState();
    _currentIndex = widget.initialIndex;
    _pageController = PageController(initialPage: widget.initialIndex);
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final currentItem = widget.items[_currentIndex];

    return Scaffold(
      backgroundColor: Colors.transparent,
      body: SafeArea(
        child: Column(
          children: [
            // Top Bar
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 4),
                    decoration: BoxDecoration(
                      color: widget.primaryColor,
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text(
                      currentItem['tag'] ?? 'Preview',
                      style: GoogleFonts.dmSans(
                        color: Colors.white,
                        fontSize: 11,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    '${_currentIndex + 1} / ${widget.items.length}',
                    style: GoogleFonts.dmSans(
                      color: Colors.white70,
                      fontSize: 12,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  const Spacer(),
                  // Double Tap Hint Pill
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3.5),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Row(
                      children: [
                        Icon(
                          _isZoomed ? Icons.zoom_out_map_rounded : Icons.touch_app_rounded,
                          color: Colors.white70,
                          size: 13,
                        ),
                        const SizedBox(width: 4),
                        Text(
                          _isZoomed ? 'Double-tap reset' : 'Double-tap zoom',
                          style: GoogleFonts.dmSans(
                            color: Colors.white70,
                            fontSize: 10.5,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 6),
                  IconButton(
                    icon: const Icon(Icons.close_rounded, color: Colors.white, size: 24),
                    onPressed: () => Navigator.pop(context),
                  ),
                ],
              ),
            ),

            // Zoomable Page View with Clamped Clipping to prevent overlaps
            Expanded(
              child: PageView.builder(
                controller: _pageController,
                itemCount: widget.items.length,
                physics: _isZoomed
                    ? const NeverScrollableScrollPhysics()
                    : const BouncingScrollPhysics(),
                onPageChanged: (idx) {
                  setState(() {
                    _currentIndex = idx;
                    _isZoomed = false;
                  });
                },
                itemBuilder: (context, idx) {
                  return _ZoomablePageViewItem(
                    key: ValueKey('page_$idx'),
                    item: widget.items[idx],
                    onZoomChanged: (zoomed) {
                      if (_isZoomed != zoomed) {
                        setState(() => _isZoomed = zoomed);
                      }
                    },
                  );
                },
              ),
            ),

            // Bottom Caption & CTA
            Container(
              padding: const EdgeInsets.fromLTRB(16, 12, 16, 16),
              decoration: BoxDecoration(
                color: const Color(0xFF0F172A).withValues(alpha: 0.95),
                border: const Border(top: BorderSide(color: Color(0xFF1E293B))),
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Row(
                    children: [
                      IconButton(
                        icon: const Icon(Icons.chevron_left_rounded, color: Colors.white, size: 28),
                        onPressed: _currentIndex > 0
                            ? () => _pageController.previousPage(
                                  duration: const Duration(milliseconds: 250),
                                  curve: Curves.easeOut,
                                )
                            : null,
                      ),
                      Expanded(
                        child: Column(
                          children: [
                            Text(
                              currentItem['title'] ?? '',
                              textAlign: TextAlign.center,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: GoogleFonts.dmSans(
                                color: Colors.white,
                                fontWeight: FontWeight.w800,
                                fontSize: 13,
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              currentItem['desc'] ?? '',
                              textAlign: TextAlign.center,
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                              style: GoogleFonts.dmSans(
                                color: const Color(0xFF94A3B8),
                                fontSize: 11,
                              ),
                            ),
                          ],
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.chevron_right_rounded, color: Colors.white, size: 28),
                        onPressed: _currentIndex < widget.items.length - 1
                            ? () => _pageController.nextPage(
                                  duration: const Duration(milliseconds: 250),
                                  curve: Curves.easeOut,
                                )
                            : null,
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  SizedBox(
                    width: double.infinity,
                    height: 44,
                    child: ElevatedButton.icon(
                      onPressed: widget.onPrimaryAction,
                      icon: Icon(
                        widget.isUnlocked ? Icons.menu_book_rounded : Icons.shopping_bag_rounded,
                        size: 16,
                      ),
                      label: Text(
                        widget.actionButtonText,
                        style: GoogleFonts.dmSans(fontWeight: FontWeight.w900, fontSize: 13),
                      ),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: widget.isUnlocked ? const Color(0xFF059669) : widget.primaryColor,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// Individual Zoomable Page Item with animated double-tap zoom & strict boundary clipping
class _ZoomablePageViewItem extends StatefulWidget {
  final Map<String, String> item;
  final ValueChanged<bool> onZoomChanged;

  const _ZoomablePageViewItem({
    super.key,
    required this.item,
    required this.onZoomChanged,
  });

  @override
  State<_ZoomablePageViewItem> createState() => _ZoomablePageViewItemState();
}

class _ZoomablePageViewItemState extends State<_ZoomablePageViewItem>
    with SingleTickerProviderStateMixin {
  late TransformationController _transformController;
  late AnimationController _animController;
  Animation<Matrix4>? _zoomAnimation;
  TapDownDetails? _doubleTapDetails;

  @override
  void initState() {
    super.initState();
    _transformController = TransformationController();
    _animController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 260),
    );
    _transformController.addListener(_onScaleChanged);
  }

  void _onScaleChanged() {
    final scale = _transformController.value.getMaxScaleOnAxis();
    widget.onZoomChanged(scale > 1.05);
  }

  @override
  void dispose() {
    _transformController.removeListener(_onScaleChanged);
    _transformController.dispose();
    _animController.dispose();
    super.dispose();
  }

  void _handleDoubleTap() {
    final currentScale = _transformController.value.getMaxScaleOnAxis();
    final Matrix4 endMatrix;

    if (currentScale > 1.1) {
      endMatrix = Matrix4.identity();
    } else {
      final pos = _doubleTapDetails?.localPosition ?? const Offset(150, 250);
      endMatrix = Matrix4.identity()
        ..setEntry(0, 0, 2.5)
        ..setEntry(1, 1, 2.5)
        ..setEntry(0, 3, -pos.dx * 1.5)
        ..setEntry(1, 3, -pos.dy * 1.5);
    }

    _zoomAnimation = Matrix4Tween(
      begin: _transformController.value,
      end: endMatrix,
    ).animate(CurvedAnimation(parent: _animController, curve: Curves.easeOutCubic));

    _animController.forward(from: 0).then((_) {
      _transformController.value = endMatrix;
    });

    _zoomAnimation!.addListener(() {
      _transformController.value = _zoomAnimation!.value;
    });
  }

  Widget _buildFallback(Map<String, String> item) {
    return Container(
      color: const Color(0xFF1E293B),
      padding: const EdgeInsets.all(24),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.picture_as_pdf_rounded, color: Colors.white54, size: 48),
          const SizedBox(height: 12),
          Text(
            item['title'] ?? 'Sample Preview',
            textAlign: TextAlign.center,
            style: GoogleFonts.dmSans(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
          ),
          const SizedBox(height: 6),
          Text(
            item['desc'] ?? '',
            textAlign: TextAlign.center,
            style: GoogleFonts.dmSans(color: Colors.white70, fontSize: 13),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final asset = widget.item['asset'];
    final url = widget.item['url'];

    Widget imageWidget;
    if (asset != null && asset.isNotEmpty) {
      imageWidget = Image.asset(
        asset,
        fit: BoxFit.contain,
        errorBuilder: (context, error, stackTrace) {
          if (url != null && url.isNotEmpty) {
            return CachedNetworkImage(
              imageUrl: url,
              fit: BoxFit.contain,
              placeholder: (context, url) => const Center(
                child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
              ),
              errorWidget: (context, url, error) => _buildFallback(widget.item),
            );
          }
          return _buildFallback(widget.item);
        },
      );
    } else if (url != null && url.isNotEmpty) {
      imageWidget = CachedNetworkImage(
        imageUrl: url,
        fit: BoxFit.contain,
        placeholder: (context, url) => const Center(
          child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
        ),
        errorWidget: (context, url, error) => _buildFallback(widget.item),
      );
    } else {
      imageWidget = _buildFallback(widget.item);
    }

    return ClipRect(
      child: GestureDetector(
        onDoubleTapDown: (d) => _doubleTapDetails = d,
        onDoubleTap: _handleDoubleTap,
        child: InteractiveViewer(
          transformationController: _transformController,
          minScale: 1.0,
          maxScale: 4.5,
          clipBehavior: Clip.hardEdge,
          child: Center(
            child: Container(
              margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.5),
                    blurRadius: 20,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              clipBehavior: Clip.antiAlias,
              child: imageWidget,
            ),
          ),
        ),
      ),
    );
  }
}
