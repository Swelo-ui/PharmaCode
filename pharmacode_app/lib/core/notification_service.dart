import 'dart:async';
import 'dart:convert';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:timezone/data/latest_all.dart' as tz;
import 'package:timezone/timezone.dart' as tz;

// ─── SHARED CONSTANTS ────────────────────────────────────────────────────────
const String _kChannelId = 'pharmacode_alerts_v2';
const String _kChannelName = 'PharmaCode Alerts';
const String _kChannelDesc =
    'Instant updates on B.Pharm syllabus, notes & announcements';
const String _kSoundName = 'pharmacode_sound';

@pragma('vm:entry-point')
Future<void> firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  debugPrint('FCM Background message received: ${message.messageId}');

  // Firebase must be initialized in background isolate
  try {
    await Firebase.initializeApp();
  } catch (e) {
    debugPrint('Firebase background init note: $e');
  }

  // Check user preference
  try {
    final prefs = await SharedPreferences.getInstance();
    final enabled = prefs.getBool('pref_notifications') ?? true;
    if (!enabled) {
      debugPrint('FCM background notification skipped: user muted notifications');
      return;
    }
  } catch (_) {}

  final title = message.notification?.title ??
      message.data['title'] ??
      'PharmaCode Alert';
  final body = message.notification?.body ??
      message.data['body'] ??
      'New study materials & updates are available.';
  final payload = message.data['deepLink'] ?? message.data['route'];

  final plugin = FlutterLocalNotificationsPlugin();
  const androidSettings =
      AndroidInitializationSettings('@mipmap/ic_notification');
  await plugin.initialize(
    settings: const InitializationSettings(android: androidSettings),
  );

  final androidPlugin = plugin
      .resolvePlatformSpecificImplementation<
          AndroidFlutterLocalNotificationsPlugin>();

  // Re-create channels in background isolate (safe / idempotent)
  const channel = AndroidNotificationChannel(
    _kChannelId,
    _kChannelName,
    description: _kChannelDesc,
    importance: Importance.max,
    sound: RawResourceAndroidNotificationSound(_kSoundName),
    playSound: true,
    enableVibration: true,
    enableLights: true,
  );
  await androidPlugin?.createNotificationChannel(channel);

  const fallbackChannel = AndroidNotificationChannel(
    'fcm_fallback_notification_channel',
    'PharmaCode Broadcast',
    description: _kChannelDesc,
    importance: Importance.max,
    sound: RawResourceAndroidNotificationSound(_kSoundName),
    playSound: true,
    enableVibration: true,
    enableLights: true,
  );
  await androidPlugin?.createNotificationChannel(fallbackChannel);

  const androidDetails = AndroidNotificationDetails(
    _kChannelId,
    _kChannelName,
    channelDescription: _kChannelDesc,
    importance: Importance.max,
    priority: Priority.high,
    playSound: true,
    sound: RawResourceAndroidNotificationSound(_kSoundName),
    icon: '@mipmap/ic_notification',
    enableVibration: true,
    enableLights: true,
    visibility: NotificationVisibility.public,
  );

  // Only show local notification if it was a data-only payload.
  // If message.notification != null, Google Play Services / Android OS already displays it.
  if (message.notification == null) {
    final notifId =
        (DateTime.now().millisecondsSinceEpoch ~/ 100) % 2147483647;
    await plugin.show(
      id: notifId,
      title: title,
      body: body,
      notificationDetails: const NotificationDetails(android: androidDetails),
      payload: payload,
    );
  }

  // Persist to SharedPreferences for in-app notification center
  try {
    final prefs = await SharedPreferences.getInstance();
    final storedJson = prefs.getString('saved_notifications');
    List<dynamic> list = [];
    if (storedJson != null) {
      try {
        list = jsonDecode(storedJson) as List<dynamic>;
      } catch (_) {}
    }
    list.insert(0, {
      'id': 'notif-${DateTime.now().millisecondsSinceEpoch}',
      'title': title,
      'body': body,
      'timestamp': 'Just now',
      'deepLink': payload,
      'isRead': false,
    });
    await prefs.setString('saved_notifications', jsonEncode(list));
  } catch (e) {
    debugPrint('Background notification storage error: $e');
  }
}


