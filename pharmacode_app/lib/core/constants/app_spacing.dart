import 'package:flutter/widgets.dart';

/// Production-grade 8dp Spacing Grid
/// All layout padding, margins, and gaps must use these tokens — zero magic numbers.
class AppSpacing {
  AppSpacing._();

  static const double none = 0.0;
  static const double xs = 4.0;    // 0.5x
  static const double sm = 8.0;    // 1x
  static const double md = 16.0;   // 2x
  static const double lg = 24.0;   // 3x
  static const double xl = 32.0;   // 4x
  static const double xxl = 40.0;  // 5x
  static const double xxxl = 48.0; // 6x

  // Vertical Gaps
  static const SizedBox gapXs = SizedBox(height: xs, width: xs);
  static const SizedBox gapSm = SizedBox(height: sm, width: sm);
  static const SizedBox gapMd = SizedBox(height: md, width: md);
  static const SizedBox gapLg = SizedBox(height: lg, width: lg);
  static const SizedBox gapXl = SizedBox(height: xl, width: xl);
  static const SizedBox gapXxl = SizedBox(height: xxl, width: xxl);

  // Padding Presets
  static const EdgeInsets paddingXs = EdgeInsets.all(xs);
  static const EdgeInsets paddingSm = EdgeInsets.all(sm);
  static const EdgeInsets paddingMd = EdgeInsets.all(md);
  static const EdgeInsets paddingLg = EdgeInsets.all(lg);
  static const EdgeInsets paddingXl = EdgeInsets.all(xl);

  // Horizontal Padding
  static const EdgeInsets horizontalSm = EdgeInsets.symmetric(horizontal: sm);
  static const EdgeInsets horizontalMd = EdgeInsets.symmetric(horizontal: md);
  static const EdgeInsets horizontalLg = EdgeInsets.symmetric(horizontal: lg);

  // Vertical Padding
  static const EdgeInsets verticalSm = EdgeInsets.symmetric(vertical: sm);
  static const EdgeInsets verticalMd = EdgeInsets.symmetric(vertical: md);
  static const EdgeInsets verticalLg = EdgeInsets.symmetric(vertical: lg);

  // Standard Screen Edge Insets
  static const EdgeInsets screenPadding = EdgeInsets.symmetric(horizontal: md, vertical: sm);
  static const EdgeInsets screenPaddingAll = EdgeInsets.all(md);
}
