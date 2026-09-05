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

  /// Check if query likely needs live web search
  bool shouldTriggerSearch(String query) {
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
      'who update',
      'search web',
    ];
    return triggers.any((t) => lower.contains(t));
  }

  /// Perform search via DuckDuckGo Instant Answer API + Lite Web API
  Future<List<SearchResultItem>> search(String query, {int maxResults = 4}) async {
    final cleanQuery = query
        .replaceAll(RegExp(r'\b(search web|google search|latest news on)\b', caseSensitive: false), '')
        .trim();
    if (cleanQuery.isEmpty) return [];

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

        if (abstractText.isNotEmpty) {
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
              if (text.isNotEmpty) {
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
      debugPrint('[WebSearchService] Instant answer failed: $e');
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
          // Extract snippets using regex
          final snippetRegex = RegExp(
            r'<a class="result__snippet[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>',
            dotAll: true,
          );

          final matches = snippetRegex.allMatches(body).take(maxResults);
          for (final m in matches) {
            final rawUrl = m.group(1) ?? '';
            final rawSnippet = m.group(2) ?? '';
            final cleanSnippet = rawSnippet.replaceAll(RegExp(r'<[^>]*>'), '').trim();

            if (cleanSnippet.isNotEmpty) {
              results.add(SearchResultItem(
                title: cleanQuery,
                snippet: cleanSnippet,
                url: rawUrl.isNotEmpty ? rawUrl : 'https://duckduckgo.com',
              ));
            }
          }
        }
      } catch (e) {
        debugPrint('[WebSearchService] HTML search failed: $e');
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
