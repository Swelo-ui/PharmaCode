import 'package:flutter/material.dart';

enum TourTooltipPosition {
  auto,
  above,
  below,
}

class TourStep {
  final String id;
  final String title;
  final String description;
  final GlobalKey? targetKey;
  final EdgeInsets targetPadding;
  final double borderRadius;
  final bool isFinalStep;
  final String? nextButtonText;
  final IconData? icon;
  final TourTooltipPosition preferredPosition;

  const TourStep({
    required this.id,
    required this.title,
    required this.description,
    this.targetKey,
    this.targetPadding = const EdgeInsets.all(8),
    this.borderRadius = 14.0,
    this.isFinalStep = false,
    this.nextButtonText,
    this.icon,
    this.preferredPosition = TourTooltipPosition.auto,
  });
}
