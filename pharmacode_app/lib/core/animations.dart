import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

/// ─────────────────────────────────────────────────────────────────────────────
/// BouncingCard / TouchScale
/// Inspired by tfaki/jump & SmartToolFactory Animation-Tutorials.
/// Gives physics-based interactive bounce feedback when tapped.
/// ─────────────────────────────────────────────────────────────────────────────
class BouncingCard extends StatefulWidget {
  final Widget child;
  final VoidCallback? onTap;
  final double scaleFactor;
  final Duration duration;
  final BorderRadius? borderRadius;

  const BouncingCard({
    super.key,
    required this.child,
    this.onTap,
    this.scaleFactor = 0.965,
    this.duration = const Duration(milliseconds: 110),
    this.borderRadius,
  });

  @override
  State<BouncingCard> createState() => _BouncingCardState();
}

class _BouncingCardState extends State<BouncingCard>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: widget.duration,
      reverseDuration: widget.duration,
    );
    _scaleAnimation = Tween<double>(
      begin: 1.0,
      end: widget.scaleFactor,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeOutCubic,
      reverseCurve: Curves.easeOutCubic,
    ));
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _onTapDown(TapDownDetails details) {
    if (widget.onTap != null) {
      _controller.forward();
      HapticFeedback.selectionClick();
    }
  }

  void _onTapUp(TapUpDetails details) {
    if (widget.onTap != null) {
      _controller.reverse();
      widget.onTap!();
    }
  }

  void _onTapCancel() {
    if (widget.onTap != null) {
      _controller.reverse();
    }
  }

  @override
  Widget build(BuildContext context) {
    if (widget.onTap == null) return widget.child;

    return GestureDetector(
      behavior: HitTestBehavior.opaque,
      onTapDown: _onTapDown,
      onTapUp: _onTapUp,
      onTapCancel: _onTapCancel,
      child: AnimatedBuilder(
        animation: _scaleAnimation,
        builder: (context, child) => Transform.scale(
          scale: _scaleAnimation.value,
          child: child,
        ),
        child: widget.child,
      ),
    );
  }
}

/// ─────────────────────────────────────────────────────────────────────────────
/// StaggeredSlideFade
/// Inspired by OCNYang/Android-Animation-Set & compose-animation-examples.
/// Cards glide into view sequentially on load with smooth slide + fade.
/// ─────────────────────────────────────────────────────────────────────────────
class StaggeredSlideFade extends StatefulWidget {
  final Widget child;
  final int index;
  final Duration duration;
  final double verticalOffset;

  const StaggeredSlideFade({
    super.key,
    required this.child,
    required this.index,
    this.duration = const Duration(milliseconds: 380),
    this.verticalOffset = 24.0,
  });

  @override
  State<StaggeredSlideFade> createState() => _StaggeredSlideFadeState();
}

class _StaggeredSlideFadeState extends State<StaggeredSlideFade>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _fadeAnimation;
  late Animation<Offset> _slideAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: widget.duration);

    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOutCubic),
    );

    _slideAnimation = Tween<Offset>(
      begin: Offset(0, widget.verticalOffset / 100),
      end: Offset.zero,
    ).animate(CurvedAnimation(parent: _controller, curve: Curves.easeOutCubic));

    // Stagger based on item index (capped at 8 items for speed)
    final delayMs = (widget.index.clamp(0, 8) * 45);
    Future.delayed(Duration(milliseconds: delayMs), () {
      if (mounted) _controller.forward();
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return FadeTransition(
      opacity: _fadeAnimation,
      child: SlideTransition(
        position: _slideAnimation,
        child: widget.child,
      ),
    );
  }
}

/// ─────────────────────────────────────────────────────────────────────────────
/// PulsingLiveDot
/// Inspired by OCNYang Animated-Vector & live status indicators.
/// ─────────────────────────────────────────────────────────────────────────────
class PulsingLiveDot extends StatefulWidget {
  final Color color;
  final double size;

  const PulsingLiveDot({
    super.key,
    this.color = const Color(0xFF10B981),
    this.size = 7.0,
  });

  @override
  State<PulsingLiveDot> createState() => _PulsingLiveDotState();
}

class _PulsingLiveDotState extends State<PulsingLiveDot>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;
  late Animation<double> _opacityAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1400),
    )..repeat(reverse: true);

    _scaleAnimation = Tween<double>(begin: 0.85, end: 1.25).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    );

    _opacityAnimation = Tween<double>(begin: 0.45, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) => Opacity(
        opacity: _opacityAnimation.value,
        child: Transform.scale(
          scale: _scaleAnimation.value,
          child: Container(
            width: widget.size,
            height: widget.size,
            decoration: BoxDecoration(
              color: widget.color,
              shape: BoxShape.circle,
              boxShadow: [
                BoxShadow(
                  color: widget.color.withValues(alpha: 0.5),
                  blurRadius: 4,
                  spreadRadius: 1,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// ─────────────────────────────────────────────────────────────────────────────
/// ReadingProgressBar
/// Inspired by XYZReader / Educational Material readers.
/// Displays an interactive reading completion progress bar as user scrolls.
/// ─────────────────────────────────────────────────────────────────────────────
class ReadingProgressBar extends StatelessWidget {
  final double progress; // 0.0 to 1.0
  final Color color;

  const ReadingProgressBar({
    super.key,
    required this.progress,
    this.color = const Color(0xFF4C6EF5),
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      height: 3,
      color: Colors.transparent,
      alignment: Alignment.centerLeft,
      child: FractionallySizedBox(
        widthFactor: progress.clamp(0.0, 1.0),
        child: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [color, color.withValues(alpha: 0.7)],
            ),
            borderRadius: const BorderRadius.horizontal(right: Radius.circular(2)),
          ),
        ),
      ),
    );
  }
}
