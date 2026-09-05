import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:share_plus/share_plus.dart';
import '../../core/in_app_browser.dart';
import '../../core/theme.dart';
import '../../models/syllabus_models.dart';
import '../../services/syllabus_service.dart';
import '../ai/pharma_helper_screen.dart';
import '../../widgets/pharma_mascot_widget.dart';

class SubjectDetailScreen extends StatefulWidget {
  final Subject subject;

  const SubjectDetailScreen({super.key, required this.subject});

  @override
  State<SubjectDetailScreen> createState() => _SubjectDetailScreenState();
}

class _SubjectDetailScreenState extends State<SubjectDetailScreen> {
  late bool _isBookmarked;

  @override
  void initState() {
    super.initState();
    _isBookmarked = SyllabusService().isBookmarked(widget.subject.code);
  }

  void _toggleBookmark() async {
    final status = await SyllabusService().toggleBookmark(widget.subject.code);
    setState(() {
      _isBookmarked = status;
    });
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

  @override
  Widget build(BuildContext context) {
    final s = widget.subject;

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
              _isBookmarked ? Icons.bookmark_rounded : Icons.bookmark_outline_rounded,
              color: _isBookmarked ? AppTheme.brandAmber : AppTheme.primaryNavy,
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
                  Row(
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
                      const SizedBox(width: 8),
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
                      const Spacer(),
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
                          width: 36,
                          height: 36,
                          decoration: BoxDecoration(
                            color: const Color(0xFFEEF2FF),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          alignment: Alignment.center,
                          child: Text(
                            unit.num,
                            style: GoogleFonts.dmSans(
                              color: const Color(0xFF4C6EF5),
                              fontWeight: FontWeight.w900,
                              fontSize: 12,
                            ),
                          ),
                        ),
                        title: Text(
                          unit.title,
                          style: GoogleFonts.dmSans(
                            color: AppTheme.primaryNavy,
                            fontWeight: FontWeight.w800,
                            fontSize: 13,
                          ),
                        ),
                        subtitle: unit.hours.isNotEmpty
                            ? Text(
                                unit.hours,
                                style: GoogleFonts.dmSans(
                                  color: AppTheme.textMuted,
                                  fontSize: 11,
                                  fontWeight: FontWeight.w600,
                                ),
                              )
                            : null,
                        childrenPadding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                        children: [
                          const Divider(color: Color(0xFFF0F4FF), height: 1),
                          const SizedBox(height: 12),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: unit.topics.map((t) {
                              final cleanT = t.replaceAll('**', '').replaceAll('*', '').trim();
                              return Padding(
                                padding: const EdgeInsets.only(bottom: 8),
                                child: Row(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Container(
                                      margin: const EdgeInsets.only(top: 6),
                                      width: 6,
                                      height: 6,
                                      decoration: const BoxDecoration(
                                        color: Color(0xFF4C6EF5),
                                        shape: BoxShape.circle,
                                      ),
                                    ),
                                    const SizedBox(width: 10),
                                    Expanded(
                                      child: Text(
                                        cleanT,
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
