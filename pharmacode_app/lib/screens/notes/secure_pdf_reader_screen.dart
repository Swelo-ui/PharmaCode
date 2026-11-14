import 'dart:async';
import 'dart:io';
import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:flutter_pdfview/flutter_pdfview.dart';
import 'package:http/http.dart' as http;
import 'package:path_provider/path_provider.dart';
import '../../core/security/secure_doc_resolver.dart';
import '../../core/services/offline_storage_service.dart';
import '../../core/services/security_service.dart';
import '../../services/auth_service.dart';
import '../../services/pdf_service.dart';

/// Classplus-Style Secure In-App PDF Reader
/// Features:
/// - Native Android WindowManager.FLAG_SECURE (Blocks Screenshots & Screen Recording)
/// - Zero leak vectors: NO Download, NO Share, NO Open With, NO Export
/// - Private sandbox encrypted/temporary cache (Never saved to public SD card / gallery)
/// - Subtle, non-intrusive diagonal anti-piracy watermark with masked user identity
/// - Full-screen reading canvas with crisp pinch-to-zoom & page controls
class SecurePdfReaderScreen extends StatefulWidget {
  final AdminPdfItem pdfItem;

  const SecurePdfReaderScreen({
    super.key,
    required this.pdfItem,
  });

  @override
  State<SecurePdfReaderScreen> createState() => _SecurePdfReaderScreenState();
}

class _SecurePdfReaderScreenState extends State<SecurePdfReaderScreen> with WidgetsBindingObserver {
  final SecurityService _security = SecurityService();
  final Completer<PDFViewController> _controller = Completer<PDFViewController>();

  String? _localFilePath;
  bool _isLoading = true;
  String _loadingMessage = 'Securing document and preparing high-res pages...';
  String? _errorMessage;

  int _currentPage = 0;
  int _totalPages = 0;
  bool _nightMode = false;
  bool _isToolbarVisible = true;

