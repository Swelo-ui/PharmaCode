import 'dart:io';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/animations.dart';
import '../../core/services/offline_storage_service.dart';
import '../../core/theme.dart';
import '../../services/pdf_service.dart';
import '../main_navigation_screen.dart';
import 'secure_pdf_reader_screen.dart';

/// Screen listing all downloaded offline study guides & notes
/// Reads directly from encrypted sandbox storage with 0 internet dependency.
class OfflineDownloadsScreen extends StatefulWidget {
  final bool isOfflineLaunch;

  const OfflineDownloadsScreen({
    super.key,
    this.isOfflineLaunch = false,
  });

  @override
  State<OfflineDownloadsScreen> createState() => _OfflineDownloadsScreenState();
}

class _OfflineDownloadsScreenState extends State<OfflineDownloadsScreen> {
  final OfflineStorageService _offlineService = OfflineStorageService.instance;
  List<AdminPdfItem> _downloadedItems = [];
  String _totalSizeStr = '0.0 MB';
  bool _isLoading = true;
  bool _isCheckingConnection = false;

  Future<void> _checkConnectivityAndPrompt() async {
    if (_isCheckingConnection) return;
    setState(() => _isCheckingConnection = true);

    bool isOnline = false;
    try {
      final lookup = await InternetAddress.lookup('dns.google').timeout(const Duration(seconds: 4));
      isOnline = lookup.isNotEmpty && lookup[0].rawAddress.isNotEmpty;
    } catch (_) {
      isOnline = false;
    }

    if (!mounted) return;
    setState(() => _isCheckingConnection = false);

    if (isOnline) {
      _showInternetRestoredDialog();
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Row(
            children: [
              const Icon(Icons.wifi_off_rounded, color: Colors.white, size: 18),
              const SizedBox(width: 10),
              Expanded(
                child: Text(
                  'No internet detected. Connect to Wi-Fi or Mobile Data to open Home.',
                  style: GoogleFonts.dmSans(fontWeight: FontWeight.w700, fontSize: 12.5),
                ),
              ),
            ],
          ),
          backgroundColor: const Color(0xFFDC2626),
          behavior: SnackBarBehavior.floating,
          duration: const Duration(seconds: 3),
        ),
      );
    }
  }

  void _showInternetRestoredDialog() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: const Color(0xFFECFDF5),
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(Icons.wifi_rounded, color: Color(0xFF059669), size: 22),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                'Internet Restored!',
                style: GoogleFonts.dmSans(
                  fontWeight: FontWeight.w900,
                  fontSize: 17,
                  color: AppTheme.primaryNavy,
                ),
              ),
            ),
          ],
        ),
        content: Text(
          'Your internet connection is back online. Would you like to enter PharmaCode Home now?',
          style: GoogleFonts.dmSans(
            color: const Color(0xFF475569),
            fontSize: 13,
            height: 1.4,
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: Text(
              'Stay in Offline Library',
              style: GoogleFonts.dmSans(
                fontWeight: FontWeight.w700,
                color: const Color(0xFF64748B),
              ),
            ),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(ctx);
              Navigator.pushReplacement(
                context,
                MaterialPageRoute(builder: (_) => const MainNavigationScreen()),
              );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF1E3A8A),
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
            child: Text(
              'Open Home',
              style: GoogleFonts.dmSans(fontWeight: FontWeight.w800),
            ),
          ),
        ],
      ),
    );
  }

  @override
  void initState() {
    super.initState();
    _loadOfflineList();
  }

  Future<void> _loadOfflineList() async {
    setState(() => _isLoading = true);
    final items = await _offlineService.getDownloadedPdfs();
    final sizeStr = await _offlineService.getTotalOfflineSizeFormatted();
    if (mounted) {
      setState(() {
        _downloadedItems = items;
        _totalSizeStr = sizeStr;
        _isLoading = false;
      });
    }
  }

  Future<void> _deleteOfflinePdf(AdminPdfItem item) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Text('Remove Offline Copy?', style: GoogleFonts.dmSans(fontWeight: FontWeight.w800, fontSize: 16)),
        content: Text(
          'This will delete the local offline file of "${item.title}". You will need internet data to read or re-download it.',
          style: GoogleFonts.dmSans(fontSize: 13, color: const Color(0xFF475569)),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: Text('Keep', style: GoogleFonts.dmSans(fontWeight: FontWeight.w700, color: const Color(0xFF64748B))),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(ctx, true),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFDC2626),
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            ),
            child: Text('Delete', style: GoogleFonts.dmSans(fontWeight: FontWeight.w800)),
          ),
        ],
      ),
    );

    if (confirm == true) {
      await _offlineService.removeOfflinePdf(item.id);
      await _loadOfflineList();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Offline copy removed from private storage.'),
            backgroundColor: Color(0xFF334155),
            duration: Duration(seconds: 2),
          ),
        );
      }
    }
  }

  void _openReader(AdminPdfItem item) {
    AppHaptics.selectionClick();
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => SecurePdfReaderScreen(pdfItem: item),
      ),
    ).then((_) => _loadOfflineList());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        titleSpacing: 0,
        leading: Navigator.canPop(context)
            ? IconButton(
                icon: const Icon(Icons.arrow_back_rounded),
                onPressed: () => Navigator.pop(context),
                tooltip: 'Back',
              )
            : const Padding(
                padding: EdgeInsets.only(left: 16),
                child: Icon(Icons.folder_special_rounded, color: Color(0xFF1E3A8A), size: 22),
              ),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Offline Library',
              style: GoogleFonts.dmSans(
                color: AppTheme.primaryNavy,
                fontWeight: FontWeight.w900,
                fontSize: 18,
              ),
            ),
            Text(
              !_isLoading && _downloadedItems.isNotEmpty
                  ? '${_downloadedItems.length} Saved Document${_downloadedItems.length > 1 ? 's' : ''} • $_totalSizeStr'
                  : 'Read your saved study documents offline',
              style: GoogleFonts.dmSans(
                color: AppTheme.brandBlue,
                fontWeight: FontWeight.w700,
                fontSize: 11,
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: _isCheckingConnection
                ? const SizedBox(
                    width: 16,
                    height: 16,
                    child: CircularProgressIndicator(strokeWidth: 2, color: AppTheme.primaryNavy),
                  )
                : const Icon(Icons.refresh_rounded, size: 20),
            onPressed: () {
              _loadOfflineList();
              if (widget.isOfflineLaunch) {
                _checkConnectivityAndPrompt();
              }
            },
            tooltip: widget.isOfflineLaunch ? 'Check Connection' : 'Refresh',
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : Column(
              children: [
                if (widget.isOfflineLaunch)
                  Container(
                    width: double.infinity,
                    margin: const EdgeInsets.fromLTRB(16, 12, 16, 4),
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF1F5F9),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: const Color(0xFFE2E8F0)),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.offline_pin_rounded, color: Color(0xFF059669), size: 18),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Text(
                            'Encrypted Offline Storage: Saved study guides remain fully accessible offline without internet.',
                            style: GoogleFonts.dmSans(
                              fontSize: 11.5,
                              color: const Color(0xFF334155),
                              fontWeight: FontWeight.w600,
                              height: 1.35,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                Expanded(
                  child: RefreshIndicator(
                    onRefresh: _loadOfflineList,
                    child: _downloadedItems.isEmpty ? _buildEmptyState() : _buildList(),
                  ),
                ),
              ],
            ),
    );
  }

  Widget _buildEmptyState() {
    return ListView(
      physics: const AlwaysScrollableScrollPhysics(),
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 40),
      children: [
        Center(
          child: Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              color: const Color(0xFFEEF2FF),
              shape: BoxShape.circle,
              border: Border.all(color: const Color(0xFFC7D2FE), width: 2),
            ),
            child: const Icon(
              Icons.download_for_offline_outlined,
              size: 42,
              color: Color(0xFF3B5BDB),
            ),
          ),
        ),
        const SizedBox(height: 20),
        Text(
          'No Offline Documents Saved',
          textAlign: TextAlign.center,
          style: GoogleFonts.dmSans(
            color: AppTheme.primaryNavy,
            fontWeight: FontWeight.w900,
            fontSize: 19,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          'You can save your unlocked VIP guides (like PV Interview Kit & RA Dossier Guide) for 100% offline reading with zero internet consumption.',
          textAlign: TextAlign.center,
          style: GoogleFonts.dmSans(
            color: const Color(0xFF64748B),
            fontSize: 13,
            height: 1.45,
          ),
        ),
        const SizedBox(height: 24),
        Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: const Color(0xFFFEF3C7).withValues(alpha: 0.6),
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: const Color(0xFFFDE68A)),
          ),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Icon(Icons.info_outline_rounded, color: Color(0xFFD97706), size: 18),
              const SizedBox(width: 10),
              Expanded(
                child: Text(
                  'Policy Note: Free study notes stream online with short ad support. Offline storage is reserved for VIP & purchased career guides.',
                  style: GoogleFonts.dmSans(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: const Color(0xFF92400E),
                    height: 1.35,
                  ),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 30),
        if (widget.isOfflineLaunch) ...[
          ElevatedButton.icon(
            onPressed: _checkConnectivityAndPrompt,
            icon: _isCheckingConnection
                ? const SizedBox(
                    width: 16,
                    height: 16,
                    child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                  )
                : const Icon(Icons.wifi_rounded, size: 18),
            label: Text(
              _isCheckingConnection ? 'Checking Connection...' : 'Check Connection to Open Home',
              style: GoogleFonts.dmSans(fontWeight: FontWeight.w800, fontSize: 14),
            ),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF1E3A8A),
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(vertical: 14),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              elevation: 2,
            ),
          ),
        ] else ...[
          ElevatedButton.icon(
            onPressed: () => Navigator.pop(context),
            icon: const Icon(Icons.arrow_back_rounded, size: 18),
            label: Text(
              'Back to Study Notes',
              style: GoogleFonts.dmSans(fontWeight: FontWeight.w800, fontSize: 14),
            ),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF1E3A8A),
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(vertical: 14),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              elevation: 2,
            ),
          ),
        ],
      ],
    );
  }

  Widget _buildList() {
    return ListView(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 24),
      children: [
        // Security info pill
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFF0F172A), Color(0xFF1E293B)],
            ),
            borderRadius: BorderRadius.circular(14),
          ),
          child: Row(
            children: [
              const Icon(Icons.security_rounded, color: Color(0xFF10B981), size: 18),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Zero-Data Offline Storage',
                      style: GoogleFonts.dmSans(
                        color: Colors.white,
                        fontWeight: FontWeight.w800,
                        fontSize: 12,
                      ),
                    ),
                    Text(
                      'Saved locally for offline access · Read anytime without internet.',
                      style: GoogleFonts.dmSans(
                        color: const Color(0xFF94A3B8),
                        fontSize: 11,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 14),

        // Items
        ..._downloadedItems.map((item) => _buildOfflineCard(item)),
      ],
    );
  }

  Widget _buildOfflineCard(AdminPdfItem item) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFA7F3D0), width: 1.5),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: const Color(0xFFECFDF5),
                    borderRadius: BorderRadius.circular(6),
                    border: Border.all(color: const Color(0xFF10B981).withValues(alpha: 0.3)),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.check_circle_rounded, color: Color(0xFF059669), size: 12),
                      const SizedBox(width: 4),
                      Text(
                        'SAVED OFFLINE',
                        style: GoogleFonts.dmSans(
                          color: const Color(0xFF059669),
                          fontWeight: FontWeight.w900,
                          fontSize: 10,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 8),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(
                    color: const Color(0xFFEEF2FF),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    item.subjectCode,
                    style: const TextStyle(
                      fontFamily: 'JetBrains Mono',
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF3730A3),
                    ),
                  ),
                ),
                const Spacer(),
                IconButton(
                  icon: const Icon(Icons.delete_outline_rounded, color: Color(0xFFEF4444), size: 20),
                  padding: EdgeInsets.zero,
                  constraints: const BoxConstraints(minWidth: 32, minHeight: 32),
                  onPressed: () => _deleteOfflinePdf(item),
                  tooltip: 'Delete Offline Copy',
                ),
              ],
            ),
            const SizedBox(height: 10),
            Text(
              item.title,
              style: GoogleFonts.dmSans(
                color: AppTheme.textDark,
                fontWeight: FontWeight.w800,
                fontSize: 14.5,
                height: 1.3,
              ),
            ),
            const SizedBox(height: 6),
            Text(
              '${item.pages} Pages • ${item.fileSize} • Sem ${item.semester} • ${item.unit}',
              style: GoogleFonts.dmSans(
                color: const Color(0xFF64748B),
                fontSize: 12,
                fontWeight: FontWeight.w500,
              ),
            ),
            const SizedBox(height: 14),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () => _openReader(item),
                icon: const Icon(Icons.menu_book_rounded, size: 16),
                label: Text(
                  'Open in Secure Reader',
                  style: GoogleFonts.dmSans(
                    fontWeight: FontWeight.w800,
                    fontSize: 13,
                  ),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF1E3A8A),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 11),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  elevation: 1,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
