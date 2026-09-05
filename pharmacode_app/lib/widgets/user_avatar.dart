import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AvatarItem {
  final String key;
  final String label;
  final IconData? icon;
  final Color? color;
  final Color? bg;
  final String? assetPath;

  const AvatarItem({
    required this.key,
    required this.label,
    this.icon,
    this.color,
    this.bg,
    this.assetPath,
  });
}

const List<AvatarItem> kPharmaAvatars = [
  AvatarItem(
    key: 'mascot',
    label: 'Capsule Mascot',
    assetPath: 'assets/images/app_icon.png',
  ),
  AvatarItem(
    key: 'scholar',
    label: 'Scholar',
    icon: Icons.school_rounded,
    color: Color(0xFF4F46E5),
    bg: Color(0xFFEEF2FF),
  ),
  AvatarItem(
    key: 'pharmacist',
    label: 'Pharmacist',
    icon: Icons.medication_rounded,
    color: Color(0xFF059669),
    bg: Color(0xFFECFDF5),
  ),
  AvatarItem(
    key: 'scientist',
    label: 'Lab Researcher',
    icon: Icons.biotech_rounded,
    color: Color(0xFF2563EB),
    bg: Color(0xFFEFF6FF),
  ),
  AvatarItem(
    key: 'doctor',
    label: 'Clinical Lead',
    icon: Icons.medical_services_rounded,
    color: Color(0xFFDC2626),
    bg: Color(0xFFFEF2F2),
  ),
  AvatarItem(
    key: 'tech',
    label: 'Pharma Tech & AI',
    icon: Icons.terminal_rounded,
    color: Color(0xFF7C3AED),
    bg: Color(0xFFF5F3FF),
  ),
  AvatarItem(
    key: 'topper',
    label: 'Top Performer',
    icon: Icons.auto_awesome_rounded,
    color: Color(0xFFD97706),
    bg: Color(0xFFFFFBEB),
  ),
  AvatarItem(
    key: 'biotech',
    label: 'Genetics & Bio',
    icon: Icons.bubble_chart_rounded,
    color: Color(0xFF0891B2),
    bg: Color(0xFFECFEFF),
  ),
];

class UserAvatar extends StatelessWidget {
  final String avatarKey;
  final String photoUrl;
  final String name;
  final double size;
  final bool showOnlineDot;
  final VoidCallback? onTap;
  final Border? border;

  const UserAvatar({
    super.key,
    required this.avatarKey,
    required this.photoUrl,
    required this.name,
    this.size = 40,
    this.showOnlineDot = false,
    this.onTap,
    this.border,
  });

  @override
  Widget build(BuildContext context) {
    Widget avatarWidget = _buildAvatarContent();

    if (showOnlineDot) {
      final dotSize = (size * 0.28).clamp(8.0, 14.0);
      avatarWidget = Stack(
        clipBehavior: Clip.none,
        children: [
          avatarWidget,
          Positioned(
            right: 0,
            bottom: 0,
            child: Container(
              width: dotSize,
              height: dotSize,
              decoration: BoxDecoration(
                color: const Color(0xFF10B981),
                shape: BoxShape.circle,
                border: Border.all(color: Colors.white, width: dotSize > 10 ? 2 : 1.5),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.15),
                    blurRadius: 3,
                    offset: const Offset(0, 1),
                  ),
                ],
              ),
            ),
          ),
        ],
      );
    }

    if (onTap != null) {
      return GestureDetector(
        onTap: onTap,
        child: avatarWidget,
      );
    }

    return avatarWidget;
  }

  Widget _buildAvatarContent() {
    // 1. Google Photo if explicitly chosen or default with photoUrl
    if (avatarKey == 'google' && photoUrl.isNotEmpty) {
      return Container(
        width: size,
        height: size,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          border: border ?? Border.all(color: Colors.white, width: 1.5),
        ),
        child: ClipOval(
          child: Image.network(
            photoUrl,
            width: size,
            height: size,
            fit: BoxFit.cover,
            errorBuilder: (context, error, stackTrace) => _buildFallbackInitial(),
          ),
        ),
      );
    }

    // 2. Mascot
    if (avatarKey == 'mascot') {
      return Container(
        width: size,
        height: size,
        padding: EdgeInsets.all(size * 0.08),
        decoration: BoxDecoration(
          color: const Color(0xFFF0F4FF),
          shape: BoxShape.circle,
          border: border ?? Border.all(color: const Color(0xFFD6E4FF), width: 1.5),
        ),
        child: ClipOval(
          child: Image.asset(
            'assets/images/app_icon.png',
            fit: BoxFit.contain,
          ),
        ),
      );
    }

    // 3. Preset Avatars
    final matched = kPharmaAvatars.where((a) => a.key == avatarKey).firstOrNull;
    if (matched != null && matched.icon != null) {
      return Container(
        width: size,
        height: size,
        decoration: BoxDecoration(
          color: matched.bg,
          shape: BoxShape.circle,
          border: border ?? Border.all(color: matched.color!.withValues(alpha: 0.3), width: 1.5),
        ),
        alignment: Alignment.center,
        child: Icon(
          matched.icon,
          color: matched.color,
          size: size * 0.52,
        ),
      );
    }

    // 4. Default to Initial
    return _buildFallbackInitial();
  }

  Widget _buildFallbackInitial() {
    final letter = name.trim().isNotEmpty ? name.trim()[0].toUpperCase() : 'S';
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF2563EB), Color(0xFF1D4ED8)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        shape: BoxShape.circle,
        border: border ?? Border.all(color: Colors.white, width: 1.5),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF2563EB).withValues(alpha: 0.25),
            blurRadius: 4,
            offset: const Offset(0, 1.5),
          ),
        ],
      ),
      alignment: Alignment.center,
      child: Text(
        letter,
        style: GoogleFonts.dmSans(
          color: Colors.white,
          fontWeight: FontWeight.w900,
          fontSize: size * 0.44,
        ),
      ),
    );
  }
}
