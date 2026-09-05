import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/constants/app_spacing.dart';
import '../../core/theme.dart';
import '../../core/widgets/ad_native_card.dart';
import '../../features/career/presentation/career_controller.dart';
import '../../features/career/presentation/widgets/career_domain_card.dart';
import '../../features/career/presentation/widgets/career_hero_banner.dart';
import '../../features/career/presentation/widgets/community_roadmap_card.dart';
import '../../features/career/presentation/widgets/study_guides_list.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';

class BlogsScreen extends ConsumerWidget {
  final VoidCallback? onNavigateToNotes;

  const BlogsScreen({super.key, this.onNavigateToNotes});

  Widget _buildCategorySelector(BuildContext context, WidgetRef ref, String selectedCategory) {
    final categories = [
      {'id': 'ALL', 'label': '🌟 All Guides'},
      {'id': 'DOMAINS', 'label': '💼 6 Career Domains'},
      {'id': 'KIT', 'label': '📑 Interview Kits'},
      {'id': 'COURSE', 'label': '🎓 Free Certifications'},
      {'id': 'TECH', 'label': '💻 AI & Python'},
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

          return Padding(
            padding: const EdgeInsets.only(right: AppSpacing.sm),
            child: ChoiceChip(
              label: Text(
                cat['label']!,
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
                ref.read(selectedCareerCategoryProvider.notifier).state = cat['id']!;
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
}
