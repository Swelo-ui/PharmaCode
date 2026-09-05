import 'package:flutter/material.dart';

/// Centralized Color Tokens for PharmaCode Design System
class AppColors {
  AppColors._();

  // Primary Brand Colors
  static const Color primaryNavy = Color(0xFF0F1D5C);
  static const Color primaryNavyLight = Color(0xFF1E3A8A);
  static const Color brandBlue = Color(0xFF2563EB);
  static const Color brandCyan = Color(0xFF0EA5E9);
  static const Color brandTeal = Color(0xFF0D9488);
  static const Color brandPurple = Color(0xFF7C3AED);
  static const Color brandAmber = Color(0xFFD97706);
  static const Color brandRose = Color(0xFFE11D48);
  static const Color brandEmerald = Color(0xFF059669);

  // Light Mode Surfaces
  static const Color lightBackground = Color(0xFFF8FAFC);
  static const Color lightSurface = Colors.white;
  static const Color lightSurfaceAlt = Color(0xFFF1F5F9);
  static const Color lightBorder = Color(0xFFE2E8F0);
  static const Color lightBorderSoft = Color(0xFFEDF2F7);

  // Dark Mode Surfaces (OLED & High-Contrast Ready)
  static const Color darkBackground = Color(0xFF0B1120);
  static const Color darkSurface = Color(0xFF131D31);
  static const Color darkSurfaceAlt = Color(0xFF1E293B);
  static const Color darkBorder = Color(0xFF334155);
  static const Color darkBorderSoft = Color(0xFF1E293B);

  // Text Colors (Light Mode)
  static const Color textDark = Color(0xFF0F172A);
  static const Color textBody = Color(0xFF334155);
  static const Color textMuted = Color(0xFF64748B);
  static const Color textSubtle = Color(0xFF94A3B8);

  // Text Colors (Dark Mode)
  static const Color textDarkTheme = Color(0xFFF8FAFC);
  static const Color textBodyDarkTheme = Color(0xFFCBD5E1);
  static const Color textMutedDarkTheme = Color(0xFF94A3B8);

  // Status & Feedback
  static const Color success = Color(0xFF10B981);
  static const Color warning = Color(0xFFF59E0B);
  static const Color error = Color(0xFFEF4444);
  static const Color info = Color(0xFF3B82F6);

  // Semester Palette (Consistent across app)
  static const List<Color> semesterColors = [
    Color(0xFF2563EB), // Sem 1 - Blue
    Color(0xFF0D9488), // Sem 2 - Teal
    Color(0xFF7C3AED), // Sem 3 - Purple
    Color(0xFFD97706), // Sem 4 - Amber
    Color(0xFF059669), // Sem 5 - Emerald
    Color(0xFFDC2626), // Sem 6 - Red
    Color(0xFF0891B2), // Sem 7 - Cyan
    Color(0xFF4F46E5), // Sem 8 - Indigo
  ];

  static Color getSemesterColor(int sem) {
    if (sem < 1 || sem > 8) return brandBlue;
    return semesterColors[sem - 1];
  }

  static Color getSemesterBg(int sem, {bool isDark = false}) {
    final color = getSemesterColor(sem);
    return isDark ? color.withValues(alpha: 0.18) : color.withValues(alpha: 0.08);
  }

  static Color parseHex(String hex, {Color fallback = brandBlue}) {
    try {
      final clean = hex.replaceAll('#', '').trim();
      if (clean.length == 6) {
        return Color(int.parse('FF$clean', radix: 16));
      } else if (clean.length == 8) {
        return Color(int.parse(clean, radix: 16));
      }
    } catch (_) {}
    return fallback;
  }
}
