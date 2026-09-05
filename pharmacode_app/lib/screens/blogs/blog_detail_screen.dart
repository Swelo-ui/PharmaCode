import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:share_plus/share_plus.dart';
import '../../core/animations.dart';
import '../../core/in_app_browser.dart';
import '../../core/theme.dart';
import '../../models/blog_model.dart';
import '../ai/pharma_helper_screen.dart';
import '../../widgets/pharma_mascot_widget.dart';

class BlogDetailScreen extends StatefulWidget {
  final Blog blog;

  const BlogDetailScreen({super.key, required this.blog});

  @override
  State<BlogDetailScreen> createState() => _BlogDetailScreenState();
}

class _BlogDetailScreenState extends State<BlogDetailScreen> {
  final ScrollController _scrollController = ScrollController();
  double _readingProgress = 0.0;

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_onScroll);
  }

  void _onScroll() {
    if (!_scrollController.hasClients) return;
    final maxScroll = _scrollController.position.maxScrollExtent;
    final currentScroll = _scrollController.position.pixels;
    if (maxScroll > 0) {
      final progress = (currentScroll / maxScroll).clamp(0.0, 1.0);
      if ((progress - _readingProgress).abs() > 0.005) {
        setState(() {
          _readingProgress = progress;
        });
      }
    }
  }

  @override
  void dispose() {
    _scrollController.removeListener(_onScroll);
    _scrollController.dispose();
    super.dispose();
  }

  void _openActionUrl() {
    if (widget.blog.actionUrl.isNotEmpty) {
      openInAppUrl(context, widget.blog.actionUrl);
    }
  }

  void _shareBlog() {
    SharePlus.instance.share(
      ShareParams(
        text: '📖 ${widget.blog.title}\n\n'
            '${widget.blog.description}\n\n'
            'Read full guide on PharmaCode:\n${widget.blog.actionUrl.isNotEmpty ? widget.blog.actionUrl : "https://pharmacode.vercel.app/blog/"}',
        subject: widget.blog.title,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final blogColor = AppTheme.parseHex(widget.blog.colorHex);
    final blogBg = AppTheme.parseHex(widget.blog.bgHex);

    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        title: Text(
          widget.blog.tag,
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
                    initialPrompt: 'Please explain the core concepts, interview questions, and key takeaways for "${widget.blog.title}" in simple Hinglish with mnemonics.',
                    initialContextTitle: widget.blog.title,
                  ),
                ),
              );
            },
            tooltip: 'Ask PharmaHelper',
          ),
          IconButton(
            icon: const Icon(Icons.share_rounded, color: AppTheme.primaryNavy),
            onPressed: _shareBlog,
            tooltip: 'Share Guide',
          ),
        ],
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(3),
          child: ReadingProgressBar(
            progress: _readingProgress,
            color: blogColor,
          ),
        ),
      ),
      bottomNavigationBar: widget.blog.actionUrl.isNotEmpty
          ? Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: BoxDecoration(
                color: Colors.white,
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.06),
                    blurRadius: 10,
                    offset: const Offset(0, -3),
                  ),
                ],
                border: const Border(top: BorderSide(color: AppTheme.borderSoft)),
              ),
              child: SafeArea(
                child: SizedBox(
                  height: 48,
                  child: ElevatedButton.icon(
                    onPressed: _openActionUrl,
                    icon: const Icon(Icons.open_in_browser_rounded, size: 18),
                    label: Text(
                      widget.blog.actionLabel,
                      style: GoogleFonts.dmSans(fontWeight: FontWeight.w900, fontSize: 13.5),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: blogColor,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                  ),
                ),
              ),
            )
          : null,
      body: SingleChildScrollView(
        controller: _scrollController,
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.fromLTRB(16, 14, 16, 36),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ── Header Badges ──────────────────────────────────────────
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: blogBg,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: blogColor.withValues(alpha: 0.3)),
                  ),
                  child: Text(
                    widget.blog.tag,
                    style: GoogleFonts.dmSans(
                      color: blogColor,
                      fontWeight: FontWeight.w900,
                      fontSize: 11,
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                Text(
                  '${widget.blog.date} · ${widget.blog.readTime}',
                  style: GoogleFonts.dmSans(
                    color: AppTheme.textMuted,
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),

            // ── Title ──────────────────────────────────────────────────
            Text(
              widget.blog.title,
              style: GoogleFonts.dmSans(
                color: AppTheme.primaryNavy,
                fontSize: 21,
                fontWeight: FontWeight.w900,
                height: 1.25,
                letterSpacing: -0.4,
              ),
            ),
            const SizedBox(height: 14),

            // ── Overview Summary Box ───────────────────────────────────
            Container(
              padding: const EdgeInsets.all(16),
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
              child: Text(
                widget.blog.description,
                style: GoogleFonts.dmSans(
                  color: AppTheme.textBody,
                  fontSize: 13,
                  height: 1.55,
                ),
              ),
            ),
            const SizedBox(height: 18),

            // ── Main Article Sections ──────────────────────────────────
            ..._buildStructuredSections(widget.blog.content, blogColor, blogBg),

            const SizedBox(height: 20),

            // ── Web Reference Card ─────────────────────────────────────
            if (widget.blog.actionUrl.isNotEmpty)
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFFF8FAFF),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFFE0E8FF), width: 1.5),
                ),
                child: Column(
                  children: [
                    Text(
                      'Access Complete Resources & Official Files',
                      textAlign: TextAlign.center,
                      style: GoogleFonts.dmSans(
                        color: AppTheme.primaryNavy,
                        fontSize: 14.5,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      'Download PDF guides, verify certification eligibility, and access supplementary question banks directly online.',
                      textAlign: TextAlign.center,
                      style: GoogleFonts.dmSans(color: AppTheme.textMuted, fontSize: 12, height: 1.4),
                    ),
                    const SizedBox(height: 12),
                    ElevatedButton.icon(
                      onPressed: _openActionUrl,
                      icon: const Icon(Icons.open_in_browser_rounded, size: 16),
                      label: Text(
                        widget.blog.actionLabel,
                        style: GoogleFonts.dmSans(fontWeight: FontWeight.w800, fontSize: 12.5),
                      ),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: blogColor,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                    ),
                  ],
                ),
              ),
          ],
        ),
      ),
    );
  }

  List<Widget> _buildStructuredSections(String content, Color accentColor, Color bgAccent) {
    final List<Widget> widgets = [];
    final rawSections = content.split('SECTION:');

    for (var raw in rawSections) {
      if (raw.trim().isEmpty) continue;
      final lines = raw.trim().split('\n');
      final header = lines.first.trim();
      final bodyLines = lines.skip(1).where((l) => l.trim().isNotEmpty).toList();

      widgets.add(
        Container(
          width: double.infinity,
          margin: const EdgeInsets.only(bottom: 16),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppTheme.borderSoft, width: 1.5),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    width: 4,
                    height: 18,
                    decoration: BoxDecoration(
                      color: accentColor,
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      header,
                      style: GoogleFonts.dmSans(
                        color: AppTheme.primaryNavy,
                        fontSize: 16,
                        fontWeight: FontWeight.w900,
                        letterSpacing: -0.2,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              ...bodyLines.map((line) {
                final cleanLine = line.replaceAll('**', '').replaceAll('*', '').trim();

                // Check if this is a Q&A question
                if (cleanLine.startsWith('Q1:') ||
                    cleanLine.startsWith('Q2:') ||
                    cleanLine.startsWith('Q3:') ||
                    cleanLine.startsWith('Q4:') ||
                    cleanLine.startsWith('Q5:')) {
                  return Container(
                    margin: const EdgeInsets.only(top: 8, bottom: 4),
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    decoration: BoxDecoration(
                      color: bgAccent,
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: accentColor.withValues(alpha: 0.2)),
                    ),
                    child: Text(
                      cleanLine,
                      style: GoogleFonts.dmSans(
                        color: accentColor,
                        fontWeight: FontWeight.w900,
                        fontSize: 13,
                      ),
                    ),
                  );
                }

                // Check if this is a Q&A answer
                if (cleanLine.startsWith('Answer:')) {
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 12, left: 4, right: 4),
                    child: Text(
                      cleanLine.replaceFirst('Answer:', '').trim(),
                      style: GoogleFonts.dmSans(
                        color: AppTheme.textDark,
                        fontSize: 12.5,
                        height: 1.5,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  );
                }

                // Check if this is a chapter or course bullet
                final isChapter = cleanLine.startsWith('Chapter') ||
                    cleanLine.startsWith('Course') ||
                    cleanLine.startsWith('Module');

                return Padding(
                  padding: const EdgeInsets.only(bottom: 8),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        margin: const EdgeInsets.only(top: 6, right: 8),
                        width: isChapter ? 6 : 5,
                        height: isChapter ? 6 : 5,
                        decoration: BoxDecoration(
                          color: isChapter ? accentColor : AppTheme.textMuted,
                          shape: BoxShape.circle,
                        ),
                      ),
                      Expanded(
                        child: Text(
                          cleanLine,
                          style: GoogleFonts.dmSans(
                            color: isChapter ? AppTheme.primaryNavy : AppTheme.textDark,
                            fontSize: 12.5,
                            fontWeight: isChapter ? FontWeight.w700 : FontWeight.w500,
                            height: 1.48,
                          ),
                        ),
                      ),
                    ],
                  ),
                );
              }),
            ],
          ),
        ),
      );
    }

    return widgets;
  }
}
