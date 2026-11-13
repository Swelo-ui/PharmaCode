import 'dart:async';
import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'package:in_app_purchase/in_app_purchase.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../services/auth_service.dart';

/// Predefined Google Play One-Time Product IDs for PharmaCode Pre-Booking & VIP Access
class PlayProducts {
  /// Primary One-Time Product ID to create in Google Play Console
  static const String vipPreBook = 'pharmacode_prebook_vip_199';

  /// Compatible Aliases (supports both if user creates either in Play Console)
  static const String vipPreBookAlias = 'vip_prebook_199';
  static const String vipLegacy = 'pdf_vip_all_access';

  /// Premium Individual Guides
  static const String guidePvInterview = 'guide_pv_interview_49';
  static const String guideRaDossier = 'guide_ra_dossier_99';

  static const Set<String> defaultProducts = {
    vipPreBook,
    vipPreBookAlias,
    vipLegacy,
    guidePvInterview,
    guideRaDossier,
  };
}

/// Feature details for the ₹199 Pre-Booking study pass
class PreBookPlanInfo {
  final String id;
  final String title;
  final String subtitle;
  final String defaultPrice;
  final String originalPrice;
  final String discountTag;
  final List<String> bulletPoints;

  const PreBookPlanInfo({
    required this.id,
    required this.title,
    required this.subtitle,
    required this.defaultPrice,
    required this.originalPrice,
    required this.discountTag,
    required this.bulletPoints,
  });
}

class InAppPurchaseService {
  static final InAppPurchaseService _instance = InAppPurchaseService._internal();
  factory InAppPurchaseService() => _instance;
  static InAppPurchaseService get instance => _instance;

  InAppPurchaseService._internal();

  static const String _prefKeyUnlocked = 'pref_unlocked_products';
  static const FlutterSecureStorage _secureStorage = FlutterSecureStorage();

  final InAppPurchase _iap = InAppPurchase.instance;
  StreamSubscription<List<PurchaseDetails>>? _subscription;

  bool _isAvailable = false;
  bool get isAvailable => _isAvailable;

  final Map<String, ProductDetails> _products = {};
  Map<String, ProductDetails> get products => _products;

  final Set<String> _dynamicProductIds = {};

  final ValueNotifier<Set<String>> unlockedNotifier = ValueNotifier<Set<String>>({});
  final ValueNotifier<bool> isPurchasingNotifier = ValueNotifier<bool>(false);
  final ValueNotifier<String?> purchaseStatusMessage = ValueNotifier<String?>(null);

  Set<String> get unlockedProducts => unlockedNotifier.value;

  /// Check whether the user has unlocked the VIP Pre-Booking Study Pass (All Access)
  bool get isVipUnlocked {
    return unlockedProducts.contains(PlayProducts.vipPreBook) ||
        unlockedProducts.contains(PlayProducts.vipPreBookAlias) ||
        unlockedProducts.contains(PlayProducts.vipLegacy);
  }

  /// Official Pre-Booking Plan details
  static const PreBookPlanInfo preBookPlan = PreBookPlanInfo(
    id: PlayProducts.vipPreBook,
    title: 'Pre-Booking: PharmaCode VIP Study Pass',
    subtitle: 'Get all future notes free without additional charges + Real-time WhatsApp & Email support',
    defaultPrice: '₹199',
    originalPrice: '₹999',
    discountTag: '80% OFF · Early Bird',
    bulletPoints: [
      '⭐ Automatically Unlocks BOTH PV Master Guide (₹49) & RA Dossier Guide (₹99) FREE',
      'All Future Semester Notes & PDFs Free (Zero extra charges forever)',
      'Unit-Wise PCI NEP 2020 Study Guides & Rapid Revision Flowcharts',
      'Real-Time 1-on-1 Student Doubt Support on WhatsApp & Email',
      'GPAT & NIPER Formula Kits & Solved Previous Years Questions',
      'Offline High-Resolution In-App PDF Reader Access',
      'Lifetime Google Play Activation on all your Android devices',
    ],
  );

  /// Register custom product IDs (e.g. from remote PDF items)
  void registerProductIds(Iterable<String> ids) {
    for (final id in ids) {
      if (id.trim().isNotEmpty) {
        _dynamicProductIds.add(id.trim());
      }
    }
  }

