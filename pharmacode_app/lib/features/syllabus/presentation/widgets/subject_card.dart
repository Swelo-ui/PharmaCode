import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../../core/constants/app_spacing.dart';
import '../../../../core/theme.dart';
import '../../../../models/syllabus_models.dart';
import '../../../bookmarks/presentation/bookmarks_controller.dart';
import '../../../../screens/syllabus/subject_detail_screen.dart';

class SubjectCard extends ConsumerWidget {
  final Subject subject;
  final int semesterNum;
  final bool isExpanded;
  final VoidCallback onToggleExpand;

  const SubjectCard({
    super.key,
    required this.subject,
    required this.semesterNum,
    required this.isExpanded,
    required this.onToggleExpand,
  });

  Widget _typePill(String type) {
    Color color;
    Color bg;
    switch (type) {
      case 'Theory':
        color = const Color(0xFF2563EB);
        bg = const Color(0xFFEFF6FF);
        break;
      case 'Practical':
        color = const Color(0xFF059669);
        bg = const Color(0xFFECFDF5);
        break;
      case 'Internship':
        color = const Color(0xFFD97706);
        bg = const Color(0xFFFFFBEB);
        break;
      default:
        color = const Color(0xFF7C3AED);
        bg = const Color(0xFFF5F3FF);
    }
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
      decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(6)),
      child: Text(type, style: GoogleFonts.dmSans(color: color, fontWeight: FontWeight.w800, fontSize: 9.5)),
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final bookmarkedCodes = ref.watch(bookmarksProvider);
    final isBookmarked = bookmarkedCodes.contains(subject.code);
    final color = AppTheme.getSemesterColor(semesterNum);
    final bg = AppTheme.getSemesterBg(semesterNum);

    return Container(
      margin: const EdgeInsets.only(bottom: AppSpacing.sm),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isExpanded ? color.withValues(alpha: 0.5) : AppTheme.borderSoft,
          width: isExpanded ? 1.8 : 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: isExpanded ? color.withValues(alpha: 0.08) : Colors.black.withValues(alpha: 0.02),
            blurRadius: isExpanded ? 12 : 6,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onToggleExpand,
          borderRadius: BorderRadius.circular(16),
          child: Padding(
            padding: AppSpacing.paddingMd,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Top Meta Row: Flexible code badge, type pill, credits, key, bookmark
                Row(
                  children: [
                    Flexible(
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
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
                    _typePill(subject.typeLabel),
                    const SizedBox(width: 6),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                      decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(6)),
                      child: Text(
                        '${subject.credits} cr',
                        style: GoogleFonts.dmSans(color: color, fontWeight: FontWeight.w900, fontSize: 9.5),
                      ),
                    ),
                    if (subject.highlight) ...[
                      const SizedBox(width: 6),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
                        decoration: BoxDecoration(
                          color: const Color(0xFFFFFBEB),
                          borderRadius: BorderRadius.circular(6),
                          border: Border.all(color: const Color(0xFFF59E0B).withValues(alpha: 0.5)),
                        ),
                        child: Text(
                          'KEY',
                          style: GoogleFonts.dmSans(color: const Color(0xFFB45309), fontWeight: FontWeight.w900, fontSize: 8.5),
                        ),
                      ),
                    ],
                    const Spacer(),
                    GestureDetector(
                      behavior: HitTestBehavior.opaque,
                      onTap: () {
                        ref.read(bookmarksProvider.notifier).toggleBookmark(subject.code);
                      },
                      child: Padding(
                        padding: const EdgeInsets.all(4),
                        child: Icon(
                          isBookmarked ? Icons.bookmark_rounded : Icons.bookmark_outline_rounded,
                          color: isBookmarked ? AppTheme.brandBlue : AppTheme.textMuted,
                          size: 20,
                        ),
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: AppSpacing.sm),

                // Main Title & Chevron
                Row(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Expanded(
                      child: Text(
                        subject.name,
                        style: GoogleFonts.dmSans(
                          color: AppTheme.textDark,
                          fontWeight: FontWeight.w800,
                          fontSize: 14,
                          height: 1.3,
                        ),
                      ),
                    ),
                    const SizedBox(width: AppSpacing.sm),
                    Icon(
                      isExpanded ? Icons.keyboard_arrow_up_rounded : Icons.keyboard_arrow_down_rounded,
                      color: isExpanded ? color : AppTheme.textMuted,
                      size: 20,
                    ),
                  ],
                ),

                // Unit count / details preview
                const SizedBox(height: 6),
                Row(
                  children: [
                    Text(
                      '${subject.units.length} Units',
                      style: GoogleFonts.dmSans(color: AppTheme.textMuted, fontSize: 11.5, fontWeight: FontWeight.w600),
                    ),
                    const Text(' · ', style: TextStyle(color: AppTheme.textMuted)),
                    Text(
                      '${subject.units.fold(0, (sum, u) => sum + u.topics.length)} Topics',
                      style: GoogleFonts.dmSans(color: AppTheme.textMuted, fontSize: 11.5),
                    ),
                  ],
                ),

                // Expanded Section: Units preview & Full detail button
                if (isExpanded) ...[
                  const SizedBox(height: AppSpacing.md),
                  const Divider(color: AppTheme.borderSoft),
                  const SizedBox(height: AppSpacing.sm),
                  ...subject.units.map((u) => Padding(
                        padding: const EdgeInsets.only(bottom: 6),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                              decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(4)),
                              child: Text(u.num, style: GoogleFonts.dmSans(color: color, fontSize: 9.5, fontWeight: FontWeight.w900)),
                            ),
                            const SizedBox(width: AppSpacing.sm),
                            Expanded(
                              child: Text(u.title, style: GoogleFonts.dmSans(fontSize: 12.5, fontWeight: FontWeight.w600, color: AppTheme.textDark)),
                            ),
                          ],
                        ),
                      )),
                  const SizedBox(height: AppSpacing.sm),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (_) => SubjectDetailScreen(subject: subject)),
                        );
                      },
                      icon: const Icon(Icons.arrow_forward_rounded, size: 16),
                      label: Text('Open Full Subject Details', style: GoogleFonts.dmSans(fontWeight: FontWeight.w800, fontSize: 12.5)),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: color,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 10),
                      ),
                    ),
                  ),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }
}
