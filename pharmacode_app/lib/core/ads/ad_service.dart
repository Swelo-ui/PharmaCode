import 'package:flutter/foundation.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';

/// Centralized AdMob Service for PharmaCode
/// Manages AdMob SDK initialization, safe test/live ad unit swapping,
/// and preloading for Interstitial and Rewarded ads with frequency capping.
class AdService {
  AdService._();
  static final AdService instance = AdService._();

  bool _isInitialized = false;
  bool get isInitialized => _isInitialized;

  // Interstitial management
  InterstitialAd? _interstitialAd;
  bool _isInterstitialLoading = false;
  DateTime? _lastInterstitialShowTime;
  static const Duration interstitialCooldown = Duration(minutes: 3, seconds: 30);

  // Rewarded management
  RewardedAd? _rewardedAd;
  bool _isRewardedLoading = false;

  // --- Real AdMob IDs provided by user ---
  static const String _liveBannerId = 'ca-app-pub-4586974769522828/4905288376';
  static const String _liveInterstitialId = 'ca-app-pub-4586974769522828/1825653298';
  static const String _liveRewardedId = 'ca-app-pub-4586974769522828/4346156227';
  static const String _liveNativeId = 'ca-app-pub-4586974769522828/4319954691';

  // --- Google Official Test IDs (prevents AdMob policy bans during development) ---
  static const String _testBannerId = 'ca-app-pub-3940256099942544/6300978111';
  static const String _testInterstitialId = 'ca-app-pub-3940256099942544/1033173712';
  static const String _testRewardedId = 'ca-app-pub-3940256099942544/5224354917';
  static const String _testNativeId = 'ca-app-pub-3940256099942544/2247696110';

  String get bannerAdUnitId => kReleaseMode ? _liveBannerId : _testBannerId;
  String get interstitialAdUnitId => kReleaseMode ? _liveInterstitialId : _testInterstitialId;
  String get rewardedAdUnitId => kReleaseMode ? _liveRewardedId : _testRewardedId;
  String get nativeAdUnitId => kReleaseMode ? _liveNativeId : _testNativeId;

  /// Initialize Google Mobile Ads SDK
  Future<void> initialize() async {
    if (_isInitialized) return;
    try {
      final status = await MobileAds.instance.initialize();
      _isInitialized = true;
      debugPrint('AdMob initialized successfully: ${status.adapterStatuses}');
      // Preload ads for smooth user experience
      loadInterstitialAd();
      loadRewardedAd();
    } catch (e) {
      debugPrint('AdMob initialization error: $e');
    }
  }

  // ==========================================
  // INTERSTITIAL AD MANAGEMENT
  // ==========================================

  void loadInterstitialAd() {
    if (_interstitialAd != null || _isInterstitialLoading) return;
    _isInterstitialLoading = true;

    InterstitialAd.load(
      adUnitId: interstitialAdUnitId,
      request: const AdRequest(),
      adLoadCallback: InterstitialAdLoadCallback(
        onAdLoaded: (ad) {
          _interstitialAd = ad;
          _isInterstitialLoading = false;
          debugPrint('Interstitial ad loaded successfully.');
        },
        onAdFailedToLoad: (error) {
          _interstitialAd = null;
          _isInterstitialLoading = false;
          debugPrint('Interstitial ad failed to load: ${error.message}');
        },
      ),
    );
  }

  /// Shows an interstitial ad if available and not within cooldown period (3.5 mins).
  /// Always calls [onDismissed] so screen navigation / action proceeds seamlessly.
  bool showInterstitialAd({VoidCallback? onDismissed}) {
    final now = DateTime.now();

    // Check frequency capping (3.5 mins)
    if (_lastInterstitialShowTime != null &&
        now.difference(_lastInterstitialShowTime!) < interstitialCooldown) {
      debugPrint('Interstitial skipped: Frequency cap active (cooldown).');
      onDismissed?.call();
      return false;
    }

    if (_interstitialAd == null) {
      debugPrint('Interstitial not ready. Loading next...');
      loadInterstitialAd();
      onDismissed?.call();
      return false;
    }

    _interstitialAd!.fullScreenContentCallback = FullScreenContentCallback(
      onAdDismissedFullScreenContent: (ad) {
        ad.dispose();
        _interstitialAd = null;
        _lastInterstitialShowTime = DateTime.now();
        loadInterstitialAd();
        onDismissed?.call();
      },
      onAdFailedToShowFullScreenContent: (ad, error) {
        debugPrint('Interstitial failed to show: ${error.message}');
        ad.dispose();
        _interstitialAd = null;
        loadInterstitialAd();
        onDismissed?.call();
      },
    );

    _interstitialAd!.show();
    return true;
  }

  // ==========================================
  // REWARDED AD MANAGEMENT
  // ==========================================

  void loadRewardedAd() {
    if (_rewardedAd != null || _isRewardedLoading) return;
    _isRewardedLoading = true;

    RewardedAd.load(
      adUnitId: rewardedAdUnitId,
      request: const AdRequest(),
      rewardedAdLoadCallback: RewardedAdLoadCallback(
        onAdLoaded: (ad) {
          _rewardedAd = ad;
          _isRewardedLoading = false;
          debugPrint('Rewarded ad loaded successfully.');
        },
        onAdFailedToLoad: (error) {
          _rewardedAd = null;
          _isRewardedLoading = false;
          debugPrint('Rewarded ad failed to load: ${error.message}');
        },
      ),
    );
  }

  /// Shows rewarded ad. Triggers [onUserEarnedReward] when completed.
  /// Calls [onDismissed] when ad closes. If ad isn't loaded, calls [onFailed].
  void showRewardedAd({
    required void Function(RewardItem reward) onUserEarnedReward,
    VoidCallback? onDismissed,
    VoidCallback? onFailed,
  }) {
    if (_rewardedAd == null) {
      debugPrint('Rewarded ad not loaded yet.');
      loadRewardedAd();
      onFailed?.call();
      return;
    }

    bool earned = false;

    _rewardedAd!.fullScreenContentCallback = FullScreenContentCallback(
      onAdDismissedFullScreenContent: (ad) {
        ad.dispose();
        _rewardedAd = null;
        loadRewardedAd();
        onDismissed?.call();
      },
      onAdFailedToShowFullScreenContent: (ad, error) {
        debugPrint('Rewarded ad failed to show: ${error.message}');
        ad.dispose();
        _rewardedAd = null;
        loadRewardedAd();
        onFailed?.call();
      },
    );

    _rewardedAd!.show(
      onUserEarnedReward: (adWithoutView, reward) {
        earned = true;
        onUserEarnedReward(reward);
      },
    );

    // If dismissed without completing reward, optional fallback handled by onDismissed
    if (!earned) {
      // Reward logic triggers via onUserEarnedReward callback
    }
  }

  bool get isRewardedAdReady => _rewardedAd != null;
  bool get isInterstitialAdReady => _interstitialAd != null;
}
