import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../../core/animations.dart';
import '../../../../core/constants/app_spacing.dart';
import '../../../../core/theme.dart';
import '../../../../models/blog_model.dart';
import '../../../../screens/blogs/blog_detail_screen.dart';

class StudyGuidesList extends StatelessWidget {
  final List<Blog> blogs;

  const StudyGuidesList({super.key, required this.blogs});

  @override
  Widget build(BuildContext context) {
    if (blogs.isEmpty) {
      return const SizedBox.shrink();
    }

    return Padding(
      padding: AppSpacing.horizontalMd,
      child: ListView.builder(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        itemCount: blogs.length,
        itemBuilder: (context, index) {
          final blog = blogs[index];
          final blogColor = AppTheme.parseHex(blog.colorHex);
          final blogBg = AppTheme.parseHex(blog.bgHex);

          return StaggeredSlideFade(
            index: index,
            child: Container(
              margin: const EdgeInsets.only(bottom: AppSpacing.md),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppTheme.borderSoft, width: 1.5),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.02),
                    blurRadius: 10,
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
                      MaterialPageRoute(builder: (_) => BlogDetailScreen(blog: blog)),
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
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 4),
                              decoration: BoxDecoration(
                                color: blogBg,
                                borderRadius: BorderRadius.circular(6),
                                border: Border.all(color: blogColor.withValues(alpha: 0.3)),
                              ),
                              child: Text(
                                blog.tag,
                                style: GoogleFonts.dmSans(color: blogColor, fontWeight: FontWeight.w900, fontSize: 10),
                              ),
                            ),
                            const Spacer(),
                            if (blog.isNew)
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                                decoration: BoxDecoration(
                                  color: const Color(0xFFEF4444),
                                  borderRadius: BorderRadius.circular(5),
                                ),
                                child: Text('NEW', style: GoogleFonts.dmSans(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 9)),
                              ),
                          ],
                        ),
                        const SizedBox(height: AppSpacing.sm),
                        Text(
                          blog.title,
                          style: GoogleFonts.dmSans(
                            color: AppTheme.textDark,
                            fontSize: 15,
                            fontWeight: FontWeight.w900,
                            height: 1.3,
                            letterSpacing: -0.2,
                          ),
                        ),
                        const SizedBox(height: AppSpacing.sm),
                        Text(
                          blog.description,
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          style: GoogleFonts.dmSans(color: AppTheme.textBody, fontSize: 12.5, height: 1.45),
                        ),
                        const SizedBox(height: AppSpacing.md),
                        Row(
                          children: [
                            const Icon(Icons.schedule_rounded, size: 13, color: AppTheme.textMuted),
                            const SizedBox(width: AppSpacing.xs),
                            Text(blog.readTime, style: GoogleFonts.dmSans(color: AppTheme.textMuted, fontSize: 11)),
                            const Spacer(),
                            Text('Read Full Guide', style: GoogleFonts.dmSans(color: blogColor, fontWeight: FontWeight.w800, fontSize: 12)),
                            const SizedBox(width: AppSpacing.xs),
                            Icon(Icons.arrow_forward_rounded, size: 14, color: blogColor),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
