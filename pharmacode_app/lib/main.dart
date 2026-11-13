import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'core/animations.dart';
import 'core/billing/in_app_purchase_service.dart';
import 'core/notification_service.dart';
import 'core/theme.dart';
import 'screens/splash_screen.dart';

final themeModeProvider = Provider<ThemeMode>((ref) => ThemeMode.light);

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize Haptic touch settings
  await AppHaptics.init();

  // ✅ CRITICAL: Firebase MUST be initialized before any Firebase plugin usage
  try {
    await Firebase.initializeApp();
    // Register background messaging handler in main isolate so notifications fire when app is closed
    FirebaseMessaging.onBackgroundMessage(firebaseMessagingBackgroundHandler);
  } catch (e) {
    debugPrint('Firebase initialization error: $e');
  }

  // Set status bar styling
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.dark,
      systemNavigationBarColor: Colors.white,
      systemNavigationBarIconBrightness: Brightness.dark,
    ),
  );

  // Initialize In-App Purchases (Google Play Billing)
  try {
    await InAppPurchaseService.instance.init();
  } catch (e) {
    debugPrint('InAppPurchaseService initialization error: $e');
  }

  // Initialize Notification Service (loads saved notifications, read IDs & deleted IDs)
  try {
    await NotificationService().initialize();
  } catch (e) {
    debugPrint('NotificationService initialization error: $e');
  }

  runApp(
    const ProviderScope(
      child: PharmaCodeApp(),
    ),
  );
}

class PharmaCodeApp extends StatelessWidget {
  const PharmaCodeApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'PharmaCode',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      themeMode: ThemeMode.light,
      home: const SplashScreen(),
    );
  }
}
