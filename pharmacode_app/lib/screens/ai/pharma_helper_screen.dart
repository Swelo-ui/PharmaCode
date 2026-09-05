import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:share_plus/share_plus.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../core/theme.dart';
import '../../models/syllabus_models.dart';
import '../../services/ai/ai_config.dart';
import '../../services/ai/ai_key_manager.dart';
import '../../services/ai/ai_rotation_service.dart';
import '../../services/ai/pharma_prompt_templates.dart';
import '../../widgets/pharma_mascot_widget.dart';

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
                if (msg.citations.isNotEmpty) ...[
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

  bool _isTableSeparator(String line) {
    final t = line.trim();
    if (!t.contains('|') || !t.contains('-')) return false;
    return RegExp(r'^\|?(\s*:?-{2,}:?\s*\|?)+\s*$').hasMatch(t);
  }

  bool _isTableRow(String line) {
    final t = line.trim();
    if (!t.contains('|')) return false;
    final pipes = t.split('|').length - 1;
    return pipes >= 2;
  }

  List<String> _parseTableCells(String line) {
    String t = line.trim();
    if (t.startsWith('|')) t = t.substring(1);
    if (t.endsWith('|')) t = t.substring(0, t.length - 1);
    return t.split('|').map((c) => c.trim()).toList();
  }

  Widget _buildMarkdownTable(List<String> headers, List<List<String>> rows) {
    if (headers.isEmpty && rows.isEmpty) return const SizedBox.shrink();

    final colCount = headers.isNotEmpty ? headers.length : (rows.isNotEmpty ? rows.first.length : 1);

    return Container(
      margin: const EdgeInsets.symmetric(vertical: 8),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFFCBD5E1), width: 1.2),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.03),
            blurRadius: 8,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      clipBehavior: Clip.antiAlias,
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        physics: const BouncingScrollPhysics(),
        child: ConstrainedBox(
          constraints: BoxConstraints(
            minWidth: MediaQuery.of(context).size.width - 70,
          ),
          child: Table(
            defaultVerticalAlignment: TableCellVerticalAlignment.middle,
            columnWidths: {
              for (int c = 0; c < colCount; c++)
                c: const IntrinsicColumnWidth(),
            },
            children: [
              // Header Row
              if (headers.isNotEmpty)
                TableRow(
                  decoration: const BoxDecoration(
                    color: Color(0xFFEFF6FF),
                    border: Border(bottom: BorderSide(color: Color(0xFF93C5FD), width: 1.5)),
                  ),
                  children: headers.map((h) {
                    return Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                      alignment: Alignment.centerLeft,
                      child: Text(
                        h.replaceAll('**', '').replaceAll('*', '').trim(),
                        style: GoogleFonts.dmSans(
                          fontWeight: FontWeight.w900,
                          fontSize: 13,
                          color: const Color(0xFF1E3A8A),
                          letterSpacing: -0.2,
                        ),
                      ),
                    );
                  }).toList(),
                ),

              // Data Rows
              for (int r = 0; r < rows.length; r++)
                TableRow(
                  decoration: BoxDecoration(
                    color: r % 2 == 1 ? const Color(0xFFF8FAFC) : Colors.white,
                    border: r < rows.length - 1
                        ? const Border(bottom: BorderSide(color: Color(0xFFE2E8F0), width: 0.8))
                        : null,
                  ),
                  children: [
                    for (int c = 0; c < colCount; c++)
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                        alignment: Alignment.centerLeft,
                        child: ConstrainedBox(
                          constraints: const BoxConstraints(maxWidth: 280, minWidth: 90),
                          child: _buildRichInlineText(c < rows[r].length ? rows[r][c] : ''),
                        ),
                      ),
                  ],
                ),
            ],
          ),
        ),
      ),
    );
  }

  /// Clean formatted text rendering for markdown without extra heavy packages
  Widget _renderFormattedText(String text) {
    final lines = text.split('\n');
    final List<Widget> children = [];
    bool isFirstItem = true;

    for (int i = 0; i < lines.length; i++) {
      final trimmed = lines[i].trim();

      if (trimmed.isEmpty) {
        if (!isFirstItem) {
          children.add(const SizedBox(height: 5));
        }
        continue;
      }

      // 1. Divider handling (---, ***, ___)
      if (trimmed == '---' || trimmed == '***' || trimmed == '___' || (trimmed.startsWith('---') && trimmed.length <= 5)) {
        if (!isFirstItem && children.isNotEmpty) {
          children.add(
            const Padding(
              padding: EdgeInsets.symmetric(vertical: 6),
              child: Divider(height: 1, thickness: 0.8, color: Color(0xFFE2E8F0)),
            ),
          );
        }
        continue;
      }

      // 2. Markdown Table Detection & Parsing
      if (_isTableRow(trimmed) && i + 1 < lines.length && _isTableSeparator(lines[i + 1])) {
        final headers = _parseTableCells(trimmed);
        i++; // Skip separator line

        final List<List<String>> rows = [];
        int j = i + 1;
        while (j < lines.length && _isTableRow(lines[j]) && !_isTableSeparator(lines[j])) {
          final cells = _parseTableCells(lines[j]);
          while (cells.length < headers.length) {
            cells.add('');
          }
          rows.add(cells);
          j++;
        }
        i = j - 1; // Advance loop index

        children.add(_buildMarkdownTable(headers, rows));
        isFirstItem = false;
        continue;
      }

      isFirstItem = false;

      // 3. Headings
      if (trimmed.startsWith('#### ') || trimmed.startsWith('##### ')) {
        final rawTitle = trimmed.substring(trimmed.indexOf(' ') + 1);
        final title = rawTitle.replaceAll('**', '').replaceAll('*', '').trim();
        children.add(
          Padding(
            padding: const EdgeInsets.only(top: 8, bottom: 3),
            child: Text(
              title,
              style: GoogleFonts.dmSans(
                fontSize: 14.5,
                fontWeight: FontWeight.w800,
                color: AppTheme.primaryNavy,
              ),
            ),
          ),
        );
      } else if (trimmed.startsWith('### ')) {
        final rawTitle = trimmed.substring(4);
        final title = rawTitle.replaceAll('**', '').replaceAll('*', '').trim();
        children.add(
          Padding(
            padding: const EdgeInsets.only(top: 8, bottom: 4),
            child: Text(
              title,
              style: GoogleFonts.dmSans(
                fontSize: 15.5,
                fontWeight: FontWeight.w800,
                color: AppTheme.primaryNavy,
              ),
            ),
          ),
        );
      } else if (trimmed.startsWith('## ')) {
        final rawTitle = trimmed.substring(3);
        final title = rawTitle.replaceAll('**', '').replaceAll('*', '').trim();
        children.add(
          Padding(
            padding: const EdgeInsets.only(top: 10, bottom: 4),
            child: Text(
              title,
              style: GoogleFonts.dmSans(
                fontSize: 17,
                fontWeight: FontWeight.w900,
                color: AppTheme.primaryNavy,
              ),
            ),
          ),
        );
      } else if (trimmed.startsWith('# ')) {
        final rawTitle = trimmed.substring(2);
        final title = rawTitle.replaceAll('**', '').replaceAll('*', '').trim();
        children.add(
          Padding(
            padding: const EdgeInsets.only(top: 12, bottom: 6),
            child: Text(
              title,
              style: GoogleFonts.dmSans(
                fontSize: 19,
                fontWeight: FontWeight.w900,
                color: AppTheme.primaryNavy,
              ),
            ),
          ),
        );
      } else if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        final content = trimmed.substring(2);
        children.add(
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 2.5),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('•  ', style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF2563EB))),
                Expanded(child: _buildRichInlineText(content)),
              ],
            ),
          ),
        );
      } else if (RegExp(r'^[A-Z]\.\s').hasMatch(trimmed)) {
        final match = RegExp(r'^([A-Z]\.)\s*(.*)$').firstMatch(trimmed);
        final letter = match?.group(1) ?? 'A.';
        final title = (match?.group(2) ?? '').replaceAll('**', '').replaceAll('*', '').trim();
        children.add(
          Padding(
            padding: const EdgeInsets.only(top: 10, bottom: 4),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(
                    color: const Color(0xFFEFF6FF),
                    borderRadius: BorderRadius.circular(6),
                    border: Border.all(color: const Color(0xFFBFDBFE)),
                  ),
                  child: Text(
                    letter,
                    style: GoogleFonts.dmSans(
                      fontSize: 12,
                      fontWeight: FontWeight.w900,
                      color: const Color(0xFF1E40AF),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    title,
                    style: GoogleFonts.dmSans(
                      fontSize: 15,
                      fontWeight: FontWeight.w800,
                      color: AppTheme.primaryNavy,
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      } else if (RegExp(r'^\d+\.\s').hasMatch(trimmed)) {
        final match = RegExp(r'^(\d+\.)\s*(.*)$').firstMatch(trimmed);
        final num = match?.group(1) ?? '1.';
        final content = match?.group(2) ?? '';
        children.add(
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 2.5),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('$num  ', style: const TextStyle(fontWeight: FontWeight.w700, color: Color(0xFF2563EB))),
                Expanded(child: _buildRichInlineText(content)),
              ],
            ),
          ),
        );
      } else if (trimmed.startsWith('> ')) {
        final quote = trimmed.substring(2);
        children.add(
          Container(
            margin: const EdgeInsets.symmetric(vertical: 4),
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            decoration: BoxDecoration(
              color: const Color(0xFFF1F5F9),
              borderRadius: BorderRadius.circular(6),
              border: const Border(
                left: BorderSide(color: Color(0xFF2563EB), width: 3),
              ),
            ),
            child: _buildRichInlineText(quote),
          ),
        );
      } else {
        children.add(
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 2),
            child: _buildRichInlineText(trimmed),
          ),
        );
      }
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: children,
    );
  }

  Widget _buildRichInlineText(String text) {
    // Clean unwanted raw patterns like *"quote"* or "*quote*"
    String cleaned = text;
    cleaned = cleaned.replaceAll(RegExp(r'\*\"(.*?)\"\*'), '"\$1"');
    cleaned = cleaned.replaceAll(RegExp(r'\"\*(.*?)\*\"'), '"\$1"');

    // If entire line is wrapped in bold: **Heading text**
    if (cleaned.startsWith('**') && cleaned.endsWith('**') && cleaned.length > 4 && !cleaned.substring(2, cleaned.length - 2).contains('**')) {
      return Text(
        cleaned.substring(2, cleaned.length - 2),
        style: GoogleFonts.inter(
          fontSize: 14,
          height: 1.45,
          fontWeight: FontWeight.w800,
          color: const Color(0xFF0F172A),
        ),
      );
    }

    // Tokenise markdown spans: bold (**...**), italic (*...* or _..._), code (`...`)
    final regex = RegExp(r'(\*\*[^*]+?\*\*|\*[^*\s][^*]*?\*|`[^`]+?`|_[^_\s][^_]*?_)');
    final matches = regex.allMatches(cleaned);

    if (matches.isEmpty) {
      final plainText = cleaned.replaceAll(RegExp(r'^\*+|\*+$'), '').trim();
      return Text(
        plainText,
        style: GoogleFonts.inter(
          fontSize: 13.8,
          height: 1.45,
          fontWeight: FontWeight.w400,
          color: const Color(0xFF334155),
        ),
      );
    }

    final List<TextSpan> spans = [];
    int lastIndex = 0;

    for (final match in matches) {
      if (match.start > lastIndex) {
        final pre = cleaned.substring(lastIndex, match.start).replaceAll(RegExp(r'^\*+|\*+$'), '');
        if (pre.isNotEmpty) {
          spans.add(TextSpan(
            text: pre,
            style: GoogleFonts.inter(
              fontSize: 13.8,
              height: 1.45,
              fontWeight: FontWeight.w400,
              color: const Color(0xFF334155),
            ),
          ));
        }
      }

      final token = match.group(0)!;
      if (token.startsWith('**') && token.endsWith('**') && token.length > 4) {
        final inner = token.substring(2, token.length - 2);
        spans.add(TextSpan(
          text: inner,
          style: GoogleFonts.inter(
            fontSize: 13.8,
            height: 1.45,
            fontWeight: FontWeight.w800,
            color: const Color(0xFF0F172A),
          ),
        ));
      } else if (token.startsWith('*') && token.endsWith('*') && token.length > 2) {
        final inner = token.substring(1, token.length - 1);
        spans.add(TextSpan(
          text: inner,
          style: GoogleFonts.inter(
            fontSize: 13.8,
            height: 1.45,
            fontStyle: FontStyle.italic,
            fontWeight: FontWeight.w500,
            color: const Color(0xFF1E293B),
          ),
        ));
      } else if (token.startsWith('_') && token.endsWith('_') && token.length > 2) {
        final inner = token.substring(1, token.length - 1);
        spans.add(TextSpan(
          text: inner,
          style: GoogleFonts.inter(
            fontSize: 13.8,
            height: 1.45,
            fontStyle: FontStyle.italic,
            fontWeight: FontWeight.w500,
            color: const Color(0xFF1E293B),
          ),
        ));
      } else if (token.startsWith('`') && token.endsWith('`') && token.length > 2) {
        final inner = token.substring(1, token.length - 1);
        spans.add(TextSpan(
          text: ' $inner ',
          style: GoogleFonts.jetBrainsMono(
            fontSize: 12.5,
            fontWeight: FontWeight.w600,
            color: const Color(0xFF1E40AF),
            backgroundColor: const Color(0xFFEFF6FF),
          ),
        ));
      }

      lastIndex = match.end;
    }

    if (lastIndex < cleaned.length) {
      final post = cleaned.substring(lastIndex).replaceAll(RegExp(r'^\*+|\*+$'), '');
      if (post.isNotEmpty) {
        spans.add(TextSpan(
          text: post,
          style: GoogleFonts.inter(
            fontSize: 13.8,
            height: 1.45,
            fontWeight: FontWeight.w400,
            color: const Color(0xFF334155),
          ),
        ));
      }
    }

    return Text.rich(TextSpan(children: spans));
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