class AppNotification {
  final String id;
  final String title;
  final String body;
  final String timestamp;
  final String? deepLink;
  bool isRead;

  AppNotification({
    required this.id,
    required this.title,
    required this.body,
    required this.timestamp,
    this.deepLink,
    this.isRead = false,
  });

  Map<String, dynamic> toMap() => {
    'id': id,
    'title': title,
    'body': body,
    'timestamp': timestamp,
    'deepLink': deepLink,
    'isRead': isRead,
  };

  factory AppNotification.fromMap(Map<String, dynamic> map) => AppNotification(
    id: map['id'] ?? '',
    title: map['title'] ?? '',
    body: map['body'] ?? '',
    timestamp: map['timestamp'] ?? '',
    deepLink: map['deepLink'],
    isRead: map['isRead'] ?? false,
  );
}

class NotificationService {
  static const String channelId = 'pharmacode_alerts_v2';
  static const String channelName = 'PharmaCode Alerts';
  static const String soundResourceName = 'pharmacode_sound';

  static final NotificationService _instance = NotificationService._internal();
  factory NotificationService() => _instance;
  NotificationService._internal();

  final FlutterLocalNotificationsPlugin _notificationsPlugin =
      FlutterLocalNotificationsPlugin();

  bool _isInitialized = false;
  bool _hasInitialSynced = false;
  Completer<void>? _initCompleter;
  String? _fcmToken;
  final List<AppNotification> _notificationsHistory = [];
  final Set<String> _alertedNotifIds = {};
  final Set<String> _readNotifIds = {};
  final Set<String> _deletedNotifIds = {};
  Timer? _pollingTimer;
  final ValueNotifier<int> unreadCountNotifier = ValueNotifier<int>(0);
  final ValueNotifier<List<AppNotification>> notificationsNotifier =
      ValueNotifier<List<AppNotification>>([]);

  List<AppNotification> get history => List.unmodifiable(_notificationsHistory);
  int get unreadCount => _notificationsHistory.where((n) => !n.isRead).length;
  String? get fcmToken => _fcmToken;

  Future<String?> getFcmToken() async {
    try {
      _fcmToken ??= await FirebaseMessaging.instance.getToken();
    } catch (e) {
      debugPrint('getFcmToken error: $e');
    }
    return _fcmToken;
  }

  void _notifyListeners() {
    notificationsNotifier.value = List.unmodifiable(_notificationsHistory);
    unreadCountNotifier.value =
        _notificationsHistory.where((n) => !n.isRead).length;
  }

  void _updateUnreadCount() => _notifyListeners();

  Future<void> ensureInitialized() async {
    if (_isInitialized) return;
    if (_initCompleter != null) {
      await _initCompleter!.future;
      return;
    }
    _initCompleter = Completer<void>();
    await initialize();
    if (!_initCompleter!.isCompleted) {
      _initCompleter!.complete();
    }
  }

