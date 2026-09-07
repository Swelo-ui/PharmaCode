import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme.dart';
import 'guided_tour_model.dart';

class GuidedTourOverlay extends StatefulWidget {
  final List<TourStep> steps;
  final VoidCallback onComplete;
  final VoidCallback onSkip;

  const GuidedTourOverlay({
    super.key,
    required this.steps,
    required this.onComplete,
    required this.onSkip,
  });

  @override
  State<GuidedTourOverlay> createState() => _GuidedTourOverlayState();
}

class _GuidedTourOverlayState extends State<GuidedTourOverlay>
    with SingleTickerProviderStateMixin {
  int _currentIndex = 0;
  late AnimationController _animCtrl;
  late Animation<double> _fadeAnim;

  @override
  void initState() {
    super.initState();
    _animCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 300),
    );
    _fadeAnim = CurvedAnimation(parent: _animCtrl, curve: Curves.easeInOut);
    _animCtrl.forward();
  }

  @override
  void dispose() {
    _animCtrl.dispose();
    super.dispose();
  }

  void _nextStep() {
    if (_currentIndex < widget.steps.length - 1) {
      _animCtrl.reverse().then((_) {
        setState(() {
          _currentIndex++;
        });
        _animCtrl.forward();
      });
    } else {
      widget.onComplete();
    }
  }

  void _previousStep() {
    if (_currentIndex > 0) {
      _animCtrl.reverse().then((_) {
        setState(() {
          _currentIndex--;
        });
        _animCtrl.forward();
      });
    }
  }

  Rect? _getTargetRect(TourStep step) {
    final key = step.targetKey;
    if (key == null || key.currentContext == null) return null;
    final box = key.currentContext?.findRenderObject() as RenderBox?;
    if (box == null || !box.hasSize) return null;

    final pos = box.localToGlobal(Offset.zero);
    final size = box.size;

    return Rect.fromLTWH(
      pos.dx - step.targetPadding.left,
      pos.dy - step.targetPadding.top,
      size.width + step.targetPadding.horizontal,
      size.height + step.targetPadding.vertical,
    );
  }

  @override
  Widget build(BuildContext context) {
    if (widget.steps.isEmpty) return const SizedBox.shrink();

    final step = widget.steps[_currentIndex];
    final targetRect = _getTargetRect(step);
    final screenSize = MediaQuery.of(context).size;
    final isFinal = step.isFinalStep || _currentIndex == widget.steps.length - 1;

    // Determine tooltip position: if target is in bottom half, show above; else below
    bool placeAbove = false;
    if (targetRect != null) {
      if (step.preferredPosition == TourTooltipPosition.above) {
        placeAbove = true;
      } else if (step.preferredPosition == TourTooltipPosition.below) {
        placeAbove = false;
      } else {
        placeAbove = targetRect.center.dy > (screenSize.height * 0.52);
      }
    }

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) {
        if (didPop) return;
        widget.onSkip();
      },
      child: Material(
        type: MaterialType.transparency,
        child: FadeTransition(
          opacity: _fadeAnim,
          child: Stack(
            children: [
              // 1. Semi-transparent backdrop with spotlight cutout
              Positioned.fill(
                child: CustomPaint(
                  painter: _SpotlightPainter(
                    targetRect: targetRect,
                    borderRadius: step.borderRadius,
                    overlayColor: const Color(0xC70A1128), // 78% opacity dark navy
                  ),
                ),
              ),

              // 2. Absorb taps outside card to prevent background mis-clicks
              Positioned.fill(
                child: GestureDetector(
                  behavior: HitTestBehavior.translucent,
                  onTap: () {},
                ),
              ),

              // 3. Tooltip Card
              if (targetRect == null || isFinal)
                _buildCenteredCard(context, step, isFinal)
              else
                _buildTargetedCard(context, step, targetRect, placeAbove, isFinal),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTargetedCard(
    BuildContext context,
    TourStep step,
    Rect targetRect,
    bool placeAbove,
    bool isFinal,
  ) {
    final screenSize = MediaQuery.of(context).size;
    final safePadding = MediaQuery.of(context).padding;
    final double cardMargin = 20.0;
    final double cardWidth = (screenSize.width - (cardMargin * 2)).clamp(280.0, 420.0);

    // Calculate vertical position
    double? top;
    double? bottom;

    if (placeAbove) {
      bottom = (screenSize.height - targetRect.top + 14).clamp(
        safePadding.bottom + 10,
        screenSize.height - safePadding.top - 120,
      );
    } else {
      top = (targetRect.bottom + 14).clamp(
        safePadding.top + 10,
        screenSize.height - safePadding.bottom - 120,
      );
    }

    // Horizontal arrow alignment
    final arrowX = (targetRect.center.dx - cardMargin).clamp(24.0, cardWidth - 24.0);

    return Positioned(
      top: top,
      bottom: bottom,
      left: cardMargin,
      right: cardMargin,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (!placeAbove)
            Padding(
              padding: EdgeInsets.only(left: arrowX - 8),
              child: _buildArrow(isPointingUp: true),
            ),
          _buildCardContent(step, isFinal),
          if (placeAbove)
            Padding(
              padding: EdgeInsets.only(left: arrowX - 8),
              child: _buildArrow(isPointingUp: false),
            ),
        ],
      ),
    );
  }

  Widget _buildCenteredCard(BuildContext context, TourStep step, bool isFinal) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24),
        child: _buildCardContent(step, isFinal),
      ),
    );
  }

  Widget _buildArrow({required bool isPointingUp}) {
    return CustomPaint(
      size: const Size(16, 8),
      painter: _ArrowPainter(
        color: Colors.white,
        isPointingUp: isPointingUp,
      ),
    );
  }

  Widget _buildCardContent(TourStep step, bool isFinal) {
    final stepNumber = _currentIndex + 1;
    final totalSteps = widget.steps.length;

    return Material(
      color: Colors.transparent,
      child: DefaultTextStyle(
        style: GoogleFonts.dmSans(
          decoration: TextDecoration.none,
        ),
        child: Container(
          width: double.infinity,
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(20),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.25),
                blurRadius: 24,
                offset: const Offset(0, 8),
              ),
              BoxShadow(
                color: AppTheme.brandBlue.withValues(alpha: 0.15),
                blurRadius: 12,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header: Step pill & Skip button
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppTheme.brandBlue.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        if (step.icon != null) ...[
                          Icon(step.icon, size: 12, color: AppTheme.brandBlue),
                          const SizedBox(width: 4),
                        ],
                        Text(
                          isFinal ? 'Tour Complete' : 'Step $stepNumber of $totalSteps',
                          style: GoogleFonts.dmSans(
                            color: AppTheme.brandBlue,
                            fontWeight: FontWeight.w800,
                            fontSize: 11,
                            letterSpacing: 0.3,
                            decoration: TextDecoration.none,
                          ),
                        ),
                      ],
                    ),
                  ),
                  if (!isFinal)
                    TextButton(
                      onPressed: widget.onSkip,
                      style: TextButton.styleFrom(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                        minimumSize: Size.zero,
                        tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                      ),
                      child: Text(
                        'Skip Tour',
                        style: GoogleFonts.dmSans(
                          color: AppTheme.textMuted,
                          fontWeight: FontWeight.w700,
                          fontSize: 12,
                          decoration: TextDecoration.none,
                        ),
                      ),
                    ),
                ],
              ),

              const SizedBox(height: 12),

              // Title
              Text(
                step.title,
                style: GoogleFonts.dmSans(
                  color: AppTheme.primaryNavy,
                  fontWeight: FontWeight.w900,
                  fontSize: 18,
                  letterSpacing: -0.3,
                  decoration: TextDecoration.none,
                ),
              ),

              const SizedBox(height: 8),

              // Description
              Text(
                step.description,
                style: GoogleFonts.dmSans(
                  color: AppTheme.textBody,
                  fontSize: 13.5,
                  height: 1.45,
                  decoration: TextDecoration.none,
                ),
              ),

              const SizedBox(height: 18),

              // Navigation buttons
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  if (_currentIndex > 0 && !isFinal)
                    OutlinedButton(
                      onPressed: _previousStep,
                      style: OutlinedButton.styleFrom(
                        side: const BorderSide(color: AppTheme.borderSoft),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                      ),
                      child: Text(
                        'Back',
                        style: GoogleFonts.dmSans(
                          color: AppTheme.textDark,
                          fontWeight: FontWeight.w700,
                          fontSize: 13,
                          decoration: TextDecoration.none,
                        ),
                      ),
                    )
                  else
                    const SizedBox.shrink(),

                  ElevatedButton(
                    onPressed: _nextStep,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.primaryNavy,
                      foregroundColor: Colors.white,
                      elevation: 2,
                      padding: const EdgeInsets.symmetric(horizontal: 22, vertical: 12),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          step.nextButtonText ?? (isFinal ? 'Finish & Explore' : 'Next'),
                          style: GoogleFonts.dmSans(
                            fontWeight: FontWeight.w800,
                            fontSize: 13.5,
                            decoration: TextDecoration.none,
                          ),
                        ),
                        const SizedBox(width: 6),
                        Icon(
                          isFinal ? Icons.check_circle_rounded : Icons.arrow_forward_rounded,
                          size: 15,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _SpotlightPainter extends CustomPainter {
  final Rect? targetRect;
  final double borderRadius;
  final Color overlayColor;

  const _SpotlightPainter({
    required this.targetRect,
    required this.borderRadius,
    required this.overlayColor,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final screenPath = Path()..addRect(Rect.fromLTWH(0, 0, size.width, size.height));

    if (targetRect == null) {
      canvas.drawPath(screenPath, Paint()..color = overlayColor);
      return;
    }

    final cutoutRRect = RRect.fromRectAndRadius(
      targetRect!,
      Radius.circular(borderRadius),
    );

    final cutoutPath = Path()..addRRect(cutoutRRect);

    // Difference path leaves a clear window around the target
    final combinedPath = Path.combine(PathOperation.difference, screenPath, cutoutPath);
    canvas.drawPath(combinedPath, Paint()..color = overlayColor);

    // Glowing outline around the cutout
    final borderPaint = Paint()
      ..color = const Color(0xFF60A5FA)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.5;
    canvas.drawRRect(cutoutRRect, borderPaint);

    final outerGlowPaint = Paint()
      ..color = const Color(0x5538BDF8)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 5.0;
    canvas.drawRRect(cutoutRRect, outerGlowPaint);
  }

  @override
  bool shouldRepaint(covariant _SpotlightPainter oldDelegate) {
    return oldDelegate.targetRect != targetRect ||
        oldDelegate.borderRadius != borderRadius ||
        oldDelegate.overlayColor != overlayColor;
  }
}

class _ArrowPainter extends CustomPainter {
  final Color color;
  final bool isPointingUp;

  const _ArrowPainter({required this.color, required this.isPointingUp});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..style = PaintingStyle.fill;

    final path = Path();
    if (isPointingUp) {
      path.moveTo(size.width / 2, 0);
      path.lineTo(size.width, size.height);
      path.lineTo(0, size.height);
    } else {
      path.moveTo(0, 0);
      path.lineTo(size.width, 0);
      path.lineTo(size.width / 2, size.height);
    }
    path.close();

    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant _ArrowPainter oldDelegate) {
    return oldDelegate.color != color || oldDelegate.isPointingUp != isPointingUp;
  }
}
