import 'package:flutter/material.dart';
import '../../services/auth_service.dart';
import '../../services/pdf_service.dart';
import '../billing/in_app_purchase_service.dart';
import '../../screens/notes/secure_pdf_reader_screen.dart';

/// Classplus-Style Modal Sheet for Purchasing Individual Premium Study Guides
/// Requires Firebase Auth login before purchase so entitlements are permanently tied to account.
class GuidePurchaseSheet extends StatefulWidget {
  final AdminPdfItem pdfItem;

  const GuidePurchaseSheet({
    super.key,
    required this.pdfItem,
  });

  static Future<void> show(BuildContext context, AdminPdfItem pdfItem) {
    return showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => GuidePurchaseSheet(pdfItem: pdfItem),
    );
  }

  @override
  State<GuidePurchaseSheet> createState() => _GuidePurchaseSheetState();
}

class _GuidePurchaseSheetState extends State<GuidePurchaseSheet> {
  final AuthService _auth = AuthService();
  final InAppPurchaseService _billing = InAppPurchaseService.instance;

  bool _isSigningIn = false;

  @override
  void initState() {
    super.initState();
    // Register product ID in billing client
    if (widget.pdfItem.playProductId.isNotEmpty) {
      _billing.registerProductIds([widget.pdfItem.playProductId]);
    }
  }

  void _onBuyPressed() async {
    // 1. Enforce compulsory authentication
    if (!_auth.isLoggedIn) {
      _promptLogin();
      return;
    }

    // 2. Launch Google Play Billing flow
    final productId = widget.pdfItem.playProductId.isNotEmpty
        ? widget.pdfItem.playProductId
        : 'guide_vip_${widget.pdfItem.id}';

    await _billing.buyProductById(productId);
  }

