import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/notification_service.dart';

final notificationServiceProvider = Provider<NotificationService>((ref) {
  return NotificationService();
});

class NotificationListNotifier extends StateNotifier<List<AppNotification>> {
  final NotificationService _service;

  NotificationListNotifier(this._service) : super([]) {
    _load();
    _service.unreadCountNotifier.addListener(_load);
  }

  @override
  void dispose() {
    _service.unreadCountNotifier.removeListener(_load);
    super.dispose();
  }

  void _load() {
    state = _service.history;
  }

  Future<void> markAsRead(String id) async {
    await _service.markAsRead(id);
    state = _service.history;
  }

  Future<void> markAllAsRead() async {
    await _service.markAllAsRead();
    state = _service.history;
  }

  Future<void> triggerTest() async {
    await _service.triggerTestNotification();
    state = _service.history;
  }

  Future<void> triggerDelayedTest(int seconds) async {
    await _service.scheduleDelayedTestNotification(seconds);
  }
}

final notificationsListProvider = StateNotifierProvider<NotificationListNotifier, List<AppNotification>>((ref) {
  return NotificationListNotifier(ref.watch(notificationServiceProvider));
});

final unreadNotificationsCountProvider = Provider<int>((ref) {
  final list = ref.watch(notificationsListProvider);
  return list.where((n) => !n.isRead).length;
});