  Future<void> initialize() async {
    if (_isInitialized) return;

    const AndroidInitializationSettings androidSettings =
        AndroidInitializationSettings('@mipmap/ic_notification');

    const InitializationSettings initSettings = InitializationSettings(
      android: androidSettings,
    );

    try {
      // Initialize timezone database (needed for zonedSchedule)
      tz.initializeTimeZones();
      await _notificationsPlugin.initialize(
        settings: initSettings,
        onDidReceiveNotificationResponse: (NotificationResponse details) {
          debugPrint('Notification tapped: ${details.payload}');
        },
        onDidReceiveBackgroundNotificationResponse:
            _onBackgroundNotificationTapped,
      );

      // Create the custom notification channel (idempotent — safe to call multiple times)
      final androidPlugin = _notificationsPlugin
          .resolvePlatformSpecificImplementation<
              AndroidFlutterLocalNotificationsPlugin>();

      const AndroidNotificationChannel channel = AndroidNotificationChannel(
        channelId,
        channelName,
        description: _kChannelDesc,
        importance: Importance.max,
        sound: RawResourceAndroidNotificationSound(soundResourceName),
        playSound: true,
        enableVibration: true,
        enableLights: true,
      );
      await androidPlugin?.createNotificationChannel(channel);

      // Create fallback channels for FCM (ensures all FCM pushes get highest priority even if channel unspecified)
      const AndroidNotificationChannel fallbackChannel = AndroidNotificationChannel(
        'fcm_fallback_notification_channel',
        'PharmaCode Broadcast',
        description: _kChannelDesc,
        importance: Importance.max,
        sound: RawResourceAndroidNotificationSound(soundResourceName),
        playSound: true,
        enableVibration: true,
        enableLights: true,
      );
      await androidPlugin?.createNotificationChannel(fallbackChannel);

      // Request runtime notification permission (Android 13+)
      final granted =
          await androidPlugin?.requestNotificationsPermission() ?? false;
      debugPrint('Notification permission granted: $granted');

      // Initialize Firebase Cloud Messaging
      await _initializeFirebaseMessaging();

      _isInitialized = true;
      await _loadStoredNotifications();
      startPeriodicSync();
      unawaited(syncRemoteNotifications());
      unawaited(scheduleRecurringStudyNotifications());
    } catch (e) {
      debugPrint('Notification initialization error: $e');
    }
  }

  /// Automatically schedules high-yield PCI exam & study alerts using Android native AlarmManager.
  /// Works reliably even when the app is completely closed / killed.
  Future<void> scheduleRecurringStudyNotifications() async {
    try {
      final enabled = await areNotificationsEnabled();
      if (!enabled) return;

      tz.initializeTimeZones();
      final now = tz.TZDateTime.now(tz.local);

      // Study Reminder 1: Scheduled for next morning 10:00 AM
      var nextTipTime = tz.TZDateTime(tz.local, now.year, now.month, now.day + 1, 10, 0);
      if (nextTipTime.isBefore(now)) {
        nextTipTime = nextTipTime.add(const Duration(days: 1));
      }

      const AndroidNotificationDetails studyDetails = AndroidNotificationDetails(
        channelId,
        channelName,
        channelDescription: _kChannelDesc,
        importance: Importance.max,
        priority: Priority.high,
        playSound: true,
        sound: RawResourceAndroidNotificationSound(soundResourceName),
        icon: '@mipmap/ic_notification',
        enableVibration: true,
        enableLights: true,
        visibility: NotificationVisibility.public,
      );

      await _notificationsPlugin.zonedSchedule(
        id: 9101,
        title: '🎓 GPAT 2027 Rapid Study Tip',
        body: 'Master unit headings first — over 60% of exam questions are framed directly from standard PCI syllabus topics!',
        scheduledDate: nextTipTime,
        notificationDetails: const NotificationDetails(android: studyDetails),
        payload: '/notes',
        androidScheduleMode: AndroidScheduleMode.inexactAllowWhileIdle,
      );

      // Study Reminder 2: Scheduled for 2 days later at 6:30 PM
      var nextRevTime = tz.TZDateTime(tz.local, now.year, now.month, now.day + 2, 18, 30);
      await _notificationsPlugin.zonedSchedule(
        id: 9102,
        title: '📚 B.Pharm Rapid Revision Alert',
        body: 'Check out newly uploaded verified Unit Notes and Formula Kits in your PharmaCode offline library.',
        scheduledDate: nextRevTime,
        notificationDetails: const NotificationDetails(android: studyDetails),
        payload: '/notes',
        androidScheduleMode: AndroidScheduleMode.inexactAllowWhileIdle,
      );
    } catch (e) {
      debugPrint('Error scheduling study reminders: $e');
    }
  }

