import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../core/theme.dart';
import '../services/syllabus_service.dart';
import '../core/notification_service.dart';
import 'main_navigation_screen.dart';
import 'onboarding/onboarding_screen.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _ctrl;
  late Animation<double> _fade;
  late Animation<double> _scale;
  late Animation<double> _taglineFade;
  late Animation<Offset> _taglineSlide;

  @override
  void initState() {
    super.initState();
    SystemChrome.setSystemUIOverlayStyle(
      const SystemUiOverlayStyle(
        statusBarColor: Colors.transparent,
        statusBarIconBrightness: Brightness.dark,
      ),
    );

    _ctrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1600),
    );

    _fade = CurvedAnimation(parent: _ctrl, curve: const Interval(0.0, 0.5, curve: Curves.easeOut));
    _scale = Tween<double>(begin: 0.7, end: 1.0).animate(
      CurvedAnimation(parent: _ctrl, curve: const Interval(0.0, 0.6, curve: Curves.easeOutBack)),
    );
    _taglineFade = CurvedAnimation(parent: _ctrl, curve: const Interval(0.5, 0.9, curve: Curves.easeIn));
    _taglineSlide = Tween<Offset>(begin: const Offset(0, 0.5), end: Offset.zero).animate(
      CurvedAnimation(parent: _ctrl, curve: const Interval(0.5, 0.9, curve: Curves.easeOut)),
    );

    _ctrl.forward();
    _initApp();
  }

  Future<void> _initApp() async {
    final sw = Stopwatch()..start();
    await Future.wait([
      SyllabusService().initialize(),
      NotificationService().initialize(),
    ]);
    final elapsed = sw.elapsedMilliseconds;
    if (elapsed < 1800) {
      await Future.delayed(Duration(milliseconds: 1800 - elapsed));
    }
    final prefs = await SharedPreferences.getInstance();
    final seenOnboarding = prefs.getBool('seen_onboarding') ?? false;

    if (mounted) {
      Navigator.of(context).pushReplacement(
        PageRouteBuilder(
          pageBuilder: (context, anim, _) =>
              seenOnboarding ? const MainNavigationScreen() : const OnboardingScreen(),
          transitionsBuilder: (context, anim, _, child) =>
              FadeTransition(opacity: anim, child: child),
          transitionDuration: const Duration(milliseconds: 500),
        ),
      );
    }
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Spacer(flex: 2),

            // Logo Card
            FadeTransition(
              opacity: _fade,
              child: ScaleTransition(
                scale: _scale,
                child: Container(
                  width: 100,
                  height: 100,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(24),
                    boxShadow: [
                      BoxShadow(
                        color: AppTheme.brandBlue.withValues(alpha: 0.22),
                        blurRadius: 36,
                        offset: const Offset(0, 12),
                      ),
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.06),
                        blurRadius: 12,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  padding: const EdgeInsets.all(8),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(18),
                    child: Image.asset(
                      'assets/images/app_icon.png',
                      fit: BoxFit.contain,
                      filterQuality: FilterQuality.high,
                    ),
                  ),
                ),
              ),
            ),

            const SizedBox(height: 28),

            // Brand Name
            FadeTransition(
              opacity: _fade,
              child: RichText(
                text: TextSpan(
                  children: [
                    TextSpan(
                      text: 'Pharma',
                      style: GoogleFonts.dmSans(
                        color: AppTheme.primaryNavy,
                        fontSize: 34,
                        fontWeight: FontWeight.w900,
                        letterSpacing: -1.0,
                      ),
                    ),
                    TextSpan(
                      text: 'Code',
                      style: GoogleFonts.dmSans(
                        color: AppTheme.brandBlue,
                        fontSize: 34,
                        fontWeight: FontWeight.w900,
                        letterSpacing: -1.0,
                      ),
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 10),

            // Tagline with slide-up
            SlideTransition(
              position: _taglineSlide,
              child: FadeTransition(
                opacity: _taglineFade,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 7),
                  decoration: BoxDecoration(
                    color: const Color(0xFFEEF2FF),
                    borderRadius: BorderRadius.circular(24),
                  ),
                  child: Text(
                    'Code • Cure • Care',
                    style: GoogleFonts.dmSans(
                      color: AppTheme.brandBlue,
                      fontSize: 13,
                      fontWeight: FontWeight.w800,
                      letterSpacing: 0.6,
                    ),
                  ),
                ),
              ),
            ),

            const SizedBox(height: 8),

            FadeTransition(
              opacity: _taglineFade,
              child: Text(
                'B.Pharm PCI NEP 2020 · All 8 Semesters',
                style: GoogleFonts.dmSans(
                  color: AppTheme.textMuted,
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),

            const Spacer(flex: 2),

            // Loading indicator
            FadeTransition(
              opacity: _taglineFade,
              child: Column(
                children: [
                  const SizedBox(
                    width: 24,
                    height: 24,
                    child: CircularProgressIndicator(
                      strokeWidth: 2.5,
                      valueColor: AlwaysStoppedAnimation<Color>(AppTheme.brandBlue),
                    ),
                  ),
                  const SizedBox(height: 10),
                  Text(
                    'Loading syllabus...',
                    style: GoogleFonts.dmSans(
                      color: AppTheme.textMuted,
                      fontSize: 11,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 48),
          ],
        ),
      ),
    );
  }
}
