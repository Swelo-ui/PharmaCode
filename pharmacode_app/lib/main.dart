import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'core/ads/ad_service.dart';
import 'core/notification_service.dart';
import 'core/theme.dart';
import 'screens/splash_screen.dart';

final themeModeProvider = StateProvider<ThemeMode>((ref) => ThemeMode.light);

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Set status bar styling
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.dark,
      systemNavigationBarColor: Colors.white,
      systemNavigationBarIconBrightness: Brightness.dark,
    ),
  );

  // Initialize Firebase
  try {
    await Firebase.initializeApp();
    FirebaseMessaging.onBackgroundMessage(firebaseMessagingBackgroundHandler);
  } catch (e) {
    debugPrint('Firebase initialization notice: $e');
  }

  // Initialize Google AdMob SDK
  try {
    await AdService.instance.initialize();
  } catch (e) {
    debugPrint('AdMob initialization notice: $e');
  }

  runApp(
    const ProviderScope(
      child: PharmaCodeApp(),
    ),
  );
}

class PharmaCodeApp extends ConsumerWidget {
  const PharmaCodeApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final themeMode = ref.watch(themeModeProvider);

    return MaterialApp(
      title: 'PharmaCode',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: themeMode,
      home: const SplashScreen(),
    );
  }
}
