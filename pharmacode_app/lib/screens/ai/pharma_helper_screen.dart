import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:share_plus/share_plus.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../core/theme.dart';
import '../../core/ads/ad_service.dart';
import '../../core/widgets/ad_banner_widget.dart';
import '../../models/syllabus_models.dart';
import '../../models/ai_bookmark_model.dart';
import '../../services/ai_bookmark_service.dart';
import '../../services/ai/ai_config.dart';
import '../../services/ai/ai_key_manager.dart';
import '../../services/ai/ai_rotation_service.dart';
import '../../services/ai/pharma_prompt_templates.dart';
import '../../widgets/pharma_mascot_widget.dart';
import '../../widgets/pharma_markdown_widget.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../auth/login_screen.dart';

class PharmaHelperScreen extends StatefulWidget {
  final String? initialPrompt;
  final String? initialContextTitle;
  final Subject? attachedSubject;

  const PharmaHelperScreen({
    super.key,
    this.initialPrompt,
    this.initialContextTitle,
    this.attachedSubject,
  });

  @override
  State<PharmaHelperScreen> createState() => _PharmaHelperScreenState();
}

class _PharmaHelperScreenState extends State<PharmaHelperScreen> {
  final TextEditingController _textCtrl = TextEditingController();
  final ScrollController _scrollCtrl = ScrollController();
  final AiRotationService _aiService = AiRotationService();
  final AiKeyManager _keyManager = AiKeyManager();

  final List<ChatMessage> _messages = [];
  bool _isLoading = false;
  PharmaChatMode _selectedMode = PharmaChatMode.tutorHinglish;
  bool _webSearchEnabled = false;
  Subject? _attachedSubject;
  int _queryCounter = 0;

  final List<String> _suggestedPrompts = [
    'Bioavailability simple Hinglish me samjhao',
    'Write a 5-mark answer on Tablet Capping & Lamination',
    'What are the 4 validity criteria in Pharmacovigilance ICSR?',
    'GPCR signaling pathway simple analogy se batao',
    'ICH Q1A stability testing guidelines summary',
    'Recent FDA approved antibody drugs search karo',
  ];

