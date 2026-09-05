import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;

class SearchResultItem {
  final String title;
  final String snippet;
  final String url;

  const SearchResultItem({
    required this.title,
    required this.snippet,
    required this.url,
  });
}

class WebSearchService {
  static final WebSearchService _instance = WebSearchService._internal();
  factory WebSearchService() => _instance;
  WebSearchService._internal();

  /// Check if query is a greeting, casual chat, or bot identity question
  bool isGreetingOrCasual(String query) {
    final lower = query.trim().toLowerCase();
    if (lower.length < 5) return true;
    final greetings = RegExp(
      r'^(hi|hello|hey|namaste|hlo|heya|hola|kaise ho|kese ho|good morning|good evening|good afternoon|test|ok|okay|bye|thanks|thank you)\b',
      caseSensitive: false,
    );
    if (greetings.hasMatch(lower)) return true;

    final metaQuestions = RegExp(
      r'\b(who are you|who r u|what is your name|who made you|who created you|what can you do|what are your features|tum kaun ho|aap kaun ho|kya kar sakte ho|tell me about yourself|introduce yourself|help|menu|identity)\b',
      caseSensitive: false,
    );
    if (metaQuestions.hasMatch(lower)) return true;

    final jailbreaks = RegExp(
      r'\b(now i give you|give you access|tell me a story|tell story|ignore previous instructions|dan mode|jailbreak)\b',
      caseSensitive: false,
    );
    return jailbreaks.hasMatch(lower);
  }

  /// Helper to extract real destination URL from DuckDuckGo redirect link
  static String _extractDestinationUrl(String rawUrl) {
    if (rawUrl.isEmpty) return 'https://duckduckgo.com';
    try {
      String normalized = rawUrl;
      if (normalized.startsWith('//')) {
        normalized = 'https:$normalized';
      }
      final uri = Uri.parse(normalized);
      final uddg = uri.queryParameters['uddg'];
      if (uddg != null && uddg.isNotEmpty) {
        return Uri.decodeFull(uddg);
      }
      return normalized;
    } catch (_) {
      return rawUrl;
    }
  }

  /// Helper to derive readable title from URL domain if title is missing
  static String _deriveTitleFromUrl(String url, {required String fallback}) {
    try {
      final uri = Uri.parse(url);
      final host = uri.host.replaceFirst('www.', '');
      if (host.isNotEmpty) {
        final segments = uri.pathSegments.where((s) => s.isNotEmpty).toList();
        if (segments.isNotEmpty) {
          final last = segments.last.replaceAll(RegExp(r'[-_]'), ' ').replaceAll('.html', '').trim();
          if (last.length > 3) {
            return '${last[0].toUpperCase()}${last.substring(1)} (${host.toUpperCase()})';
          }
        }
        return host.toUpperCase();
      }
    } catch (_) {}
    return fallback;
  }

  /// Check if query likely needs live web search
  bool shouldTriggerSearch(String query) {
    if (isGreetingOrCasual(query)) return false;
    final lower = query.toLowerCase();
    final triggers = [
      'latest',
      'recent',
      'current',
      '2024',
      '2025',
      '2026',
      'fda approval',
      'cdsco update',
      'clinical trial',
      'new guideline',
      'news',
      'trending',
      'new drug',
      'approved in',
      'world health organization update',
      'search web',
    ];
    return triggers.any((t) => lower.contains(t));
  }

  /// Check if result is relevant to medical/pharmaceutical context or query
  bool _isRelevantResult(String title, String snippet, String query) {
    final combined = '$title $snippet'.toLowerCase();

    // Reject obvious music/entertainment false positives
    final blacklistedEntertainment = ['album', 'lyrics', 'the who', 'song', 'billboard', 'tracklist'];
    if (blacklistedEntertainment.any((b) => combined.contains(b))) {
      return false;
    }

    final queryTokens = query.toLowerCase().split(RegExp(r'\s+')).where((t) => t.length > 2);

    // Matches any query keyword
    final matchesQuery = queryTokens.any((t) => combined.contains(t));

    // Pharma / Health keywords whitelist
    final pharmaTerms = [
      'pharm',
      'drug',
      'medicin',
      'clinical',
      'fda',
      'cdsco',
      'therapy',
      'therapeutic',
      'disease',
      'dose',
      'tablet',
      'capsule',
      'adme',
      'mechanism',
      'receptor',
      'treatment',
      'patient',
      'trial',
      'guideline',
      'world health organization',
      'who guideline',
    ];
    final hasPharmaRelevance = pharmaTerms.any((p) => combined.contains(p));

    return matchesQuery || hasPharmaRelevance;
  }

  /// Perform search via DuckDuckGo Instant Answer API + Lite Web API
  Future<List<SearchResultItem>> search(String query, {int maxResults = 4}) async {
    final cleanQuery = query
        .replaceAll(RegExp(r'\b(search web|google search|latest news on)\b', caseSensitive: false), '')
        .trim();

    // Never search on greetings or empty queries
    if (cleanQuery.isEmpty || isGreetingOrCasual(cleanQuery)) {
      return [];
    }

    final List<SearchResultItem> results = [];

    // 1. Try DuckDuckGo Instant Answer API
    try {
      final uri = Uri.parse(
        'https://api.duckduckgo.com/?q=${Uri.encodeComponent(cleanQuery)}&format=json&no_html=1&skip_disambig=1',
      );
      final res = await http.get(uri, headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 PharmaCode/1.0',
        'Accept': 'application/json',
      }).timeout(const Duration(seconds: 6));

      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);
        final heading = data['Heading'] as String? ?? '';
        final abstractText = data['AbstractText'] as String? ?? '';
        final abstractUrl = data['AbstractURL'] as String? ?? '';

