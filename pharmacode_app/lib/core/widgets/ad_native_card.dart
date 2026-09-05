import 'package:flutter/material.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';
import '../ads/ad_service.dart';
import '../constants/app_colors.dart';

/// Material 3 styled Native Ad card for in-feed integration in Syllabus and Career feeds.
class AdNativeCard extends StatefulWidget {
  final TemplateType templateType;
  final EdgeInsetsGeometry margin;

  const AdNativeCard({
    super.key,
    this.templateType = TemplateType.small,
    this.margin = const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
  });

  @override
  State<AdNativeCard> createState() => _AdNativeCardState();
}

class _AdNativeCardState extends State<AdNativeCard> {
  NativeAd? _nativeAd;
  bool _isLoaded = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_nativeAd == null) {
      _loadNativeAd();
    }
  }

  void _loadNativeAd() {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    _nativeAd = NativeAd(
      adUnitId: AdService.instance.nativeAdUnitId,
      request: const AdRequest(),
      listener: NativeAdListener(
        onAdLoaded: (ad) {
          if (mounted) {
            setState(() {
              _isLoaded = true;
            });
          }
        },
        onAdFailedToLoad: (ad, error) {
          debugPrint('NativeAd failed to load: ${error.message}');
          ad.dispose();
          if (mounted) {
            setState(() {
              _isLoaded = false;
            });
          }
        },
      ),
      nativeTemplateStyle: NativeTemplateStyle(
        templateType: widget.templateType,
        mainBackgroundColor: isDark ? AppColors.darkSurface : AppColors.lightSurface,
        cornerRadius: 16.0,
        callToActionTextStyle: NativeTemplateTextStyle(
          textColor: Colors.white,
          backgroundColor: AppColors.brandBlue,
          style: NativeTemplateFontStyle.bold,
          size: 14.0,
        ),
        primaryTextStyle: NativeTemplateTextStyle(
          textColor: isDark ? AppColors.textDarkTheme : AppColors.textDark,
          style: NativeTemplateFontStyle.bold,
          size: 15.0,
        ),
        secondaryTextStyle: NativeTemplateTextStyle(
          textColor: isDark ? AppColors.textMutedDarkTheme : AppColors.textMuted,
          style: NativeTemplateFontStyle.normal,
          size: 13.0,
        ),
        tertiaryTextStyle: NativeTemplateTextStyle(
          textColor: isDark ? AppColors.textSubtle : AppColors.textSubtle,
          style: NativeTemplateFontStyle.normal,
          size: 11.0,
        ),
      ),
    );

    _nativeAd?.load();
  }

  @override
  void dispose() {
    _nativeAd?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (!_isLoaded || _nativeAd == null) {
      return const SizedBox.shrink();
    }

    final isDark = Theme.of(context).brightness == Brightness.dark;
    final double cardHeight = widget.templateType == TemplateType.small ? 96.0 : 320.0;

    return Container(
      margin: widget.margin,
      height: cardHeight,
      decoration: BoxDecoration(
        color: isDark ? AppColors.darkSurface : AppColors.lightSurface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isDark ? AppColors.darkBorderSoft : AppColors.lightBorder,
          width: 1,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: isDark ? 0.2 : 0.04),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      clipBehavior: Clip.antiAlias,
      child: AdWidget(ad: _nativeAd!),
    );
  }
}
