import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:share_plus/share_plus.dart';
import '../../core/in_app_browser.dart';
import '../../core/theme.dart';
import '../../features/bookmarks/presentation/bookmarks_controller.dart';
import '../../models/syllabus_models.dart';
import '../ai/pharma_helper_screen.dart';
import '../../widgets/pharma_mascot_widget.dart';

class SubjectDetailScreen extends ConsumerStatefulWidget {
  final Subject subject;

  const SubjectDetailScreen({super.key, required this.subject});

  @override
  ConsumerState<SubjectDetailScreen> createState() => _SubjectDetailScreenState();
}

class _SubjectDetailScreenState extends ConsumerState<SubjectDetailScreen> {
  void _toggleBookmark() async {
    final status = await ref.read(bookmarksProvider.notifier).toggleBookmark(widget.subject.code);
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            status ? 'Saved to Bookmarks!' : 'Removed from Bookmarks',
            style: GoogleFonts.dmSans(fontWeight: FontWeight.w700),
          ),
          backgroundColor: AppTheme.primaryNavy,
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
          duration: const Duration(seconds: 2),
        ),
      );
    }
  }

  void _shareSubject() {
    SharePlus.instance.share(
      ShareParams(
        text: '📚 ${widget.subject.code}: ${widget.subject.name}\n'
            'PCI B.Pharm NEP 2020 Syllabus · ${widget.subject.credits} Credits · ${widget.subject.units.length} Units\n\n'
            'Explore on PharmaCode: https://pharmacode.vercel.app/syllabus/',
        subject: '${widget.subject.code} Syllabus - PharmaCode',
      ),
    );
  }

  void _openNotes() {
    openInAppUrl(context, 'https://pharmacode.vercel.app/notes/');
  }

  Widget _buildTopicItem(String rawTopic) {
    final cleanT = rawTopic.replaceAll('**', '').replaceAll('*', '').trim();
    if (cleanT.isEmpty) return const SizedBox.shrink();

    final colonIndex = cleanT.indexOf(':');
    final hasColonPrefix = colonIndex != -1 && colonIndex <= 55;
    final isOverview = cleanT.toLowerCase().startsWith('definition, etiopathogenesis') ||
        cleanT.toLowerCase().startsWith('overview of management');

    if (isOverview) {
      return Container(
        margin: const EdgeInsets.only(bottom: 10),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 9),
        decoration: BoxDecoration(
          color: const Color(0xFFF8FAFC),
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: const Color(0xFFE2E8F0)),
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Padding(
              padding: EdgeInsets.only(top: 2),
              child: Icon(Icons.info_outline_rounded, size: 15, color: Color(0xFF64748B)),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: Text(
                cleanT,
                style: GoogleFonts.dmSans(
                  color: const Color(0xFF334155),
                  fontSize: 12.5,
                  fontStyle: FontStyle.italic,
                  height: 1.45,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ],
        ),
      );
    }

    String prefix = '';
    String body = cleanT;
    if (hasColonPrefix) {
      prefix = cleanT.substring(0, colonIndex + 1).trim();
      body = cleanT.substring(colonIndex + 1).trim();
    }

    final isUpper = prefix.isNotEmpty && prefix == prefix.toUpperCase() && prefix.contains(RegExp(r'[A-Z]'));

    return Padding(
      padding: const EdgeInsets.only(bottom: 9),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            margin: const EdgeInsets.only(top: 6),
            width: 6,
            height: 6,
            decoration: BoxDecoration(
              color: isUpper ? const Color(0xFF4F46E5) : const Color(0xFF6366F1),
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: RichText(
              text: TextSpan(
                children: [
                  if (prefix.isNotEmpty)
                    TextSpan(
                      text: '$prefix ',
                      style: GoogleFonts.dmSans(
                        color: isUpper ? const Color(0xFF0F172A) : const Color(0xFF1E293B),
                        fontWeight: isUpper ? FontWeight.w800 : FontWeight.w700,
                        fontSize: 13,
                        letterSpacing: isUpper ? 0.2 : 0,
                      ),
                    ),
                  TextSpan(
                    text: body,
                    style: GoogleFonts.dmSans(
                      color: const Color(0xFF475569),
                      fontSize: 13,
                      height: 1.5,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final s = widget.subject;
    final isBookmarked = ref.watch(bookmarksProvider).contains(s.code);

    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        title: Text(
          s.code,
          style: GoogleFonts.dmSans(
            color: AppTheme.primaryNavy,
            fontWeight: FontWeight.w900,
            letterSpacing: -0.2,
          ),
        ),
        actions: [
          IconButton(
            icon: const PharmaMascotWidget(size: 26, showBadge: true),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => PharmaHelperScreen(
                    attachedSubject: widget.subject,
                  ),
                ),
              );
            },
            tooltip: 'Ask PharmaHelper',
          ),
          IconButton(
            icon: Icon(
              isBookmarked ? Icons.bookmark_rounded : Icons.bookmark_outline_rounded,
              color: isBookmarked ? AppTheme.brandAmber : AppTheme.primaryNavy,
            ),
            onPressed: _toggleBookmark,
            tooltip: 'Bookmark Subject',
          ),
          IconButton(
            icon: const Icon(Icons.share_rounded, color: AppTheme.primaryNavy),
            onPressed: _shareSubject,
            tooltip: 'Share Subject',
          ),
        ],
      ),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.fromLTRB(16, 16, 16, 32),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ── Header Card ───────────────────────────────────────────
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [
                    Color(0xFF0F1D5C),
                    Color(0xFF1A2B6B),
                    Color(0xFF2E4BAD),
                  ],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(20),
                boxShadow: [
                  BoxShadow(
                    color: AppTheme.primaryNavy.withValues(alpha: 0.25),
                    blurRadius: 18,
                    offset: const Offset(0, 8),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Wrap(
                    spacing: 8,
                    runSpacing: 6,
                    crossAxisAlignment: WrapCrossAlignment.center,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.18),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          s.code,
                          style: GoogleFonts.dmSans(
                            color: Colors.white,
                            fontWeight: FontWeight.w900,
                            fontSize: 12,
                          ),
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                        decoration: BoxDecoration(
                          color: AppTheme.brandBlueLight.withValues(alpha: 0.25),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          '${s.credits} Credits · ${s.typeLabel}',
                          style: GoogleFonts.dmSans(
                            color: Colors.white,
                            fontWeight: FontWeight.w700,
                            fontSize: 11,
                          ),
                        ),
                      ),
                      if (s.highlight)
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: const Color(0xFFFEF3C7),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              const Icon(Icons.star_rounded, size: 12, color: Color(0xFF92400E)),
                              const SizedBox(width: 3),
                              Text(
                                'KEY',
                                style: GoogleFonts.dmSans(
                                  color: const Color(0xFF92400E),
                                  fontWeight: FontWeight.w900,
                                  fontSize: 10,
                                ),
                              ),
                            ],
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(height: 14),
                  Text(
                    s.name,
                    style: GoogleFonts.dmSans(
                      color: Colors.white,
                      fontSize: 20,
                      fontWeight: FontWeight.w900,
                      height: 1.25,
                      letterSpacing: -0.3,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Expanded(
                        child: ElevatedButton.icon(
                          onPressed: _openNotes,
                          icon: const Icon(Icons.download_rounded, size: 15),
                          label: Text(
                            'Free Notes',
                            style: GoogleFonts.dmSans(fontWeight: FontWeight.w800, fontSize: 12.5),
                          ),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.white,
                            foregroundColor: AppTheme.primaryNavy,
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 11),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          ),
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: ElevatedButton.icon(
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (_) => PharmaHelperScreen(
                                  attachedSubject: widget.subject,
                                ),
                              ),
                            );
                          },
                          icon: const PharmaMascotWidget(size: 20),
                          label: Text(
                            'Ask AI Tutor',
                            style: GoogleFonts.dmSans(fontWeight: FontWeight.w800, fontSize: 12.5),
                          ),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF38BDF8),
                            foregroundColor: const Color(0xFF0F172A),
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 11),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // ── Course Objectives ────────────────────────────────────
            if (s.objectives.isNotEmpty) ...[
              Text(
                'Course Objectives',
                style: GoogleFonts.dmSans(
                  color: AppTheme.primaryNavy,
                  fontSize: 17,
                  fontWeight: FontWeight.w900,
                  letterSpacing: -0.2,
                ),
              ),
              const SizedBox(height: 10),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppTheme.borderSoft, width: 1.5),
                ),
                child: Column(
                  children: s.objectives.map((obj) {
                    final cleanObj = obj.replaceAll('**', '').replaceAll('*', '').trim();
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 10),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Padding(
                            padding: EdgeInsets.only(top: 2),
                            child: Icon(Icons.check_circle_rounded, size: 16, color: AppTheme.brandGreen),
                          ),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Text(
                              cleanObj,
                              style: GoogleFonts.dmSans(
                                color: AppTheme.textDark,
                                fontSize: 13,
                                height: 1.45,
                              ),
                            ),
                          ),
                        ],
                      ),
                    );
                  }).toList(),
                ),
              ),
              const SizedBox(height: 24),
            ],

            // ── Units Breakdown ──────────────────────────────────────
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Units Breakdown (${s.units.length} Units)',
                  style: GoogleFonts.dmSans(
                    color: AppTheme.primaryNavy,
                    fontSize: 17,
                    fontWeight: FontWeight.w900,
                    letterSpacing: -0.2,
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: const Color(0xFFEEF2FF),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    'PCI NEP 2020',
                    style: GoogleFonts.dmSans(
                      color: const Color(0xFF4338CA),
                      fontSize: 11,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),

            if (s.units.isEmpty)
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppTheme.borderSoft, width: 1.5),
                ),
                child: Text(
                  'Practical / Project curriculum follows university laboratory manual & continuous assessment criteria.',
                  style: GoogleFonts.dmSans(color: AppTheme.textMuted, fontSize: 13),
                ),
              )
            else
              ListView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: s.units.length,
                itemBuilder: (context, index) {
                  final unit = s.units[index];
                  return Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppTheme.borderSoft, width: 1.5),
                    ),
                    child: Theme(
                      data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
                      child: ExpansionTile(
                        initiallyExpanded: index == 0,
                        tilePadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
                        leading: Container(
                          width: 40,
                          height: 40,
                          decoration: BoxDecoration(
                            gradient: const LinearGradient(
                              colors: [Color(0xFFEEF2FF), Color(0xFFE0E7FF)],
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                            ),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: const Color(0xFFC7D2FE), width: 1),
                          ),
                          alignment: Alignment.center,
                          child: FittedBox(
                            fit: BoxFit.scaleDown,
                            child: Padding(
                              padding: const EdgeInsets.symmetric(horizontal: 4),
                              child: Text(
                                unit.num,
                                style: GoogleFonts.dmSans(
                                  color: const Color(0xFF3730A3),
                                  fontWeight: FontWeight.w900,
                                  fontSize: 12.5,
                                ),
                              ),
                            ),
                          ),
                        ),
                        title: Text(
                          unit.title,
                          style: GoogleFonts.dmSans(
                            color: AppTheme.primaryNavy,
                            fontWeight: FontWeight.w800,
                            fontSize: 13.5,
                            height: 1.3,
                          ),
                        ),
                        subtitle: Padding(
                          padding: const EdgeInsets.only(top: 4),
                          child: Row(
                            children: [
                              if (unit.hours.isNotEmpty) ...[
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFFF1F5F9),
                                    borderRadius: BorderRadius.circular(6),
                                  ),
                                  child: Text(
                                    unit.hours,
                                    style: GoogleFonts.dmSans(
                                      color: const Color(0xFF475569),
                                      fontSize: 10.5,
                                      fontWeight: FontWeight.w700,
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 8),
                              ],
                              Text(
                                '${unit.topics.length} topics',
                                style: GoogleFonts.dmSans(
                                  color: AppTheme.textMuted,
                                  fontSize: 11,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ],
                          ),
                        ),
                        childrenPadding: const EdgeInsets.fromLTRB(16, 4, 16, 16),
                        children: [
                          const Divider(color: Color(0xFFF0F4FF), height: 1),
                          const SizedBox(height: 12),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: unit.topics.map(_buildTopicItem).toList(),
                          ),
                          const SizedBox(height: 12),
                          SizedBox(
                            width: double.infinity,
                            child: OutlinedButton.icon(
                              onPressed: () {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (_) => PharmaHelperScreen(
                                      attachedSubject: widget.subject,
                                      initialPrompt: 'Explain Unit ${unit.num}: ${unit.title} in detail with important 5-mark and 10-mark exam questions.',
                                    ),
                                  ),
                                );
                              },
                              icon: const PharmaMascotWidget(size: 18, showBadge: false),
                              label: Text(
                                'Explain Unit ${unit.num} with AI Tutor',
                                style: GoogleFonts.dmSans(fontWeight: FontWeight.w800, fontSize: 12),
                              ),
                              style: OutlinedButton.styleFrom(
                                foregroundColor: const Color(0xFF2563EB),
                                side: const BorderSide(color: Color(0xFFBFDBFE)),
                                padding: const EdgeInsets.symmetric(vertical: 8),
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),

            const SizedBox(height: 24),

            // ── Textbooks & References ───────────────────────────────
            if (s.references.isNotEmpty) ...[
              Text(
                'Recommended Textbooks & References',
                style: GoogleFonts.dmSans(
                  color: AppTheme.primaryNavy,
                  fontSize: 17,
                  fontWeight: FontWeight.w900,
                  letterSpacing: -0.2,
                ),
              ),
              const SizedBox(height: 10),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppTheme.borderSoft, width: 1.5),
                ),
                child: Column(
                  children: s.references.map((ref) {
                    final cleanRef = ref.replaceAll('**', '').replaceAll('*', '').trim();
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 10),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Padding(
                            padding: EdgeInsets.only(top: 2),
                            child: Icon(Icons.menu_book_rounded, size: 16, color: AppTheme.brandBlue),
                          ),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Text(
                              cleanRef,
                              style: GoogleFonts.dmSans(
                                color: AppTheme.textDark,
                                fontSize: 13,
                                height: 1.4,
                              ),
                            ),
                          ),
                        ],
                      ),
                    );
                  }).toList(),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