  void startPeriodicSync() {
    _pollingTimer?.cancel();
    // Poll every 15 seconds while app is in foreground/memory for instant alert broadcast
    _pollingTimer = Timer.periodic(const Duration(seconds: 15), (_) {
      syncRemoteNotifications();
    });
  }

  void stopPeriodicSync() {
    _pollingTimer?.cancel();
  }

  /// Syncs notifications broadcast from Admin Panel and records active user heartbeat
  Future<void> syncRemoteNotifications() async {
    await ensureInitialized();
    try {
      final prefs = await SharedPreferences.getInstance();

      // 1. Send anonymous heartbeat for active users count
      try {
        var deviceId = prefs.getString('device_unique_id');
        if (deviceId == null) {
          deviceId = 'apk_${DateTime.now().millisecondsSinceEpoch}_${(1000 + (DateTime.now().microsecond % 9000))}';
          await prefs.setString('device_unique_id', deviceId);
        }

        final heartbeatUri = Uri.parse('https://pharmacode.vercel.app/api/admin/analytics');
        unawaited(http.post(
          heartbeatUri,
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode({'platform': 'Android App', 'deviceId': deviceId}),
        ).timeout(const Duration(seconds: 4)));
      } catch (_) {}

      // 2. Fetch remote notifications feed from Admin Panel with cache-buster
      final feedUri = Uri.parse('https://pharmacode.vercel.app/api/notifications/?t=${DateTime.now().millisecondsSinceEpoch}');
      final res = await http.get(feedUri).timeout(const Duration(seconds: 6));
      if (res.statusCode == 200) {
        final Map<String, dynamic> data = jsonDecode(res.body);
        final List<dynamic> remoteList = data['notifications'] ?? [];

        bool updated = false;
        final existingMap = {for (var n in _notificationsHistory) n.id: n};
        final enabled = prefs.getBool('pref_notifications') ?? true;
        final bool isFirstRunDone = prefs.getBool('notifications_first_run_completed') ?? false;

        for (final item in remoteList) {
          final id = item['id']?.toString() ?? '';
          final title = item['title']?.toString() ?? '';
          final body = item['body']?.toString() ?? '';
          final deepLink = item['deepLink']?.toString();
          final timestamp = item['timestamp']?.toString() ?? 'Recent';

          if (id.isEmpty) continue;

          // ❌ If the user swiped away/deleted this notification, NEVER bring it back!
          if (_deletedNotifIds.contains(id)) continue;

          // ✅ BULLETPROOF: On app launch or initial sync, mark all existing historical
          // notifications as alerted quietly so that NO POPUPS/BANNERS occur when opening the app!
          if (!_hasInitialSynced || !isFirstRunDone) {
            _alertedNotifIds.add(id);
          } else {
            // Trigger local system banner & sound ONLY for genuine NEW broadcasts that arrive WHILE app is open/polling
            if (!_alertedNotifIds.contains(id)) {
              _alertedNotifIds.add(id);
              updated = true;

              if (enabled) {
                final notifId = (id.hashCode.abs()) % 2147483647;
                const AndroidNotificationDetails androidDetails = AndroidNotificationDetails(
                  channelId,
                  channelName,
                  channelDescription: _kChannelDesc,
                  importance: Importance.max,
                  priority: Priority.high,
                  showWhen: true,
                  playSound: true,
                  sound: RawResourceAndroidNotificationSound(soundResourceName),
                  icon: '@mipmap/ic_notification',
                  enableVibration: true,
                  enableLights: true,
                  visibility: NotificationVisibility.public,
                );

                await _notificationsPlugin.show(
                  id: notifId,
                  title: title,
                  body: body,
                  notificationDetails: const NotificationDetails(android: androidDetails),
                  payload: deepLink,
                );
              }
            }
          }

          // Check if already in history
          if (existingMap.containsKey(id)) {
            // If already in history, preserve read state! If user read it, ensure it stays read!
            final existing = existingMap[id]!;
            if (_readNotifIds.contains(id) && !existing.isRead) {
              existing.isRead = true;
              updated = true;
            }
          } else {
            // New notification from server
            final bool isRead = _readNotifIds.contains(id);
            final notifObj = AppNotification(
              id: id,
              title: title,
              body: body,
              timestamp: timestamp,
              deepLink: deepLink,
              isRead: isRead,
            );
            _notificationsHistory.insert(0, notifObj);
            existingMap[id] = notifObj;
            updated = true;
          }
        }

        _hasInitialSynced = true;
        await prefs.setBool('notifications_first_run_completed', true);
        await prefs.setStringList('alerted_notification_ids', _alertedNotifIds.toList());

        if (updated) {
          _notifyListeners();
          await _persistNotifications();
        }
      }
    } catch (e) {
      debugPrint('Remote notification sync note (offline or server unreachable): $e');
    }
  }

