import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/constants/app_spacing.dart';
import '../../core/theme.dart';
import '../../core/widgets/ad_banner_widget.dart';
import '../../core/widgets/empty_state_view.dart';
import '../../features/bookmarks/presentation/bookmarks_controller.dart';
import '../syllabus/subject_detail_screen.dart';

class BookmarksScreen extends ConsumerWidget {
  const BookmarksScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final bookmarkedSubjects = ref.watch(bookmarkedSubjectsProvider);

    if (bookmarkedSubjects.isEmpty) {
      return const EmptyStateView(
        icon: Icons.bookmark_outline_rounded,
        title: 'No Bookmarks Saved Yet',
        message: 'Tap the bookmark icon on any subject in the syllabus to save it here for instant offline revision.',
      );
    }

    return Column(
      children: [
        Expanded(
          child: ListView.builder(
            physics: const BouncingScrollPhysics(),
            padding: AppSpacing.screenPaddingAll,
            itemCount: bookmarkedSubjects.length,
            itemBuilder: (context, index) {
        final subject = bookmarkedSubjects[index];

        return Container(
          margin: const EdgeInsets.only(bottom: AppSpacing.sm),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppTheme.borderSoft, width: 1.5),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.02),
                blurRadius: 8,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Material(
            color: Colors.transparent,
            child: InkWell(
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => SubjectDetailScreen(subject: subject)),
                );
              },
              borderRadius: BorderRadius.circular(16),
              child: Padding(
                padding: AppSpacing.paddingMd,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Flexible(
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 4),
                            decoration: BoxDecoration(
                              color: const Color(0xFFEEF2FF),
                              borderRadius: BorderRadius.circular(7),
                            ),
                            child: Text(
                              subject.code,
                              style: GoogleFonts.dmSans(
                                color: const Color(0xFF3730A3),
                                fontWeight: FontWeight.w900,
                                fontSize: 10.5,
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: AppSpacing.sm),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                          decoration: BoxDecoration(
                            color: const Color(0xFFF1F5F9),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            '${subject.credits} cr · ${subject.typeLabel}',
                            style: GoogleFonts.dmSans(
                              color: AppTheme.textDark,
                              fontWeight: FontWeight.w700,
                              fontSize: 9.5,
                            ),
                          ),
                        ),
                        const Spacer(),
                        IconButton(
                          constraints: const BoxConstraints(minWidth: 32, minHeight: 32),
                          padding: EdgeInsets.zero,
                          icon: const Icon(Icons.bookmark_remove_rounded, color: AppTheme.brandAmber, size: 22),
                          onPressed: () async {
                            await ref.read(bookmarksProvider.notifier).toggleBookmark(subject.code);
                            if (context.mounted) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text(
                                    'Removed from Bookmarks',
                                    style: GoogleFonts.dmSans(fontWeight: FontWeight.w700),
                                  ),
                                  behavior: SnackBarBehavior.floating,
                                  duration: const Duration(seconds: 1),
                                ),
                              );
                            }
                          },
                          tooltip: 'Remove',
                        ),
                      ],
                    ),
                    const SizedBox(height: AppSpacing.sm),
                    Text(
                      subject.name,
                      style: GoogleFonts.dmSans(
                        color: AppTheme.primaryNavy,
                        fontWeight: FontWeight.w800,
                        fontSize: 14,
                        height: 1.3,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      '${subject.units.length} Syllabus Units · Tap to view full details',
                      style: GoogleFonts.dmSans(color: AppTheme.textMuted, fontSize: 11.5, fontWeight: FontWeight.w500),
                    ),
                  ],
                ),
              ),
            ),
          ),
        );
      },
    ),
  ),
  const AdBannerWidget(),
],
);
}
}
