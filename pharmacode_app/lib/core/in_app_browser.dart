import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

/// Opens web URLs inside the app using Chrome Custom Tabs / In-App Browser View
/// so users never get kicked out to external browser apps.
Future<void> openInAppUrl(BuildContext context, String urlString) async {
  if (urlString.trim().isEmpty) return;

  final uri = Uri.parse(urlString.trim());

  try {
    // 1. First priority: in-app browser view (Chrome Custom Tabs on Android / SFSafariViewController on iOS)
    final launched = await launchUrl(
      uri,
      mode: LaunchMode.inAppBrowserView,
      browserConfiguration: const BrowserConfiguration(showTitle: true),
    );

    if (!launched) {
      // 2. Fallback to in-app webview
      final webviewLaunched = await launchUrl(
        uri,
        mode: LaunchMode.inAppWebView,
      );

      if (!webviewLaunched) {
        // 3. Last fallback
        await launchUrl(uri, mode: LaunchMode.platformDefault);
      }
    }
  } catch (e) {
    debugPrint('In-app browser launch notice: $e');
    try {
      await launchUrl(uri, mode: LaunchMode.platformDefault);
    } catch (_) {}
  }
}