  void _promptLogin() async {
    setState(() => _isSigningIn = true);
    try {
      final cred = await _auth.signInWithGoogle();
      if (cred != null && mounted) {
        // Sync entitlements for the new login
        await _billing.syncUserEntitlements(cred.user?.uid ?? '');
        if (!mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Logged in as ${_auth.displayName}. Ready to unlock guide!'),
            backgroundColor: const Color(0xFF059669),
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Login cancelled or failed: $e'),
            backgroundColor: Colors.redAccent,
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _isSigningIn = false);
    }
  }

  void _openSecureReader() {
    Navigator.of(context).pop();
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (_) => SecurePdfReaderScreen(pdfItem: widget.pdfItem),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final productId = widget.pdfItem.playProductId.isNotEmpty
        ? widget.pdfItem.playProductId
        : 'guide_vip_${widget.pdfItem.id}';

    final isUnlocked = _billing.isUnlocked(productId);
    final priceStr = _billing.getProductPrice(productId, fallback: '₹${widget.pdfItem.priceRupees}');

    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      padding: EdgeInsets.only(
        top: 12,
        left: 20,
        right: 20,
        bottom: MediaQuery.of(context).viewInsets.bottom + 24,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Drag handle
          Center(
            child: Container(
              width: 44,
              height: 4,
              decoration: BoxDecoration(
                color: Colors.grey.shade300,
                borderRadius: BorderRadius.circular(4),
              ),
            ),
          ),
          const SizedBox(height: 16),

          // Header with Badge
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 4),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFFD97706), Color(0xFFF59E0B)],
                  ),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.workspace_premium_rounded, color: Colors.white, size: 14),
                    SizedBox(width: 4),
                    Text(
                      'PREMIUM STUDY GUIDE',
                      style: TextStyle(
                        fontFamily: 'Nunito',
                        fontSize: 10,
                        fontWeight: FontWeight.w900,
                        color: Colors.white,
                        letterSpacing: 0.8,
                      ),
                    ),
                  ],
                ),
              ),
              const Spacer(),
              IconButton(
                icon: const Icon(Icons.close_rounded, color: Color(0xFF64748B), size: 20),
                onPressed: () => Navigator.pop(context),
              ),
            ],
          ),

          const SizedBox(height: 8),

          // Title & Subject Code
          Text(
            widget.pdfItem.title,
            style: const TextStyle(
              fontFamily: 'Nunito',
              fontSize: 18,
              fontWeight: FontWeight.w800,
              color: Color(0xFF0F172A),
              height: 1.25,
            ),
          ),
          const SizedBox(height: 6),
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                decoration: BoxDecoration(
                  color: const Color(0xFF1E3A8A).withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  widget.pdfItem.subjectCode,
                  style: const TextStyle(
                    fontFamily: 'JetBrains Mono',
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF1E3A8A),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Text(
                'Sem ${widget.pdfItem.semester} • ${widget.pdfItem.unit}',
                style: const TextStyle(
                  fontFamily: 'Nunito',
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: Color(0xFF64748B),
                ),
              ),
              const Spacer(),
              Text(
                '${widget.pdfItem.pages} Pages • ${widget.pdfItem.fileSize}',
                style: const TextStyle(
                  fontFamily: 'Nunito',
                  fontSize: 11,
                  fontWeight: FontWeight.w600,
                  color: Color(0xFF94A3B8),
                ),
              ),
            ],
          ),

          const SizedBox(height: 16),

          // Price & Security Highlight Box
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF0F172A), Color(0xFF1E293B)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Row(
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Google Play One-Time Purchase',
                      style: TextStyle(
                        fontFamily: 'Nunito',
                        fontSize: 11,
                        fontWeight: FontWeight.w600,
                        color: Color(0xFF94A3B8),
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      priceStr,
                      style: const TextStyle(
                        fontFamily: 'Nunito',
                        fontSize: 24,
                        fontWeight: FontWeight.w900,
                        color: Colors.white,
                      ),
                    ),
                  ],
                ),
                const Spacer(),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  decoration: BoxDecoration(
                    color: const Color(0xFF10B981).withValues(alpha: 0.2),
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: const Color(0xFF10B981).withValues(alpha: 0.4)),
                  ),
                  child: const Row(
                    children: [
                      Icon(Icons.verified_user_rounded, color: Color(0xFF10B981), size: 14),
                      SizedBox(width: 4),
                      Text(
                        'Lifetime Access',
                        style: TextStyle(
                          fontFamily: 'Nunito',
                          fontSize: 11,
                          fontWeight: FontWeight.w800,
                          color: Color(0xFF10B981),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 16),

          // Feature points
          _buildFeatureRow(Icons.offline_pin_rounded, 'Encrypted In-App Offline Reading', 'Read anywhere inside the app without high data usage.'),
          _buildFeatureRow(Icons.shield_rounded, 'Classplus-Grade Anti-Piracy Protection', 'Screenshot & screen recording completely blocked to protect verified notes.'),
          _buildFeatureRow(Icons.devices_rounded, 'Permanent Account Binding', 'Bound to your Google account — stays active after app reinstalls.'),

          const SizedBox(height: 16),

          // Login requirement status banner
          if (!_auth.isLoggedIn)
            Container(
              margin: const EdgeInsets.only(bottom: 14),
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFFEFF6FF),
                border: Border.all(color: const Color(0xFFBFDBFE)),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                children: [
                  const Icon(Icons.account_circle_outlined, color: Color(0xFF2563EB), size: 20),
                  const SizedBox(width: 10),
                  const Expanded(
                    child: Text(
                      'Account required: Sign in so your purchased guide remains permanently linked.',
                      style: TextStyle(
                        fontFamily: 'Nunito',
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: Color(0xFF1E40AF),
                      ),
                    ),
                  ),
                ],
              ),
            ),

          // Main Action Button
          if (isUnlocked)
            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton.icon(
                onPressed: _openSecureReader,
                icon: const Icon(Icons.menu_book_rounded, color: Colors.white, size: 18),
                label: const Text(
                  'Already Unlocked · Open Secure Reader',
                  style: TextStyle(fontFamily: 'Nunito', fontSize: 14, fontWeight: FontWeight.w800),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF059669),
                  foregroundColor: Colors.white,
                  elevation: 0,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                ),
              ),
            )
          else if (!_auth.isLoggedIn)
            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton.icon(
                onPressed: _isSigningIn ? null : _promptLogin,
                icon: _isSigningIn
                    ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                    : const Icon(Icons.login_rounded, color: Colors.white, size: 18),
                label: Text(
                  _isSigningIn ? 'Connecting Account...' : 'Sign in with Google to Purchase',
                  style: const TextStyle(fontFamily: 'Nunito', fontSize: 14, fontWeight: FontWeight.w800),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF1E3A8A),
                  foregroundColor: Colors.white,
                  elevation: 0,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                ),
              ),
            )
          else
            ValueListenableBuilder<bool>(
              valueListenable: _billing.isPurchasingNotifier,
              builder: (context, isPurchasing, _) {
                return SizedBox(
                  width: double.infinity,
                  height: 50,
                  child: ElevatedButton.icon(
                    onPressed: isPurchasing ? null : _onBuyPressed,
                    icon: isPurchasing
                        ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                        : const Icon(Icons.shopping_bag_outlined, color: Colors.white, size: 18),
                    label: Text(
                      isPurchasing ? 'Processing with Google Play...' : 'Unlock via Google Play ($priceStr)',
                      style: const TextStyle(fontFamily: 'Nunito', fontSize: 14, fontWeight: FontWeight.w800),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF1E3A8A),
                      foregroundColor: Colors.white,
                      elevation: 0,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    ),
                  ),
                );
              },
            ),

          const SizedBox(height: 10),

          // Restore Purchases & Dev Test Simulation
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              TextButton(
                onPressed: () => _billing.restorePurchases(),
                child: const Text(
                  'Restore Purchases',
                  style: TextStyle(
                    fontFamily: 'Nunito',
                    fontSize: 12,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFF64748B),
                  ),
                ),
              ),
              const Text('•', style: TextStyle(color: Color(0xFFCBD5E1))),
              TextButton(
                onPressed: () {
                  // Direct test simulation for debug/demo
                  _billing.simulateUnlockForTesting(productId);
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Test mode: Guide unlocked! Tap "Open Secure Reader".')),
                  );
                },
                child: const Text(
                  'Test Unlock',
                  style: TextStyle(
                    fontFamily: 'Nunito',
                    fontSize: 12,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFF94A3B8),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildFeatureRow(IconData icon, String title, String subtitle) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(6),
            decoration: BoxDecoration(
              color: const Color(0xFF1E3A8A).withValues(alpha: 0.08),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: const Color(0xFF1E3A8A), size: 16),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontFamily: 'Nunito',
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFF1E293B),
                  ),
                ),
                Text(
                  subtitle,
                  style: const TextStyle(
                    fontFamily: 'Nunito',
                    fontSize: 11,
                    fontWeight: FontWeight.w500,
                    color: Color(0xFF64748B),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