  Future<void> _initializeFirebaseMessaging() async {
    try {
      final messaging = FirebaseMessaging.instance;

      // Request permissions (alert, badge, sound)
      final settings = await messaging.requestPermission(
        alert: true,
        badge: true,
        sound: true,
        provisional: false,
      );
      debugPrint('FCM Authorization status: ${settings.authorizationStatus}');

      // Enable foreground notification presentation with sound
      await messaging.setForegroundNotificationPresentationOptions(
        alert: true,
        badge: true,
        sound: true,
      );

      // Subscribe to topics for broadcast alerts (delivers reliably when app is killed/closed)
      try {
        await Future.wait([
          messaging.subscribeToTopic('all_students'),
          messaging.subscribeToTopic('all'),
          messaging.subscribeToTopic('updates'),
          messaging.subscribeToTopic('general'),
          messaging.subscribeToTopic('announcements'),
        ]).timeout(const Duration(milliseconds: 1500));
      } catch (e) {
        debugPrint('FCM Topic subscribe skipped/offline: $e');
      }

      // Fetch FCM Token safely with timeout
      try {
        _fcmToken = await messaging.getToken().timeout(const Duration(milliseconds: 1500));
        debugPrint('FCM Device Registration Token: $_fcmToken');
      } catch (e) {
        debugPrint('FCM Token get skipped/offline: $e');
      }

      // Listen for token refreshes
      messaging.onTokenRefresh.listen((token) {
        _fcmToken = token;
        debugPrint('FCM Token Refreshed: $token');
      });

      // Foreground message listener: show custom local notification with custom sound
      FirebaseMessaging.onMessage.listen((RemoteMessage message) {
        debugPrint('FCM Foreground message: ${message.notification?.title ?? message.data["title"]}');
        final title = message.notification?.title ?? message.data['title'] ?? 'PharmaCode Update';
        final body = message.notification?.body ?? message.data['body'] ?? '';
        final payload = message.data['deepLink'] ?? message.data['route'];

        showNotification(
          title: title,
          body: body,
          payload: payload,
        );
      });

      // Background notification tap handler
      FirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage message) {
        debugPrint('FCM message opened app: ${message.data}');
      });

