import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:share_plus/share_plus.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../core/theme.dart';
import '../../services/ai/ai_config.dart';
import '../../services/ai/ai_key_manager.dart';
import '../../services/ai/ai_rotation_service.dart';
import '../../services/ai/pharma_prompt_templates.dart';
import '../../widgets/pharma_mascot_widget.dart';

class PharmaHelperScreen extends StatefulWidget {
  final String? initialPrompt;
  final String? initialContextTitle;

  const PharmaHelperScreen({
    super.key,
    this.initialPrompt,
    this.initialContextTitle,
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

  final List<String> _suggestedPrompts = [
    'Bioavailability simple Hinglish me samjhao 💊',
    'Write a 5-mark answer on Tablet Capping & Lamination 📝',
    'What are the 4 validity criteria in Pharmacovigilance ICSR? 🔬',
    'GPCR signaling pathway simple analogy se batao ⚡',
    'ICH Q1A stability testing guidelines summary 📋',
    'Recent FDA approved antibody drugs search karo 🌐',
  ];

  @override
  void initState() {
    super.initState();
    _loadInitialGreeting();

    // If an initial prompt was passed (e.g. from Subject or Blog screen)
    if (widget.initialPrompt != null && widget.initialPrompt!.isNotEmpty) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        _handleSendMessage(widget.initialPrompt!);
      });
    }
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
        history: _messages.where((m) => m.id != 'greeting').toList(),
        mode: _selectedMode,
        forceWebSearch: _webSearchEnabled,
      );

      if (mounted) {
        setState(() {
          _messages.add(response);
          _isLoading = false;
        });
        _scrollToBottom();
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
        text: '📚 PharmaCode AI Tutor Note:\n\n$text\n\nStudied via PharmaCode — Complete B.Pharm Companion',
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
          Expanded(
            child: ListView.builder(
              controller: _scrollCtrl,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
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
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
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
              label: '🎓 Professor (Hinglish)',
              color: const Color(0xFF2563EB),
            ),
            const SizedBox(width: 8),
            _buildModeChip(
              mode: PharmaChatMode.examPrep,
              label: '📝 Exam Prep (5/10 Marks)',
              color: const Color(0xFF7C3AED),
            ),
            const SizedBox(width: 8),
            _buildModeChip(
              mode: PharmaChatMode.mnemonic,
              label: '💡 Mnemonics & Tricks',
              color: const Color(0xFFD97706),
            ),
            const SizedBox(width: 8),
            _buildModeChip(
              mode: PharmaChatMode.webSearch,
              label: '🌐 Web Research (FDA/CDSCO)',
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
      borderRadius: BorderRadius.circular(20),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: isSelected ? color : const Color(0xFFF1F5F9),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isSelected ? color : const Color(0xFFE2E8F0),
          ),
        ),
        child: Text(
          label,
          style: GoogleFonts.inter(
            fontSize: 12,
            fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
            color: isSelected ? Colors.white : const Color(0xFF475569),
          ),
        ),
      ),
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
            padding: const EdgeInsets.all(16),
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
                    '🌐 Live Web Citations & Sources:',
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
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
        decoration: BoxDecoration(
          color: Colors.white,
          border: const Border(top: BorderSide(color: Color(0xFFE2E8F0))),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.04),
              blurRadius: 10,
              offset: const Offset(0, -3),
            ),
          ],
        ),
      child: Row(
        children: [
          // Web Search Toggle
          IconButton(
            icon: Icon(
              Icons.language_rounded,
              color: _webSearchEnabled ? const Color(0xFF0D9488) : const Color(0xFF94A3B8),
            ),
            tooltip: _webSearchEnabled ? 'Web Search Active' : 'Enable Web Search',
            onPressed: () {
              setState(() {
                _webSearchEnabled = !_webSearchEnabled;
              });
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(
                    _webSearchEnabled ? '🌐 Live Web Grounding Enabled' : 'Offline In-App Grounding Only',
                    style: GoogleFonts.inter(fontWeight: FontWeight.w600),
                  ),
                  duration: const Duration(seconds: 1),
                  behavior: SnackBarBehavior.floating,
                ),
              );
            },
          ),
          Expanded(
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 14),
              decoration: BoxDecoration(
                color: const Color(0xFFF1F5F9),
                borderRadius: BorderRadius.circular(24),
              ),
              child: TextField(
                controller: _textCtrl,
                minLines: 1,
                maxLines: 4,
                textInputAction: TextInputAction.send,
                onSubmitted: _handleSendMessage,
                style: GoogleFonts.inter(fontSize: 14, color: const Color(0xFF0F172A)),
                decoration: InputDecoration(
                  hintText: 'Ask PharmaHelper in Hinglish or English...',
                  hintStyle: GoogleFonts.inter(color: const Color(0xFF94A3B8), fontSize: 13.5),
                  border: InputBorder.none,
                  isDense: true,
                  contentPadding: const EdgeInsets.symmetric(vertical: 10),
                ),
              ),
            ),
          ),
          const SizedBox(width: 8),
          Container(
            width: 42,
            height: 42,
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF2563EB), Color(0xFF1D4ED8)],
              ),
              shape: BoxShape.circle,
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFF2563EB).withValues(alpha: 0.3),
                  blurRadius: 6,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: IconButton(
              icon: const Icon(Icons.send_rounded, color: Colors.white, size: 19),
              onPressed: () => _handleSendMessage(_textCtrl.text),
            ),
          ),
        ],
      ),
    ),
  );
}

  /// Clean formatted text rendering for markdown without extra heavy packages
  Widget _renderFormattedText(String text) {
    final lines = text.split('\n');
    final List<Widget> children = [];

    for (final line in lines) {
      final trimmed = line.trim();

      if (trimmed.isEmpty) {
        children.add(const SizedBox(height: 6));
        continue;
      }

      if (trimmed.startsWith('### ')) {
        children.add(
          Padding(
            padding: const EdgeInsets.only(top: 8, bottom: 4),
            child: Text(
              trimmed.substring(4),
              style: GoogleFonts.dmSans(
                fontSize: 15.5,
                fontWeight: FontWeight.w800,
                color: AppTheme.primaryNavy,
              ),
            ),
          ),
        );
      } else if (trimmed.startsWith('## ')) {
        children.add(
          Padding(
            padding: const EdgeInsets.only(top: 10, bottom: 4),
            child: Text(
              trimmed.substring(3),
              style: GoogleFonts.dmSans(
                fontSize: 17,
                fontWeight: FontWeight.w900,
                color: AppTheme.primaryNavy,
              ),
            ),
          ),
        );
      } else if (trimmed.startsWith('# ')) {
        children.add(
          Padding(
            padding: const EdgeInsets.only(top: 12, bottom: 6),
            child: Text(
              trimmed.substring(2),
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
    // Basic bold **text** parser
    final parts = text.split('**');
    final List<TextSpan> spans = [];

    for (int i = 0; i < parts.length; i++) {
      final isBold = i % 2 == 1;
      spans.add(
        TextSpan(
          text: parts[i],
          style: GoogleFonts.inter(
            fontSize: 13.8,
            height: 1.45,
            fontWeight: isBold ? FontWeight.w800 : FontWeight.w400,
            color: isBold ? const Color(0xFF0F172A) : const Color(0xFF334155),
          ),
        ),
      );
    }

    return Text.rich(TextSpan(children: spans));
  }

  Widget _buildSettingsSheet(BuildContext ctx) {
    final statuses = _keyManager.getProviderStatuses();
    final groqCtrl = TextEditingController(text: _keyManager.getCustomKey(AiProvider.groq) ?? '');
    final geminiCtrl = TextEditingController(text: _keyManager.getCustomKey(AiProvider.gemini) ?? '');
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
                  'PharmaCode uses awesome-freellm-apis with automatic multi-tier fallback so students never see rate limit errors.',
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
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          AiConfig.providers[entry.key]?.displayName ?? entry.key.name,
                          style: GoogleFonts.inter(fontSize: 12.5, fontWeight: FontWeight.w600),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: entry.value.contains('Online') || entry.value.contains('Active')
                                ? const Color(0xFFDCFCE7)
                                : const Color(0xFFFEF3C7),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            entry.value,
                            style: GoogleFonts.inter(
                              fontSize: 10,
                              fontWeight: FontWeight.w700,
                              color: entry.value.contains('Online') || entry.value.contains('Active')
                                  ? const Color(0xFF166534)
                                  : const Color(0xFF92400E),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                const SizedBox(height: 16),
                Text(
                  'CUSTOM FREE KEYS (OPTIONAL)',
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
                    labelText: 'Groq Cloud API Key (Free at console.groq.com)',
                    hintText: 'gsk_...',
                    isDense: true,
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                ),
                const SizedBox(height: 10),
                TextField(
                  controller: geminiCtrl,
                  decoration: InputDecoration(
                    labelText: 'Google Gemini API Key (Free at aistudio.google.com)',
                    hintText: 'AIzaSy...',
                    isDense: true,
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                ),
                const SizedBox(height: 10),
                TextField(
                  controller: openRouterCtrl,
                  decoration: InputDecoration(
                    labelText: 'OpenRouter API Key (Free at openrouter.ai)',
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
                          await _keyManager.setCustomKey(AiProvider.openrouter, openRouterCtrl.text);
                          if (ctx.mounted) {
                            Navigator.pop(ctx);
                            messenger.showSnackBar(
                              const SnackBar(
                                content: Text('API Keys saved securely!'),
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
