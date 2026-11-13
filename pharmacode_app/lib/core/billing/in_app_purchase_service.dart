import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:in_app_purchase/in_app_purchase.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Predefined Google Play One-Time Product IDs for PharmaCode Pre-Booking & VIP Access
class PlayProducts {
  /// Primary One-Time Product ID to create in Google Play Console
  static const String vipPreBook = 'pharmacode_prebook_vip_199';

  /// Compatible Aliases (supports both if user creates either in Play Console)
  static const String vipPreBookAlias = 'vip_prebook_199';
  static const String vipLegacy = 'pdf_vip_all_access';

  static const Set<String> all = {
    vipPreBook,
    vipPreBookAlias,
    vipLegacy,
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

  final InAppPurchase _iap = InAppPurchase.instance;
  StreamSubscription<List<PurchaseDetails>>? _subscription;

  bool _isAvailable = false;
  bool get isAvailable => _isAvailable;

  final Map<String, ProductDetails> _products = {};
  Map<String, ProductDetails> get products => _products;

  final ValueNotifier<Set<String>> unlockedNotifier = ValueNotifier<Set<String>>({});
  final ValueNotifier<bool> isPurchasingNotifier = ValueNotifier<bool>(false);
  final ValueNotifier<String?> purchaseStatusMessage = ValueNotifier<String?>(null);

  Set<String> get unlockedProducts => unlockedNotifier.value;

  /// Check whether the user has unlocked the VIP Pre-Booking Study Pass
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
      'All Future Semester Notes & PDFs Free (Zero extra charges forever)',
      'Unit-Wise PCI NEP 2020 Study Guides & Rapid Revision Flowcharts',
      'Real-Time 1-on-1 Student Doubt Support on WhatsApp & Email',
      'GPAT & NIPER Formula Kits & Solved Previous Years Questions',
      'Offline High-Resolution PDF Downloads & Print Ready Sheets',
      'Lifetime Google Play Activation on all your Android devices',
    ],
  );

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
  }

  /// Query product details from Google Play Console
  Future<void> loadProducts() async {
    try {
      final ProductDetailsResponse response = await _iap.queryProductDetails(PlayProducts.all);
      if (response.error != null) {
        debugPrint('[InAppPurchaseService] queryProductDetails error: ${response.error!.message}');
      }
      _products.clear();
      for (final product in response.productDetails) {
        _products[product.id] = product;
      }
      debugPrint('[InAppPurchaseService] Loaded ${_products.length} products from Google Play.');
    } catch (e) {
      debugPrint('[InAppPurchaseService] Failed to load products: $e');
    }
  }

  /// Check whether a given product or bundle is unlocked
  bool isUnlocked(String? productId) {
    if (isVipUnlocked) return true;
    if (productId == null) return false;
    return unlockedProducts.contains(productId);
  }

  /// Launch Google Play purchase flow for Pre-Booking VIP Pass
  Future<bool> buyPreBookVipPass() async {
    isPurchasingNotifier.value = true;
    purchaseStatusMessage.value = 'Connecting to Google Play...';

    // Check primary ID or alias
    ProductDetails? target = _products[PlayProducts.vipPreBook] ??
        _products[PlayProducts.vipPreBookAlias] ??
        _products[PlayProducts.vipLegacy];

    if (target == null) {
      await loadProducts();
      target = _products[PlayProducts.vipPreBook] ??
          _products[PlayProducts.vipPreBookAlias] ??
          _products[PlayProducts.vipLegacy];
    }

    if (target == null) {
      isPurchasingNotifier.value = false;
      purchaseStatusMessage.value =
          'Google Play Store checkout is currently connecting. Please ensure your Google Play Store is up to date and try again.';
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

  /// Launch purchase flow by product ID
  Future<bool> buyProductById(String productId) async {
    return buyPreBookVipPass();
  }

  /// Restore previous purchases (Google Play policy requirement)
  Future<void> restorePurchases() async {
    try {
      isPurchasingNotifier.value = true;
      purchaseStatusMessage.value = 'Restoring previous purchases from Google Play...';
      await _iap.restorePurchases();
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
          await _deliverProduct(purchase.productID);
          if (purchase.pendingCompletePurchase) {
            await _iap.completePurchase(purchase);
          }
          isPurchasingNotifier.value = false;
          purchaseStatusMessage.value = purchase.status == PurchaseStatus.restored
              ? 'VIP Study Pass restored successfully! 🎉'
              : 'Payment successful! Pre-Booking VIP Pass activated! 🎉';
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

  /// Mark product as unlocked in persistent state and notify UI
  Future<void> _deliverProduct(String productId) async {
    final updated = Set<String>.from(unlockedNotifier.value)..add(productId);
    unlockedNotifier.value = updated;

    final prefs = await SharedPreferences.getInstance();
    await prefs.setStringList(_prefKeyUnlocked, updated.toList());
  }

  /// Instant developer simulation for testing without Google Play Console wait
  Future<void> simulateUnlockForTesting() async {
    await _deliverProduct(PlayProducts.vipPreBook);
    purchaseStatusMessage.value = 'Test Simulation: Pre-Booking VIP Pass activated! 🎉';
  }

  /// Reset purchases for testing lock/unlock state
  Future<void> resetPurchasesForTesting() async {
    unlockedNotifier.value = {};
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_prefKeyUnlocked);
    purchaseStatusMessage.value = 'Purchases reset for testing.';
  }

  /// Load persisted purchases from SharedPreferences
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