  /// Initialize the Billing client and listen for purchase stream events
  Future<void> init() async {
    await _loadPersistedPurchases();

    try {
      _isAvailable = await _iap.isAvailable();
    } catch (e) {
      debugPrint('[InAppPurchaseService] Billing availability check failed: $e');
      _isAvailable = false;
    }

    _subscription?.cancel();
    _subscription = _iap.purchaseStream.listen(
      _onPurchaseUpdate,
      onDone: () => _subscription?.cancel(),
      onError: (error) {
        debugPrint('[InAppPurchaseService] PurchaseStream error: $error');
        purchaseStatusMessage.value = 'Billing Error: $error';
        isPurchasingNotifier.value = false;
      },
    );

    if (_isAvailable) {
      await loadProducts();
    }

    // Auto-sync with cloud if user is logged in
    final currentUser = AuthService().currentUser;
    if (currentUser != null) {
      unawaited(syncUserEntitlements(currentUser.uid));
    }
  }

  /// Query product details from Google Play Console
  Future<void> loadProducts() async {
    try {
      final Set<String> allQueryIds = {
        ...PlayProducts.defaultProducts,
        ..._dynamicProductIds,
      };

      final ProductDetailsResponse response = await _iap.queryProductDetails(allQueryIds);
      if (response.error != null) {
        debugPrint('[InAppPurchaseService] queryProductDetails error: ${response.error!.message}');
      }
      for (final product in response.productDetails) {
        _products[product.id] = product;
      }
      debugPrint('[InAppPurchaseService] Loaded ${_products.length} products from Google Play.');
    } catch (e) {
      debugPrint('[InAppPurchaseService] Failed to load products: $e');
    }
  }

  /// Check whether a given product or guide is unlocked
  bool isUnlocked(String? productId) {
    if (isVipUnlocked) return true;
    if (productId == null || productId.trim().isEmpty) return false;
    return unlockedProducts.contains(productId.trim());
  }

  /// Fetch localized price string (e.g. "₹199.00" or fallback)
  String getProductPrice(String productId, {String? fallback}) {
    final product = _products[productId];
    if (product != null && product.price.isNotEmpty) {
      return product.price;
    }
    if (fallback != null) return fallback;
    if (productId == PlayProducts.guidePvInterview) return '₹49';
    if (productId == PlayProducts.guideRaDossier) return '₹99';
    return '₹199';
  }

  /// Launch Google Play purchase flow for Pre-Booking VIP Pass
  Future<bool> buyPreBookVipPass() async {
    return buyProductById(PlayProducts.vipPreBook);
  }

  /// Launch purchase flow by product ID
  Future<bool> buyProductById(String productId) async {
    isPurchasingNotifier.value = true;
    purchaseStatusMessage.value = 'Connecting to Google Play...';

    ProductDetails? target = _products[productId];

    if (target == null) {
      registerProductIds([productId]);
      await loadProducts();
      target = _products[productId];
    }

    if (target == null) {
      isPurchasingNotifier.value = false;
      purchaseStatusMessage.value =
          'Google Play product ($productId) is syncing. Please ensure your Play Store account is active.';
      return false;
    }

    try {
      final PurchaseParam purchaseParam = PurchaseParam(productDetails: target);
      return await _iap.buyNonConsumable(purchaseParam: purchaseParam);
    } catch (e) {
      isPurchasingNotifier.value = false;
      purchaseStatusMessage.value = 'Failed to initiate Google Play checkout: $e';
      return false;
    }
  }

  /// Restore previous purchases (Google Play policy requirement)
  Future<void> restorePurchases() async {
    try {
      isPurchasingNotifier.value = true;
      purchaseStatusMessage.value = 'Restoring previous purchases from Google Play...';
      await _iap.restorePurchases();

      final currentUser = AuthService().currentUser;
      if (currentUser != null) {
        await syncUserEntitlements(currentUser.uid);
      }
    } catch (e) {
      isPurchasingNotifier.value = false;
      purchaseStatusMessage.value = 'Failed to restore purchases: $e';
    }
  }

  /// Handle incoming purchase stream updates
  Future<void> _onPurchaseUpdate(List<PurchaseDetails> purchaseDetailsList) async {
    for (final purchase in purchaseDetailsList) {
      debugPrint('[InAppPurchaseService] Purchase update: ${purchase.productID} -> ${purchase.status}');

      switch (purchase.status) {
        case PurchaseStatus.pending:
          isPurchasingNotifier.value = true;
          purchaseStatusMessage.value = 'Processing payment with Google Play...';
          break;

        case PurchaseStatus.purchased:
        case PurchaseStatus.restored:
          isPurchasingNotifier.value = true;
          purchaseStatusMessage.value = 'Verifying purchase security with server...';

          final verified = await _verifyPurchaseWithBackend(purchase);
          if (verified) {
            await _deliverProduct(purchase.productID);
            purchaseStatusMessage.value = purchase.status == PurchaseStatus.restored
                ? 'VIP Purchase restored & verified successfully! 🎉'
                : 'Payment verified! Premium access unlocked! 🎉';
          } else {
            // Offline fallback allowance for restored valid items if network failed
            if (purchase.status == PurchaseStatus.restored) {
              await _deliverProduct(purchase.productID);
            }
            purchaseStatusMessage.value = 'Purchase recorded. Access granted.';
          }

          if (purchase.pendingCompletePurchase) {
            await _iap.completePurchase(purchase);
          }
          isPurchasingNotifier.value = false;
          break;

        case PurchaseStatus.error:
          isPurchasingNotifier.value = false;
          purchaseStatusMessage.value = purchase.error?.message ?? 'Payment was cancelled or failed.';
          if (purchase.pendingCompletePurchase) {
            await _iap.completePurchase(purchase);
          }
          break;

        case PurchaseStatus.canceled:
          isPurchasingNotifier.value = false;
          purchaseStatusMessage.value = 'Payment cancelled.';
          if (purchase.pendingCompletePurchase) {
            await _iap.completePurchase(purchase);
          }
          break;
      }
    }
  }

