import 'package:flutter/material.dart';

enum MascotState {
  idle,
  thinking,
  explaining,
  searchingWeb,
}

class PharmaMascotWidget extends StatefulWidget {
  final double size;
  final MascotState state;
  final bool showBadge;

  const PharmaMascotWidget({
    super.key,
    this.size = 48,
    this.state = MascotState.idle,
    this.showBadge = false,
  });

  @override
  State<PharmaMascotWidget> createState() => _PharmaMascotWidgetState();
}

class _PharmaMascotWidgetState extends State<PharmaMascotWidget>
    with SingleTickerProviderStateMixin {
  late AnimationController _ctrl;
  late Animation<double> _pulseAnim;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    )..repeat(reverse: true);

    _pulseAnim = Tween<double>(begin: 1.0, end: 1.08).animate(
      CurvedAnimation(parent: _ctrl, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isAnimated = widget.state != MascotState.idle;

    Widget mascotBody = Container(
      width: widget.size,
      height: widget.size,
      padding: EdgeInsets.all(widget.size * 0.1),
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: LinearGradient(
          colors: _getGradientColors(),
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        boxShadow: [
          BoxShadow(
            color: _getGlowColor().withValues(alpha: 0.35),
            blurRadius: widget.size * 0.25,
            spreadRadius: widget.size * 0.05,
          ),
        ],
        border: Border.all(color: Colors.white, width: widget.size * 0.04),
      ),
      child: ClipOval(
        child: Image.asset(
          'assets/images/app_icon.png',
          fit: BoxFit.contain,
          errorBuilder: (context, error, stackTrace) => Icon(
            Icons.smart_toy_rounded,
            color: Colors.white,
            size: widget.size * 0.55,
          ),
        ),
      ),
    );

    if (isAnimated) {
      mascotBody = ScaleTransition(
        scale: _pulseAnim,
        child: mascotBody,
      );
    }

    if (!widget.showBadge) {
      return mascotBody;
    }

    return Stack(
      clipBehavior: Clip.none,
      children: [
        mascotBody,
        Positioned(
          right: -2,
          bottom: -2,
          child: Container(
            padding: const EdgeInsets.all(3),
            decoration: BoxDecoration(
              color: _getStateBadgeColor(),
              shape: BoxShape.circle,
              border: Border.all(color: Colors.white, width: 1.5),
            ),
            child: Icon(
              _getStateIcon(),
              color: Colors.white,
              size: widget.size * 0.24,
            ),
          ),
        ),
      ],
    );
  }

  List<Color> _getGradientColors() {
    switch (widget.state) {
      case MascotState.idle:
        return const [Color(0xFF2563EB), Color(0xFF1D4ED8)];
      case MascotState.thinking:
        return const [Color(0xFF8B5CF6), Color(0xFF6D28D9)];
      case MascotState.explaining:
        return const [Color(0xFF10B981), Color(0xFF059669)];
      case MascotState.searchingWeb:
        return const [Color(0xFF06B6D4), Color(0xFF0891B2)];
    }
  }

  Color _getGlowColor() {
    switch (widget.state) {
      case MascotState.idle:
        return const Color(0xFF3B82F6);
      case MascotState.thinking:
        return const Color(0xFF8B5CF6);
      case MascotState.explaining:
        return const Color(0xFF10B981);
      case MascotState.searchingWeb:
        return const Color(0xFF06B6D4);
    }
  }

  Color _getStateBadgeColor() {
    switch (widget.state) {
      case MascotState.idle:
        return const Color(0xFF10B981); // Online green
      case MascotState.thinking:
        return const Color(0xFF8B5CF6);
      case MascotState.explaining:
        return const Color(0xFFF59E0B);
      case MascotState.searchingWeb:
        return const Color(0xFF06B6D4);
    }
  }

  IconData _getStateIcon() {
    switch (widget.state) {
      case MascotState.idle:
        return Icons.auto_awesome_rounded;
      case MascotState.thinking:
        return Icons.psychology_rounded;
      case MascotState.explaining:
        return Icons.record_voice_over_rounded;
      case MascotState.searchingWeb:
        return Icons.language_rounded;
    }
  }
}
