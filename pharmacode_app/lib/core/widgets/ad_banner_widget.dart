import 'package:flutter/material.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';
import '../ads/ad_service.dart';
import '../billing/in_app_purchase_service.dart';

/// Clean, responsive Anchored Adaptive Banner Ad widget with automatic lifecycle management
/// and zero-gap fallback on load failures.
class AdBannerWidget extends StatefulWidget {
  final EdgeInsetsGeometry padding;
  final AdSize? adSize;

  const AdBannerWidget({
    super.key,
    this.padding = const EdgeInsets.symmetric(vertical: 8),
    this.adSize,
  });

  @override
  State<AdBannerWidget> createState() => _AdBannerWidgetState();
}

class _AdBannerWidgetState extends State<AdBannerWidget> {
  BannerAd? _bannerAd;
  bool _isLoaded = false;
  bool _isLoading = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_bannerAd == null && !_isLoading) {
      _loadBanner();
    }
  }

  Future<void> _loadBanner() async {
    // 100% Ad-Free for VIP Pass holders
    if (InAppPurchaseService.instance.isVipUnlocked) return;
    if (_isLoading) return;
    _isLoading = true;

    AdSize targetSize = widget.adSize ?? AdSize.banner;
    if (widget.adSize == null && mounted) {
      try {
        final screenWidth = MediaQuery.of(context).size.width.truncate();
        final adaptive = await AdSize.getCurrentOrientationAnchoredAdaptiveBannerAdSize(screenWidth);
        if (adaptive != null) {
          targetSize = adaptive;
        }
      } catch (_) {}
    }

    _bannerAd = BannerAd(
      adUnitId: AdService.instance.bannerAdUnitId,
      size: targetSize,
      request: const AdRequest(),
      listener: BannerAdListener(
        onAdLoaded: (ad) {
          if (mounted) {
            setState(() {
              _isLoaded = true;
              _isLoading = false;
            });
          }
        },
        onAdFailedToLoad: (ad, error) {
          debugPrint('BannerAd failed to load: ${error.message}');
          ad.dispose();
          if (mounted) {
            setState(() {
              _isLoaded = false;
              _isLoading = false;
            });
          }
        },
      ),
    );

    _bannerAd?.load();
  }

  @override
  void dispose() {
    _bannerAd?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    // 100% Ad-Free for VIP Pass holders
    if (InAppPurchaseService.instance.isVipUnlocked) {
      return const SizedBox.shrink();
    }

    if (!_isLoaded || _bannerAd == null) {
      return const SizedBox.shrink();
    }

    return Padding(
      padding: widget.padding,
      child: Center(
        child: SizedBox(
          width: _bannerAd!.size.width.toDouble(),
          height: _bannerAd!.size.height.toDouble(),
          child: AdWidget(ad: _bannerAd!),
        ),
      ),
    );
  }
}
