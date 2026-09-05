import 'dart:convert';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
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

  // ✅ FIX: Always show via flutter_local_notifications with our custom channel.
  // When FCM sends a notification-payload, Android OS auto-shows it on the
  // DEFAULT channel (no custom sound). By always calling plugin.show() here,
  // we ensure our custom channel + sound is used every time.
  final notifId =
      (DateTime.now().millisecondsSinceEpoch ~/ 100) % 2147483647;
  await plugin.show(
    id: notifId,
    title: title,
    body: body,
    notificationDetails: const NotificationDetails(android: androidDetails),
    payload: payload,
  );

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
  String? _fcmToken;
  final List<AppNotification> _notificationsHistory = [];
  final ValueNotifier<int> unreadCountNotifier = ValueNotifier<int>(0);

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

  void _updateUnreadCount() {
    unreadCountNotifier.value = _notificationsHistory.where((n) => !n.isRead).length;
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

      // Request exact alarm permission (Android 12+) for reliable closed/background firing
      await androidPlugin?.requestExactAlarmsPermission();

      // Initialize Firebase Cloud Messaging
      await _initializeFirebaseMessaging();

      _isInitialized = true;
      await _loadStoredNotifications();
    } catch (e) {
      debugPrint('Notification initialization error: $e');
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
      await messaging.subscribeToTopic('all_students');
      await messaging.subscribeToTopic('all');
      await messaging.subscribeToTopic('updates');
      await messaging.subscribeToTopic('general');
      await messaging.subscribeToTopic('announcements');

      // Fetch FCM Token
      _fcmToken = await messaging.getToken();
      debugPrint('FCM Device Registration Token: $_fcmToken');

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
      final storedJson = prefs.getString('saved_notifications');
      if (storedJson != null) {
        final List<dynamic> list = jsonDecode(storedJson);
        _notificationsHistory.clear();
        _notificationsHistory.addAll(
          list.map((item) => AppNotification.fromMap(item as Map<String, dynamic>)),
        );
      } else {
        // Welcome notifications
        _notificationsHistory.addAll([
          AppNotification(
            id: 'notif-1',
            title: 'Welcome to PharmaCode!',
            body: 'Access complete B.Pharm NEP 2020 syllabus, unit-wise notes & career guides anytime offline.',
            timestamp: 'Just now',
            isRead: false,
          ),
          AppNotification(
            id: 'notif-2',
            title: 'New Subject Added: BP604T',
            body: 'AI Applications in Pharmaceutical Sciences syllabus and notes are now live.',
            timestamp: 'Yesterday',
            isRead: false,
          ),
          AppNotification(
            id: 'notif-3',
            title: 'GPAT 2027 Preparation Alert',
            body: 'Check high-yield unit headings in Pharmacology & Medicinal Chemistry.',
            timestamp: '3 days ago',
            isRead: true,
          ),
        ]);
        await _persistNotifications();
      }
    } catch (e) {
      debugPrint('Error loading saved notifications: $e');
    } finally {
      _updateUnreadCount();
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

  Future<void> markAllAsRead() async {
    for (var n in _notificationsHistory) {
      n.isRead = true;
    }
    _updateUnreadCount();
    await _persistNotifications();
  }

  Future<void> markAsRead(String id) async {
    final index = _notificationsHistory.indexWhere((n) => n.id == id);
    if (index != -1) {
      _notificationsHistory[index].isRead = true;
      _updateUnreadCount();
      await _persistNotifications();
    }
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
        androidScheduleMode: AndroidScheduleMode.exactAllowWhileIdle,
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