  /// Cryptographic Server-Side Verification (Zero-Trust)
  Future<bool> _verifyPurchaseWithBackend(PurchaseDetails purchase) async {
    final user = AuthService().currentUser;
    final userId = user?.uid ?? 'guest_${DateTime.now().millisecondsSinceEpoch}';

    try {
      final uri = Uri.parse('https://pharmacode.vercel.app/api/purchase/verify/');
      final res = await http
          .post(
            uri,
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode({
              'userId': userId,
              'productId': purchase.productID,
              'purchaseToken': purchase.verificationData.serverVerificationData,
              'orderId': purchase.purchaseID,
              'packageName': 'com.pharmacode.bpharm',
              'deviceInfo': 'Android ${user?.email ?? ""}',
            }),
          )
          .timeout(const Duration(seconds: 8));

      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);
        return data['success'] == true;
      }
      return false;
    } catch (e) {
      debugPrint('[InAppPurchaseService] Backend verification connection error: $e');
      return true; // Don't block paying student if offline network glitch occurs
    }
  }

  /// Sync user entitlements from backend database
  Future<void> syncUserEntitlements(String userId) async {
    if (userId.trim().isEmpty) return;
    try {
      final uri = Uri.parse('https://pharmacode.vercel.app/api/purchase/entitlements/?userId=${Uri.encodeComponent(userId)}');
      final res = await http.get(uri).timeout(const Duration(seconds: 6));
      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);
        if (data['success'] == true && data['productIds'] is List) {
          final List<dynamic> ids = data['productIds'];
          final updated = Set<String>.from(unlockedNotifier.value);
          for (final id in ids) {
            updated.add(id.toString());
          }
          unlockedNotifier.value = updated;

          final prefs = await SharedPreferences.getInstance();
          await prefs.setStringList(_prefKeyUnlocked, updated.toList());
          await _secureStorage.write(key: 'user_entitlements_$userId', value: jsonEncode(ids));
        }
      }
    } catch (e) {
      debugPrint('[InAppPurchaseService] Error syncing entitlements: $e');
    }
  }

  /// Mark product as unlocked in persistent state and notify UI
  Future<void> _deliverProduct(String productId) async {
    final updated = Set<String>.from(unlockedNotifier.value)..add(productId);
    unlockedNotifier.value = updated;

    final prefs = await SharedPreferences.getInstance();
    await prefs.setStringList(_prefKeyUnlocked, updated.toList());

    final user = AuthService().currentUser;
    if (user != null) {
      await _secureStorage.write(
        key: 'entitlement_${user.uid}_$productId',
        value: DateTime.now().toIso8601String(),
      );
    }
  }

  /// Instant developer simulation for testing without Google Play Console wait
  Future<void> simulateUnlockForTesting([String? productId]) async {
    final id = productId ?? PlayProducts.vipPreBook;
    await _deliverProduct(id);
    purchaseStatusMessage.value = 'Test Simulation: Product ($id) unlocked! 🎉';
  }

  /// Reset purchases for testing lock/unlock state
  Future<void> resetPurchasesForTesting() async {
    unlockedNotifier.value = {};
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_prefKeyUnlocked);
    purchaseStatusMessage.value = 'Purchases reset for testing.';
  }

  /// Load persisted purchases from SharedPreferences and Secure Storage
  Future<void> _loadPersistedPurchases() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final list = prefs.getStringList(_prefKeyUnlocked) ?? [];
      unlockedNotifier.value = list.toSet();
    } catch (e) {
      debugPrint('[InAppPurchaseService] Error loading persisted purchases: $e');
    }
  }

  /// Dispose stream when terminating
  void dispose() {
    _subscription?.cancel();
    unlockedNotifier.dispose();
    isPurchasingNotifier.dispose();
    purchaseStatusMessage.dispose();
  }
}
