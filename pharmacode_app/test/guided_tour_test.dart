import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:pharmacode_app/core/tour/guided_tour_service.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('GuidedTourService Tests', () {
    late GuidedTourService tourService;

    setUp(() {
      SharedPreferences.setMockInitialValues({});
      tourService = GuidedTourService();
    });

    test('Initial state: fresh install has not completed onboarding or tour', () async {
      final onboardingDone = await tourService.isOnboardingCompleted();
      final tourDone = await tourService.isGuidedTourCompleted();

      expect(onboardingDone, isFalse);
      expect(tourDone, isFalse);
    });

    test('Completing onboarding with Get Started sets onboarding done and preserves tour for launch', () async {
      await tourService.setOnboardingCompleted(skipTour: false);

      final onboardingDone = await tourService.isOnboardingCompleted();
      final tourDone = await tourService.isGuidedTourCompleted();

      expect(onboardingDone, isTrue);
      expect(tourDone, isFalse);
    });

    test('Completing onboarding with Skip marks both onboarding AND tour completed', () async {
      await tourService.setOnboardingCompleted(skipTour: true);

      final onboardingDone = await tourService.isOnboardingCompleted();
      final tourDone = await tourService.isGuidedTourCompleted();

      expect(onboardingDone, isTrue);
      expect(tourDone, isTrue);
    });

    test('Completing guided tour explicitly sets flag to true', () async {
      await tourService.setGuidedTourCompleted(true);
      final tourDone = await tourService.isGuidedTourCompleted();
      expect(tourDone, isTrue);
    });

    test('Resetting guided tour allows re-taking the tour while preserving onboarding state', () async {
      await tourService.setOnboardingCompleted(skipTour: false);
      await tourService.setGuidedTourCompleted(true);

      expect(await tourService.isOnboardingCompleted(), isTrue);
      expect(await tourService.isGuidedTourCompleted(), isTrue);

      await tourService.resetGuidedTour();

      expect(await tourService.isOnboardingCompleted(), isTrue);
      expect(await tourService.isGuidedTourCompleted(), isFalse);
    });

    test('Legacy migration: seen_onboarding is respected', () async {
      SharedPreferences.setMockInitialValues({
        'seen_onboarding': true,
      });

      final onboardingDone = await tourService.isOnboardingCompleted();
      expect(onboardingDone, isTrue);
    });

    test('resetAllForTesting clears both onboarding and tour', () async {
      await tourService.setOnboardingCompleted(skipTour: true);
      expect(await tourService.isOnboardingCompleted(), isTrue);
      expect(await tourService.isGuidedTourCompleted(), isTrue);

      await tourService.resetAllForTesting();
      expect(await tourService.isOnboardingCompleted(), isFalse);
      expect(await tourService.isGuidedTourCompleted(), isFalse);
    });
  });
}
