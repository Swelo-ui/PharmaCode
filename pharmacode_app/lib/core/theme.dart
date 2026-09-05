import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'constants/app_colors.dart';

class AppTheme {
  // ─── Brand Colors ────────────────────────────────────────────────────────
  static const Color primaryNavy    = Color(0xFF1A2B6B);
  static const Color heroNavyDark   = Color(0xFF0F1D5C);
  static const Color brandBlue      = Color(0xFF4C6EF5);
  static const Color brandBlueLight = Color(0xFF93C5FD);
  static const Color brandTeal      = Color(0xFF0D9488);
  static const Color brandGreen     = Color(0xFF10B981);
  static const Color brandAmber     = Color(0xFFF59E0B);
  static const Color brandPink      = Color(0xFFEC4899);
  static const Color brandPurple    = Color(0xFF8B5CF6);
  static const Color brandCoral     = Color(0xFFF97316);
  static const Color brandRed       = Color(0xFFEF4444);

  // ─── Surfaces ────────────────────────────────────────────────────────────
  static const Color background  = Color(0xFFF4F7FB);
  static const Color surface     = Color(0xFFF0F4FF);
  static const Color card        = Colors.white;
  static const Color borderSoft  = Color(0xFFE8EDFF);
  static const Color borderStrong= Color(0xFFDDE6FF);

  // ─── Dark Mode Surfaces ──────────────────────────────────────────────────
  static const Color darkBackground = AppColors.darkBackground;
  static const Color darkSurface    = AppColors.darkSurface;
  static const Color darkSurfaceAlt = AppColors.darkSurfaceAlt;
  static const Color darkCard       = AppColors.darkSurfaceAlt;
  static const Color darkBorderSoft = AppColors.darkBorder;

  // ─── Text ─────────────────────────────────────────────────────────────────
  static const Color textDark  = Color(0xFF1A2B6B);
  static const Color textBody  = Color(0xFF374151);
  static const Color textMuted = Color(0xFF6B7FA3);

  // ─── Semester Colors ──────────────────────────────────────────────────────
  static const _semColors = [
    Color(0xFF4C6EF5), // 1 — Blue
    Color(0xFF10B981), // 2 — Green
    Color(0xFFF59E0B), // 3 — Amber
    Color(0xFFEC4899), // 4 — Pink
    Color(0xFF8B5CF6), // 5 — Purple
    Color(0xFF06B6D4), // 6 — Cyan
    Color(0xFFF97316), // 7 — Orange
    Color(0xFFBE185D), // 8 — Rose
  ];
  static const _semBgs = [
    Color(0xFFEEF2FF), // 1
    Color(0xFFECFDF5), // 2
    Color(0xFFFFFBEB), // 3
    Color(0xFFFDF2F8), // 4
    Color(0xFFF5F3FF), // 5
    Color(0xFFECFEFF), // 6
    Color(0xFFFFF7ED), // 7
    Color(0xFFFFF1F2), // 8
  ];

  static Color getSemesterColor(int num) =>
      _semColors[(num - 1).clamp(0, 7)];
  static Color getSemesterBg(int num) =>
      _semBgs[(num - 1).clamp(0, 7)];

  static Color parseHex(String hex) => AppColors.parseHex(hex);

