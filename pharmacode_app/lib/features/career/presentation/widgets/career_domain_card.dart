import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../../core/constants/app_spacing.dart';
import '../../../../core/theme.dart';
import '../../../../models/blog_model.dart';
import '../../../../screens/blogs/blog_detail_screen.dart';

class CareerDomainCard extends StatelessWidget {
  final CareerDomain domain;
  final List<Blog> blogs;

  const CareerDomainCard({
    super.key,
    required this.domain,
    required this.blogs,
  });

  IconData _getDomainIcon(String type) {
    switch (type) {
      case 'pv':
        return Icons.shield_rounded;
      case 'ra':
        return Icons.verified_user_rounded;
      case 'qa':
        return Icons.fact_check_rounded;
      case 'cro':
        return Icons.biotech_rounded;
      case 'python':
        return Icons.terminal_rounded;
      case 'prod':
        return Icons.precision_manufacturing_rounded;
      default:
        return Icons.work_rounded;
    }
  }

  void _showDetailSheet(BuildContext context) {
    final color = AppTheme.parseHex(domain.colorHex);
    final bg = AppTheme.parseHex(domain.bgHex);

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) => DraggableScrollableSheet(
        initialChildSize: 0.78,
        minChildSize: 0.5,
        maxChildSize: 0.94,
        expand: false,
        builder: (_, scrollController) => Container(
          padding: AppSpacing.paddingLg,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: Colors.grey.shade300,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: AppSpacing.md),
              Row(
                children: [
                  Container(
                    width: 44,
                    height: 44,
                    decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(12)),
                    child: Icon(_getDomainIcon(domain.iconType), color: color, size: 24),
                  ),
                  const SizedBox(width: AppSpacing.md),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          domain.title,
                          style: GoogleFonts.dmSans(fontWeight: FontWeight.w900, fontSize: 17, color: AppTheme.primaryNavy),
                        ),
                        Container(
                          margin: const EdgeInsets.only(top: 2),
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(6)),
                          child: Text(domain.tag, style: GoogleFonts.dmSans(color: color, fontSize: 10, fontWeight: FontWeight.w800)),
                        ),
                      ],
                    ),
                  ),
                  IconButton(onPressed: () => Navigator.pop(ctx), icon: const Icon(Icons.close_rounded)),
                ],
              ),
              const SizedBox(height: AppSpacing.md),
              const Divider(color: AppTheme.borderSoft),
              Expanded(
                child: ListView(
                  controller: scrollController,
                  physics: const BouncingScrollPhysics(),
                  children: [
                    const SizedBox(height: AppSpacing.sm),
                    Text('Overview', style: GoogleFonts.dmSans(fontWeight: FontWeight.w900, fontSize: 14, color: AppTheme.primaryNavy)),
                    const SizedBox(height: AppSpacing.xs),
                    Text(domain.detailedOverview.trim(), style: GoogleFonts.dmSans(fontSize: 13, color: AppTheme.textDark, height: 1.5)),
                    const SizedBox(height: AppSpacing.md),

                    Text('Top Entry Roles for Freshers', style: GoogleFonts.dmSans(fontWeight: FontWeight.w900, fontSize: 14, color: AppTheme.primaryNavy)),
                    const SizedBox(height: AppSpacing.sm),
                    ...domain.topRoles.map((role) => Padding(
                          padding: const EdgeInsets.only(bottom: 6),
                          child: Row(
                            children: [
                              Icon(Icons.check_circle_outline_rounded, size: 16, color: color),
                              const SizedBox(width: AppSpacing.sm),
                              Expanded(child: Text(role, style: GoogleFonts.dmSans(fontSize: 13, fontWeight: FontWeight.w600, color: AppTheme.textDark))),
                            ],
                          ),
                        )),
                    const SizedBox(height: AppSpacing.md),

                    Text('Must-Have Skills & Knowledge', style: GoogleFonts.dmSans(fontWeight: FontWeight.w900, fontSize: 14, color: AppTheme.primaryNavy)),
                    const SizedBox(height: AppSpacing.sm),
                    Wrap(
                      spacing: 6,
                      runSpacing: 6,
                      children: domain.coreSkills
                          .map((skill) => Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                                decoration: BoxDecoration(
                                  color: bg,
                                  borderRadius: BorderRadius.circular(8),
                                  border: Border.all(color: color.withValues(alpha: 0.2)),
                                ),
                                child: Text(skill, style: GoogleFonts.dmSans(color: color, fontSize: 11.5, fontWeight: FontWeight.w700)),
                              ))
                          .toList(),
                    ),
                    const SizedBox(height: AppSpacing.md),

                    Container(
                      padding: AppSpacing.paddingMd,
                      decoration: BoxDecoration(
                        color: const Color(0xFFF9FAFB),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: AppTheme.borderSoft),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              const Icon(Icons.school_outlined, size: 16, color: AppTheme.primaryNavy),
                              const SizedBox(width: 6),
                              Text('Eligibility', style: GoogleFonts.dmSans(fontWeight: FontWeight.w800, fontSize: 12, color: AppTheme.primaryNavy)),
                            ],
                          ),
                          const SizedBox(height: 4),
                          Text(domain.eligibility, style: GoogleFonts.dmSans(fontSize: 12, color: AppTheme.textDark)),
                          const SizedBox(height: 10),
                          Row(
                            children: const [
                              Icon(Icons.payments_outlined, size: 16, color: Color(0xFF059669)),
                              SizedBox(width: 6),
                              Text('Industry Compensation (Freshers)', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 12, color: Color(0xFF059669))),
                            ],
                          ),
                          const SizedBox(height: 4),
                          Text(domain.avgSalary, style: GoogleFonts.dmSans(fontSize: 12, color: AppTheme.textDark)),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: AppSpacing.sm),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: () {
                    Navigator.pop(ctx);
                    if (blogs.isEmpty) return;
                    final blog = blogs.firstWhere(
                      (b) => b.id == domain.targetGuideId,
                      orElse: () => blogs.first,
                    );
                    Navigator.push(context, MaterialPageRoute(builder: (_) => BlogDetailScreen(blog: blog)));
                  },
                  icon: const Icon(Icons.menu_book_rounded, size: 18),
                  label: Text('Open Study Guide & Kit', style: GoogleFonts.dmSans(fontWeight: FontWeight.w800, fontSize: 13)),
                  style: ElevatedButton.styleFrom(backgroundColor: color, foregroundColor: Colors.white),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final color = AppTheme.parseHex(domain.colorHex);
    final bg = AppTheme.parseHex(domain.bgHex);

    return Container(
      margin: const EdgeInsets.only(bottom: AppSpacing.md),
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
          onTap: () => _showDetailSheet(context),
          borderRadius: BorderRadius.circular(16),
          child: Padding(
            padding: AppSpacing.paddingMd,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      width: 38,
                      height: 38,
                      decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(10)),
                      child: Icon(_getDomainIcon(domain.iconType), color: color, size: 20),
                    ),
                    const SizedBox(width: AppSpacing.md),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            domain.title,
                            style: GoogleFonts.dmSans(
                              color: AppTheme.primaryNavy,
                              fontSize: 15,
                              fontWeight: FontWeight.w900,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            domain.eligibility,
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                            style: GoogleFonts.dmSans(color: AppTheme.textMuted, fontSize: 11, height: 1.3),
                          ),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: bg,
                        borderRadius: BorderRadius.circular(6),
                        border: Border.all(color: color.withValues(alpha: 0.3)),
                      ),
                      child: Text(
                        domain.tag,
                        style: GoogleFonts.dmSans(color: color, fontWeight: FontWeight.w900, fontSize: 9.5),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: AppSpacing.sm),
                Text(
                  domain.description,
                  style: GoogleFonts.dmSans(color: AppTheme.textBody, fontSize: 12.5, height: 1.45),
                ),
                const SizedBox(height: AppSpacing.sm),
                // Dedicated Highlighted Salary Box
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  decoration: BoxDecoration(
                    color: bg.withValues(alpha: 0.6),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: color.withValues(alpha: 0.2)),
                  ),
                  child: Row(
                    children: [
                      Icon(Icons.payments_outlined, size: 14, color: color),
                      const SizedBox(width: 6),
                      Expanded(
                        child: Text(
                          domain.avgSalary,
                          style: GoogleFonts.dmSans(
                            color: AppTheme.primaryNavy,
                            fontSize: 11.5,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: AppSpacing.sm),
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    Text(
                      'Explore Roadmap & Roles',
                      style: GoogleFonts.dmSans(
                        color: color,
                        fontWeight: FontWeight.w800,
                        fontSize: 12,
                      ),
                    ),
                    const SizedBox(width: 4),
                    Icon(Icons.arrow_forward_rounded, size: 14, color: color),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
