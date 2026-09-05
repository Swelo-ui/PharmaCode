import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:share_plus/share_plus.dart';

import '../../core/theme.dart';
import '../../models/ai_bookmark_model.dart';
import '../../services/ai_bookmark_service.dart';
import '../../widgets/pharma_markdown_widget.dart';
import '../../widgets/pharma_mascot_widget.dart';
import '../ai/pharma_helper_screen.dart';

class AiNoteDetailScreen extends StatefulWidget {
  final AiBookmark bookmark;

  const AiNoteDetailScreen({super.key, required this.bookmark});

  @override
  State<AiNoteDetailScreen> createState() => _AiNoteDetailScreenState();
}

class _AiNoteDetailScreenState extends State<AiNoteDetailScreen> {
  double _baseFontSize = 14.0;
  static const double _minFontSize = 11.5;
  static const double _maxFontSize = 20.0;

  void _zoomIn() {
    if (_baseFontSize < _maxFontSize) {
      setState(() => _baseFontSize += 1.5);
    }
  }

  void _zoomOut() {
    if (_baseFontSize > _minFontSize) {
      setState(() => _baseFontSize -= 1.5);
    }
  }

  void _copyAll(BuildContext context) {
    final fullText = '${widget.bookmark.question}\n\n${widget.bookmark.answer}';
    Clipboard.setData(ClipboardData(text: fullText));
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          'Note copied to clipboard!',
          style: GoogleFonts.dmSans(fontWeight: FontWeight.w600),
        ),
        backgroundColor: AppTheme.primaryNavy,
        behavior: SnackBarBehavior.floating,
        duration: const Duration(seconds: 1),
      ),
    );
  }

  void _shareContent() {
    SharePlus.instance.share(
      ShareParams(
        text:
            '${widget.bookmark.question}\n\n${widget.bookmark.answer}\n\n---\nStudied via PharmaCode AI Tutor',
        subject: widget.bookmark.question.isNotEmpty
            ? widget.bookmark.question
            : 'PharmaCode AI Note',
      ),
    );
  }

  Future<void> _confirmDelete(BuildContext context) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Text(
          'Delete Note?',
          style: GoogleFonts.dmSans(fontWeight: FontWeight.w800, color: AppTheme.primaryNavy),
        ),
        content: Text(
          'Are you sure you want to remove this saved AI note from your bookmarks?',
          style: GoogleFonts.inter(fontSize: 13, color: const Color(0xFF475569)),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: Text('Cancel', style: GoogleFonts.dmSans(color: const Color(0xFF64748B))),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(ctx, true),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFEF4444),
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            ),
            child: Text('Delete', style: GoogleFonts.dmSans(fontWeight: FontWeight.w700)),
          ),
        ],
      ),
    );

    if (confirmed == true && context.mounted) {
      await AiBookmarkService.instance.deleteBookmark(widget.bookmark.id);
      if (context.mounted) {
        Navigator.pop(context);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Note deleted'),
            behavior: SnackBarBehavior.floating,
            duration: Duration(seconds: 1),
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final bm = widget.bookmark;

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded, color: AppTheme.primaryNavy),
          onPressed: () => Navigator.pop(context),
        ),
        title: Row(
          children: [
            const PharmaMascotWidget(size: 24, state: MascotState.idle, showBadge: false),
            const SizedBox(width: 8),
            Flexible(
              child: Text(
                bm.subjectCode != null && bm.subjectCode!.isNotEmpty
                    ? bm.subjectCode!
                    : 'AI Note Reader',
                overflow: TextOverflow.ellipsis,
                style: GoogleFonts.dmSans(
                  color: AppTheme.primaryNavy,
                  fontWeight: FontWeight.w800,
                  fontSize: 16,
                ),
              ),
            ),
          ],
        ),
        actions: [
          // Zoom Out button
          IconButton(
            icon: const Icon(Icons.text_decrease_rounded, size: 20, color: Color(0xFF475569)),
            tooltip: 'Decrease font size',
            onPressed: _zoomOut,
          ),
          // Zoom In button
          IconButton(
            icon: const Icon(Icons.text_increase_rounded, size: 20, color: Color(0xFF475569)),
            tooltip: 'Increase font size',
            onPressed: _zoomIn,
          ),
          // Copy button
          IconButton(
            icon: const Icon(Icons.copy_rounded, size: 19, color: Color(0xFF475569)),
            tooltip: 'Copy Note',
            onPressed: () => _copyAll(context),
          ),
          // Share button
          IconButton(
            icon: const Icon(Icons.share_rounded, size: 19, color: Color(0xFF475569)),
            tooltip: 'Share Note',
            onPressed: _shareContent,
          ),
        ],
      ),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Question Banner Card
            if (bm.question.trim().isNotEmpty) ...[
              Container(
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFFEFF6FF), Color(0xFFDBEAFE)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFFBFDBFE), width: 1.2),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFF2563EB).withValues(alpha: 0.06),
                      blurRadius: 10,
                      offset: const Offset(0, 3),
                    ),
                  ],
                ),
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(6),
                          decoration: BoxDecoration(
                            color: const Color(0xFF2563EB),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: const Icon(
                            Icons.psychology_rounded,
                            size: 16,
                            color: Colors.white,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          'Question / Topic',
                          style: GoogleFonts.dmSans(
                            color: const Color(0xFF1E40AF),
                            fontWeight: FontWeight.w800,
                            fontSize: 12.5,
                            letterSpacing: 0.3,
                          ),
                        ),
                        const Spacer(),
                        if (bm.subjectCode != null && bm.subjectCode!.isNotEmpty)
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(6),
                              border: Border.all(color: const Color(0xFF93C5FD)),
                            ),
                            child: Text(
                              bm.subjectCode!,
                              style: GoogleFonts.dmSans(
                                color: const Color(0xFF1D4ED8),
                                fontWeight: FontWeight.w800,
                                fontSize: 11,
                              ),
                            ),
                          ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    SelectableText(
                      bm.question,
                      style: GoogleFonts.dmSans(
                        color: AppTheme.primaryNavy,
                        fontWeight: FontWeight.w700,
                        fontSize: 15,
                        height: 1.35,
                      ),
                    ),
                    if (bm.subjectName != null && bm.subjectName!.isNotEmpty) ...[
                      const SizedBox(height: 6),
                      Text(
                        bm.subjectName!,
                        style: GoogleFonts.inter(
                          color: const Color(0xFF475569),
                          fontSize: 11.5,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ],
                ),
              ),
              const SizedBox(height: 14),
            ],

            // Note Meta Bar: Mode, Provider & Date
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Row(
                children: [
                  const Icon(Icons.verified_rounded, size: 14, color: Color(0xFF10B981)),
                  const SizedBox(width: 6),
                  Text(
                    'AI Tutor Response',
                    style: GoogleFonts.dmSans(
                      fontSize: 11.5,
                      fontWeight: FontWeight.w700,
                      color: const Color(0xFF0F172A),
                    ),
                  ),
                  if (bm.providerUsed != null && bm.providerUsed!.isNotEmpty) ...[
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF1F5F9),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        bm.providerUsed!,
                        style: GoogleFonts.inter(
                          fontSize: 9.5,
                          fontWeight: FontWeight.w600,
                          color: const Color(0xFF475569),
                        ),
                      ),
                    ),
                  ],
                  const Spacer(),
                  Text(
                    '${bm.timestamp.day}/${bm.timestamp.month}/${bm.timestamp.year}',
                    style: GoogleFonts.inter(
                      fontSize: 11,
                      color: const Color(0xFF94A3B8),
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 14),

            // AI Answer Full-Width Card (Supports Markdown, Formatted Tables, Terminal Code Blocks)
            Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFFE2E8F0), width: 1.2),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.03),
                    blurRadius: 12,
                    offset: const Offset(0, 3),
                  ),
                ],
              ),
              padding: const EdgeInsets.all(16),
              child: PharmaMarkdownWidget(
                text: bm.answer,
                baseFontSize: _baseFontSize,
              ),
            ),

            const SizedBox(height: 20),

            // Action Buttons at Bottom
            Row(
              children: [
                // Ask follow-up
                Expanded(
                  flex: 2,
                  child: ElevatedButton.icon(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => PharmaHelperScreen(
                            initialPrompt: bm.question,
                            initialContextTitle: bm.subjectCode ?? bm.subjectName,
                          ),
                        ),
                      );
                    },
                    icon: const Icon(Icons.auto_awesome_rounded, size: 16),
                    label: Text(
                      'Ask Follow-up in AI',
                      style: GoogleFonts.dmSans(fontWeight: FontWeight.w700, fontSize: 13),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.brandBlue,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      elevation: 0,
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                // Delete button
                IconButton.filledTonal(
                  onPressed: () => _confirmDelete(context),
                  icon: const Icon(Icons.delete_outline_rounded, color: Color(0xFFEF4444), size: 20),
                  tooltip: 'Delete Note',
                  style: IconButton.styleFrom(
                    backgroundColor: const Color(0xFFFEE2E2),
                    padding: const EdgeInsets.all(12),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }
}
