import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../../core/animations.dart';
import '../../../../core/constants/app_spacing.dart';
import '../../../../core/theme.dart';
import '../../../../models/blog_model.dart';
import '../../../../screens/blogs/blog_detail_screen.dart';

class CareerHeroBanner extends StatelessWidget {
  final List<Blog> blogs;

  const CareerHeroBanner({super.key, required this.blogs});

  void _openGuide(BuildContext context, String blogId) {
    if (blogs.isEmpty) return;
    final blog = blogs.firstWhere((b) => b.id == blogId, orElse: () => blogs.first);
    Navigator.push(
      context,
      MaterialPageRoute(builder: (_) => BlogDetailScreen(blog: blog)),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      margin: AppSpacing.horizontalMd,
      padding: AppSpacing.paddingLg,
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF0F1D5C), Color(0xFF1A2B6B), Color(0xFF2E4BAD)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF0F1D5C).withValues(alpha: 0.25),
            blurRadius: 18,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Trust Badges
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: Colors.white.withValues(alpha: 0.25)),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const PulsingLiveDot(color: Color(0xFF34D399), size: 7),
                    const SizedBox(width: AppSpacing.xs),
                    Text(
                      "INDIA'S MOST TRUSTED",
                      style: GoogleFonts.dmSans(
                        color: Colors.white,
                        fontSize: 9.5,
                        fontWeight: FontWeight.w900,
                        letterSpacing: 0.5,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: AppSpacing.sm),
              Flexible(
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    'B.PHARM CAREERS',
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: GoogleFonts.dmSans(
                      color: const Color(0xFFC7D2FE),
                      fontSize: 9.5,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.md),

          // Main Headline
          Text(
            'Right Guidance.\nReal Opportunities.\nBetter Tomorrow.',
            style: GoogleFonts.dmSans(
              color: Colors.white,
              fontSize: 22,
              fontWeight: FontWeight.w900,
              height: 1.25,
              letterSpacing: -0.4,
            ),
          ),
          const SizedBox(height: AppSpacing.sm),

          Text(
            'Curated interview kits, entry roles, core technical skills, and salary benchmarks for pharma graduates.',
            style: GoogleFonts.dmSans(
              color: const Color(0xFFE0E7FF),
              fontSize: 12.5,
              height: 1.45,
            ),
          ),
          const SizedBox(height: AppSpacing.lg),

          // Action Buttons
          Wrap(
            spacing: AppSpacing.sm,
            runSpacing: AppSpacing.sm,
            children: [
              BouncingCard(
                onTap: () => _openGuide(context, 'pharmacovigilance-interview-preparation-kit'),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 9),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(10),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.1),
                        blurRadius: 8,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.shield_outlined, color: AppTheme.primaryNavy, size: 15),
                      const SizedBox(width: AppSpacing.xs),
                      Text(
                        'PV Kit (44 Pages)',
                        style: GoogleFonts.dmSans(
                          color: AppTheme.primaryNavy,
                          fontWeight: FontWeight.w900,
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              BouncingCard(
                onTap: () => _openGuide(context, 'regulatory-affairs-guide'),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 9),
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: Colors.white.withValues(alpha: 0.3)),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.description_outlined, color: Colors.white, size: 15),
                      const SizedBox(width: AppSpacing.xs),
                      Text(
                        'RA Guide',
                        style: GoogleFonts.dmSans(
                          color: Colors.white,
                          fontWeight: FontWeight.w800,
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