  // Offline storage state
  bool _isDownloaded = false;
  bool _isSavingOffline = false;
  Uint8List? _cachedRawBytes;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);

    // 1. Immediately enforce Android FLAG_SECURE
    _security.enableSecureMode();

    // 2. Check offline availability and fetch/load PDF
    _checkOfflineStatus();
    _loadSecurePdf();
  }

  Future<void> _checkOfflineStatus() async {
    final downloaded = await OfflineStorageService.instance.isPdfDownloaded(widget.pdfItem.id);
    if (mounted) {
      setState(() => _isDownloaded = downloaded);
    }
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    // Re-verify FLAG_SECURE on app resume/pause
    if (state == AppLifecycleState.resumed || state == AppLifecycleState.paused) {
      _security.enableSecureMode();
    }
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);

    // Turn off FLAG_SECURE when leaving the protected document viewer
    _security.disableSecureMode();

    // Clean up temporary sandbox file to protect memory
    _cleanupSandboxFile();
    super.dispose();
  }

  Future<void> _cleanupSandboxFile() async {
    if (_localFilePath != null) {
      try {
        final file = File(_localFilePath!);
        // Only delete if it's an ephemeral temporary view file (Do not delete encrypted permanent offline file)
        if (!file.path.endsWith('.enc') && await file.exists()) {
          await file.delete();
        }
      } catch (_) {}
    }
  }

  Future<void> _loadSecurePdf() async {
    try {
      setState(() {
        _isLoading = true;
        _errorMessage = null;
        _loadingMessage = 'Securing document and preparing high-res pages...';
      });

      // 1. Check if document exists in Offline Storage
      final isOffline = await OfflineStorageService.instance.isPdfDownloaded(widget.pdfItem.id);
      if (isOffline) {
        final decryptedFile = await OfflineStorageService.instance.getDecryptedOfflineFile(widget.pdfItem.id);
        if (decryptedFile != null && await decryptedFile.exists()) {
          final bytes = await decryptedFile.readAsBytes();
          if (mounted) {
            setState(() {
              _localFilePath = decryptedFile.path;
              _cachedRawBytes = bytes;
              _isDownloaded = true;
              _isLoading = false;
            });
          }
          return;
        }
      }

      // 2. Not in offline storage: Fetch via Secure Resolver (Obfuscated & Anti-Reverse Engineered)
      final url = SecureDocResolver.resolveSecureUrl(
        widget.pdfItem.id,
        fallbackUrl: widget.pdfItem.url.isNotEmpty
            ? widget.pdfItem.url
            : PdfService.instance.getTrackedDownloadUrl(widget.pdfItem.id),
      );

      final uri = Uri.parse(url);
      final response = await http.get(uri).timeout(const Duration(seconds: 25));

      if (response.statusCode >= 200 && response.statusCode < 300) {
        _cachedRawBytes = response.bodyBytes;

        // Store in private app support directory (Inaccessible by external file explorers)
        final dir = await getApplicationSupportDirectory();
        final secureDir = Directory('${dir.path}/secure_docs');
        if (!await secureDir.exists()) {
          await secureDir.create(recursive: true);
        }

        final filePath = '${secureDir.path}/doc_${widget.pdfItem.id}_${DateTime.now().millisecondsSinceEpoch}.bin';
        final file = File(filePath);
        await file.writeAsBytes(response.bodyBytes, flush: true);

        if (mounted) {
          setState(() {
            _localFilePath = filePath;
            _isLoading = false;
          });
        }
      } else {
        throw Exception('Server returned status code: ${response.statusCode}');
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _isLoading = false;
          _errorMessage = 'Could not load PDF document.\nPlease check your internet connection and try again.';
        });
      }
    }
  }

  /// Handles user tapping the Download / Offline button
  Future<void> _handleDownloadAction() async {
    // POLICY ENFORCEMENT: Free study guides cannot be saved offline (Ad supported streaming only)
    if (!widget.pdfItem.isPremium) {
      _showFreeDownloadLockedDialog();
      return;
    }

    // PAID / VIP GUIDES:
    if (_isDownloaded) {
      _showOfflineOptionsDialog();
      return;
    }

    await _saveCurrentDocumentOffline();
  }

  Future<void> _saveCurrentDocumentOffline() async {
    setState(() => _isSavingOffline = true);

    try {
      Uint8List? bytesToSave = _cachedRawBytes;
      if (bytesToSave == null && _localFilePath != null) {
        final f = File(_localFilePath!);
        if (await f.exists()) {
          bytesToSave = await f.readAsBytes();
        }
      }

      if (bytesToSave == null) {
        throw Exception('Document bytes not ready. Please wait for the document to finish loading.');
      }

      final success = await OfflineStorageService.instance.savePdfOffline(widget.pdfItem, bytesToSave);
      if (success) {
        if (mounted) {
          setState(() {
            _isDownloaded = true;
            _isSavingOffline = false;
          });
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Row(
                children: [
                  Icon(Icons.check_circle_rounded, color: Color(0xFF10B981), size: 18),
                  SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      '✓ Saved offline! Access anytime without mobile data.',
                      style: TextStyle(fontWeight: FontWeight.w700),
                    ),
                  ),
                ],
              ),
              backgroundColor: Color(0xFF0F172A),
              duration: Duration(seconds: 3),
            ),
          );
        }
      } else {
        throw Exception('Could not write encrypted offline file.');
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isSavingOffline = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Offline save error: $e'),
            backgroundColor: Colors.redAccent,
          ),
        );
      }
    }
  }

  void _showFreeDownloadLockedDialog() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: _nightMode ? const Color(0xFF1E1E1E) : Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: const Color(0xFFFEF3C7),
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(Icons.lock_rounded, color: Color(0xFFD97706), size: 22),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                'Free Study Guide',
                style: TextStyle(
                  fontFamily: 'Nunito',
                  fontSize: 16,
                  fontWeight: FontWeight.w900,
                  color: _nightMode ? Colors.white : const Color(0xFF0F172A),
                ),
              ),
            ),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'This free study guide is sponsored by short ads and streams online in the secure reader.',
              style: TextStyle(
                fontFamily: 'Nunito',
                fontSize: 13,
                fontWeight: FontWeight.w600,
                color: _nightMode ? Colors.white70 : const Color(0xFF334155),
                height: 1.4,
              ),
            ),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFFEEF2FF),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFFC7D2FE)),
              ),
              child: const Row(
                children: [
                  Icon(Icons.workspace_premium_rounded, color: Color(0xFF3B5BDB), size: 18),
                  SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      'Offline storage is exclusively available for VIP Guides (PV, RA & ₹499 VIP Pass).',
                      style: TextStyle(
                        fontFamily: 'Nunito',
                        fontSize: 11.5,
                        fontWeight: FontWeight.w800,
                        color: Color(0xFF1E3A8A),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
        actions: [
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF1E3A8A),
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            ),
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Understand', style: TextStyle(fontFamily: 'Nunito', fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  void _showOfflineOptionsDialog() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: _nightMode ? const Color(0xFF1E1E1E) : Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
        title: Row(
          children: [
            const Icon(Icons.check_circle_rounded, color: Color(0xFF10B981), size: 22),
            const SizedBox(width: 10),
            Expanded(
              child: Text(
                'Saved in Offline Storage',
                style: TextStyle(
                  fontFamily: 'Nunito',
                  fontSize: 16,
                  fontWeight: FontWeight.w900,
                  color: _nightMode ? Colors.white : const Color(0xFF0F172A),
                ),
              ),
            ),
          ],
        ),
        content: Text(
          'This guide is safely encrypted in your private app storage. You can read it anytime with zero mobile data.\n\nWould you like to remove this offline copy to free up storage?',
          style: TextStyle(
            fontFamily: 'Nunito',
            fontSize: 13,
            fontWeight: FontWeight.w600,
            color: _nightMode ? Colors.white70 : const Color(0xFF334155),
            height: 1.4,
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Keep Offline', style: TextStyle(fontFamily: 'Nunito', fontWeight: FontWeight.w700)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFDC2626),
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            ),
            onPressed: () async {
              Navigator.pop(ctx);
              await OfflineStorageService.instance.removeOfflinePdf(widget.pdfItem.id);
              if (mounted) {
                setState(() => _isDownloaded = false);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Offline copy removed from private storage.'),
                    backgroundColor: Color(0xFF334155),
                  ),
                );
              }
            },
            child: const Text('Remove', style: TextStyle(fontFamily: 'Nunito', fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  /// Formatted masked watermark text: e.g. "PharmaCode · sh***@gmail.com · UID: a82f"
  String _getWatermarkText() {
    final user = AuthService().currentUser;
    if (user == null) {
      return 'PharmaCode Verified Student';
    }

    final email = user.email ?? '';
    String maskedEmail = 'Student';
    if (email.contains('@')) {
      final parts = email.split('@');
      final prefix = parts[0];
      final domain = parts[1];
      final visibleLen = prefix.length > 2 ? 2 : 1;
      maskedEmail = '${prefix.substring(0, visibleLen)}***@$domain';
    }

    final uidPart = user.uid.length > 6 ? user.uid.substring(0, 6) : user.uid;
    return 'PharmaCode • $maskedEmail • ID: $uidPart';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _nightMode ? const Color(0xFF121212) : const Color(0xFFF8FAFC),
      body: SafeArea(
        child: Stack(
          children: [
            // ─── MAIN PDF VIEW CANVAS ─────────────────────────────────────────
            GestureDetector(
              onTap: () {
                setState(() => _isToolbarVisible = !_isToolbarVisible);
              },
              child: _buildPdfContent(),
            ),

            // ─── CLASSPLUS-STYLE NON-INTRUSIVE WATERMARK LAYER ────────────────
            // Ignores touch events completely so pinch-to-zoom is 100% fluid
            Positioned.fill(
              child: IgnorePointer(
                child: _buildElegantWatermarkGrid(),
              ),
            ),

            // ─── TOP APP BAR (AUTOHIDES ON TAP) ───────────────────────────────
            AnimatedPositioned(
              duration: const Duration(milliseconds: 200),
              curve: Curves.easeInOut,
              top: _isToolbarVisible ? 0 : -80,
              left: 0,
              right: 0,
              child: _buildTopBar(),
            ),

            // ─── BOTTOM CONTROLS & PAGE PILL ──────────────────────────────────
            AnimatedPositioned(
              duration: const Duration(milliseconds: 200),
              curve: Curves.easeInOut,
              bottom: _isToolbarVisible ? 16 : -80,
              left: 20,
              right: 20,
              child: _buildBottomControls(),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPdfContent() {
    if (_isLoading) {
      return Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const SizedBox(
              width: 44,
              height: 44,
              child: CircularProgressIndicator(
                strokeWidth: 3,
                valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF1E3A8A)),
              ),
            ),
            const SizedBox(height: 18),
            Text(
              _loadingMessage,
              style: TextStyle(
                fontFamily: 'Nunito',
                fontSize: 13,
                fontWeight: FontWeight.w600,
                color: _nightMode ? Colors.white70 : const Color(0xFF475569),
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.security_rounded, size: 14, color: Color(0xFF059669)),
                const SizedBox(width: 4),
                Text(
                  'Encrypted Sandbox & Screen Protection Active',
                  style: TextStyle(
                    fontFamily: 'Nunito',
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    color: const Color(0xFF059669),
                  ),
                ),
              ],
            ),
          ],
        ),
      );
    }

    if (_errorMessage != null || _localFilePath == null) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(28.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 60,
                height: 60,
                decoration: BoxDecoration(
                  color: Colors.red.withValues(alpha: 0.1),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.error_outline_rounded, color: Colors.redAccent, size: 32),
              ),
              const SizedBox(height: 16),
              Text(
                _errorMessage ?? 'Failed to open protected document.',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontFamily: 'Nunito',
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: _nightMode ? Colors.white70 : const Color(0xFF334155),
                ),
              ),
              const SizedBox(height: 20),
              ElevatedButton.icon(
                onPressed: _loadSecurePdf,
                icon: const Icon(Icons.refresh_rounded, size: 16),
                label: const Text('Retry Loading', style: TextStyle(fontFamily: 'Nunito', fontWeight: FontWeight.bold)),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF1E3A8A),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  padding: const EdgeInsets.symmetric(horizontal: 22, vertical: 12),
                ),
              ),
            ],
          ),
        ),
      );
    }

    return PDFView(
      filePath: _localFilePath!,
      enableSwipe: true,
      swipeHorizontal: false,
      autoSpacing: true,
      pageFling: true,
      pageSnap: true,
      defaultPage: _currentPage,
      fitPolicy: FitPolicy.WIDTH,
      nightMode: _nightMode,
      onRender: (pages) {
        setState(() {
          _totalPages = pages ?? 0;
        });
      },
      onError: (error) {
        setState(() {
          _errorMessage = error.toString();
        });
      },
      onPageError: (page, error) {
        debugPrint('Page $page error: $error');
      },
      onViewCreated: (PDFViewController pdfViewController) {
        if (!_controller.isCompleted) {
          _controller.complete(pdfViewController);
        }
      },
      onPageChanged: (int? page, int? total) {
        setState(() {
          _currentPage = page ?? 0;
          _totalPages = total ?? _totalPages;
        });
      },
    );
  }

  /// Subtle Classplus-Style Watermark Grid
  /// - Opacity is very low (0.06 - 0.08) so reading is never impaired
  /// - Rotated at -25 degrees across the screen
  /// - Cannot be blocked by screenshots (because FLAG_SECURE stops capture anyway)
  /// - Deters external camera piracy
  Widget _buildElegantWatermarkGrid() {
    final watermarkText = _getWatermarkText();

    return LayoutBuilder(
      builder: (context, constraints) {
        return Opacity(
          opacity: _nightMode ? 0.08 : 0.065,
          child: Transform.rotate(
            angle: -0.44, // approx -25 degrees
            child: OverflowBox(
              maxWidth: constraints.maxWidth * 2,
              maxHeight: constraints.maxHeight * 2,
              child: Column(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: List.generate(7, (rowIndex) {
                  return Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: List.generate(3, (colIndex) {
                      return Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 40),
                        child: Text(
                          watermarkText,
                          style: TextStyle(
                            fontFamily: 'Nunito',
                            fontSize: 13,
                            fontWeight: FontWeight.w800,
                            letterSpacing: 1.2,
                            color: _nightMode ? Colors.white : Colors.black,
                          ),
                        ),
                      );
                    }),
                  );
                }),
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildTopBar() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: _nightMode ? const Color(0xFF1E1E1E) : Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.06),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          IconButton(
            icon: Icon(
              Icons.arrow_back_ios_new_rounded,
              size: 18,
              color: _nightMode ? Colors.white : const Color(0xFF0F172A),
            ),
            onPressed: () => Navigator.of(context).pop(),
          ),
          const SizedBox(width: 4),
          Expanded(
            child: Builder(
              builder: (context) {
                final isCro = widget.pdfItem.id == 'pdf-career-free' ||
                    widget.pdfItem.id == 'pdf-cro-manual' ||
                    widget.pdfItem.title.toLowerCase().contains('cro');
                final displayTitle = isCro
                    ? 'CRO Operations Manual – PharmaCode (2026 Edition)'
                    : widget.pdfItem.title;
                final displayCode = isCro ? 'CRO-OPS' : widget.pdfItem.subjectCode;
                final displayUnit = isCro ? '15 Chapters & Onboarding Kit' : widget.pdfItem.unit;

                return Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      displayTitle,
                      style: TextStyle(
                        fontFamily: 'Nunito',
                        fontSize: 13,
                        fontWeight: FontWeight.w800,
                        color: _nightMode ? Colors.white : const Color(0xFF0F172A),
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1),
                          decoration: BoxDecoration(
                            color: (isCro ? const Color(0xFF059669) : const Color(0xFF1E3A8A)).withValues(alpha: 0.12),
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: Text(
                            displayCode,
                            style: TextStyle(
                              fontFamily: 'JetBrains Mono',
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                              color: isCro ? const Color(0xFF059669) : const Color(0xFF1E3A8A),
                            ),
                          ),
                        ),
                        const SizedBox(width: 6),
                        Flexible(
                          child: Text(
                            displayUnit,
                            style: TextStyle(
                              fontFamily: 'Nunito',
                              fontSize: 11,
                              color: _nightMode ? Colors.white60 : const Color(0xFF64748B),
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                  ],
                );
              },
            ),
          ),
          // Night mode toggle
          IconButton(
            tooltip: _nightMode ? 'Day Mode' : 'Night Mode',
            icon: Icon(
              _nightMode ? Icons.light_mode_rounded : Icons.dark_mode_rounded,
              size: 20,
              color: _nightMode ? Colors.amber : const Color(0xFF475569),
            ),
            onPressed: () {
              setState(() => _nightMode = !_nightMode);
            },
          ),
          // Download / Save Offline button (Functional Classplus-Style Offline Gating)
          if (!widget.pdfItem.isPremium)
            IconButton(
              tooltip: 'Free Note (Streaming Only)',
              icon: Icon(
                Icons.file_download_off_rounded,
                size: 20,
                color: _nightMode ? Colors.white38 : const Color(0xFF94A3B8),
              ),
              onPressed: _showFreeDownloadLockedDialog,
            )
          else if (_isSavingOffline)
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 12),
              child: SizedBox(
                width: 18,
                height: 18,
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                  valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF10B981)),
                ),
              ),
            )
          else if (_isDownloaded)
            IconButton(
              tooltip: 'Saved in Offline Storage',
              icon: const Icon(
                Icons.download_done_rounded,
                size: 22,
                color: Color(0xFF10B981),
              ),
              onPressed: _showOfflineOptionsDialog,
            )
          else
            IconButton(
              tooltip: 'Save Offline',
              icon: Icon(
                Icons.file_download_outlined,
                size: 20,
                color: _nightMode ? Colors.white70 : const Color(0xFF475569),
              ),
              onPressed: _handleDownloadAction,
            ),
        ],
      ),
    );
  }

  Widget _buildBottomControls() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        // Elegant Pill indicating current page and secure status
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          decoration: BoxDecoration(
            color: _nightMode ? const Color(0xFF1E1E1E) : Colors.white,
            borderRadius: BorderRadius.circular(30),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.12),
                blurRadius: 10,
                offset: const Offset(0, 3),
              ),
            ],
            border: Border.all(
              color: _nightMode ? Colors.white12 : const Color(0xFFE2E8F0),
            ),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.lock_rounded, size: 14, color: Color(0xFF059669)),
              const SizedBox(width: 6),
              Text(
                'Page ${_currentPage + 1} of ${_totalPages > 0 ? _totalPages : widget.pdfItem.pages}',
                style: TextStyle(
                  fontFamily: 'Nunito',
                  fontSize: 12,
                  fontWeight: FontWeight.w700,
                  color: _nightMode ? Colors.white : const Color(0xFF0F172A),
                ),
              ),
              const SizedBox(width: 10),
              Container(width: 1, height: 14, color: Colors.grey.withValues(alpha: 0.3)),
              const SizedBox(width: 10),
              GestureDetector(
                onTap: _showJumpPageDialog,
                child: Text(
                  'Go to',
                  style: TextStyle(
                    fontFamily: 'Nunito',
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: const Color(0xFF2563EB),
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  void _showJumpPageDialog() {
    if (_totalPages <= 1) return;
    int target = _currentPage + 1;

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: _nightMode ? const Color(0xFF1E1E1E) : Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Text(
          'Go to Page (1 - $_totalPages)',
          style: TextStyle(
            fontFamily: 'Nunito',
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: _nightMode ? Colors.white : const Color(0xFF0F172A),
          ),
        ),
        content: StatefulBuilder(
          builder: (context, setDialogState) => Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                'Page $target',
                style: const TextStyle(
                  fontFamily: 'JetBrains Mono',
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF1E3A8A),
                ),
              ),
              Slider(
                value: target.toDouble(),
                min: 1,
                max: _totalPages.toDouble(),
                divisions: _totalPages - 1,
                activeColor: const Color(0xFF1E3A8A),
                onChanged: (val) {
                  setDialogState(() => target = val.round());
                },
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel', style: TextStyle(fontFamily: 'Nunito')),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF1E3A8A),
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            ),
            onPressed: () async {
              Navigator.pop(ctx);
              final controller = await _controller.future;
              await controller.setPage(target - 1);
            },
            child: const Text('Jump', style: TextStyle(fontFamily: 'Nunito', fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }
}
