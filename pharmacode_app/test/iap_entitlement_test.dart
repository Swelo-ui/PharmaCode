import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
// ignore: depend_on_referenced_packages
import 'package:in_app_purchase_android/src/messages.g.dart';
import 'package:pharmacode_app/core/billing/in_app_purchase_service.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  setUpAll(() {
    TestDefaultBinaryMessengerBinding.instance.defaultBinaryMessenger
        .setMockMessageHandler(
      'dev.flutter.pigeon.in_app_purchase_android.InAppPurchaseApi.startConnection',
      (ByteData? message) async {
        final codec = InAppPurchaseApi.pigeonChannelCodec;
        return codec.encodeMessage(<Object?>[PlatformBillingResult(responseCode: PlatformBillingResponse.ok, debugMessage: 'OK')]);
      },
    );
  });

  group('InAppPurchaseService Entitlement & Hierarchy Tests', () {
    late InAppPurchaseService billing;

    setUp(() {
      billing = InAppPurchaseService.instance;
      billing.unlockedNotifier.value = {};
    });

    tearDown(() {
      billing.unlockedNotifier.value = {};
    });

    test('1. Default Free State: Everything is LOCKED', () {
      expect(billing.isVipUnlocked, isFalse);
      expect(billing.isUnlocked(PlayProducts.guidePvInterview), isFalse);
      expect(billing.isUnlocked(PlayProducts.guideRaDossier), isFalse);
      expect(billing.isUnlocked(PlayProducts.guidePharmaInterview), isFalse);
      expect(billing.isUnlocked(PlayProducts.guidePharmaInterview), isFalse);
      expect(billing.isUnlocked('pdf_unit1_pharmacology'), isFalse);
      expect(billing.isUnlocked(null), isFalse);
      expect(billing.isUnlocked(''), isFalse);
    });

    test('2. Single Purchase - PV Guide Only (₹49): Only PV is UNLOCKED, others LOCKED', () {
      billing.unlockedNotifier.value = {PlayProducts.guidePvInterview};

      expect(billing.isVipUnlocked, isFalse, reason: 'VIP should NOT be unlocked when only PV is purchased');
      expect(billing.isUnlocked(PlayProducts.guidePvInterview), isTrue, reason: 'PV Guide must be unlocked');
      expect(billing.isUnlocked(PlayProducts.guideRaDossier), isFalse, reason: 'RA Guide must remain locked');
      expect(billing.isUnlocked('pdf_unit1_pharmacology'), isFalse, reason: 'Notes must remain locked');
    });

    test('3. Single Purchase - RA Guide Only (₹99): Only RA is UNLOCKED, others LOCKED', () {
      billing.unlockedNotifier.value = {PlayProducts.guideRaDossier};

      expect(billing.isVipUnlocked, isFalse, reason: 'VIP should NOT be unlocked when only RA is purchased');
      expect(billing.isUnlocked(PlayProducts.guideRaDossier), isTrue, reason: 'RA Guide must be unlocked');
      expect(billing.isUnlocked(PlayProducts.guidePvInterview), isFalse, reason: 'PV Guide must remain locked');
      expect(billing.isUnlocked(PlayProducts.guidePharmaInterview), isFalse, reason: 'Pharma Interview Kit must remain locked');
      expect(billing.isUnlocked('pdf_unit1_pharmacology'), isFalse, reason: 'Notes must remain locked');
    });

    test('3b. Single Purchase - Pharma Interview Kit Only (₹149): Only Interview Kit is UNLOCKED, others LOCKED', () {
      billing.unlockedNotifier.value = {PlayProducts.guidePharmaInterview};

      expect(billing.isVipUnlocked, isFalse, reason: 'VIP should NOT be unlocked when only Interview Kit is purchased');
      expect(billing.isUnlocked(PlayProducts.guidePharmaInterview), isTrue, reason: 'Interview Kit must be unlocked');
      expect(billing.isUnlocked(PlayProducts.guidePvInterview), isFalse, reason: 'PV Guide must remain locked');
      expect(billing.isUnlocked(PlayProducts.guideRaDossier), isFalse, reason: 'RA Guide must remain locked');
      expect(billing.isUnlocked('pdf_unit1_pharmacology'), isFalse, reason: 'Notes must remain locked');
    });

    test('4. VIP Pass Purchase (₹499): AUTOMATICALLY unlocks PV, RA, Pharma Interview Kit, and ALL Notes', () {
      billing.unlockedNotifier.value = {PlayProducts.vipPreBook499};

      expect(billing.isVipUnlocked, isTrue, reason: 'VIP Pass (₹499) must be active');
      expect(billing.isUnlocked(PlayProducts.guidePvInterview), isTrue, reason: 'PV Guide must automatically unlock with VIP');
      expect(billing.isUnlocked(PlayProducts.guideRaDossier), isTrue, reason: 'RA Guide must automatically unlock with VIP');
      expect(billing.isUnlocked(PlayProducts.guidePharmaInterview), isTrue, reason: 'Pharma Interview Kit must automatically unlock with VIP');
      expect(billing.isUnlocked('pdf_unit1_pharmacology'), isTrue, reason: 'Semester Notes must unlock with VIP');
      expect(billing.isUnlocked('random_future_pdf_id'), isTrue, reason: 'Any future content must unlock with VIP');
    });

    test('5. VIP Pass Aliases: Both vipPreBook499Alias, vipPreBook, and legacy unlock EVERYTHING', () {
      // Test Alias 1: vip_prebook_499
      billing.unlockedNotifier.value = {PlayProducts.vipPreBook499Alias};
      expect(billing.isVipUnlocked, isTrue);
      expect(billing.isUnlocked(PlayProducts.guidePvInterview), isTrue);
      expect(billing.isUnlocked(PlayProducts.guideRaDossier), isTrue);
      expect(billing.isUnlocked(PlayProducts.guidePharmaInterview), isTrue);

      // Test Alias 2: pharmacode_prebook_vip_199
      billing.unlockedNotifier.value = {PlayProducts.vipPreBook};
      expect(billing.isVipUnlocked, isTrue);
      expect(billing.isUnlocked(PlayProducts.guidePvInterview), isTrue);
      expect(billing.isUnlocked(PlayProducts.guideRaDossier), isTrue);
      expect(billing.isUnlocked(PlayProducts.guidePharmaInterview), isTrue);

      // Test Alias 3: pdf_vip_all_access
      billing.unlockedNotifier.value = {PlayProducts.vipLegacy};
      expect(billing.isVipUnlocked, isTrue);
      expect(billing.isUnlocked(PlayProducts.guidePvInterview), isTrue);
      expect(billing.isUnlocked(PlayProducts.guideRaDossier), isTrue);
      expect(billing.isUnlocked(PlayProducts.guidePharmaInterview), isTrue);
    });

    test('6. Developer VIP Toggle Test: toggleVipForTesting switches between Unlocked & Locked', () async {
      billing.unlockedNotifier.value = {};
      expect(billing.isVipUnlocked, isFalse);

      final nowUnlocked = await billing.toggleVipForTesting();
      expect(nowUnlocked, isTrue);
      expect(billing.isVipUnlocked, isTrue);
      expect(billing.isUnlocked(PlayProducts.guidePvInterview), isTrue);

      final nowLocked = await billing.toggleVipForTesting();
      expect(nowLocked, isFalse);
      expect(billing.isVipUnlocked, isFalse);
    });

    test('7. User Logout Hook (Zero cross-account leak): Wipes all entitlements', () {
      billing.unlockedNotifier.value = {PlayProducts.vipPreBook499, PlayProducts.guidePvInterview};
      expect(billing.isVipUnlocked, isTrue);

      billing.onUserLoggedOut();

      expect(billing.unlockedProducts.isEmpty, isTrue);
      expect(billing.isVipUnlocked, isFalse);
      expect(billing.isUnlocked(PlayProducts.guidePvInterview), isFalse);
      expect(billing.isUnlocked(PlayProducts.guideRaDossier), isFalse);
      expect(billing.isUnlocked(PlayProducts.guidePharmaInterview), isFalse);
    });
  });
}