  @override
  void initState() {
    super.initState();
    _attachedSubject = widget.attachedSubject;

    if (_attachedSubject != null) {
      _loadSubjectGreeting(_attachedSubject!);
    } else {
      _loadInitialGreeting();
    }

    // If an initial prompt was passed (e.g. from Unit or Blog screen)
    if (widget.initialPrompt != null && widget.initialPrompt!.isNotEmpty) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        _handleSendMessage(widget.initialPrompt!);
      });
    }
  }

  void _loadSubjectGreeting(Subject s) {
    final unitsData = s.units.map((u) => {
      'num': u.num,
      'title': u.title,
      'hours': u.hours,
    }).toList();

    _messages.add(
      ChatMessage(
        id: 'subject_greeting',
        content: PharmaPromptTemplates.getSubjectInitialGreeting(
          code: s.code,
          name: s.name,
          credits: s.credits,
          typeLabel: s.typeLabel,
          units: unitsData,
        ),
        isUser: false,
        timestamp: DateTime.now(),
        providerUsed: 'PharmaLearn AI • ${s.code} Mentor',
      ),
    );

    // Setup dynamic suggestions specifically for this subject
    _suggestedPrompts.clear();
    _suggestedPrompts.addAll([
      '${s.code} ke high-weightage exam topics batao',
      'Unit 1: ${s.units.isNotEmpty ? s.units.first.title : "Introduction"} samjhao',
      'Top 5-mark and 10-mark exam questions',
      'Exam preparation strategy for ${s.code}',
      'Important definitions and mechanisms',
    ]);
  }

  void _loadInitialGreeting() {
    _messages.add(
      ChatMessage(
        id: 'greeting',
        content: PharmaPromptTemplates.getInitialGreeting(),
        isUser: false,
        timestamp: DateTime.now(),
        providerUsed: 'PharmaLearn AI Engine',
      ),
    );
  }

  @override
  void dispose() {
    _textCtrl.dispose();
    _scrollCtrl.dispose();
    super.dispose();
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollCtrl.hasClients) {
        _scrollCtrl.animateTo(
          _scrollCtrl.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  void _scrollToNewAiResponse(double prevMax) {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollCtrl.hasClients) {
        final maxOffset = _scrollCtrl.position.maxScrollExtent;
        final target = (prevMax - 24.0).clamp(0.0, maxOffset);
        _scrollCtrl.animateTo(
          target,
          duration: const Duration(milliseconds: 350),
          curve: Curves.easeOutCubic,
        );
      }
    });
  }

  String? _getSubjectContextString() {
    final s = _attachedSubject;
    if (s == null) return null;

    final b = StringBuffer();
    b.writeln('SUBJECT CODE: ${s.code}');
    b.writeln('SUBJECT NAME: ${s.name}');
    b.writeln('CREDITS: ${s.credits} (${s.typeLabel})');
    if (s.objectives.isNotEmpty) {
      b.writeln('COURSE OBJECTIVES:');
      for (final obj in s.objectives) {
        b.writeln('- $obj');
      }
    }
    b.writeln('PCI NEP 2020 SYLLABUS UNITS & TOPICS:');
    for (final u in s.units) {
      b.writeln('• Unit ${u.num}: ${u.title} (${u.hours})');
      if (u.topics.isNotEmpty) {
        b.writeln('  Topics: ${u.topics.join(', ')}');
      }
    }
    if (s.references.isNotEmpty) {
      b.writeln('RECOMMENDED REFERENCE BOOKS:');
      for (final ref in s.references) {
        b.writeln('- $ref');
      }
    }
    return b.toString();
  }

  Future<void> _handleSendMessage(String text) async {
    final query = text.trim();
    if (query.isEmpty || _isLoading) return;

    _textCtrl.clear();
    FocusScope.of(context).unfocus();

    _queryCounter++;
    if (_queryCounter % 4 == 0) {
      AdService.instance.showInterstitialAd();
    }

    final userMsg = ChatMessage(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      content: query,
      isUser: true,
      timestamp: DateTime.now(),
    );

    setState(() {
      _messages.add(userMsg);
      _isLoading = true;
    });
    _scrollToBottom();

    try {
      final response = await _aiService.sendMessage(
        userMessage: query,
        history: _messages.where((m) => !m.id.contains('greeting')).toList(),
        mode: _selectedMode,
        forceWebSearch: _webSearchEnabled,
        subjectContext: _getSubjectContextString(),
      );

      if (mounted) {
        final prevMax = _scrollCtrl.hasClients ? _scrollCtrl.position.maxScrollExtent : 0.0;
        setState(() {
          _messages.add(response);
          _isLoading = false;
        });
        _scrollToNewAiResponse(prevMax);
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _messages.add(
            ChatMessage(
              id: DateTime.now().millisecondsSinceEpoch.toString(),
              content: 'Main offline knowledge base se information verify kar raha hoon. Kripya apna internet connection check karein ya AI Settings check karein.',
              isUser: false,
              timestamp: DateTime.now(),
              providerUsed: 'Offline Failover',
            ),
          );
          _isLoading = false;
        });
        _scrollToBottom();
      }
    }
  }

  void _copyToClipboard(String text) {
    Clipboard.setData(ClipboardData(text: text));
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          'Copied to clipboard!',
          style: GoogleFonts.inter(fontWeight: FontWeight.w600),
        ),
        backgroundColor: AppTheme.primaryNavy,
        behavior: SnackBarBehavior.floating,
        duration: const Duration(seconds: 2),
      ),
    );
  }

  void _shareMessage(String text) {
    SharePlus.instance.share(
      ShareParams(
        text: 'PharmaCode AI Tutor Note:\n\n$text\n\nStudied via PharmaCode — Complete B.Pharm Companion',
        subject: 'PharmaCode Study Note',
      ),
    );
  }

  void _openSettingsDialog() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => _buildSettingsSheet(ctx),
    );
  }

  void _openSavedNotesSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => _buildSavedNotesBottomSheet(ctx),
    );
  }

  Widget _buildSavedNotesBottomSheet(BuildContext ctx) {
    return Container(
      height: MediaQuery.of(context).size.height * 0.78,
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(22)),
      ),
      child: Column(
        children: [
          Center(
            child: Container(
              margin: const EdgeInsets.only(top: 10, bottom: 6),
              width: 38,
              height: 4,
              decoration: BoxDecoration(
                color: const Color(0xFFCBD5E1),
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(18, 6, 14, 12),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFEF3C7),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Icon(Icons.bookmarks_rounded, size: 20, color: Color(0xFFD97706)),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Saved AI Notes & Solutions',
                        style: GoogleFonts.dmSans(
                          fontSize: 16.5,
                          fontWeight: FontWeight.w800,
                          color: AppTheme.primaryNavy,
                        ),
                      ),
                      Text(
                        'Cloud synced across your devices',
                        style: GoogleFonts.inter(
                          fontSize: 11.5,
                          color: AppTheme.textMuted,
                        ),
                      ),
                    ],
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.close_rounded, size: 22, color: Color(0xFF64748B)),
                  onPressed: () => Navigator.pop(ctx),
                ),
              ],
            ),
          ),
          const Divider(height: 1, color: Color(0xFFE2E8F0)),
          Expanded(
            child: ValueListenableBuilder<List<AiBookmark>>(
              valueListenable: AiBookmarkService.instance.bookmarksNotifier,
              builder: (context, bookmarks, _) {
                if (bookmarks.isEmpty) {
                  return Center(
                    child: Padding(
                      padding: const EdgeInsets.all(24),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Container(
                            padding: const EdgeInsets.all(16),
                            decoration: const BoxDecoration(
                              color: Color(0xFFF1F5F9),
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(Icons.bookmark_outline_rounded, size: 36, color: Color(0xFF94A3B8)),
                          ),
                          const SizedBox(height: 14),
                          Text(
                            'No Saved AI Notes Yet',
                            style: GoogleFonts.dmSans(
                              fontSize: 16,
                              fontWeight: FontWeight.w700,
                              color: AppTheme.primaryNavy,
                            ),
                          ),
                          const SizedBox(height: 6),
                          Text(
                            'Chat me AI responses ke neeche diye "Save" button par tap karein. Aapke imp questions, solutions aur python scripts yaha save rahenge!',
                            textAlign: TextAlign.center,
                            style: GoogleFonts.inter(fontSize: 12.5, color: const Color(0xFF64748B), height: 1.4),
                          ),
                        ],
                      ),
                    ),
                  );
                }

                return ListView.separated(
                  padding: const EdgeInsets.fromLTRB(16, 12, 16, 24),
                  itemCount: bookmarks.length,
                  separatorBuilder: (ctx, idx) => const SizedBox(height: 12),
                  itemBuilder: (context, index) {
                    final item = bookmarks[index];
                    return Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF8FAFC),
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: const Color(0xFFE2E8F0)),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              if (item.subjectCode != null && item.subjectCode!.isNotEmpty) ...[
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2.5),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFFEEF2FF),
                                    borderRadius: BorderRadius.circular(6),
                                  ),
                                  child: Text(
                                    item.subjectCode!,
                                    style: GoogleFonts.dmSans(
                                      fontSize: 10.5,
                                      fontWeight: FontWeight.w800,
                                      color: const Color(0xFF3730A3),
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 6),
                              ],
                              Expanded(
                                child: Text(
                                  item.question,
                                  style: GoogleFonts.inter(
                                    fontSize: 13,
                                    fontWeight: FontWeight.w700,
                                    color: AppTheme.primaryNavy,
                                  ),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                              IconButton(
                                icon: const Icon(Icons.delete_outline_rounded, size: 18, color: Color(0xFFEF4444)),
                                tooltip: 'Delete Bookmark',
                                padding: EdgeInsets.zero,
                                constraints: const BoxConstraints(),
                                onPressed: () async {
                                  await AiBookmarkService.instance.deleteBookmark(item.id);
                                },
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          ConstrainedBox(
                            constraints: const BoxConstraints(maxHeight: 180),
                            child: SingleChildScrollView(
                              child: _renderFormattedText(item.answer),
                            ),
                          ),
                          const SizedBox(height: 10),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.end,
                            children: [
                              InkWell(
                                onTap: () => _copyToClipboard(item.answer),
                                borderRadius: BorderRadius.circular(6),
                                child: Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: Colors.white,
                                    borderRadius: BorderRadius.circular(6),
                                    border: Border.all(color: const Color(0xFFCBD5E1)),
                                  ),
                                  child: Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      const Icon(Icons.copy_rounded, size: 12, color: Color(0xFF475569)),
                                      const SizedBox(width: 4),
                                      Text('Copy', style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w600, color: const Color(0xFF475569))),
                                    ],
                                  ),
                                ),
                              ),
                              const SizedBox(width: 8),
                              InkWell(
                                onTap: () => _shareMessage(item.answer),
                                borderRadius: BorderRadius.circular(6),
                                child: Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: Colors.white,
                                    borderRadius: BorderRadius.circular(6),
                                    border: Border.all(color: const Color(0xFFCBD5E1)),
                                  ),
                                  child: Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      const Icon(Icons.share_rounded, size: 12, color: Color(0xFF475569)),
                                      const SizedBox(width: 4),
                                      Text('Share', style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w600, color: const Color(0xFF475569))),
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
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: _buildAppBar(),
      body: Column(
        children: [
          _buildModeSelector(),
          if (_attachedSubject != null) _buildAttachedSubjectBanner(),
          Expanded(
            child: ListView.builder(
              controller: _scrollCtrl,
              padding: const EdgeInsets.fromLTRB(14, 14, 14, 20),
              itemCount: _messages.length + (_isLoading ? 1 : 0),
              itemBuilder: (context, index) {
                if (index == _messages.length && _isLoading) {
                  return _buildLoadingBubble();
                }
                return _buildMessageItem(_messages[index]);
              },
            ),
          ),
          if (_messages.length <= 1 && !_isLoading) _buildSuggestionsCarousel(),
          const AdBannerWidget(padding: EdgeInsets.symmetric(vertical: 2)),
          _buildInputBar(),
        ],
      ),
    );
  }

  PreferredSizeWidget _buildAppBar() {
    return AppBar(
      elevation: 0,
      backgroundColor: Colors.white,
      foregroundColor: AppTheme.primaryNavy,
      leading: IconButton(
        icon: const Icon(Icons.arrow_back_rounded),
        onPressed: () => Navigator.pop(context),
      ),
      titleSpacing: 0,
      title: Row(
        children: [
          PharmaMascotWidget(
            size: 38,
            state: _isLoading
                ? (_webSearchEnabled ? MascotState.searchingWeb : MascotState.thinking)
                : MascotState.idle,
            showBadge: true,
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Flexible(
                      child: Text(
                        'PharmaHelper',
                        overflow: TextOverflow.ellipsis,
                        maxLines: 1,
                        style: GoogleFonts.dmSans(
                          fontWeight: FontWeight.w800,
                          fontSize: 16.5,
                          color: AppTheme.primaryNavy,
                        ),
                      ),
                    ),
                    const SizedBox(width: 6),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1.5),
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [Color(0xFF2563EB), Color(0xFF4F46E5)],
                        ),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        'AI TUTOR',
                        style: GoogleFonts.inter(
                          color: Colors.white,
                          fontSize: 9,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                    ),
                  ],
                ),
                Text(
                  _isLoading
                      ? (_webSearchEnabled ? 'Searching Web & Formulating...' : 'Simplifying Concept...')
                      : 'PCI NEP 2020 • Hinglish & English',
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: GoogleFonts.inter(
                    fontSize: 11,
                    color: _isLoading ? AppTheme.brandBlue : AppTheme.brandGreen,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
      actions: [
        ValueListenableBuilder<List<AiBookmark>>(
          valueListenable: AiBookmarkService.instance.bookmarksNotifier,
          builder: (context, bookmarks, _) {
            return Stack(
              alignment: Alignment.center,
              children: [
                IconButton(
                  icon: const Icon(Icons.bookmarks_rounded, size: 22),
                  tooltip: 'Saved AI Notes',
                  onPressed: _openSavedNotesSheet,
                ),
                if (bookmarks.isNotEmpty)
                  Positioned(
                    top: 8,
                    right: 8,
                    child: Container(
                      padding: const EdgeInsets.all(3),
                      decoration: const BoxDecoration(
                        color: Color(0xFFD97706),
                        shape: BoxShape.circle,
                      ),
                      constraints: const BoxConstraints(minWidth: 15, minHeight: 15),
                      child: Text(
                        '${bookmarks.length}',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 8.5,
                          fontWeight: FontWeight.bold,
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ),
                  ),
              ],
            );
          },
        ),
        IconButton(
          icon: const Icon(Icons.tune_rounded, size: 22),
          tooltip: 'AI Engine Settings',
          onPressed: _openSettingsDialog,
        ),
        const SizedBox(width: 4),
      ],
    );
  }

  Widget _buildModeSelector() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(bottom: BorderSide(color: Color(0xFFE2E8F0))),
      ),
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        physics: const BouncingScrollPhysics(),
        child: Row(
          children: [
            _buildModeChip(
              mode: PharmaChatMode.tutorHinglish,
              label: 'Professor (Hinglish)',
              color: const Color(0xFF2563EB),
            ),
            const SizedBox(width: 6),
            _buildModeChip(
              mode: PharmaChatMode.examPrep,
              label: 'Exam Prep (5/10 Marks)',
              color: const Color(0xFF7C3AED),
            ),
            const SizedBox(width: 6),
            _buildModeChip(
              mode: PharmaChatMode.mnemonic,
              label: 'Mnemonics & Revision',
              color: const Color(0xFFD97706),
            ),
            const SizedBox(width: 6),
            _buildModeChip(
              mode: PharmaChatMode.webSearch,
              label: 'Clinical & Web Research',
              color: const Color(0xFF0D9488),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildModeChip({
    required PharmaChatMode mode,
    required String label,
    required Color color,
  }) {
    final isSelected = _selectedMode == mode;
    return InkWell(
      onTap: () {
        setState(() {
          _selectedMode = mode;
          if (mode == PharmaChatMode.webSearch) {
            _webSearchEnabled = true;
          }
        });
      },
      borderRadius: BorderRadius.circular(16),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 180),
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
        decoration: BoxDecoration(
          color: isSelected ? color : const Color(0xFFF1F5F9),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: isSelected ? color : const Color(0xFFE2E8F0),
          ),
        ),
        child: Text(
          label,
          style: GoogleFonts.inter(
            fontSize: 11.5,
            fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
            color: isSelected ? Colors.white : const Color(0xFF475569),
          ),
        ),
      ),
    );
  }

  Widget _buildAttachedSubjectBanner() {
    final s = _attachedSubject;
    if (s == null) return const SizedBox.shrink();

    return Container(
      margin: const EdgeInsets.fromLTRB(12, 4, 12, 4),
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF0F1D5C), Color(0xFF1E3A8A)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(10),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF0F1D5C).withValues(alpha: 0.14),
            blurRadius: 6,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.2),
              borderRadius: BorderRadius.circular(5),
            ),
            child: Text(
              s.code,
              style: GoogleFonts.dmSans(
                color: Colors.white,
                fontWeight: FontWeight.w900,
                fontSize: 11,
              ),
            ),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  s.name,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: GoogleFonts.dmSans(
                    color: Colors.white,
                    fontWeight: FontWeight.w800,
                    fontSize: 12,
                  ),
                ),
                Text(
                  '${s.credits} Credits · ${s.typeLabel} · ${s.units.length} Units',
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: GoogleFonts.inter(
                    color: const Color(0xFF93C5FD),
                    fontWeight: FontWeight.w600,
                    fontSize: 10,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 6),
          // View Units action
          InkWell(
            onTap: () => _showSubjectUnitsModal(s),
            borderRadius: BorderRadius.circular(6),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
              decoration: BoxDecoration(
                color: const Color(0xFF38BDF8).withValues(alpha: 0.22),
                borderRadius: BorderRadius.circular(6),
                border: Border.all(color: const Color(0xFF38BDF8).withValues(alpha: 0.4)),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.list_alt_rounded, color: Color(0xFF7DD3FC), size: 12),
                  const SizedBox(width: 3),
                  Text(
                    'Units',
                    style: GoogleFonts.dmSans(
                      color: Colors.white,
                      fontSize: 10.5,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(width: 6),
          // Detach / Clear subject context button
          InkWell(
            onTap: () {
              setState(() {
                _attachedSubject = null;
                _suggestedPrompts.clear();
                _suggestedPrompts.addAll([
                  'Bioavailability simple Hinglish me samjhao',
                  'Write a 5-mark answer on Tablet Capping & Lamination',
                  'What are the 4 validity criteria in Pharmacovigilance ICSR?',
                  'GPCR signaling pathway simple analogy se batao',
                  'ICH Q1A stability testing guidelines summary',
                  'Recent FDA approved antibody drugs search karo',
                ]);
              });
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(
                    'Subject context detached. PharmaHelper is now in general mode.',
                    style: GoogleFonts.inter(fontWeight: FontWeight.w600),
                  ),
                  duration: const Duration(seconds: 2),
                  behavior: SnackBarBehavior.floating,
                ),
              );
            },
            borderRadius: BorderRadius.circular(12),
            child: Container(
              padding: const EdgeInsets.all(4),
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.15),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.close_rounded, size: 14, color: Colors.white70),
            ),
          ),
        ],
      ),
    );
  }

  void _showSubjectUnitsModal(Subject s) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        return Container(
          constraints: BoxConstraints(
            maxHeight: MediaQuery.of(ctx).size.height * 0.75,
          ),
          padding: const EdgeInsets.fromLTRB(20, 16, 20, 24),
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: const Color(0xFFCBD5E1),
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: const Color(0xFFEFF6FF),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: const Color(0xFFBFDBFE)),
                    ),
                    child: Text(
                      s.code,
                      style: GoogleFonts.dmSans(
                        color: const Color(0xFF1D4ED8),
                        fontWeight: FontWeight.w900,
                        fontSize: 12,
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      'Syllabus Units (${s.units.length} Units)',
                      style: GoogleFonts.dmSans(
                        fontWeight: FontWeight.w900,
                        fontSize: 16,
                        color: AppTheme.primaryNavy,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 4),
              Text(
                s.name,
                style: GoogleFonts.dmSans(
                  color: AppTheme.textMuted,
                  fontSize: 12.5,
                ),
              ),
              const SizedBox(height: 14),
              const Divider(height: 1),
              Flexible(
                child: ListView.separated(
                  shrinkWrap: true,
                  physics: const BouncingScrollPhysics(),
                  padding: const EdgeInsets.symmetric(vertical: 10),
                  itemCount: s.units.length,
                  separatorBuilder: (_, _) => const Divider(height: 1, color: Color(0xFFF1F5F9)),
                  itemBuilder: (context, idx) {
                    final u = s.units[idx];
                    return ListTile(
                      contentPadding: const EdgeInsets.symmetric(horizontal: 4, vertical: 2),
                      leading: Container(
                        width: 32,
                        height: 32,
                        decoration: BoxDecoration(
                          color: const Color(0xFFEFF6FF),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        alignment: Alignment.center,
                        child: Text(
                          u.num,
                          style: GoogleFonts.dmSans(
                            color: const Color(0xFF2563EB),
                            fontWeight: FontWeight.w900,
                            fontSize: 12,
                          ),
                        ),
                      ),
                      title: Text(
                        u.title,
                        style: GoogleFonts.dmSans(
                          fontWeight: FontWeight.w700,
                          fontSize: 13.5,
                          color: const Color(0xFF0F172A),
                        ),
                      ),
                      subtitle: u.hours.isNotEmpty
                          ? Text(
                              u.hours,
                              style: GoogleFonts.inter(fontSize: 11, color: const Color(0xFF64748B)),
                            )
                          : null,
                      trailing: ElevatedButton(
                        onPressed: () {
                          Navigator.pop(ctx);
                          _handleSendMessage('Explain Unit ${u.num}: ${u.title} in detail with important 5-mark and 10-mark exam questions.');
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFFEFF6FF),
                          foregroundColor: const Color(0xFF2563EB),
                          elevation: 0,
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                        ),
                        child: Text(
                          'Ask AI',
                          style: GoogleFonts.dmSans(fontSize: 11.5, fontWeight: FontWeight.w800),
                        ),
                      ),
                    );
                  },
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildMessageItem(ChatMessage msg) {
    if (msg.isUser) {
      return Padding(
        padding: const EdgeInsets.only(bottom: 16),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.end,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Flexible(
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF1E3A8A), Color(0xFF2563EB)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: const BorderRadius.only(
                    topLeft: Radius.circular(18),
                    topRight: Radius.circular(4),
                    bottomLeft: Radius.circular(18),
                    bottomRight: Radius.circular(18),
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFF2563EB).withValues(alpha: 0.2),
                      blurRadius: 8,
                      offset: const Offset(0, 3),
                    ),
                  ],
                ),
                child: Text(
                  msg.content,
                  style: GoogleFonts.inter(
                    color: Colors.white,
                    fontSize: 14.5,
                    height: 1.4,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            ),
            const SizedBox(width: 8),
            Container(
              width: 32,
              height: 32,
              decoration: const BoxDecoration(
                color: Color(0xFFDBEAFE),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.person_rounded, color: Color(0xFF1D4ED8), size: 18),
            ),
          ],
        ),
      );
    }

    // AI Response Card
    return Padding(
      padding: const EdgeInsets.only(bottom: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              PharmaMascotWidget(
                size: 28,
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
              if (msg.providerUsed != null) ...[
                const SizedBox(width: 6),
                Flexible(
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                    decoration: BoxDecoration(
                      color: const Color(0xFFEEF2FF),
                      borderRadius: BorderRadius.circular(6),
                      border: Border.all(color: const Color(0xFFC7D2FE)),
                    ),
                    child: Text(
                      msg.providerUsed!,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: GoogleFonts.inter(
                        fontSize: 9.5,
                        fontWeight: FontWeight.w600,
                        color: const Color(0xFF4338CA),
                      ),
                    ),
                  ),
                ),
              ],
            ],
          ),
          const SizedBox(height: 6),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 14),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(4),
                topRight: Radius.circular(18),
                bottomLeft: Radius.circular(18),
                bottomRight: Radius.circular(18),
              ),
              border: Border.all(color: const Color(0xFFE2E8F0)),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.04),
                  blurRadius: 10,
                  offset: const Offset(0, 3),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _renderFormattedText(msg.content),
                if (msg.citations.isNotEmpty &&
                    !msg.content.toLowerCase().startsWith("i'm sorry") &&
                    !msg.content.toLowerCase().startsWith("i am sorry") &&
                    !msg.content.toLowerCase().contains("cannot help with that") &&
                    msg.content.trim().length >= 60) ...[
                  const SizedBox(height: 14),
                  const Divider(color: Color(0xFFE2E8F0)),
                  Text(
                    'Verified Web Sources & Citations:',
                    style: GoogleFonts.inter(
                      fontSize: 11.5,
                      fontWeight: FontWeight.w700,
                      color: AppTheme.brandTeal,
                    ),
                  ),
                  const SizedBox(height: 6),
                  for (final cite in msg.citations)
                    InkWell(
                      onTap: () async {
                        final uri = Uri.tryParse(cite.url);
                        if (uri != null && await canLaunchUrl(uri)) {
                          await launchUrl(uri, mode: LaunchMode.externalApplication);
                        }
                      },
                      child: Padding(
                        padding: const EdgeInsets.symmetric(vertical: 3),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Icon(Icons.link_rounded, size: 14, color: AppTheme.brandBlue),
                            const SizedBox(width: 6),
                            Expanded(
                              child: Text(
                                cite.title,
                                style: GoogleFonts.inter(
                                  fontSize: 11.5,
                                  color: AppTheme.brandBlue,
                                  decoration: TextDecoration.underline,
                                ),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                ],
                const SizedBox(height: 12),
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    ValueListenableBuilder<List<AiBookmark>>(
                      valueListenable: AiBookmarkService.instance.bookmarksNotifier,
                      builder: (context, bookmarks, _) {
                        final isSaved = AiBookmarkService.instance.isBookmarked(msg.content);
                        return InkWell(
                          onTap: () async {
                            String questionPrompt = 'PharmaCode AI Note';
                            final msgIdx = _messages.indexOf(msg);
                            if (msgIdx > 0) {
                              for (int k = msgIdx - 1; k >= 0; k--) {
                                if (_messages[k].isUser) {
                                  questionPrompt = _messages[k].content;
                                  break;
                                }
                              }
                            }

                            // If user is guest/not logged in, require login first so notes sync permanently to account
                            final currentUser = FirebaseAuth.instance.currentUser;
                            if (currentUser == null || currentUser.isAnonymous) {
                              _showLoginRequiredSheet(
                                questionPrompt: questionPrompt,
                                msg: msg,
                              );
                              return;
                            }

                            final added = await AiBookmarkService.instance.toggleBookmark(
                              question: questionPrompt,
                              answer: msg.content,
                              subjectCode: _attachedSubject?.code,
                              subjectName: _attachedSubject?.name,
                              mode: _selectedMode.name,
                              providerUsed: msg.providerUsed,
                            );
                            if (context.mounted) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text(
                                    added
                                        ? 'Saved to Cloud Bookmarks!'
                                        : 'Removed from Bookmarks',
                                  ),
                                  duration: const Duration(seconds: 2),
                                  behavior: SnackBarBehavior.floating,
                                ),
                              );
                            }
                          },
                          borderRadius: BorderRadius.circular(6),
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: isSaved ? const Color(0xFFFEF3C7) : const Color(0xFFF1F5F9),
                              borderRadius: BorderRadius.circular(6),
                              border: isSaved
                                  ? Border.all(color: const Color(0xFFFCD34D), width: 0.8)
                                  : null,
                            ),
                            child: Row(
                              children: [
                                Icon(
                                  isSaved ? Icons.bookmark_rounded : Icons.bookmark_outline_rounded,
                                  size: 13,
                                  color: isSaved ? const Color(0xFFD97706) : const Color(0xFF475569),
                                ),
                                const SizedBox(width: 4),
                                Text(
                                  isSaved ? 'Saved' : 'Save',
                                  style: GoogleFonts.inter(
                                    fontSize: 11,
                                    fontWeight: FontWeight.w600,
                                    color: isSaved ? const Color(0xFFB45309) : const Color(0xFF475569),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
                    const SizedBox(width: 8),
                    InkWell(
                      onTap: () => _copyToClipboard(msg.content),
                      borderRadius: BorderRadius.circular(6),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF1F5F9),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.copy_rounded, size: 13, color: Color(0xFF475569)),
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
                    InkWell(
                      onTap: () => _shareMessage(msg.content),
                      borderRadius: BorderRadius.circular(6),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF1F5F9),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.share_rounded, size: 13, color: Color(0xFF475569)),
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
          ),
        ],
      ),
    );
  }

  void _showLoginRequiredSheet({
    required String questionPrompt,
    required ChatMessage msg,
  }) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        return Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
          ),
          padding: EdgeInsets.fromLTRB(
            24,
            16,
            24,
            MediaQuery.of(ctx).padding.bottom + 20,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: const Color(0xFFCBD5E1),
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              const SizedBox(height: 20),
              Container(
                width: 64,
                height: 64,
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFFEFF6FF), Color(0xFFDBEAFE)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: const Color(0xFFBFDBFE), width: 1.5),
                ),
                child: const Icon(
                  Icons.cloud_sync_rounded,
                  color: Color(0xFF2563EB),
                  size: 34,
                ),
              ),
              const SizedBox(height: 16),
              Text(
                'Account Me Save Karein',
                style: GoogleFonts.dmSans(
                  fontSize: 19,
                  fontWeight: FontWeight.w900,
                  color: AppTheme.primaryNavy,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'AI Notes ko permanently save rakhne ke liye pehle Login / Sign Up karein. Isse aapke notes Firebase Cloud par hamesha safe rahenge aur phone switch ya app update par bhi kabhi delete nahi honge jab tak aap khud na hatayein!',
                textAlign: TextAlign.center,
                style: GoogleFonts.dmSans(
                  fontSize: 13,
                  color: AppTheme.textMuted,
                  height: 1.45,
                ),
              ),
              const SizedBox(height: 22),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: () {
                    Navigator.pop(ctx);
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => LoginScreen(
                          onLoginSuccess: () async {
                            await AiBookmarkService.instance.toggleBookmark(
                              question: questionPrompt,
                              answer: msg.content,
                              subjectCode: _attachedSubject?.code,
                              subjectName: _attachedSubject?.name,
                              mode: _selectedMode.name,
                              providerUsed: msg.providerUsed,
                            );
                            if (mounted) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content: Text('Note permanently saved to your Firebase account!'),
                                  backgroundColor: AppTheme.brandGreen,
                                  behavior: SnackBarBehavior.floating,
                                ),
                              );
                            }
                          },
                        ),
                      ),
                    );
                  },
                  icon: const Icon(Icons.login_rounded, size: 18),
                  label: Text(
                    'Login / Sign Up to Save',
                    style: GoogleFonts.dmSans(
                      fontSize: 14,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.brandBlue,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                    ),
                    elevation: 0,
                  ),
                ),
              ),
              const SizedBox(height: 10),
              TextButton(
                onPressed: () => Navigator.pop(ctx),
                child: Text(
                  'Cancel',
                  style: GoogleFonts.dmSans(
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                    color: AppTheme.textMuted,
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildLoadingBubble() {
    return Padding(
      padding: const EdgeInsets.only(bottom: 20),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          PharmaMascotWidget(
            size: 32,
            state: _webSearchEnabled ? MascotState.searchingWeb : MascotState.thinking,
            showBadge: false,
          ),
          const SizedBox(width: 10),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const SizedBox(
                  width: 16,
                  height: 16,
                  child: CircularProgressIndicator(strokeWidth: 2, color: Color(0xFF2563EB)),
                ),
                const SizedBox(width: 10),
                Text(
                  _webSearchEnabled ? 'Searching live clinical updates...' : 'PharmaHelper is formulating...',
                  style: GoogleFonts.inter(
                    fontSize: 12.5,
                    color: const Color(0xFF64748B),
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSuggestionsCarousel() {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 10),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
            child: Row(
              children: [
                const Icon(Icons.lightbulb_outline_rounded, size: 16, color: Color(0xFFF59E0B)),
                const SizedBox(width: 6),
                Text(
                  'Quick Pharma Prompts (Tap to ask):',
                  style: GoogleFonts.inter(
                    fontSize: 12,
                    fontWeight: FontWeight.w700,
                    color: const Color(0xFF475569),
                  ),
                ),
              ],
            ),
          ),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            physics: const BouncingScrollPhysics(),
            padding: const EdgeInsets.symmetric(horizontal: 12),
            child: Row(
              children: _suggestedPrompts.map((p) {
                return Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 4),
                  child: ActionChip(
                    label: Text(
                      p,
                      style: GoogleFonts.inter(fontSize: 12, color: const Color(0xFF1E293B)),
                    ),
                    backgroundColor: Colors.white,
                    side: const BorderSide(color: Color(0xFFE2E8F0)),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    onPressed: () => _handleSendMessage(p),
                  ),
                );
              }).toList(),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInputBar() {
    return SafeArea(
      top: false,
      bottom: true,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
        decoration: BoxDecoration(
          color: Colors.white,
          border: const Border(top: BorderSide(color: Color(0xFFE2E8F0), width: 0.8)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.02),
              blurRadius: 6,
              offset: const Offset(0, -2),
            ),
          ],
        ),
        child: Container(
          constraints: const BoxConstraints(minHeight: 38),
          decoration: BoxDecoration(
            color: const Color(0xFFF8FAFC),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: const Color(0xFFE2E8F0), width: 0.8),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 2),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              // Web Search Toggle inside pill
              Material(
                color: Colors.transparent,
                child: InkWell(
                  borderRadius: BorderRadius.circular(16),
                  onTap: () {
                    setState(() {
                      _webSearchEnabled = !_webSearchEnabled;
                    });
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text(
                          _webSearchEnabled ? 'Live Web Grounding Enabled' : 'Offline In-App Grounding Only',
                          style: GoogleFonts.inter(fontWeight: FontWeight.w600),
                        ),
                        duration: const Duration(seconds: 1),
                        behavior: SnackBarBehavior.floating,
                      ),
                    );
                  },
                  child: Container(
                    padding: const EdgeInsets.all(4),
                    decoration: BoxDecoration(
                      color: _webSearchEnabled ? const Color(0xFFCCFBF1) : Colors.transparent,
                      shape: BoxShape.circle,
                    ),
                    child: Icon(
                      Icons.language_rounded,
                      size: 17,
                      color: _webSearchEnabled ? const Color(0xFF0D9488) : const Color(0xFF94A3B8),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 4),
              Expanded(
                child: TextField(
                  controller: _textCtrl,
                  minLines: 1,
                  maxLines: 4,
                  textInputAction: TextInputAction.send,
                  onSubmitted: _handleSendMessage,
                  style: GoogleFonts.inter(fontSize: 13.5, color: const Color(0xFF0F172A)),
                  decoration: InputDecoration(
                    hintText: _attachedSubject != null
                        ? 'Ask about ${_attachedSubject!.code} (Hinglish/English)...'
                        : 'Ask PharmaHelper (Hinglish/English)...',
                    hintStyle: GoogleFonts.inter(color: const Color(0xFF94A3B8), fontSize: 12.5),
                    border: InputBorder.none,
                    isDense: true,
                    contentPadding: const EdgeInsets.symmetric(vertical: 5, horizontal: 4),
                  ),
                ),
              ),
              const SizedBox(width: 4),
              Container(
                width: 28,
                height: 28,
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    colors: [Color(0xFF1E3A8A), Color(0xFF2563EB)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  shape: BoxShape.circle,
                ),
                child: IconButton(
                  padding: EdgeInsets.zero,
                  icon: _isLoading
                      ? const SizedBox(
                          width: 12,
                          height: 12,
                          child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                        )
                      : const Icon(Icons.arrow_upward_rounded, color: Colors.white, size: 15),
                  onPressed: _isLoading ? null : () => _handleSendMessage(_textCtrl.text),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  /// Unified rich formatted text rendering using PharmaMarkdownWidget
  Widget _renderFormattedText(String text) {
    return PharmaMarkdownWidget(text: text);
  }

  Widget _buildSettingsSheet(BuildContext ctx) {
    final statuses = _keyManager.getProviderStatuses();
    final groqCtrl = TextEditingController(text: _keyManager.getCustomKey(AiProvider.groq) ?? '');
    final geminiCtrl = TextEditingController(text: _keyManager.getCustomKey(AiProvider.gemini) ?? '');
    final nvidiaCtrl = TextEditingController(text: _keyManager.getCustomKey(AiProvider.nvidia) ?? '');
    final openRouterCtrl = TextEditingController(text: _keyManager.getCustomKey(AiProvider.openrouter) ?? '');

    return StatefulBuilder(
      builder: (context, setSheetState) {
        return ConstrainedBox(
          constraints: BoxConstraints(
            maxHeight: MediaQuery.of(context).size.height * 0.88,
          ),
          child: Container(
            decoration: const BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
            ),
            padding: EdgeInsets.only(
              left: 20,
              right: 20,
              top: 20,
              bottom: MediaQuery.of(context).viewInsets.bottom + 24,
            ),
            child: SingleChildScrollView(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Center(
                  child: Container(
                    width: 40,
                    height: 4,
                    decoration: BoxDecoration(
                      color: const Color(0xFFCBD5E1),
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    const Icon(Icons.tune_rounded, color: Color(0xFF2563EB)),
                    const SizedBox(width: 8),
                    Text(
                      'AI Engine & Provider Failover',
                      style: GoogleFonts.dmSans(
                        fontSize: 18,
                        fontWeight: FontWeight.w800,
                        color: AppTheme.primaryNavy,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Text(
                  'PharmaCode comes with pre-configured high-speed AI (Groq + Gemini + NVIDIA NIM). All students get instant intelligent responses out-of-the-box! Optional personal keys can be configured below as backups.',
                  style: GoogleFonts.inter(fontSize: 12, color: const Color(0xFF64748B)),
                ),
                const SizedBox(height: 16),
                Text(
                  'ACTIVE ROTATION STATUS',
                  style: GoogleFonts.inter(
                    fontSize: 11,
                    fontWeight: FontWeight.w800,
                    color: const Color(0xFF94A3B8),
                    letterSpacing: 0.5,
                  ),
                ),
                const SizedBox(height: 8),
                for (final entry in statuses.entries)
                  Container(
                    margin: const EdgeInsets.only(bottom: 6),
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF8FAFC),
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: const Color(0xFFE2E8F0)),
                    ),
                    child: Row(
                      children: [
                        Expanded(
                          child: Text(
                            AiConfig.providers[entry.key]?.displayName ?? entry.key.name,
                            style: GoogleFonts.inter(fontSize: 12.5, fontWeight: FontWeight.w600),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: entry.value.contains('Online') || entry.value.contains('Active')
                                ? const Color(0xFFDCFCE7)
                                : (entry.value.contains('Cooldown')
                                    ? const Color(0xFFFEF3C7)
                                    : const Color(0xFFEFF6FF)),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            entry.value,
                            style: GoogleFonts.inter(
                              fontSize: 10,
                              fontWeight: FontWeight.w700,
                              color: entry.value.contains('Online') || entry.value.contains('Active')
                                  ? const Color(0xFF166534)
                                  : (entry.value.contains('Cooldown')
                                      ? const Color(0xFF92400E)
                                      : const Color(0xFF1D4ED8)),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                const SizedBox(height: 16),
                Text(
                  'CUSTOM BACKUP KEYS (OPTIONAL OVERRIDES)',
                  style: GoogleFonts.inter(
                    fontSize: 11,
                    fontWeight: FontWeight.w800,
                    color: const Color(0xFF94A3B8),
                    letterSpacing: 0.5,
                  ),
                ),
                const SizedBox(height: 8),
                TextField(
                  controller: groqCtrl,
                  decoration: InputDecoration(
                    labelText: 'Groq Cloud API Key',
                    helperText: 'Default active. Free at console.groq.com',
                    helperStyle: GoogleFonts.inter(fontSize: 10.5, color: const Color(0xFF64748B)),
                    hintText: 'gsk_...',
                    isDense: true,
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                ),
                const SizedBox(height: 10),
                TextField(
                  controller: geminiCtrl,
                  decoration: InputDecoration(
                    labelText: 'Google Gemini API Key',
                    helperText: 'Default active. Free at aistudio.google.com',
                    helperStyle: GoogleFonts.inter(fontSize: 10.5, color: const Color(0xFF64748B)),
                    hintText: 'AQ... or AIza...',
                    isDense: true,
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                ),
                const SizedBox(height: 10),
                TextField(
                  controller: nvidiaCtrl,
                  decoration: InputDecoration(
                    labelText: 'NVIDIA NIM API Key',
                    helperText: 'Default active. Free at build.nvidia.com',
                    helperStyle: GoogleFonts.inter(fontSize: 10.5, color: const Color(0xFF64748B)),
                    hintText: 'nvapi-...',
                    isDense: true,
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                ),
                const SizedBox(height: 10),
                TextField(
                  controller: openRouterCtrl,
                  decoration: InputDecoration(
                    labelText: 'OpenRouter API Key',
                    helperText: 'Optional tier at openrouter.ai/keys',
                    helperStyle: GoogleFonts.inter(fontSize: 10.5, color: const Color(0xFF64748B)),
                    hintText: 'sk-or-v1-...',
                    isDense: true,
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                ),
                const SizedBox(height: 14),
                Row(
                  children: [
                    Expanded(
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF2563EB),
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                        ),
                        onPressed: () async {
                          final messenger = ScaffoldMessenger.of(context);
                          await _keyManager.setCustomKey(AiProvider.groq, groqCtrl.text);
                          await _keyManager.setCustomKey(AiProvider.gemini, geminiCtrl.text);
                          await _keyManager.setCustomKey(AiProvider.nvidia, nvidiaCtrl.text);
                          await _keyManager.setCustomKey(AiProvider.openrouter, openRouterCtrl.text);
                          if (ctx.mounted) {
                            Navigator.pop(ctx);
                            messenger.showSnackBar(
                              const SnackBar(
                                content: Text('API Keys updated successfully!'),
                                backgroundColor: Color(0xFF10B981),
                              ),
                            );
                          }
                        },
                        child: Text('Save Custom Keys', style: GoogleFonts.inter(fontWeight: FontWeight.w700)),
                      ),
                    ),
                    const SizedBox(width: 10),
                    OutlinedButton(
                      style: OutlinedButton.styleFrom(
                        foregroundColor: const Color(0xFFEF4444),
                        side: const BorderSide(color: Color(0xFFEF4444)),
                        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                      onPressed: () {
                        setState(() {
                          _messages.clear();
                          _loadInitialGreeting();
                        });
                        Navigator.pop(ctx);
                      },
                      child: const Text('Clear Chat'),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      );
    },
    );
  }
}
