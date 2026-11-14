import 'dart:async';
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

  // Set status bar styling early
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.dark,
      systemNavigationBarColor: Colors.white,
      systemNavigationBarIconBrightness: Brightness.dark,
    ),
  );

  // ✅ CRITICAL: Firebase MUST be initialized before any Firebase plugin usage
  try {
    await Firebase.initializeApp();
    // Register background messaging handler in main isolate so notifications fire when app is closed
    FirebaseMessaging.onBackgroundMessage(firebaseMessagingBackgroundHandler);
  } catch (e) {
    debugPrint('Firebase initialization error: $e');
  }

  // 🚀 Fast-boot: Run Flutter app immediately so SplashScreen appears with zero lag
  runApp(
    const ProviderScope(
      child: PharmaCodeApp(),
    ),
  );

  // Non-blocking initialization of core background services during splash animation
  unawaited(AppHaptics.init());
  unawaited(InAppPurchaseService.instance.init());
  unawaited(NotificationService().initialize());
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
      scrollBehavior: const SmoothScrollBehavior(),
      home: const SplashScreen(),
    );
  }
}

/// Global smooth bouncing scroll behavior for high refresh rate displays (90Hz / 120Hz)
class SmoothScrollBehavior extends MaterialScrollBehavior {
  const SmoothScrollBehavior();

  @override
  ScrollPhysics getScrollPhysics(BuildContext context) {
    return const BouncingScrollPhysics(parent: AlwaysScrollableScrollPhysics());
  }
}
