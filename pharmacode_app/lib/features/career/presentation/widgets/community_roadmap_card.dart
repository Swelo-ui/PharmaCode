import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../../core/animations.dart';
import '../../../../core/constants/app_spacing.dart';
import '../../../../core/theme.dart';

class CommunityRoadmapCard extends StatelessWidget {
  const CommunityRoadmapCard({super.key});

  void _showPosterZoomDialog(BuildContext context) {
    showDialog(
      context: context,
      barrierColor: Colors.black87,
      builder: (_) => Dialog(
        backgroundColor: Colors.transparent,
        insetPadding: AppSpacing.paddingSm,
        child: Stack(
          alignment: Alignment.topRight,
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(16),
              child: InteractiveViewer(
                panEnabled: true,
                minScale: 0.8,
                maxScale: 4.0,
                child: Image.asset('assets/images/pic2.jpg', fit: BoxFit.contain),
              ),
            ),
            Positioned(
              top: 10,
              right: 10,
              child: CircleAvatar(
                backgroundColor: Colors.black54,
                radius: 18,
                child: IconButton(
                  padding: EdgeInsets.zero,
                  icon: const Icon(Icons.close_rounded, color: Colors.white, size: 20),
                  onPressed: () => Navigator.pop(context),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCheckItem(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Row(
        children: [
          const Icon(Icons.check_circle_rounded, color: Color(0xFF10B981), size: 16),
          const SizedBox(width: AppSpacing.sm),
          Expanded(
            child: Text(
              text,
              style: GoogleFonts.dmSans(color: AppTheme.textDark, fontSize: 12.5, fontWeight: FontWeight.w600),
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: AppSpacing.horizontalMd,
      padding: AppSpacing.paddingLg,
      decoration: BoxDecoration(
        color: const Color(0xFFF8FAFF),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFE0E8FF), width: 1.5),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(color: AppTheme.primaryNavy, borderRadius: BorderRadius.circular(20)),
            child: Text(
              'JOIN PHARMACODE COMMUNITY',
              style: GoogleFonts.dmSans(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 9.5, letterSpacing: 0.5),
            ),
          ),
          const SizedBox(height: AppSpacing.sm),
          Text(
            'Smart Preparation. Strong Knowledge. Successful Interview.',
            style: GoogleFonts.dmSans(color: AppTheme.primaryNavy, fontSize: 17, fontWeight: FontWeight.w900, height: 1.3),
          ),
          const SizedBox(height: AppSpacing.md),
          _buildCheckItem('Daily Valuable Content & Pharma Updates'),
          _buildCheckItem('ATS-Friendly Resume Building Guidance'),
          _buildCheckItem('Interview Q&A with Real Case Studies'),
          _buildCheckItem('Free PCI NEP 2020 Study Notes PDF'),
          const SizedBox(height: AppSpacing.md),

          // Uncropped Roadmap Poster with Zoom Tap
          BouncingCard(
            onTap: () => _showPosterZoomDialog(context),
            child: Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: const Color(0xFFE8EDFF), width: 1.5),
                boxShadow: [
                  BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 10, offset: const Offset(0, 3)),
                ],
              ),
              child: Stack(
                alignment: Alignment.bottomRight,
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.circular(10),
                    child: Image.asset(
                      'assets/images/pic2.jpg',
                      width: double.infinity,
                      fit: BoxFit.fitWidth,
                    ),
                  ),
                  Container(
                    margin: const EdgeInsets.all(10),
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    decoration: BoxDecoration(color: Colors.black.withValues(alpha: 0.75), borderRadius: BorderRadius.circular(8)),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Icons.fullscreen_rounded, color: Colors.white, size: 16),
                        const SizedBox(width: AppSpacing.xs),
                        Text('Tap to Zoom Roadmap', style: GoogleFonts.dmSans(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w800)),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
