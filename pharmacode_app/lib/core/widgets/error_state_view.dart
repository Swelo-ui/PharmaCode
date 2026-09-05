import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../constants/app_spacing.dart';

/// Production Error State View with graceful offline handling and retry callback
class ErrorStateView extends StatelessWidget {
  final String title;
  final String errorMessage;
  final VoidCallback onRetry;
  final bool isOffline;

  const ErrorStateView({
    super.key,
    this.title = 'Something went wrong',
    required this.errorMessage,
    required this.onRetry,
    this.isOffline = false,
  });

  @override
  Widget build(BuildContext context) {
    final icon = isOffline ? Icons.wifi_off_rounded : Icons.error_outline_rounded;
    final displayTitle = isOffline ? 'No Internet Connection' : title;
    final displayMsg = isOffline
        ? 'Please check your network settings. Your cached study materials remain available offline.'
        : errorMessage;

    return Center(
      child: Padding(
        padding: AppSpacing.paddingXl,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 72,
              height: 72,
              decoration: BoxDecoration(
                color: const Color(0xFFEF4444).withValues(alpha: 0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, size: 36, color: const Color(0xFFEF4444)),
            ),
            const SizedBox(height: AppSpacing.md),
            Text(
              displayTitle,
              textAlign: TextAlign.center,
              style: GoogleFonts.dmSans(
                fontSize: 17,
                fontWeight: FontWeight.w800,
                color: Theme.of(context).textTheme.titleLarge?.color,
              ),
            ),
            const SizedBox(height: AppSpacing.sm),
            Text(
              displayMsg,
              textAlign: TextAlign.center,
              style: GoogleFonts.dmSans(
                fontSize: 13,
                color: Theme.of(context).textTheme.bodySmall?.color,
                height: 1.5,
              ),
            ),
            const SizedBox(height: AppSpacing.lg),
            ElevatedButton.icon(
              onPressed: onRetry,
              icon: const Icon(Icons.refresh_rounded, size: 16),
              label: Text('Retry Now', style: GoogleFonts.dmSans(fontWeight: FontWeight.w700)),
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg, vertical: AppSpacing.sm),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
