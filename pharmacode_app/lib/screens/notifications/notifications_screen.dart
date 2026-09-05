import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme.dart';
import '../../core/widgets/empty_state_view.dart';
import '../../features/notifications/presentation/notification_controller.dart';

class NotificationsScreen extends ConsumerWidget {
  const NotificationsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final list = ref.watch(notificationsListProvider);

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded, color: AppTheme.primaryNavy),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          'Notifications',
          style: GoogleFonts.dmSans(
            color: AppTheme.primaryNavy,
            fontWeight: FontWeight.w800,
            fontSize: 18,
          ),
        ),
        actions: [
          if (list.isNotEmpty && list.any((n) => !n.isRead))
            TextButton(
              onPressed: () => ref.read(notificationsListProvider.notifier).markAllAsRead(),
              child: Text(
                'Mark all read',
                style: GoogleFonts.dmSans(
                  color: AppTheme.brandBlue,
                  fontSize: 13,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
        ],
      ),
      body: list.isEmpty
          ? const EmptyStateView(
              icon: Icons.notifications_none_rounded,
              title: 'No Notifications Yet',
              message: 'You are all caught up! New exam updates, notes & announcements will appear here.',
            )
          : ListView.separated(
              physics: const BouncingScrollPhysics(),
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
              itemCount: list.length,
              separatorBuilder: (ctx, idx) => const SizedBox(height: 10),
              itemBuilder: (context, index) {
                final notif = list[index];
                return Container(
                  decoration: BoxDecoration(
                    color: notif.isRead ? Colors.white : const Color(0xFFF0F7FF),
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(
                      color: notif.isRead
                          ? const Color(0xFFE2E8F0)
                          : const Color(0xFFBFDBFE),
                      width: notif.isRead ? 1 : 1.2,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.02),
                        blurRadius: 6,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: Material(
                    color: Colors.transparent,
                    child: InkWell(
                      onTap: () {
                        ref.read(notificationsListProvider.notifier).markAsRead(notif.id);
                      },
                      borderRadius: BorderRadius.circular(14),
                      child: Padding(
                        padding: const EdgeInsets.all(14),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Container(
                              width: 8,
                              height: 8,
                              margin: const EdgeInsets.only(top: 5, right: 10),
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: notif.isRead
                                    ? Colors.transparent
                                    : const Color(0xFF2563EB),
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
                                            color: AppTheme.primaryNavy,
                                            fontSize: 13.5,
                                            fontWeight: notif.isRead
                                                ? FontWeight.w700
                                                : FontWeight.w900,
                                          ),
                                        ),
                                      ),
                                      Text(
                                        notif.timestamp,
                                        style: GoogleFonts.inter(
                                          color: const Color(0xFF94A3B8),
                                          fontSize: 10.5,
                                          fontWeight: FontWeight.w500,
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 5),
                                  Text(
                                    notif.body,
                                    style: GoogleFonts.inter(
                                      color: notif.isRead
                                          ? const Color(0xFF64748B)
                                          : const Color(0xFF334155),
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
    );
  }
}
