import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:share_plus/share_plus.dart';

import '../../core/constants/app_spacing.dart';
import '../../core/theme.dart';
import '../../core/widgets/ad_banner_widget.dart';
import '../../core/widgets/empty_state_view.dart';
import '../../features/bookmarks/presentation/bookmarks_controller.dart';
import '../../models/ai_bookmark_model.dart';
import '../../services/ai_bookmark_service.dart';
import '../../widgets/pharma_markdown_widget.dart';
import '../../widgets/pharma_mascot_widget.dart';
import '../ai/pharma_helper_screen.dart';
import '../syllabus/subject_detail_screen.dart';

class BookmarksScreen extends ConsumerStatefulWidget {
  const BookmarksScreen({super.key});

  @override
  ConsumerState<BookmarksScreen> createState() => _BookmarksScreenState();
}

class _BookmarksScreenState extends ConsumerState<BookmarksScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final TextEditingController _searchCtrl = TextEditingController();
  String _searchQuery = '';
  final Set<String> _expandedBookmarkIds = {};

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    _searchCtrl.dispose();
    super.dispose();
  }

  void _copyToClipboard(String text) {
    Clipboard.setData(ClipboardData(text: text));
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Copied to clipboard!'),
        behavior: SnackBarBehavior.floating,
        duration: Duration(seconds: 1),
      ),
    );
  }

  void _shareContent(String title, String text) {
    SharePlus.instance.share(
      ShareParams(
        text: '$title\n\n$text\n\nStudied via PharmaCode — Complete B.Pharm Companion',
        subject: title,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final bookmarkedSubjects = ref.watch(bookmarkedSubjectsProvider);

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: Text(
          'Saved Bookmarks',
          style: GoogleFonts.dmSans(
            fontWeight: FontWeight.w800,
            fontSize: 18,
            color: AppTheme.primaryNavy,
          ),
        ),
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: false,
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(48),
          child: Container(
            margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
            padding: const EdgeInsets.all(3),
            decoration: BoxDecoration(
              color: const Color(0xFFF1F5F9),
              borderRadius: BorderRadius.circular(12),
            ),
            child: ValueListenableBuilder<List<AiBookmark>>(
              valueListenable: AiBookmarkService.instance.bookmarksNotifier,
              builder: (context, aiBookmarks, _) {
                return TabBar(
                  controller: _tabController,
                  indicator: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(9),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.05),
                        blurRadius: 4,
                        offset: const Offset(0, 1),
                      ),
                    ],
                  ),
                  labelColor: AppTheme.brandBlue,
                  unselectedLabelColor: const Color(0xFF64748B),
                  labelStyle: GoogleFonts.dmSans(fontSize: 13, fontWeight: FontWeight.w700),
                  unselectedLabelStyle: GoogleFonts.dmSans(fontSize: 13, fontWeight: FontWeight.w600),
                  indicatorSize: TabBarIndicatorSize.tab,
                  dividerColor: Colors.transparent,
                  tabs: [
                    Tab(
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(Icons.book_rounded, size: 16),
                          const SizedBox(width: 6),
                          Text('Syllabus (${bookmarkedSubjects.length})'),
                        ],
                      ),
                    ),
                    Tab(
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(Icons.auto_awesome_rounded, size: 15),
                          const SizedBox(width: 6),
                          Text('AI Notes (${aiBookmarks.length})'),
                        ],
                      ),
                    ),
                  ],
                );
              },
            ),
          ),
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildSyllabusTab(bookmarkedSubjects),
          _buildAiNotesTab(),
        ],
      ),
    );
  }

  Widget _buildSyllabusTab(List<dynamic> bookmarkedSubjects) {
    if (bookmarkedSubjects.isEmpty) {
      return const EmptyStateView(
        icon: Icons.bookmark_outline_rounded,
        title: 'No Subjects Bookmarked Yet',
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

  Widget _buildAiNotesTab() {
    return ValueListenableBuilder<List<AiBookmark>>(
      valueListenable: AiBookmarkService.instance.bookmarksNotifier,
      builder: (context, bookmarks, _) {
        if (bookmarks.isEmpty) {
          return const EmptyStateView(
            icon: Icons.auto_awesome_rounded,
            title: 'No Saved AI Notes Yet',
            message: 'PharmaHelper AI Tutor me kisi bhi answer ke neeche "Save" button tap karein. Bo notes yaha store honge aur aapke cloud account se sync rahenge.',
          );
        }

        final filtered = _searchQuery.trim().isEmpty
            ? bookmarks
            : bookmarks.where((b) =>
                b.question.toLowerCase().contains(_searchQuery.toLowerCase()) ||
                b.answer.toLowerCase().contains(_searchQuery.toLowerCase()) ||
                (b.subjectCode?.toLowerCase().contains(_searchQuery.toLowerCase()) ?? false)).toList();

        return Column(
          children: [
            // Search Input
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
              child: Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: TextField(
                  controller: _searchCtrl,
                  onChanged: (val) => setState(() => _searchQuery = val),
                  style: GoogleFonts.inter(fontSize: 13),
                  decoration: InputDecoration(
                    hintText: 'Search saved questions, topics, or code...',
                    hintStyle: GoogleFonts.inter(fontSize: 13, color: const Color(0xFF94A3B8)),
                    prefixIcon: const Icon(Icons.search_rounded, size: 18, color: Color(0xFF64748B)),
                    suffixIcon: _searchQuery.isNotEmpty
                        ? IconButton(
                            icon: const Icon(Icons.close_rounded, size: 16),
                            onPressed: () {
                              _searchCtrl.clear();
                              setState(() => _searchQuery = '');
                            },
                          )
                        : null,
                    border: InputBorder.none,
                    contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                  ),
                ),
              ),
            ),
            Expanded(
              child: ListView.separated(
                padding: const EdgeInsets.fromLTRB(16, 4, 16, 16),
                itemCount: filtered.length,
                separatorBuilder: (ctx, idx) => const SizedBox(height: 14),
                itemBuilder: (context, index) {
                  final item = filtered[index];
                  final isExpanded = _expandedBookmarkIds.contains(item.id);
                  final isLongContent = item.answer.length > 500;

                  return Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: const Color(0xFFE2E8F0), width: 1.2),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.03),
                          blurRadius: 10,
                          offset: const Offset(0, 3),
                        ),
                      ],
                    ),
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Card Header: PharmaHelper Branding & Subject Badge (Matching AI Tutor)
                        Row(
                          children: [
                            const PharmaMascotWidget(
                              size: 26,
                              state: MascotState.idle,
                              showBadge: false,
                            ),
                            const SizedBox(width: 8),
                            Text(
                              'PharmaHelper',
                              style: GoogleFonts.dmSans(
                                fontWeight: FontWeight.w700,
                                fontSize: 13,
                                color: AppTheme.primaryNavy,
                              ),
                            ),
                            if (item.subjectCode != null && item.subjectCode!.isNotEmpty) ...[
                              const SizedBox(width: 6),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2.5),
                                decoration: BoxDecoration(
                                  color: const Color(0xFFEEF2FF),
                                  borderRadius: BorderRadius.circular(6),
                                  border: Border.all(color: const Color(0xFFC7D2FE)),
                                ),
                                child: Text(
                                  item.subjectCode!,
                                  style: GoogleFonts.dmSans(
                                    color: const Color(0xFF3730A3),
                                    fontWeight: FontWeight.w800,
                                    fontSize: 10,
                                  ),
                                ),
                              ),
                            ],
                            if (item.providerUsed != null) ...[
                              const SizedBox(width: 6),
                              Flexible(
                                child: Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFFF1F5F9),
                                    borderRadius: BorderRadius.circular(6),
                                  ),
                                  child: Text(
                                    item.providerUsed!,
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: GoogleFonts.inter(
                                      fontSize: 9,
                                      fontWeight: FontWeight.w600,
                                      color: const Color(0xFF475569),
                                    ),
                                  ),
                                ),
                              ),
                            ],
                            const Spacer(),
                            IconButton(
                              constraints: const BoxConstraints(minWidth: 32, minHeight: 32),
                              padding: EdgeInsets.zero,
                              icon: const Icon(Icons.delete_outline_rounded, color: Color(0xFFEF4444), size: 19),
                              tooltip: 'Delete Note',
                              onPressed: () async {
                                await AiBookmarkService.instance.deleteBookmark(item.id);
                                if (context.mounted) {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    const SnackBar(
                                      content: Text('Bookmark removed'),
                                      duration: Duration(seconds: 1),
                                      behavior: SnackBarBehavior.floating,
                                    ),
                                  );
                                }
                              },
                            ),
                          ],
                        ),

                        // Question Banner
                        if (item.question.trim().isNotEmpty) ...[
                          const SizedBox(height: 10),
                          Container(
                            width: double.infinity,
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                            decoration: BoxDecoration(
                              color: const Color(0xFFF8FAFC),
                              borderRadius: BorderRadius.circular(10),
                              border: const Border(
                                left: BorderSide(color: Color(0xFF2563EB), width: 3),
                              ),
                            ),
                            child: Row(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Padding(
                                  padding: EdgeInsets.only(top: 2),
                                  child: Icon(Icons.psychology_alt_rounded, size: 15, color: Color(0xFF2563EB)),
                                ),
                                const SizedBox(width: 8),
                                Expanded(
                                  child: Text(
                                    item.question,
                                    style: GoogleFonts.dmSans(
                                      color: AppTheme.primaryNavy,
                                      fontWeight: FontWeight.w700,
                                      fontSize: 13.5,
                                      height: 1.35,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],

                        const SizedBox(height: 12),

                        // Formatted Answer (Same UI/UX as AI Tutor with Terminal Code Blocks & Tables)
                        Stack(
                          children: [
                            ConstrainedBox(
                              constraints: BoxConstraints(
                                maxHeight: (!isExpanded && isLongContent) ? 260 : double.infinity,
                              ),
                              child: ClipRect(
                                child: PharmaMarkdownWidget(
                                  text: item.answer,
                                  baseFontSize: 13.5,
                                ),
                              ),
                            ),
                            if (!isExpanded && isLongContent)
                              Positioned(
                                left: 0,
                                right: 0,
                                bottom: 0,
                                height: 70,
                                child: Container(
                                  decoration: BoxDecoration(
                                    gradient: LinearGradient(
                                      begin: Alignment.topCenter,
                                      end: Alignment.bottomCenter,
                                      colors: [
                                        Colors.white.withValues(alpha: 0.0),
                                        Colors.white.withValues(alpha: 0.95),
                                        Colors.white,
                                      ],
                                    ),
                                  ),
                                ),
                              ),
                          ],
                        ),

                        const SizedBox(height: 10),
                        const Divider(color: Color(0xFFF1F5F9), height: 1),
                        const SizedBox(height: 10),

                        // Actions Row: Open in AI, Copy, Share, Expand/Collapse
                        Row(
                          children: [
                            // Ask follow-up in AI Tutor
                            InkWell(
                              onTap: () {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (_) => PharmaHelperScreen(
                                      initialPrompt: item.question,
                                      initialContextTitle: item.subjectCode,
                                    ),
                                  ),
                                );
                              },
                              borderRadius: BorderRadius.circular(6),
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4.5),
                                decoration: BoxDecoration(
                                  color: const Color(0xFFEFF6FF),
                                  borderRadius: BorderRadius.circular(6),
                                  border: Border.all(color: const Color(0xFFBFDBFE)),
                                ),
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    const Icon(Icons.auto_awesome_rounded, size: 12, color: Color(0xFF1D4ED8)),
                                    const SizedBox(width: 4),
                                    Text(
                                      'Ask AI',
                                      style: GoogleFonts.inter(
                                        fontSize: 11,
                                        fontWeight: FontWeight.w700,
                                        color: const Color(0xFF1D4ED8),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                            const SizedBox(width: 8),

                            // Read Full / Show Less button
                            if (isLongContent)
                              InkWell(
                                onTap: () {
                                  setState(() {
                                    if (isExpanded) {
                                      _expandedBookmarkIds.remove(item.id);
                                    } else {
                                      _expandedBookmarkIds.add(item.id);
                                    }
                                  });
                                },
                                borderRadius: BorderRadius.circular(6),
                                child: Padding(
                                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 4),
                                  child: Row(
                                    children: [
                                      Text(
                                        isExpanded ? 'Show Less' : 'Read More',
                                        style: GoogleFonts.inter(
                                          fontSize: 11.5,
                                          fontWeight: FontWeight.w700,
                                          color: AppTheme.brandBlue,
                                        ),
                                      ),
                                      Icon(
                                        isExpanded ? Icons.keyboard_arrow_up_rounded : Icons.keyboard_arrow_down_rounded,
                                        size: 16,
                                        color: AppTheme.brandBlue,
                                      ),
                                    ],
                                  ),
                                ),
                              ),

                            const Spacer(),

                            // Copy
                            InkWell(
                              onTap: () => _copyToClipboard(item.answer),
                              borderRadius: BorderRadius.circular(6),
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4.5),
                                decoration: BoxDecoration(
                                  color: const Color(0xFFF1F5F9),
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: Row(
                                  children: [
                                    const Icon(Icons.copy_rounded, size: 12, color: Color(0xFF475569)),
                                    const SizedBox(width: 4),
                                    Text(
                                      'Copy',
                                      style: GoogleFonts.inter(
                                        fontSize: 11,
                                        fontWeight: FontWeight.w600,
                                        color: const Color(0xFF475569),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                            const SizedBox(width: 8),

                            // Share
                            InkWell(
                              onTap: () => _shareContent(item.question, item.answer),
                              borderRadius: BorderRadius.circular(6),
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4.5),
                                decoration: BoxDecoration(
                                  color: const Color(0xFFF1F5F9),
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: Row(
                                  children: [
                                    const Icon(Icons.share_rounded, size: 12, color: Color(0xFF475569)),
                                    const SizedBox(width: 4),
                                    Text(
                                      'Share',
                                      style: GoogleFonts.inter(
                                        fontSize: 11,
                                        fontWeight: FontWeight.w600,
                                        color: const Color(0xFF475569),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
            const AdBannerWidget(),
          ],
        );
      },
    );
  }
}