  // ─── Typography (Unified dmSans Scale) ────────────────────────────────────
  static TextTheme _buildTextTheme({bool isDark = false}) {
    final textColor = isDark ? AppColors.textDarkTheme : textDark;
    final bodyColor = isDark ? AppColors.textBodyDarkTheme : textBody;
    final mutedColor = isDark ? AppColors.textMutedDarkTheme : textMuted;

    final base = GoogleFonts.dmSansTextTheme();
    return base.copyWith(
      displayLarge : GoogleFonts.dmSans(fontSize: 32, fontWeight: FontWeight.w900, color: textColor, letterSpacing: -1.0),
      displayMedium: GoogleFonts.dmSans(fontSize: 26, fontWeight: FontWeight.w900, color: textColor, letterSpacing: -0.6),
      displaySmall : GoogleFonts.dmSans(fontSize: 22, fontWeight: FontWeight.w800, color: textColor, letterSpacing: -0.4),
      headlineLarge: GoogleFonts.dmSans(fontSize: 20, fontWeight: FontWeight.w800, color: textColor, letterSpacing: -0.3),
      headlineMedium:GoogleFonts.dmSans(fontSize: 18, fontWeight: FontWeight.w800, color: textColor, letterSpacing: -0.2),
      headlineSmall: GoogleFonts.dmSans(fontSize: 16, fontWeight: FontWeight.w700, color: textColor),
      titleLarge   : GoogleFonts.dmSans(fontSize: 15, fontWeight: FontWeight.w700, color: textColor),
      titleMedium  : GoogleFonts.dmSans(fontSize: 14, fontWeight: FontWeight.w600, color: bodyColor),
      titleSmall   : GoogleFonts.dmSans(fontSize: 13, fontWeight: FontWeight.w600, color: bodyColor),
      bodyLarge    : GoogleFonts.dmSans(fontSize: 15, fontWeight: FontWeight.w400, color: bodyColor, height: 1.55),
      bodyMedium   : GoogleFonts.dmSans(fontSize: 13, fontWeight: FontWeight.w400, color: bodyColor, height: 1.5),
      bodySmall    : GoogleFonts.dmSans(fontSize: 12, fontWeight: FontWeight.w400, color: mutedColor, height: 1.45),
      labelLarge   : GoogleFonts.dmSans(fontSize: 13, fontWeight: FontWeight.w700, letterSpacing: 0.1),
      labelMedium  : GoogleFonts.dmSans(fontSize: 11, fontWeight: FontWeight.w700, letterSpacing: 0.3),
      labelSmall   : GoogleFonts.dmSans(fontSize: 10, fontWeight: FontWeight.w600, letterSpacing: 0.4),
    );
  }

