import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/billing/in_app_purchase_service.dart';
import '../../core/constants/app_spacing.dart';
import '../../core/security/secure_doc_resolver.dart';
import '../../core/theme.dart';
import '../../core/widgets/ad_native_card.dart';
import '../../features/career/presentation/career_controller.dart';
import '../../features/career/presentation/widgets/career_domain_card.dart';
import '../../features/career/presentation/widgets/career_hero_banner.dart';
import '../../features/career/presentation/widgets/community_roadmap_card.dart';
import '../../features/career/presentation/widgets/study_guides_list.dart';
import '../../services/pdf_service.dart';
import 'guide_detail_screen.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';

class BlogsScreen extends ConsumerWidget {
  final VoidCallback? onNavigateToNotes;

  const BlogsScreen({super.key, this.onNavigateToNotes});

  Widget _buildCategorySelector(BuildContext context, WidgetRef ref, String selectedCategory) {
    final categories = [
      {'id': 'ALL', 'label': 'All Guides', 'icon': Icons.grid_view_rounded},
      {'id': 'DOMAINS', 'label': 'Career Domains', 'icon': Icons.business_center_rounded},
      {'id': 'KIT', 'label': 'Interview Kits', 'icon': Icons.library_books_rounded},
      {'id': 'COURSE', 'label': 'Certifications', 'icon': Icons.verified_rounded},
      {'id': 'TECH', 'label': 'AI & Tech', 'icon': Icons.terminal_rounded},
    ];

    return SizedBox(
      height: 38,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        physics: const BouncingScrollPhysics(),
        padding: AppSpacing.horizontalMd,
        itemCount: categories.length,
        itemBuilder: (context, index) {
          final cat = categories[index];
          final isSelected = selectedCategory == cat['id'];
          final icon = cat['icon'] as IconData;

          return Padding(
            padding: const EdgeInsets.only(right: AppSpacing.sm),
            child: ChoiceChip(
              avatar: Icon(
                icon,
                size: 14,
                color: isSelected ? Colors.white : AppTheme.primaryNavy,
              ),
              label: Text(
                cat['label'] as String,
                style: GoogleFonts.dmSans(
                  fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
                  fontSize: 12,
                  color: isSelected ? Colors.white : AppTheme.textDark,
                ),
              ),
              selected: isSelected,
              selectedColor: AppTheme.primaryNavy,
              backgroundColor: Colors.white,
              elevation: isSelected ? 1 : 0,
              side: BorderSide(
                color: isSelected ? AppTheme.primaryNavy : AppTheme.borderSoft,
                width: 1.2,
              ),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              onSelected: (_) {
                ref.read(selectedCareerCategoryProvider.notifier).state = cat['id'] as String;
              },
            ),
          );
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final selectedCategory = ref.watch(selectedCareerCategoryProvider);
    final domains = ref.watch(careerDomainsProvider);
    final guides = ref.watch(filteredGuidesProvider);
    final allBlogs = ref.watch(careerRepositoryProvider).getBlogs();

    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.only(bottom: AppSpacing.xl),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: AppSpacing.sm),
            // ── 1. HERO BANNER ───────────────────────────────────────────
            CareerHeroBanner(blogs: allBlogs),

            const SizedBox(height: AppSpacing.md),

            // ── 2. CATEGORY SELECTOR CHIPS ───────────────────────────────
            _buildCategorySelector(context, ref, selectedCategory),

            const SizedBox(height: AppSpacing.md),

            // ── 3. DOMAINS SECTION (Visible on 'ALL' or 'DOMAINS') ───────
            if (selectedCategory == 'ALL' || selectedCategory == 'DOMAINS') ...[
              Padding(
                padding: AppSpacing.horizontalMd,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Container(
                          width: 4,
                          height: 18,
                          decoration: BoxDecoration(
                            color: AppTheme.primaryNavy,
                            borderRadius: BorderRadius.circular(2),
                          ),
                        ),
                        const SizedBox(width: AppSpacing.sm),
                        Text(
                          'Core Industry Domains',
                          style: GoogleFonts.dmSans(
                            fontSize: 16,
                            fontWeight: FontWeight.w900,
                            color: AppTheme.primaryNavy,
                            letterSpacing: -0.3,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: AppSpacing.xs),
                    Text(
                      'Explore high-paying pharma career pathways with fresher salary benchmarks.',
                      style: GoogleFonts.dmSans(color: AppTheme.textMuted, fontSize: 12),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: AppSpacing.sm),
              Padding(
                padding: AppSpacing.horizontalMd,
                child: Column(
                  children: domains
                      .map((d) => CareerDomainCard(domain: d, blogs: allBlogs))
                      .toList(),
                ),
              ),
              const SizedBox(height: AppSpacing.sm),
            ],

            // ── 3.5 DIRECT IN-APP PDF GUIDES (FREE & PAID VIP) ─────────
            if (selectedCategory == 'ALL' || selectedCategory == 'KIT') ...[
              _buildCareerPdfGuidesSection(context),
              const SizedBox(height: AppSpacing.md),
            ],

            // ── 4. COMMUNITY ROADMAP CARD (Visible on 'ALL') ────────────
            if (selectedCategory == 'ALL') ...[
              const CommunityRoadmapCard(),
              const SizedBox(height: AppSpacing.md),
            ],

            // ── NATIVE AD CARD ──────────────────────────────────────────
            const AdNativeCard(
              templateType: TemplateType.medium,
              margin: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            ),
            const SizedBox(height: AppSpacing.sm),

            // ── 5. STUDY GUIDES & CERTIFICATION LIST ────────────────────
            if (selectedCategory != 'DOMAINS') ...[
              Padding(
                padding: AppSpacing.horizontalMd,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Container(
                          width: 4,
                          height: 18,
                          decoration: BoxDecoration(
                            color: const Color(0xFF0D9488),
                            borderRadius: BorderRadius.circular(2),
                          ),
                        ),
                        const SizedBox(width: AppSpacing.sm),
                        Text(
                          selectedCategory == 'ALL'
                              ? 'Interview Kits & Study Guides'
                              : 'Curated Guides & Certifications',
                          style: GoogleFonts.dmSans(
                            fontSize: 16,
                            fontWeight: FontWeight.w900,
                            color: AppTheme.primaryNavy,
                            letterSpacing: -0.3,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: AppSpacing.xs),
                    Text(
                      'Free study kits, technical question banks, and verified certification links.',
                      style: GoogleFonts.dmSans(color: AppTheme.textMuted, fontSize: 12),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: AppSpacing.sm),
              StudyGuidesList(blogs: guides),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildCareerPdfGuidesSection(BuildContext context) {
    final allPdfs = PdfService.instance.allPdfs;

    final careerPdf = allPdfs.firstWhere(
      (p) => p.id == 'pdf-career-free' || p.id == 'pdf-cro-manual',
      orElse: () => AdminPdfItem(
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
        description: '15-Chapter Complete CRO Ecosystem Manual: Clinical Trials, CRA, CDM, QA, GCP & 30-Day Onboarding Checklist (100% Free)',
      ),
    );

    final pvPdf = allPdfs.firstWhere(
      (p) => p.id == 'pdf-pv-guide' || p.playProductId == PlayProducts.guidePvInterview,
      orElse: () => AdminPdfItem(
        id: 'pdf-pv-guide',
        title: 'Pharmacovigilance (PV) Master Interview Guide & ICSR Cases',
        subjectCode: 'BP805ET',
        subjectName: 'Pharmacovigilance',
        semester: 8,
        unit: 'Complete Interview Kit',
        category: 'Notes',
        url: SecureDocResolver.resolveSecureUrl('pdf-pv-guide'),
        fileSize: '11.6 MB',
        pages: 44,
        downloadsCount: 340,
        isPremium: true,
        playProductId: PlayProducts.guidePvInterview,
        priceRupees: 49,
        description: 'PV Interview Questions & Cases (Included in ₹199 VIP Pass)',
      ),
    );

    final raPdf = allPdfs.firstWhere(
      (p) => p.id == 'pdf-ra-guide' || p.playProductId == PlayProducts.guideRaDossier,
      orElse: () => AdminPdfItem(
        id: 'pdf-ra-guide',
        title: 'Regulatory Affairs (RA) Complete eCTD Dossier & Filing Guide',
        subjectCode: 'BP707T',
        subjectName: 'Regulatory Affairs',
        semester: 7,
        unit: 'Modules 1-5 Dossier Kit',
        category: 'Notes',
        url: SecureDocResolver.resolveSecureUrl('pdf-ra-guide'),
        fileSize: '1.2 MB',
        pages: 26,
        downloadsCount: 280,
        isPremium: true,
        playProductId: PlayProducts.guideRaDossier,
        priceRupees: 99,
        description: 'eCTD Modules 1-5, USFDA 21 CFR, DMF & ANDA (Included in ₹199 VIP Pass)',
      ),
    );

    final billing = InAppPurchaseService.instance;
    final isPvUnlocked = billing.isUnlocked(PlayProducts.guidePvInterview);
    final isRaUnlocked = billing.isUnlocked(PlayProducts.guideRaDossier);

    return Padding(
      padding: AppSpacing.horizontalMd,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 4,
                height: 18,
                decoration: BoxDecoration(
                  color: const Color(0xFFD97706),
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              const SizedBox(width: AppSpacing.sm),
              Text(
                'Direct PDF Guides & Career Kits',
                style: GoogleFonts.dmSans(
                  fontSize: 16,
                  fontWeight: FontWeight.w900,
                  color: AppTheme.primaryNavy,
                  letterSpacing: -0.3,
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.xs),
          Text(
            'High-yield career kits, verified interview question banks & industry operational manuals.',
            style: GoogleFonts.dmSans(color: AppTheme.textMuted, fontSize: 12),
          ),
          const SizedBox(height: AppSpacing.sm),

          // 1. FREE Placement Guide (Ad Supported)
          Container(
            margin: const EdgeInsets.only(bottom: 12),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF047857), Color(0xFF059669)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFF059669).withValues(alpha: 0.25),
                  blurRadius: 10,
                  offset: const Offset(0, 3),
                ),
              ],
            ),
            child: Material(
              color: Colors.transparent,
              child: InkWell(
                borderRadius: BorderRadius.circular(16),
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => GuideDetailScreen(guideType: 'cro', pdfItem: careerPdf),
                    ),
                  );
                },
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.2),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Icon(Icons.biotech_rounded, color: Colors.white, size: 26),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                                  decoration: BoxDecoration(
                                    color: Colors.white,
                                    borderRadius: BorderRadius.circular(5),
                                  ),
                                  child: const Text(
                                    '100% FREE GUIDE · AD SUPPORTED',
                                    style: TextStyle(
                                      fontFamily: 'Nunito',
                                      fontSize: 9.5,
                                      fontWeight: FontWeight.w900,
                                      color: Color(0xFF047857),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 5),
                            const Text(
                              'CRO Operations Manual (2026 Edition)',
                              style: TextStyle(
                                fontFamily: 'Nunito',
                                fontSize: 14.5,
                                fontWeight: FontWeight.w800,
                                color: Colors.white,
                                height: 1.25,
                              ),
                            ),
                            const SizedBox(height: 3),
                            const Text(
                              '15 Chapters: Clinical Trials, CRA, CDM, QA & GCP Manual',
                              style: TextStyle(
                                fontFamily: 'Nunito',
                                fontSize: 11,
                                fontWeight: FontWeight.w500,
                                color: Colors.white70,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 8),
                      const Icon(Icons.arrow_forward_ios_rounded, color: Colors.white, size: 14),
                    ],
                  ),
                ),
              ),
            ),
          ),

          // 2. PV Master Guide (₹49)
          Container(
            margin: const EdgeInsets.only(bottom: 12),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: isPvUnlocked ? const Color(0xFFA7F3D0) : const Color(0xFFFECACA),
                width: 1.5,
              ),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.02),
                  blurRadius: 8,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Material(
              color: Colors.transparent,
              child: InkWell(
                borderRadius: BorderRadius.circular(16),
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => GuideDetailScreen(guideType: 'pv', pdfItem: pvPdf),
                    ),
                  );
                },
                child: Padding(
                  padding: const EdgeInsets.all(15),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: const Color(0xFFFEF2F2),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Icon(Icons.shield_rounded, color: Color(0xFFDC2626), size: 24),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                                  decoration: BoxDecoration(
                                    color: isPvUnlocked ? const Color(0xFFECFDF5) : const Color(0xFFFEF2F2),
                                    borderRadius: BorderRadius.circular(5),
                                    border: Border.all(
                                      color: isPvUnlocked ? const Color(0xFFA7F3D0) : const Color(0xFFFECACA),
                                    ),
                                  ),
                                  child: Text(
                                    isPvUnlocked ? 'UNLOCKED' : '₹49 ONLY',
                                    style: TextStyle(
                                      fontFamily: 'Nunito',
                                      fontSize: 10,
                                      fontWeight: FontWeight.w900,
                                      color: isPvUnlocked ? const Color(0xFF059669) : const Color(0xFFDC2626),
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 6),
                                const Text(
                                  'PV Interview Kit',
                                  style: TextStyle(
                                    fontFamily: 'Nunito',
                                    fontSize: 11,
                                    fontWeight: FontWeight.w600,
                                    color: Color(0xFF94A3B8),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 4),
                            const Text(
                              'Pharmacovigilance (PV) Master Interview Guide',
                              style: TextStyle(
                                fontFamily: 'Nunito',
                                fontSize: 14,
                                fontWeight: FontWeight.w800,
                                color: Color(0xFF0F172A),
                                height: 1.25,
                              ),
                            ),
                            const SizedBox(height: 2),
                            const Text(
                              '15 Chapters: Argus Safety, MedDRA & Solved ICSR Cases',
                              style: TextStyle(
                                fontFamily: 'Nunito',
                                fontSize: 11,
                                color: Color(0xFF64748B),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 8),
                      Icon(
                        isPvUnlocked ? Icons.lock_open_rounded : Icons.arrow_forward_ios_rounded,
                        color: isPvUnlocked ? const Color(0xFF059669) : const Color(0xFFDC2626),
                        size: 16,
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),

          // 3. RA Dossier Guide (₹99)
          Container(
            margin: const EdgeInsets.only(bottom: 14),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: isRaUnlocked ? const Color(0xFFA7F3D0) : const Color(0xFFBFDBFE),
                width: 1.5,
              ),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.02),
                  blurRadius: 8,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Material(
              color: Colors.transparent,
              child: InkWell(
                borderRadius: BorderRadius.circular(16),
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => GuideDetailScreen(guideType: 'ra', pdfItem: raPdf),
                    ),
                  );
                },
                child: Padding(
                  padding: const EdgeInsets.all(15),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: const Color(0xFFEFF6FF),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Icon(Icons.description_rounded, color: Color(0xFF2563EB), size: 24),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                                  decoration: BoxDecoration(
                                    color: isRaUnlocked ? const Color(0xFFECFDF5) : const Color(0xFFEFF6FF),
                                    borderRadius: BorderRadius.circular(5),
                                    border: Border.all(
                                      color: isRaUnlocked ? const Color(0xFFA7F3D0) : const Color(0xFFBFDBFE),
                                    ),
                                  ),
                                  child: Text(
                                    isRaUnlocked ? 'UNLOCKED' : '₹99 ONLY',
                                    style: TextStyle(
                                      fontFamily: 'Nunito',
                                      fontSize: 10,
                                      fontWeight: FontWeight.w900,
                                      color: isRaUnlocked ? const Color(0xFF059669) : const Color(0xFF2563EB),
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 6),
                                const Text(
                                  'RA Dossier Kit',
                                  style: TextStyle(
                                    fontFamily: 'Nunito',
                                    fontSize: 11,
                                    fontWeight: FontWeight.w600,
                                    color: Color(0xFF94A3B8),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 4),
                            const Text(
                              'Regulatory Affairs (RA) eCTD Dossier & Filing Guide',
                              style: TextStyle(
                                fontFamily: 'Nunito',
                                fontSize: 14,
                                fontWeight: FontWeight.w800,
                                color: Color(0xFF0F172A),
                                height: 1.25,
                              ),
                            ),
                            const SizedBox(height: 2),
                            const Text(
                              '20 Sections: Modules 1-5, USFDA 21 CFR, DMF & ANDA',
                              style: TextStyle(
                                fontFamily: 'Nunito',
                                fontSize: 11,
                                color: Color(0xFF64748B),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 8),
                      Icon(
                        isRaUnlocked ? Icons.lock_open_rounded : Icons.arrow_forward_ios_rounded,
                        color: isRaUnlocked ? const Color(0xFF059669) : const Color(0xFF2563EB),
                        size: 16,
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
