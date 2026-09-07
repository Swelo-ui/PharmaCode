import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme.dart';
import '../../core/tour/guided_tour_service.dart';
import '../main_navigation_screen.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final PageController _pageCtrl = PageController();
  int _currentPage = 0;

  final List<_OnboardingData> _pages = [
    const _OnboardingData(
      badge: 'PCI NEP 2020 CURRICULUM',
      badgeColor: AppTheme.brandBlue,
      title: 'Complete B.Pharm\nSyllabus & Units',
      description: 'All 8 Semesters, 77+ Subjects, and 193 Credits mapped unit-by-unit with official PCI learning objectives and reference textbooks.',
      icon: Icons.menu_book_rounded,
      iconColor: AppTheme.brandBlue,
      tags: ['8 Semesters', '193 Credits', 'Unit-wise Breakdown', 'GPAT Aligned'],
    ),
    const _OnboardingData(
      badge: '100% FREE ACCESS',
      badgeColor: AppTheme.brandGreen,
      title: 'Unit-Wise Notes &\nDirect Downloads',
      description: 'Study anytime offline with free downloadable PDF notes for every theory subject. Zero paywalls, zero ads, no mandatory sign-in required.',
      icon: Icons.download_done_rounded,
      iconColor: AppTheme.brandGreen,
      tags: ['Free PDF Notes', 'Offline Study', 'No Paywall', 'One-Tap Download'],
    ),
    const _OnboardingData(
      badge: '24/7 AI MENTOR',
      badgeColor: Color(0xFF6366F1),
      title: 'PharmaHelper\nAI Study Tutor',
      description: 'Tough pharmacology and chemistry concepts simplified in Hinglish & English. Generate structured 5-mark exam answers in seconds.',
      icon: Icons.smart_toy_rounded,
      iconColor: Color(0xFF6366F1),
      tags: ['Hinglish & English', '5-Mark Answers', 'Failover AI', 'Zero Cost'],
    ),
    const _OnboardingData(
      badge: 'CAREER & FUTURE TECH',
      badgeColor: AppTheme.brandPurple,
      title: 'Python, AI &\nIndustry Roadmaps',
      description: 'Master NEP subjects like Python Programming (BP101T) and AI in Pharma, plus complete interview guides for Pharmacovigilance & QA.',
      icon: Icons.psychology_rounded,
      iconColor: AppTheme.brandPurple,
      tags: ['Python BP101T', 'Pharmacovigilance', 'Regulatory Affairs', 'Interview Kits'],
    ),
  ];

  Future<void> _completeOnboarding({required bool skipTour}) async {
    await GuidedTourService().setOnboardingCompleted(skipTour: skipTour);

    if (mounted) {
      Navigator.of(context).pushReplacement(
        PageRouteBuilder(
          pageBuilder: (context, anim, _) => const MainNavigationScreen(),
          transitionsBuilder: (context, anim, _, child) =>
              FadeTransition(opacity: anim, child: child),
          transitionDuration: const Duration(milliseconds: 400),
        ),
      );
    }
  }

  @override
  void dispose() {
    _pageCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isLastPage = _currentPage == _pages.length - 1;
    final screenH = MediaQuery.of(context).size.height;
    final isCompactScreen = screenH < 700;

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          if (!isLastPage)
            TextButton(
              onPressed: () => _completeOnboarding(skipTour: true),
              child: Text(
                'Skip',
                style: GoogleFonts.dmSans(
                  color: AppTheme.textMuted,
                  fontWeight: FontWeight.w700,
                  fontSize: 14,
                ),
              ),
            ),
          const SizedBox(width: 8),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Top Branding Header
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 4),
              child: Row(
                children: [
                  Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(12),
                      boxShadow: [
                        BoxShadow(
                          color: AppTheme.brandBlue.withValues(alpha: 0.15),
                          blurRadius: 10,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    padding: const EdgeInsets.all(4),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(8),
                      child: Image.asset(
                        'assets/images/app_icon.png',
                        fit: BoxFit.contain,
                        filterQuality: FilterQuality.high,
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),
                  RichText(
                    text: TextSpan(
                      children: [
                        TextSpan(
                          text: 'Pharma',
                          style: GoogleFonts.dmSans(
                            color: AppTheme.primaryNavy,
                            fontSize: 21,
                            fontWeight: FontWeight.w900,
                            letterSpacing: -0.4,
                          ),
                        ),
                        TextSpan(
                          text: 'Code',
                          style: GoogleFonts.dmSans(
                            color: AppTheme.brandBlue,
                            fontSize: 21,
                            fontWeight: FontWeight.w900,
                            letterSpacing: -0.4,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            // Page Slider
            Expanded(
              child: PageView.builder(
                controller: _pageCtrl,
                itemCount: _pages.length,
                onPageChanged: (idx) => setState(() => _currentPage = idx),
                itemBuilder: (context, i) {
                  final page = _pages[i];
                  return Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 10),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Spacer(),

                        // Hero Icon Card
                        Center(
                          child: Container(
                            width: isCompactScreen ? 96 : 116,
                            height: isCompactScreen ? 96 : 116,
                            decoration: BoxDecoration(
                              color: page.badgeColor.withValues(alpha: 0.08),
                              shape: BoxShape.circle,
                              border: Border.all(
                                color: page.badgeColor.withValues(alpha: 0.22),
                                width: 2,
                              ),
                              boxShadow: [
                                BoxShadow(
                                  color: page.badgeColor.withValues(alpha: 0.1),
                                  blurRadius: 20,
                                  offset: const Offset(0, 8),
                                ),
                              ],
                            ),
                            alignment: Alignment.center,
                            child: Icon(
                              page.icon,
                              size: isCompactScreen ? 44 : 54,
                              color: page.iconColor,
                            ),
                          ),
                        ),

                        const Spacer(),

                        // Category Badge
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                          decoration: BoxDecoration(
                            color: page.badgeColor.withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: page.badgeColor.withValues(alpha: 0.2)),
                          ),
                          child: Text(
                            page.badge,
                            style: GoogleFonts.dmSans(
                              color: page.badgeColor,
                              fontSize: 10,
                              fontWeight: FontWeight.w900,
                              letterSpacing: 0.5,
                            ),
                          ),
                        ),

                        const SizedBox(height: 12),

                        // Title
                        Text(
                          page.title,
                          style: GoogleFonts.dmSans(
                            color: AppTheme.primaryNavy,
                            fontSize: isCompactScreen ? 24 : 28,
                            fontWeight: FontWeight.w900,
                            height: 1.18,
                            letterSpacing: -0.6,
                          ),
                        ),

                        const SizedBox(height: 10),

                        // Description
                        Text(
                          page.description,
                          style: GoogleFonts.dmSans(
                            color: AppTheme.textBody,
                            fontSize: isCompactScreen ? 13 : 14,
                            height: 1.5,
                          ),
                        ),

                        const SizedBox(height: 16),

                        // Tags
                        Wrap(
                          spacing: 8,
                          runSpacing: 8,
                          children: page.tags.map((tag) {
                            return Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                              decoration: BoxDecoration(
                                color: const Color(0xFFF4F7FB),
                                borderRadius: BorderRadius.circular(8),
                                border: Border.all(color: AppTheme.borderSoft),
                              ),
                              child: Text(
                                tag,
                                style: GoogleFonts.dmSans(
                                  color: AppTheme.textDark,
                                  fontSize: 11,
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                            );
                          }).toList(),
                        ),

                        const Spacer(flex: 2),
                      ],
                    ),
                  );
                },
              ),
            ),

            // Bottom Navigation Strip
            Padding(
              padding: const EdgeInsets.fromLTRB(24, 12, 24, 24),
              child: Row(
                children: [
                  // Dot Indicators
                  Row(
                    children: List.generate(_pages.length, (i) {
                      final isSelected = _currentPage == i;
                      return AnimatedContainer(
                        duration: const Duration(milliseconds: 300),
                        margin: const EdgeInsets.only(right: 6),
                        width: isSelected ? 24 : 8,
                        height: 8,
                        decoration: BoxDecoration(
                          color: isSelected ? AppTheme.brandBlue : const Color(0xFFE2E8F0),
                          borderRadius: BorderRadius.circular(4),
                        ),
                      );
                    }),
                  ),

                  const Spacer(),

                  // Next / Get Started Button
                  ElevatedButton(
                    onPressed: () {
                      if (isLastPage) {
                        _completeOnboarding(skipTour: false);
                      } else {
                        _pageCtrl.nextPage(
                          duration: const Duration(milliseconds: 350),
                          curve: Curves.easeOutCubic,
                        );
                      }
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.primaryNavy,
                      foregroundColor: Colors.white,
                      elevation: 2,
                      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          isLastPage ? 'Get Started' : 'Next',
                          style: GoogleFonts.dmSans(fontWeight: FontWeight.w800, fontSize: 14),
                        ),
                        const SizedBox(width: 6),
                        Icon(
                          isLastPage ? Icons.check_circle_rounded : Icons.arrow_forward_rounded,
                          size: 16,
                        ),
                      ],
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

class _OnboardingData {
  final String badge;
  final Color badgeColor;
  final String title;
  final String description;
  final IconData icon;
  final Color iconColor;
  final List<String> tags;

  const _OnboardingData({
    required this.badge,
    required this.badgeColor,
    required this.title,
    required this.description,
    required this.icon,
    required this.iconColor,
    required this.tags,
  });
}