        if (abstractText.isNotEmpty && _isRelevantResult(heading, abstractText, cleanQuery)) {
          results.add(SearchResultItem(
            title: heading.isNotEmpty ? heading : cleanQuery,
            snippet: abstractText,
            url: abstractUrl.isNotEmpty ? abstractUrl : 'https://duckduckgo.com/?q=${Uri.encodeComponent(cleanQuery)}',
          ));
        }

        // Check related topics
        if (data['RelatedTopics'] is List) {
          for (final item in data['RelatedTopics']) {
            if (results.length >= maxResults) break;
            if (item is Map && item.containsKey('Text') && item.containsKey('FirstURL')) {
              final text = item['Text'] as String? ?? '';
              final url = item['FirstURL'] as String? ?? '';
              if (text.isNotEmpty && _isRelevantResult('', text, cleanQuery)) {
                results.add(SearchResultItem(
                  title: text.split(' - ').first,
                  snippet: text,
                  url: url,
                ));
              }
            }
          }
        }
      }
    } catch (e) {
      debugPrint('[WebSearchService] Instant answer notice: $e');
    }

    // 2. If results are still low, try DuckDuckGo HTML Lite fallback
    if (results.isEmpty) {
      try {
        final htmlUri = Uri.parse(
          'https://html.duckduckgo.com/html/?q=${Uri.encodeComponent(cleanQuery)}',
        );
        final res = await http.post(
          htmlUri,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: {'q': cleanQuery},
        ).timeout(const Duration(seconds: 7));

        if (res.statusCode == 200) {
          final body = res.body;
          final seenUrls = <String>{};

          // Regex to extract result__a (title + redirect URL) and result__snippet
          final blockRegex = RegExp(
            r'<div class="[^"]*web-result[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>',
            caseSensitive: false,
          );
          final titleRegex = RegExp(
            r'<a\s+class="result__a"[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>',
            caseSensitive: false,
          );
          final snippetRegex = RegExp(
            r'<a\s+class="result__snippet[^>]*>([\s\S]*?)<\/a>',
            caseSensitive: false,
          );

          final blocks = blockRegex.allMatches(body).toList();

          if (blocks.isNotEmpty) {
            for (final b in blocks) {
              if (results.length >= maxResults) break;
              final bContent = b.group(1) ?? '';
              final tMatch = titleRegex.firstMatch(bContent);
              final sMatch = snippetRegex.firstMatch(bContent);

              final rawHref = tMatch?.group(1) ?? '';
              final rawTitle = tMatch?.group(2) ?? '';
              final rawSnippet = sMatch?.group(1) ?? '';

              final cleanTitle = rawTitle.replaceAll(RegExp(r'<[^>]*>'), '').trim();
              final cleanSnippet = rawSnippet.replaceAll(RegExp(r'<[^>]*>'), '').trim();
              final realUrl = _extractDestinationUrl(rawHref);

              if (seenUrls.contains(realUrl) || realUrl.isEmpty) continue;
              seenUrls.add(realUrl);

              final finalTitle = (cleanTitle.isNotEmpty && cleanTitle.toLowerCase() != cleanQuery.toLowerCase())
                  ? cleanTitle
                  : _deriveTitleFromUrl(realUrl, fallback: cleanQuery);

              if (cleanSnippet.isNotEmpty && _isRelevantResult(finalTitle, cleanSnippet, cleanQuery)) {
                results.add(SearchResultItem(
                  title: finalTitle,
                  snippet: cleanSnippet,
                  url: realUrl,
                ));
              }
            }
          } else {
            // Direct regex fallback across body
            final tMatches = titleRegex.allMatches(body).toList();
            final sMatches = snippetRegex.allMatches(body).toList();

            for (int i = 0; i < tMatches.length && results.length < maxResults; i++) {
              final rawHref = tMatches[i].group(1) ?? '';
              final rawTitle = tMatches[i].group(2) ?? '';
              final cleanTitle = rawTitle.replaceAll(RegExp(r'<[^>]*>'), '').trim();
              final rawSnippet = i < sMatches.length ? (sMatches[i].group(1) ?? '') : '';
              final cleanSnippet = rawSnippet.replaceAll(RegExp(r'<[^>]*>'), '').trim();
              final realUrl = _extractDestinationUrl(rawHref);

              if (seenUrls.contains(realUrl) || realUrl.isEmpty) continue;
              seenUrls.add(realUrl);

              final finalTitle = (cleanTitle.isNotEmpty && cleanTitle.toLowerCase() != cleanQuery.toLowerCase())
                  ? cleanTitle
                  : _deriveTitleFromUrl(realUrl, fallback: cleanQuery);

              if (cleanSnippet.isNotEmpty && _isRelevantResult(finalTitle, cleanSnippet, cleanQuery)) {
                results.add(SearchResultItem(
                  title: finalTitle,
                  snippet: cleanSnippet,
                  url: realUrl,
                ));
              }
            }
          }
        }
      } catch (e) {
        debugPrint('[WebSearchService] HTML search notice: $e');
      }
    }

    return results;
  }

  /// Format search results into a clean context string for LLM injection
  String formatForPrompt(List<SearchResultItem> items) {
    if (items.isEmpty) return '';
    final buffer = StringBuffer();
    buffer.writeln('--- REAL-TIME WEB SEARCH RESULTS (LIVE GROUNDING) ---');
    for (int i = 0; i < items.length; i++) {
      final item = items[i];
      buffer.writeln('[Source ${i + 1}]: ${item.title}');
      buffer.writeln('URL: ${item.url}');
      buffer.writeln('Snippet: ${item.snippet}\n');
    }
    buffer.writeln('--- END WEB SEARCH RESULTS ---');
    return buffer.toString();
  }
}