      // Terminated / Killed app notification tap handler
      final initialMessage = await messaging.getInitialMessage();
      if (initialMessage != null) {
        debugPrint('FCM App opened from terminated state: ${initialMessage.data}');
      }
    } catch (e) {
      debugPrint('FCM Setup info (offline/unsupported platform): $e');
    }
  }

  Future<void> reloadNotifications() async {
    await _loadStoredNotifications();
  }

  Future<void> _loadStoredNotifications() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final alerted = prefs.getStringList('alerted_notification_ids');
      if (alerted != null) {
        _alertedNotifIds.addAll(alerted);
      }
      final readIds = prefs.getStringList('read_notification_ids');
      if (readIds != null) {
        _readNotifIds.addAll(readIds);
      }
      final deletedIds = prefs.getStringList('deleted_notification_ids');
      if (deletedIds != null) {
        _deletedNotifIds.addAll(deletedIds);
      }

      final storedJson = prefs.getString('saved_notifications');
      _notificationsHistory.clear();
      if (storedJson != null) {
        final List<dynamic> list = jsonDecode(storedJson);
        for (final item in list) {
          final n = AppNotification.fromMap(item as Map<String, dynamic>);
          // Never reload a notification that was swiped/deleted by user
          if (_deletedNotifIds.contains(n.id)) continue;
          // If user marked as read, guarantee isRead = true
          if (_readNotifIds.contains(n.id)) {
            n.isRead = true;
          }
          _notificationsHistory.add(n);
        }
      }
    } catch (e) {
      debugPrint('Error loading saved notifications: $e');
    } finally {
      _notifyListeners();
    }
  }

  Future<void> _persistNotifications() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final jsonString = jsonEncode(
        _notificationsHistory.map((n) => n.toMap()).toList(),
      );
      await prefs.setString('saved_notifications', jsonString);
    } catch (e) {
      debugPrint('Error persisting notifications: $e');
    }
  }

  Future<void> setNotificationsEnabled(bool enabled) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('pref_notifications', enabled);

    try {
      final messaging = FirebaseMessaging.instance;
      const topics = ['all_students', 'all', 'updates', 'general', 'announcements'];
      if (enabled) {
        for (final topic in topics) {
          await messaging.subscribeToTopic(topic);
        }
      } else {
        for (final topic in topics) {
          await messaging.unsubscribeFromTopic(topic);
        }
        await _notificationsPlugin.cancelAll();
      }
    } catch (e) {
      debugPrint('Error updating FCM topic subscriptions: $e');
    }
  }

  static Future<bool> areNotificationsEnabled() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      return prefs.getBool('pref_notifications') ?? true;
    } catch (_) {
      return true;
    }
  }

  Future<void> markAllAsRead() async {
    await ensureInitialized();
    for (var n in _notificationsHistory) {
      n.isRead = true;
      _readNotifIds.add(n.id);
    }
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setStringList('read_notification_ids', _readNotifIds.toList());
    } catch (_) {}
    _notifyListeners();
    await _persistNotifications();
  }

  Future<void> markAsRead(String id) async {
    await ensureInitialized();
    final index = _notificationsHistory.indexWhere((n) => n.id == id);
    if (index != -1) {
      _notificationsHistory[index].isRead = true;
      _readNotifIds.add(id);
      try {
        final prefs = await SharedPreferences.getInstance();
        await prefs.setStringList('read_notification_ids', _readNotifIds.toList());
      } catch (_) {}
      _notifyListeners();
      await _persistNotifications();
    }
  }

  /// Deletes a notification (swipe-to-dismiss) and permanently records it so it never reappears
  Future<void> deleteNotification(String id) async {
    await ensureInitialized();
    _notificationsHistory.removeWhere((n) => n.id == id);
    _deletedNotifIds.add(id);
    _readNotifIds.remove(id);

    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setStringList('deleted_notification_ids', _deletedNotifIds.toList());
    } catch (_) {}
    _notifyListeners();
    await _persistNotifications();
  }

  /// Shows a local notification immediately AND adds it to in-app notification center.
  Future<void> showNotification({
    required String title,
    required String body,
    String? payload,
  }) async {
    final notif = AppNotification(
      id: 'notif-${DateTime.now().millisecondsSinceEpoch}',
      title: title,
      body: body,
      timestamp: 'Just now',
      deepLink: payload,
      isRead: false,
    );

    _notificationsHistory.insert(0, notif);
    _updateUnreadCount();
    await _persistNotifications();

    final enabled = await areNotificationsEnabled();
    if (!enabled) {
      debugPrint('Local notification sound/alert suppressed because user disabled notifications.');
      return;
    }

    // ✅ Unique ID using microseconds to prevent collision / suppression
    final notifId =
        (DateTime.now().microsecondsSinceEpoch ~/ 100) % 2147483647;

    const AndroidNotificationDetails androidDetails = AndroidNotificationDetails(
      channelId,
      channelName,
      channelDescription: _kChannelDesc,
      importance: Importance.max,
      priority: Priority.high,
      showWhen: true,
      playSound: true,
      sound: RawResourceAndroidNotificationSound(soundResourceName),
      icon: '@mipmap/ic_notification',
      enableVibration: true,
      enableLights: true,
      visibility: NotificationVisibility.public,
    );

    const NotificationDetails platformDetails = NotificationDetails(
      android: androidDetails,
    );

    try {
      await _notificationsPlugin.show(
        id: notifId,
        title: title,
        body: body,
        notificationDetails: platformDetails,
        payload: payload,
      );
    } catch (e) {
      debugPrint('Local notification display error: $e');
    }
  }

  /// Triggers an immediate test notification visible in Android notification panel.
  Future<void> triggerTestNotification() async {
    await showNotification(
      title: '🎉 PharmaCode Live Alert!',
      body: 'Realtime notifications are working! Custom chime sound active.',
      payload: '/notes',
    );
  }

  /// ✅ Schedules a notification using Android AlarmManager via zonedSchedule.
  /// Works even when app is completely closed / killed.
  /// [seconds] = delay before notification fires (e.g. 10 = 10 seconds from now)
  Future<void> scheduleDelayedTestNotification(int seconds, {
    String title = '🔔 PharmaCode Scheduled Alert!',
    String body = 'Yeh notification app band hone ke baad bhi aayi!',
    String? payload,
  }) async {
    try {
      // Ensure timezone is initialized
      tz.initializeTimeZones();
      final scheduledTime = tz.TZDateTime.now(tz.local).add(
        Duration(seconds: seconds),
      );

      final notifId =
          (DateTime.now().microsecondsSinceEpoch ~/ 100) % 2147483647;

      const AndroidNotificationDetails androidDetails =
          AndroidNotificationDetails(
        channelId,
        channelName,
        channelDescription: _kChannelDesc,
        importance: Importance.max,
        priority: Priority.high,
        playSound: true,
        sound: RawResourceAndroidNotificationSound(soundResourceName),
        icon: '@mipmap/ic_notification',
        enableVibration: true,
        enableLights: true,
        visibility: NotificationVisibility.public,
      );

      await _notificationsPlugin.zonedSchedule(
        id: notifId,
        title: title,
        body: body,
        scheduledDate: scheduledTime,
        notificationDetails: const NotificationDetails(android: androidDetails),
        payload: payload,
        androidScheduleMode: AndroidScheduleMode.inexactAllowWhileIdle,
      );

      final notif = AppNotification(
        id: 'notif-${DateTime.now().millisecondsSinceEpoch}',
        title: title,
        body: body,
        timestamp: 'Just now',
        deepLink: payload,
        isRead: false,
      );
      _notificationsHistory.insert(0, notif);
      _updateUnreadCount();
      await _persistNotifications();

      debugPrint(
          'Notification scheduled at $scheduledTime (in $seconds seconds)');
    } catch (e) {
      debugPrint('Schedule notification error: $e');
    }
  }
}


// ─── TOP-LEVEL background tap callback ───────────────────────────────────────
/// Must be a top-level function annotated with @pragma for background isolate.
@pragma('vm:entry-point')
void _onBackgroundNotificationTapped(NotificationResponse details) {
  debugPrint('Background notification tapped: ${details.payload}');
}

