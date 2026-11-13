import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme.dart';
import '../../services/ai/ai_config.dart';
import '../../services/ai/ai_key_manager.dart';

class AiSettingsSheet extends StatefulWidget {
  final VoidCallback? onClearChat;

  const AiSettingsSheet({super.key, this.onClearChat});

  @override
  State<AiSettingsSheet> createState() => _AiSettingsSheetState();
}

class _AiSettingsSheetState extends State<AiSettingsSheet> {
  final AiKeyManager _keyManager = AiKeyManager();

  late final TextEditingController _groqCtrl;
  late final TextEditingController _geminiCtrl;
  late final TextEditingController _nvidiaCtrl;
  late final TextEditingController _openRouterCtrl;

  bool _obscureKeys = true;
  bool _isLoading = true;
  Map<AiProvider, String> _statuses = {};

  @override
  void initState() {
    super.initState();
    _groqCtrl = TextEditingController();
    _geminiCtrl = TextEditingController();
    _nvidiaCtrl = TextEditingController();
    _openRouterCtrl = TextEditingController();
    _initData();
  }

  Future<void> _initData() async {
    await _keyManager.initialize();
    if (!mounted) return;
    setState(() {
      _groqCtrl.text = _keyManager.getCustomKey(AiProvider.groq) ?? '';
      _geminiCtrl.text = _keyManager.getCustomKey(AiProvider.gemini) ?? '';
      _nvidiaCtrl.text = _keyManager.getCustomKey(AiProvider.nvidia) ?? '';
      _openRouterCtrl.text = _keyManager.getCustomKey(AiProvider.openrouter) ?? '';
      _statuses = _keyManager.getProviderStatuses();
      _isLoading = false;
    });
  }

  @override
  void dispose() {
    _groqCtrl.dispose();
    _geminiCtrl.dispose();
    _nvidiaCtrl.dispose();
    _openRouterCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return Container(
        height: 240,
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
        alignment: Alignment.center,
        child: const CircularProgressIndicator(),
      );
    }

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
          top: 18,
          bottom: MediaQuery.of(context).viewInsets.bottom + 24,
        ),
        child: SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
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
                  Expanded(
                    child: Text(
                      'AI Engine & Failover Keys',
                      style: GoogleFonts.dmSans(
                        fontSize: 18,
                        fontWeight: FontWeight.w800,
                        color: AppTheme.primaryNavy,
                      ),
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close_rounded, size: 20),
                    onPressed: () => Navigator.pop(context),
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
              for (final entry in _statuses.entries)
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
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'CUSTOM BACKUP KEYS (OPTIONAL)',
                    style: GoogleFonts.inter(
                      fontSize: 11,
                      fontWeight: FontWeight.w800,
                      color: const Color(0xFF94A3B8),
                      letterSpacing: 0.5,
                    ),
                  ),
                  IconButton(
                    icon: Icon(
                      _obscureKeys ? Icons.visibility_off_outlined : Icons.visibility_outlined,
                      size: 18,
                      color: const Color(0xFF64748B),
                    ),
                    tooltip: _obscureKeys ? 'Show keys' : 'Hide keys',
                    padding: EdgeInsets.zero,
                    constraints: const BoxConstraints(),
                    onPressed: () => setState(() => _obscureKeys = !_obscureKeys),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              TextField(
                controller: _groqCtrl,
                obscureText: _obscureKeys,
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
                controller: _geminiCtrl,
                obscureText: _obscureKeys,
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
                controller: _nvidiaCtrl,
                obscureText: _obscureKeys,
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
                controller: _openRouterCtrl,
                obscureText: _obscureKeys,
                decoration: InputDecoration(
                  labelText: 'OpenRouter API Key',
                  helperText: 'Optional tier at openrouter.ai/keys',
                  helperStyle: GoogleFonts.inter(fontSize: 10.5, color: const Color(0xFF64748B)),
                  hintText: 'sk-or-v1-...',
                  isDense: true,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                ),
              ),
              const SizedBox(height: 16),
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
                        final nav = Navigator.of(context);
                        final messenger = ScaffoldMessenger.of(context);
                        await _keyManager.setCustomKey(AiProvider.groq, _groqCtrl.text);
                        await _keyManager.setCustomKey(AiProvider.gemini, _geminiCtrl.text);
                        await _keyManager.setCustomKey(AiProvider.nvidia, _nvidiaCtrl.text);
                        await _keyManager.setCustomKey(AiProvider.openrouter, _openRouterCtrl.text);
                        if (!mounted) return;
                        nav.pop();
                        messenger.showSnackBar(
                          const SnackBar(
                            content: Text('AI Engine API Keys updated successfully! ✨'),
                            backgroundColor: Color(0xFF10B981),
                            behavior: SnackBarBehavior.floating,
                          ),
                        );
                      },
                      child: Text('Save Custom Keys', style: GoogleFonts.inter(fontWeight: FontWeight.w700)),
                    ),
                  ),
                  if (widget.onClearChat != null) ...[
                    const SizedBox(width: 10),
                    OutlinedButton(
                      style: OutlinedButton.styleFrom(
                        foregroundColor: const Color(0xFFEF4444),
                        side: const BorderSide(color: Color(0xFFEF4444)),
                        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                      onPressed: () {
                        widget.onClearChat?.call();
                        Navigator.pop(context);
                      },
                      child: const Text('Clear Chat'),
                    ),
                  ],
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
