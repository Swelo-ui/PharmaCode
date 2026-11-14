import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../services/auth_service.dart';
import '../billing/in_app_purchase_service.dart';
import '../theme.dart';

void showPreBookVipSheet(BuildContext context) {
  showModalBottomSheet(
    context: context,
    isScrollControlled: true,
    useSafeArea: true,
    backgroundColor: Colors.transparent,
    builder: (ctx) => const PreBookVipSheet(),
  );
}

/// Backward compatibility alias
void showPremiumPdfSheet(
  BuildContext context, {
  String? targetProductId,
  String? customTitle,
}) {
  showPreBookVipSheet(context);
}

class PreBookVipSheet extends StatefulWidget {
  const PreBookVipSheet({super.key});

  @override
  State<PreBookVipSheet> createState() => _PreBookVipSheetState();
}

class _PreBookVipSheetState extends State<PreBookVipSheet> {
  final InAppPurchaseService _iapService = InAppPurchaseService.instance;

  @override
  void initState() {
    super.initState();
    _iapService.purchaseStatusMessage.addListener(_onStatusMessage);
  }

  @override
  void dispose() {
    _iapService.purchaseStatusMessage.removeListener(_onStatusMessage);
    super.dispose();
  }

  void _onStatusMessage() {
    final msg = _iapService.purchaseStatusMessage.value;
    if (msg != null && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(msg, style: GoogleFonts.dmSans(fontWeight: FontWeight.w600)),
          backgroundColor: msg.contains('successful') || msg.contains('restored') || msg.contains('activated')
              ? const Color(0xFF10B981)
              : const Color(0xFF1E293B),
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        ),
      );
    }
  }

  Future<void> _openWhatsAppSupport() async {
    final user = FirebaseAuth.instance.currentUser;
    final emailText = (user?.email != null && user!.email!.isNotEmpty)
        ? user.email!
        : (user?.displayName != null && user!.displayName!.isNotEmpty ? user.displayName! : 'Registered Student');

    final message = '''Hello PharmaCode Team,

I have pre-booked / activated the *PharmaCode VIP Study Pass* (₹499 Lifetime Access).

*Student Account Details:*
• Registered Account: $emailText
• App: PharmaCode B.Pharm NEP 2020

I would like guidance / assistance with:
[ ] 1-on-1 Doubt Solving
[ ] Semester Study Notes / PDF request
[ ] Mentor Guidance & VIP Updates

Thank you!''';

    final uri = Uri.parse('https://wa.me/916265643703?text=${Uri.encodeComponent(message)}');
    try {
      if (await canLaunchUrl(uri)) {
        await launchUrl(uri, mode: LaunchMode.externalApplication);
      } else {
        _openEmailSupport();
      }
    } catch (_) {
      _openEmailSupport();
    }
  }

  Future<void> _openEmailSupport() async {
    final user = FirebaseAuth.instance.currentUser;
    final userEmail = user?.email ?? '';
    final userName = user?.displayName ?? 'Student';

    final subject = Uri.encodeComponent('PharmaCode VIP Student Support Request · [${userEmail.isNotEmpty ? userEmail : userName}]');
    final body = Uri.encodeComponent('''Dear PharmaCode Mentor Team,

I am an active VIP Study Pass student on the PharmaCode Android Application.

--- Student Details ---
Name: $userName
Registered Email: ${userEmail.isNotEmpty ? userEmail : '[Your Registered Email]'}
App Platform: Android · PharmaCode NEP 2020
Status: VIP Study Pass Active (Lifetime Access)

--- My Question / Notes Request ---
[Please describe your subject doubts, requested semester notes, or questions here]

Looking forward to your guidance.

Warm regards,
$userName
''');

    final uri = Uri.parse('mailto:pharmacode.connect@gmail.com?subject=$subject&body=$body');
    try {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    } catch (_) {}
  }

  Future<void> _handleCheckout() async {
    if (_iapService.isVipUnlocked) {
      Navigator.of(context).pop();
      return;
    }

    final auth = AuthService();
    if (!auth.isLoggedIn) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'Please sign in with Google or Email first so your VIP Pass is permanently saved to your student account!',
            style: GoogleFonts.dmSans(fontWeight: FontWeight.w600),
          ),
          backgroundColor: const Color(0xFF1E293B),
          behavior: SnackBarBehavior.floating,
        ),
      );
      final cred = await auth.signInWithGoogle();
      if (cred == null || !mounted) return;
    }

    final success = await _iapService.buyPreBookVipPass();
    if (!mounted) return;
    if (!success) {
      final msg = _iapService.purchaseStatusMessage.value ??
          'Google Play Billing is currently unavailable. Please check your connection and try again.';
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(msg, style: GoogleFonts.dmSans(fontWeight: FontWeight.w600)),
          backgroundColor: const Color(0xFF1E293B),
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final plan = InAppPurchaseService.preBookPlan;
    final liveProduct = _iapService.products[PlayProducts.vipPreBook499] ??
        _iapService.products[PlayProducts.vipPreBook499Alias] ??
        _iapService.products[PlayProducts.vipPreBook] ??
        _iapService.products[PlayProducts.vipPreBookAlias] ??
        _iapService.products[PlayProducts.vipLegacy];
    String currentPrice = (liveProduct != null && liveProduct.price.isNotEmpty)
        ? liveProduct.price
        : plan.defaultPrice;
    if (currentPrice.contains('500')) {
      currentPrice = currentPrice.replaceAll('500.00', '499.00').replaceAll('500', '499');
    }

    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // ── Sticky Header ──
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 10, 12, 6),
            child: Column(
              children: [
                Center(
                  child: Container(
                    width: 40,
                    height: 4.5,
                    decoration: BoxDecoration(
                      color: Colors.black12,
                      borderRadius: BorderRadius.circular(3),
                    ),
                  ),
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(7),
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [Color(0xFFFEF3C7), Color(0xFFFDE68A)],
                        ),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Icon(Icons.workspace_premium_rounded, color: Color(0xFFB45309), size: 20),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        'PharmaCode VIP Pre-Booking',
                        style: GoogleFonts.dmSans(
                          color: AppTheme.primaryNavy,
                          fontSize: 16,
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close_rounded, color: AppTheme.textMuted),
                      onPressed: () => Navigator.pop(context),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const Divider(height: 1),

          // ── Scrollable Body ──
          Flexible(
            child: ValueListenableBuilder<Set<String>>(
              valueListenable: _iapService.unlockedNotifier,
              builder: (context, unlockedSet, _) {
                final isUnlocked = _iapService.isVipUnlocked;

                return ListView(
                  shrinkWrap: true,
                  physics: const BouncingScrollPhysics(),
                  padding: const EdgeInsets.fromLTRB(16, 14, 16, 20),
                  children: [
                    // Top Hero Banner
                    Container(
                      padding: const EdgeInsets.all(18),
                      decoration: BoxDecoration(
                        gradient: isUnlocked
                            ? const LinearGradient(
                                colors: [Color(0xFF0F172A), Color(0xFF1E293B), Color(0xFF78350F)],
                                begin: Alignment.topLeft,
                                end: Alignment.bottomRight,
                              )
                            : const LinearGradient(
                                colors: [Color(0xFF0F172A), Color(0xFF1E3A8A), Color(0xFF2E1065)],
                                begin: Alignment.topLeft,
                                end: Alignment.bottomRight,
                              ),
                        borderRadius: BorderRadius.circular(20),
                        boxShadow: [
                          BoxShadow(
                            color: (isUnlocked ? const Color(0xFFD97706) : const Color(0xFF1E3A8A)).withValues(alpha: 0.25),
                            blurRadius: 14,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Wrap(
                            alignment: WrapAlignment.spaceBetween,
                            crossAxisAlignment: WrapCrossAlignment.center,
                            spacing: 8,
                            runSpacing: 6,
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                decoration: BoxDecoration(
                                  color: Colors.amber,
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: Text(
                                  plan.discountTag,
                                  style: GoogleFonts.dmSans(
                                    color: const Color(0xFF0F172A),
                                    fontWeight: FontWeight.w900,
                                    fontSize: 11,
                                  ),
                                ),
                              ),
                              if (isUnlocked)
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                  decoration: BoxDecoration(
                                    gradient: const LinearGradient(
                                      colors: [Color(0xFFF59E0B), Color(0xFFD97706)],
                                      begin: Alignment.topLeft,
                                      end: Alignment.bottomRight,
                                    ),
                                    borderRadius: BorderRadius.circular(8),
                                    boxShadow: [
                                      BoxShadow(
                                        color: const Color(0xFFF59E0B).withValues(alpha: 0.4),
                                        blurRadius: 8,
                                        offset: const Offset(0, 2),
                                      ),
                                    ],
                                  ),
                                  child: Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      const Icon(Icons.stars_rounded, color: Colors.white, size: 13),
                                      const SizedBox(width: 4),
                                      Text(
                                        'VIP ACTIVE · 100% AD-FREE',
                                        style: GoogleFonts.dmSans(
                                          color: Colors.white,
                                          fontWeight: FontWeight.w900,
                                          fontSize: 10.5,
                                          letterSpacing: 0.2,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                            ],
                          ),
                          const SizedBox(height: 12),
                          Text(
                            plan.title,
                            style: GoogleFonts.dmSans(
                              color: Colors.white,
                              fontSize: 19,
                              fontWeight: FontWeight.w900,
                              letterSpacing: -0.3,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            plan.subtitle,
                            style: GoogleFonts.dmSans(
                              color: Colors.white.withValues(alpha: 0.85),
                              fontSize: 12,
                              height: 1.35,
                            ),
                          ),
                          const SizedBox(height: 14),
                          Wrap(
                            crossAxisAlignment: WrapCrossAlignment.center,
                            spacing: 8,
                            runSpacing: 4,
                            children: [
                              Text(
                                currentPrice,
                                style: GoogleFonts.dmSans(
                                  color: Colors.amber,
                                  fontSize: 26,
                                  fontWeight: FontWeight.w900,
                                ),
                              ),
                              Text(
                                plan.originalPrice,
                                style: GoogleFonts.dmSans(
                                  color: Colors.white54,
                                  fontSize: 14,
                                  fontWeight: FontWeight.w700,
                                  decoration: TextDecoration.lineThrough,
                                ),
                              ),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2.5),
                                decoration: BoxDecoration(
                                  color: Colors.white.withValues(alpha: 0.12),
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: Text(
                                  'One-Time Lifetime Pass',
                                  style: GoogleFonts.dmSans(
                                    color: Colors.white70,
                                    fontSize: 11,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 16),

                    // When Unlocked: Golden Support & Privileges Card
                    if (isUnlocked) ...[
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(
                            colors: [Color(0xFFFFFBEB), Color(0xFFFEF3C7)],
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                          ),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: const Color(0xFFF59E0B), width: 1.5),
                          boxShadow: [
                            BoxShadow(
                              color: const Color(0xFFF59E0B).withValues(alpha: 0.15),
                              blurRadius: 10,
                              offset: const Offset(0, 3),
                            ),
                          ],
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Container(
                                  padding: const EdgeInsets.all(6),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFFD97706),
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: const Icon(Icons.workspace_premium_rounded, color: Colors.white, size: 18),
                                ),
                                const SizedBox(width: 10),
                                Expanded(
                                  child: Text(
                                    'VIP Member Privileges Active!',
                                    style: GoogleFonts.dmSans(
                                      color: const Color(0xFF92400E),
                                      fontSize: 15,
                                      fontWeight: FontWeight.w900,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            Text(
                              '• 100% Ad-Free Learning Experience across entire app\n'
                              '• PV (₹49), RA (₹99) & Pharma Interview Kit (₹149) permanently unlocked\n'
                              '• Unlimited AI Doubts & all future B.Pharm semester notes\n'
                              '• Real-time 1-on-1 student doubt resolution via WhatsApp & Email',
                              style: GoogleFonts.dmSans(color: const Color(0xFF78350F), fontSize: 12, height: 1.45),
                            ),
                            const SizedBox(height: 12),
                            Row(
                              children: [
                                Expanded(
                                  child: ElevatedButton.icon(
                                    onPressed: _openWhatsAppSupport,
                                    icon: const Icon(Icons.chat_rounded, size: 16),
                                    label: const Text('WhatsApp Help'),
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: const Color(0xFF10B981),
                                      foregroundColor: Colors.white,
                                      elevation: 0,
                                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 10),
                                Expanded(
                                  child: OutlinedButton.icon(
                                    onPressed: _openEmailSupport,
                                    icon: const Icon(Icons.mail_rounded, size: 16),
                                    label: const Text('Email Mentors'),
                                    style: OutlinedButton.styleFrom(
                                      foregroundColor: const Color(0xFF92400E),
                                      side: const BorderSide(color: Color(0xFFD97706), width: 1.2),
                                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 14),
                    ],

                    // Section Heading: What's Included
                    Text(
                      "What's Included in this VIP Pre-Booking:",
                      style: GoogleFonts.dmSans(
                        color: AppTheme.primaryNavy,
                        fontSize: 14.5,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                    const SizedBox(height: 10),

                    // Feature List
                    ...plan.bulletPoints.map(
                      (point) => Container(
                        margin: const EdgeInsets.only(bottom: 8),
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF8FAFC),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: AppTheme.borderSoft),
                        ),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Container(
                              padding: const EdgeInsets.all(3),
                              decoration: const BoxDecoration(
                                color: Color(0xFFECFDF5),
                                shape: BoxShape.circle,
                              ),
                              child: const Icon(Icons.check_rounded, color: Color(0xFF10B981), size: 15),
                            ),
                            const SizedBox(width: 10),
                            Expanded(
                              child: Text(
                                point,
                                style: GoogleFonts.dmSans(
                                  color: AppTheme.textDark,
                                  fontSize: 12.5,
                                  fontWeight: FontWeight.w600,
                                  height: 1.3,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),

                    const SizedBox(height: 8),

                    // Real-Time Support Highlight Card
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: const Color(0xFFEEF2FF),
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: const Color(0xFFC7D2FE)),
                      ),
                      child: Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(
                              color: const Color(0xFF3B82F6),
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: const Icon(Icons.support_agent_rounded, color: Colors.white, size: 20),
                          ),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Real-Time Student Support',
                                  style: GoogleFonts.dmSans(
                                    color: const Color(0xFF1E3A8A),
                                    fontWeight: FontWeight.w800,
                                    fontSize: 12.5,
                                  ),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  '1-on-1 exam doubts & syllabus assistance on WhatsApp & Email.',
                                  style: GoogleFonts.dmSans(
                                    color: const Color(0xFF475569),
                                    fontSize: 11,
                                    height: 1.3,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                );
              },
            ),
          ),

          // ── Bottom Checkout Action Bar ──
          Container(
            padding: EdgeInsets.fromLTRB(16, 12, 16, MediaQuery.of(context).padding.bottom + 10),
            decoration: BoxDecoration(
              color: Colors.white,
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.05),
                  blurRadius: 8,
                  offset: const Offset(0, -2),
                ),
              ],
            ),
            child: ValueListenableBuilder<bool>(
              valueListenable: _iapService.isPurchasingNotifier,
              builder: (_, isPurchasing, child) {
                final isUnlocked = _iapService.isVipUnlocked;

                return Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: isUnlocked ? const Color(0xFF10B981) : const Color(0xFF2563EB),
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                          elevation: 0,
                        ),
                        onPressed: isPurchasing ? null : _handleCheckout,
                        child: isPurchasing
                            ? const SizedBox(
                                height: 20,
                                width: 20,
                                child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                              )
                            : Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Icon(
                                    isUnlocked ? Icons.check_circle_rounded : Icons.lock_open_rounded,
                                    size: 18,
                                  ),
                                  const SizedBox(width: 8),
                                  Flexible(
                                    child: Text(
                                      isUnlocked
                                          ? 'VIP Pass Active (Tap to Close)'
                                          : 'Pre-Book VIP Pass Now · $currentPrice',
                                      style: GoogleFonts.dmSans(
                                        fontSize: 14.5,
                                        fontWeight: FontWeight.w900,
                                      ),
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ),
                                ],
                              ),
                      ),
                    ),
                    const SizedBox(height: 6),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        TextButton.icon(
                          onPressed: isPurchasing ? null : () => _iapService.restorePurchases(),
                          icon: const Icon(Icons.restore_rounded, size: 14),
                          label: Text(
                            'Restore Purchases',
                            style: GoogleFonts.dmSans(fontSize: 11.5, fontWeight: FontWeight.w700),
                          ),
                          style: TextButton.styleFrom(
                            foregroundColor: AppTheme.textMuted,
                            padding: const EdgeInsets.symmetric(horizontal: 4),
                          ),
                        ),
                        Row(
                          children: [
                            const Icon(Icons.verified_user_rounded, size: 13, color: Color(0xFF10B981)),
                            const SizedBox(width: 4),
                            Text(
                              'Google Play Certified',
                              style: GoogleFonts.dmSans(
                                color: AppTheme.textMuted,
                                fontSize: 11,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ],
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
