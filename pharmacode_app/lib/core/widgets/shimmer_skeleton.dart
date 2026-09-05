import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';
import '../constants/app_spacing.dart';

/// Reusable Shimmer Skeleton Loaders for production-grade loading UX
class ShimmerBox extends StatelessWidget {
  final double width;
  final double height;
  final double borderRadius;

  const ShimmerBox({
    super.key,
    required this.width,
    required this.height,
    this.borderRadius = 8.0,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final baseColor = isDark ? const Color(0xFF1E293B) : const Color(0xFFE2E8F0);
    final highlightColor = isDark ? const Color(0xFF334155) : const Color(0xFFF1F5F9);

    return Shimmer.fromColors(
      baseColor: baseColor,
      highlightColor: highlightColor,
      child: Container(
        width: width,
        height: height,
        decoration: BoxDecoration(
          color: baseColor,
          borderRadius: BorderRadius.circular(borderRadius),
        ),
      ),
    );
  }
}

/// Shimmer Skeleton for Syllabus Subject Cards
class ShimmerSubjectCard extends StatelessWidget {
  const ShimmerSubjectCard({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: AppSpacing.sm),
      padding: AppSpacing.paddingMd,
      decoration: BoxDecoration(
        color: Theme.of(context).cardTheme.color ?? Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Theme.of(context).dividerTheme.color ?? const Color(0xFFE2E8F0)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: const [
              ShimmerBox(width: 80, height: 24, borderRadius: 6),
              SizedBox(width: AppSpacing.sm),
              ShimmerBox(width: 60, height: 24, borderRadius: 6),
              Spacer(),
              ShimmerBox(width: 28, height: 28, borderRadius: 14),
            ],
          ),
          const SizedBox(height: AppSpacing.sm),
          const ShimmerBox(width: double.infinity, height: 18, borderRadius: 4),
          const SizedBox(height: AppSpacing.xs),
          const ShimmerBox(width: 200, height: 14, borderRadius: 4),
          const SizedBox(height: AppSpacing.md),
          Row(
            children: const [
              ShimmerBox(width: 100, height: 16, borderRadius: 4),
              Spacer(),
              ShimmerBox(width: 70, height: 16, borderRadius: 4),
            ],
          ),
        ],
      ),
    );
  }
}

/// Shimmer Skeleton for Career Guide Cards
class ShimmerGuideCard extends StatelessWidget {
  const ShimmerGuideCard({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: AppSpacing.md),
      padding: AppSpacing.paddingMd,
      decoration: BoxDecoration(
        color: Theme.of(context).cardTheme.color ?? Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Theme.of(context).dividerTheme.color ?? const Color(0xFFE2E8F0)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: const [
          ShimmerBox(width: 120, height: 22, borderRadius: 6),
          SizedBox(height: AppSpacing.sm),
          ShimmerBox(width: double.infinity, height: 18, borderRadius: 4),
          SizedBox(height: AppSpacing.xs),
          ShimmerBox(width: 240, height: 14, borderRadius: 4),
          SizedBox(height: AppSpacing.md),
          ShimmerBox(width: double.infinity, height: 36, borderRadius: 8),
        ],
      ),
    );
  }
}

/// Generic Shimmer List Placeholder
class ShimmerListLoader extends StatelessWidget {
  final int itemCount;
  final Widget itemSkeleton;

  const ShimmerListLoader({
    super.key,
    this.itemCount = 5,
    this.itemSkeleton = const ShimmerSubjectCard(),
  });

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      padding: AppSpacing.screenPadding,
      itemCount: itemCount,
      itemBuilder: (context, index) => itemSkeleton,
    );
  }
}
