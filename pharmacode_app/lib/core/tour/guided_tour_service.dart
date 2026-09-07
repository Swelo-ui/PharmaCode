import 'package:shared_preferences/shared_preferences.dart';

class GuidedTourService {
  static final GuidedTourService _instance = GuidedTourService._internal();
  factory GuidedTourService() => _instance;
  GuidedTourService._internal();

  static const String keyOnboardingCompleted = 'onboarding_completed';
  static const String keyLegacySeenOnboarding = 'seen_onboarding';
  static const String keyGuidedTourCompleted = 'guided_tour_completed';

  Future<bool> isOnboardingCompleted() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(keyOnboardingCompleted) ??
        prefs.getBool(keyLegacySeenOnboarding) ??
        false;
  }

  Future<void> setOnboardingCompleted({bool skipTour = false}) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(keyOnboardingCompleted, true);
    await prefs.setBool(keyLegacySeenOnboarding, true);
    if (skipTour) {
      await prefs.setBool(keyGuidedTourCompleted, true);
    }
  }

  Future<bool> isGuidedTourCompleted() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(keyGuidedTourCompleted) ?? false;
  }

  Future<void> setGuidedTourCompleted(bool completed) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(keyGuidedTourCompleted, completed);
  }

  Future<void> resetGuidedTour() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(keyGuidedTourCompleted, false);
  }

  Future<void> resetAllForTesting() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(keyOnboardingCompleted);
    await prefs.remove(keyLegacySeenOnboarding);
    await prefs.remove(keyGuidedTourCompleted);
  }
}
