import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/constants/app_spacing.dart';
import '../../core/notification_service.dart';
import '../../core/theme.dart';
import '../../core/widgets/empty_state_view.dart';
import '../../features/notifications/presentation/notification_controller.dart';

class NotificationsScreen extends ConsumerWidget {
  const NotificationsScreen({super.key});

  void _copyFcmToken(BuildContext context) async {
    final token = await NotificationService().getFcmToken();
    if (token != null && token.isNotEmpty) {
      Clipboard.setData(ClipboardData(text: token));
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              '🔑 FCM Token copied! Firebase Console "Send test message" me paste karein.',
              style: GoogleFonts.dmSans(fontWeight: FontWeight.w700),
            ),
            backgroundColor: const Color(0xFF047857),
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
          ),
        );
      }
    } else {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              'Token generate ho raha he, internet check karein ya thoda wait karein.',
              style: GoogleFonts.dmSans(),
            ),
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
    }
  }

  void _triggerTest(BuildContext context, WidgetRef ref) async {
    await ref.read(notificationsListProvider.notifier).triggerTest();
    if (context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            '🔔 Test Notification sent with custom chime! Check status bar.',
            style: GoogleFonts.dmSans(fontWeight: FontWeight.w700),
          ),
          backgroundColor: AppTheme.brandTeal,
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        ),
      );
    }
  }

  void _triggerDelayedTest(BuildContext context, WidgetRef ref) async {
    await ref.read(notificationsListProvider.notifier).triggerDelayedTest(5);
    if (context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            '⏱️ Notification scheduled in 5s! Minimize or close the app now to hear the chime.',
            style: GoogleFonts.dmSans(fontWeight: FontWeight.w700),
          ),
          backgroundColor: AppTheme.brandPurple,
          duration: const Duration(seconds: 4),
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final list = ref.watch(notificationsListProvider);

    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      appBar: AppBar(
        title: Text(
          'Notification Center',
          style: GoogleFonts.dmSans(
            color: AppTheme.primaryNavy,
            fontWeight: FontWeight.w900,
            letterSpacing: -0.2,
          ),
        ),
        actions: [
          if (list.isNotEmpty)
            TextButton(
              onPressed: () => ref.read(notificationsListProvider.notifier).markAllAsRead(),
              child: Text(
                'Mark all read',
                style: GoogleFonts.dmSans(
                  color: AppTheme.brandBlue,
                  fontSize: 13,
                  fontWeight: FontWeight.w800,
                ),
              ),
            ),
        ],
      ),
      body: Column(
        children: [
          // ── Push Notification Banner ───────────────────────────────
          Container(
            margin: AppSpacing.screenPadding,
            padding: AppSpacing.paddingMd,
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFFEEF2FF), Color(0xFFE0E7FF)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppTheme.brandBlue.withValues(alpha: 0.2)),
            ),
            child: Column(
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(
                            color: AppTheme.brandBlue.withValues(alpha: 0.15),
                            blurRadius: 8,
                          ),
                        ],
                      ),
                      child: const Icon(Icons.notifications_active_rounded, color: AppTheme.brandBlue, size: 24),
                    ),
                    const SizedBox(width: AppSpacing.md),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Text(
                                'Realtime Alerts Active',
                                style: GoogleFonts.dmSans(
                                  color: AppTheme.primaryNavy,
                                  fontSize: 14,
                                  fontWeight: FontWeight.w800,
                                ),
                              ),
                              const SizedBox(width: 6),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                decoration: BoxDecoration(
                                  color: const Color(0xFF10B981).withValues(alpha: 0.15),
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: Text(
                                  'Special Chime',
                                  style: GoogleFonts.dmSans(
                                    color: const Color(0xFF047857),
                                    fontSize: 9.5,
                                    fontWeight: FontWeight.w800,
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 2),
                          Text(
                            'Works online, offline & when app is closed.',
                            style: GoogleFonts.dmSans(
                              color: AppTheme.textMuted,
                              fontSize: 11.5,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton.icon(
                        onPressed: () => _triggerTest(context, ref),
                        icon: const Icon(Icons.play_arrow_rounded, size: 16),
                        label: Text(
                          'Test Sound',
                          style: GoogleFonts.dmSans(fontSize: 11.5, fontWeight: FontWeight.w800),
                        ),
                        style: OutlinedButton.styleFrom(
                          foregroundColor: AppTheme.primaryNavy,
                          side: BorderSide(color: AppTheme.brandBlue.withValues(alpha: 0.4)),
                          padding: const EdgeInsets.symmetric(vertical: 8),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: ElevatedButton.icon(
                        onPressed: () => _triggerDelayedTest(context, ref),
                        icon: const Icon(Icons.timer_outlined, size: 16),
                        label: Text(
                          'Test Close App (5s)',
                          style: GoogleFonts.dmSans(fontSize: 11.5, fontWeight: FontWeight.w800),
                        ),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppTheme.brandBlue,
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 8),
                          elevation: 0,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                InkWell(
                  onTap: () => _copyFcmToken(context),
                  borderRadius: BorderRadius.circular(8),
                  child: Container(
                    width: double.infinity,
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: AppTheme.brandBlue.withValues(alpha: 0.3)),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.vpn_key_rounded, size: 14, color: AppTheme.brandBlue),
                        const SizedBox(width: 6),
                        Text(
                          'Copy Device FCM Token (Firebase Direct Push)',
                          style: GoogleFonts.dmSans(
                            fontSize: 11.5,
                            fontWeight: FontWeight.w700,
                            color: AppTheme.brandBlue,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),

          // ── Notification History List ──────────────────────────────
          Expanded(
            child: list.isEmpty
                ? const EmptyStateView(
                    icon: Icons.notifications_none_rounded,
                    title: 'No Notifications Yet',
                    message: 'You are all caught up! New exam updates and notes alerts will appear here.',
                  )
                : ListView.builder(
                    physics: const BouncingScrollPhysics(),
                    padding: const EdgeInsets.fromLTRB(16, 0, 16, 24),
                    itemCount: list.length,
                    itemBuilder: (context, index) {
                      final notif = list[index];
                      return Container(
                        margin: const EdgeInsets.only(bottom: AppSpacing.sm),
                        decoration: BoxDecoration(
                          color: notif.isRead ? Colors.white : const Color(0xFFF0F5FF),
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(
                            color: notif.isRead ? AppTheme.borderSoft : AppTheme.brandBlue.withValues(alpha: 0.3),
                            width: 1.5,
                          ),
                        ),
                        child: Material(
                          color: Colors.transparent,
                          child: InkWell(
                            onTap: () {
                              ref.read(notificationsListProvider.notifier).markAsRead(notif.id);
                            },
                            borderRadius: BorderRadius.circular(14),
                            child: Padding(
                              padding: AppSpacing.paddingMd,
                              child: Row(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Container(
                                    width: 8,
                                    height: 8,
                                    margin: const EdgeInsets.only(top: 6, right: 12),
                                    decoration: BoxDecoration(
                                      shape: BoxShape.circle,
                                      color: notif.isRead ? Colors.transparent : AppTheme.brandBlue,
                                    ),
                                  ),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Row(
                                          children: [
                                            Expanded(
                                              child: Text(
                                                notif.title,
                                                style: GoogleFonts.dmSans(
                                                  color: AppTheme.textDark,
                                                  fontSize: 13,
                                                  fontWeight: notif.isRead ? FontWeight.w700 : FontWeight.w900,
                                                ),
                                              ),
                                            ),
                                            Text(
                                              notif.timestamp,
                                              style: GoogleFonts.dmSans(color: AppTheme.textMuted, fontSize: 10),
                                            ),
                                          ],
                                        ),
                                        const SizedBox(height: 6),
                                        Text(
                                          notif.body,
                                          style: GoogleFonts.dmSans(
                                            color: notif.isRead ? AppTheme.textMuted : AppTheme.textBody,
                                            fontSize: 12,
                                            height: 1.4,
                                          ),
                                        ),
                                      ],
                                    ),
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
        ],
      ),
    );
  }
}