  // ─── Light Theme ─────────────────────────────────────────────────────────
  static ThemeData get lightTheme {
    final textTheme = _buildTextTheme(isDark: false);
    return ThemeData(
      useMaterial3: true,
      textTheme: textTheme,
      brightness: Brightness.light,
      scaffoldBackgroundColor: background,
      colorScheme: ColorScheme.fromSeed(
        seedColor: brandBlue,
        primary: primaryNavy,
        secondary: brandBlue,
        surface: background,
        brightness: Brightness.light,
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: Colors.white,
        elevation: 0,
        scrolledUnderElevation: 1,
        surfaceTintColor: Colors.transparent,
        shadowColor: borderSoft,
        centerTitle: false,
        iconTheme: const IconThemeData(color: primaryNavy, size: 22),
        titleTextStyle: GoogleFonts.dmSans(
          color: primaryNavy,
          fontSize: 18,
          fontWeight: FontWeight.w900,
          letterSpacing: -0.3,
        ),
      ),
      navigationBarTheme: NavigationBarThemeData(
        backgroundColor: Colors.white,
        elevation: 8,
        shadowColor: Colors.black12,
        surfaceTintColor: Colors.transparent,
        indicatorColor: brandBlue.withValues(alpha: 0.12),
        iconTheme: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) {
            return const IconThemeData(color: brandBlue, size: 22);
          }
          return const IconThemeData(color: textMuted, size: 22);
        }),
        labelTextStyle: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) {
            return GoogleFonts.dmSans(color: brandBlue, fontSize: 11, fontWeight: FontWeight.w700);
          }
          return GoogleFonts.dmSans(color: textMuted, fontSize: 11, fontWeight: FontWeight.w500);
        }),
        labelBehavior: NavigationDestinationLabelBehavior.alwaysShow,
      ),
      cardTheme: CardThemeData(
        color: Colors.white,
        elevation: 0,
        margin: EdgeInsets.zero,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: borderSoft, width: 1.5),
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primaryNavy,
          foregroundColor: Colors.white,
          elevation: 0,
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          textStyle: GoogleFonts.dmSans(fontSize: 13, fontWeight: FontWeight.w800),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: primaryNavy,
          side: const BorderSide(color: borderSoft, width: 1.5),
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          textStyle: GoogleFonts.dmSans(fontSize: 13, fontWeight: FontWeight.w700),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: const Color(0xFFF4F7FB),
        hintStyle: GoogleFonts.dmSans(color: textMuted, fontSize: 14),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: borderSoft, width: 1.5),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: borderSoft, width: 1.5),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: brandBlue, width: 2),
        ),
      ),
      chipTheme: ChipThemeData(
        backgroundColor: surface,
        selectedColor: brandBlue.withValues(alpha: 0.12),
        labelStyle: GoogleFonts.dmSans(fontSize: 12, fontWeight: FontWeight.w600, color: textDark),
        side: const BorderSide(color: borderSoft, width: 1),
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      ),
      dividerTheme: const DividerThemeData(color: borderSoft, thickness: 1, space: 1),
      bottomSheetTheme: const BottomSheetThemeData(
        backgroundColor: Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
        elevation: 16,
      ),
    );
  }

  // ─── Dark Theme ──────────────────────────────────────────────────────────
  static ThemeData get darkTheme {
    final textTheme = _buildTextTheme(isDark: true);
    return ThemeData(
      useMaterial3: true,
      textTheme: textTheme,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: darkBackground,
      colorScheme: ColorScheme.fromSeed(
        seedColor: brandBlue,
        primary: const Color(0xFF60A5FA),
        secondary: const Color(0xFF38BDF8),
        surface: darkSurface,
        brightness: Brightness.dark,
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: darkSurface,
        elevation: 0,
        scrolledUnderElevation: 1,
        surfaceTintColor: Colors.transparent,
        shadowColor: darkBorderSoft,
        centerTitle: false,
        iconTheme: const IconThemeData(color: Colors.white, size: 22),
        titleTextStyle: GoogleFonts.dmSans(
          color: Colors.white,
          fontSize: 18,
          fontWeight: FontWeight.w900,
          letterSpacing: -0.3,
        ),
      ),
      navigationBarTheme: NavigationBarThemeData(
        backgroundColor: darkSurface,
        elevation: 8,
        shadowColor: Colors.black45,
        surfaceTintColor: Colors.transparent,
        indicatorColor: const Color(0xFF2563EB).withValues(alpha: 0.3),
        iconTheme: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) {
            return const IconThemeData(color: Color(0xFF60A5FA), size: 22);
          }
          return const IconThemeData(color: Color(0xFF94A3B8), size: 22);
        }),
        labelTextStyle: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) {
            return GoogleFonts.dmSans(color: const Color(0xFF60A5FA), fontSize: 11, fontWeight: FontWeight.w700);
          }
          return GoogleFonts.dmSans(color: const Color(0xFF94A3B8), fontSize: 11, fontWeight: FontWeight.w500);
        }),
        labelBehavior: NavigationDestinationLabelBehavior.alwaysShow,
      ),
      cardTheme: CardThemeData(
        color: darkSurface,
        elevation: 0,
        margin: EdgeInsets.zero,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: darkBorderSoft, width: 1.2),
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: const Color(0xFF2563EB),
          foregroundColor: Colors.white,
          elevation: 0,
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          textStyle: GoogleFonts.dmSans(fontSize: 13, fontWeight: FontWeight.w800),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: Colors.white,
          side: const BorderSide(color: darkBorderSoft, width: 1.2),
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          textStyle: GoogleFonts.dmSans(fontSize: 13, fontWeight: FontWeight.w700),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: darkSurfaceAlt,
        hintStyle: GoogleFonts.dmSans(color: const Color(0xFF94A3B8), fontSize: 14),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: darkBorderSoft, width: 1.2),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: darkBorderSoft, width: 1.2),
        ),
        focusedBorder: const OutlineInputBorder(
          borderRadius: BorderRadius.all(Radius.circular(12)),
          borderSide: BorderSide(color: Color(0xFF60A5FA), width: 2),
        ),
      ),
      chipTheme: ChipThemeData(
        backgroundColor: darkSurfaceAlt,
        selectedColor: const Color(0xFF2563EB).withValues(alpha: 0.3),
        labelStyle: GoogleFonts.dmSans(fontSize: 12, fontWeight: FontWeight.w600, color: Colors.white),
        side: const BorderSide(color: darkBorderSoft, width: 1),
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      ),
      dividerTheme: const DividerThemeData(color: darkBorderSoft, thickness: 1, space: 1),
      bottomSheetTheme: const BottomSheetThemeData(
        backgroundColor: darkSurface,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
        elevation: 16,
      ),
    );
  }
}
