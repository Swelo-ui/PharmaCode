import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_math_fork/flutter_math.dart';
import 'package:google_fonts/google_fonts.dart';

import '../core/theme.dart';

/// Reusable Markdown & Rich Output Formatter for PharmaCode
/// Renders headers, lists, quotes, tables, and IDE-styled terminal code blocks
/// without leaving raw markdown tokens (*, **, ###, ```) visible.
class PharmaMarkdownWidget extends StatelessWidget {
  final String text;
  final double? baseFontSize;
  final Color? defaultTextColor;

  const PharmaMarkdownWidget({
    super.key,
    required this.text,
    this.baseFontSize,
    this.defaultTextColor,
  });

  @override
  Widget build(BuildContext context) {
    return _renderFormatted(context, text);
  }

  Widget _renderFormatted(BuildContext context, String rawText) {
    // 0. Unescape literal newlines, escaped backticks, and unicode zero-width spaces
    final unescapedText = rawText
        .replaceAll(r'\n', '\n')
        .replaceAll(r'\\n', '\n')
        .replaceAll(r'\r', '')
        .replaceAll(RegExp(r'\\+`'), '`')
        .replaceAll(RegExp(r'`\s+`\s+`'), '```')
        .replaceAll(RegExp(r'`\s+`'), '``')
        .replaceAll(RegExp(r'[\u200B-\u200D\uFEFF]'), '');

    // Convert HTML line breaks (<br>, <br/>, <br />) into newlines
    // Preserve markdown table rows without breaking table structure
    final rawLines = unescapedText.split('\n');
    final List<String> lines = [];
    for (final rawLine in rawLines) {
      final trimmed = rawLine.trim();
      if (_isTableRow(trimmed)) {
        lines.add(rawLine);
      } else {
        final normalized = rawLine
            .replaceAll(RegExp(r'<br\s*/?>', caseSensitive: false), '\n')
            .replaceAll(RegExp(r'</p>', caseSensitive: false), '\n')
            .replaceAll(RegExp(r'<p>', caseSensitive: false), '');
        lines.addAll(normalized.split('\n'));
      }
    }

    final List<Widget> children = [];
    bool isFirstItem = true;

    for (int i = 0; i < lines.length; i++) {
      final trimmed = lines[i].trim();

      if (trimmed.isEmpty) {
        if (!isFirstItem) {
          children.add(const SizedBox(height: 5));
        }
        continue;
      }

      // 0A. Markdown Image Detection (![alt](url))
      final imageMatch = RegExp(r'^!\[(.*?)\]\((https?://[^\s)]+)\)$').firstMatch(trimmed);
      if (imageMatch != null) {
        final alt = imageMatch.group(1) ?? '';
        final url = imageMatch.group(2) ?? '';
        children.add(_buildMarkdownImage(context, alt, url));
        isFirstItem = false;
        continue;
      }

      // 0B. Standalone / Block LaTeX Math Detection (\[ ... \] or $$ ... $$)
      if (trimmed.startsWith(r'\[') || trimmed.startsWith(r'$$')) {
        final isBracket = trimmed.startsWith(r'\[');
        final closingToken = isBracket ? r'\]' : r'$$';

        // Check if single-line display math: e.g. \[ F = \frac{...}{...} \]
        if (trimmed.endsWith(closingToken) && trimmed.length > 4) {
          final eq = trimmed.substring(2, trimmed.length - 2).trim();
          children.add(_buildDisplayMathWidget(context, eq));
          isFirstItem = false;
          continue;
        }

        // Multi-line math block
        final mathLines = <String>[];
        final openingRest = trimmed.substring(2).trim();
        if (openingRest.isNotEmpty && !openingRest.contains(closingToken)) {
          mathLines.add(openingRest);
        }

        int k = i + 1;
        while (k < lines.length && !lines[k].trim().contains(closingToken)) {
          mathLines.add(lines[k].trim());
          k++;
        }
        if (k < lines.length) {
          final lastLine = lines[k].trim();
          final beforeClosing = lastLine.replaceAll(closingToken, '').trim();
          if (beforeClosing.isNotEmpty) {
            mathLines.add(beforeClosing);
          }
          i = k; // Advance past closing delimiter
        } else {
          i = k - 1;
        }

        children.add(_buildDisplayMathWidget(context, mathLines.join(' ')));
        isFirstItem = false;
        continue;
      }

      // 0C. Raw Standalone LaTeX Formula (e.g. \frac{...}{...} or \text{...} = \frac{...})
      if ((trimmed.startsWith(r'\frac') ||
           trimmed.startsWith(r'\text{') ||
           trimmed.startsWith(r'\left(') ||
           (trimmed.contains(r'\frac{') && trimmed.contains('='))) &&
          !trimmed.contains('http') &&
          !trimmed.startsWith('- ') &&
          !trimmed.startsWith('• ')) {
        children.add(_buildDisplayMathWidget(context, trimmed));
        isFirstItem = false;
        continue;
      }

      // 0D. Fenced Code Block Detection (```python ... ``` or ` bash ... or ~~~)
      final isCodeStart = trimmed.startsWith('```') ||
          trimmed.startsWith('~~~') ||
          RegExp(r'^`{1,4}\s*(?:python|bash|sh|shell|sql|r|terminal|dart|javascript|json|html|css|cpp|c|java|latex|math|tex)', caseSensitive: false).hasMatch(trimmed);

      if (isCodeStart) {
        String lang = 'terminal';
        final langMatch = RegExp(r'^[`~]{1,4}\s*([a-zA-Z0-9_\-#+.]+)?', caseSensitive: false).firstMatch(trimmed);
        if (langMatch != null && langMatch.group(1) != null && langMatch.group(1)!.isNotEmpty) {
          lang = langMatch.group(1)!.toLowerCase();
        }

        final codeLines = <String>[];
        int k = i + 1;
        while (k < lines.length &&
            !lines[k].trim().startsWith('```') &&
            !lines[k].trim().startsWith('~~~') &&
            !RegExp(r'^[`~]{1,4}\s*$').hasMatch(lines[k].trim())) {
          codeLines.add(lines[k]);
          k++;
        }
        if (k < lines.length &&
            (lines[k].trim().startsWith('```') ||
             lines[k].trim().startsWith('~~~') ||
             RegExp(r'^[`~]{1,4}\s*$').hasMatch(lines[k].trim()))) {
          i = k; // Advance past closing backticks
        } else {
          i = k - 1;
        }

        // If fenced code is labeled latex/math/tex, render as display math
        if (lang == 'latex' || lang == 'math' || lang == 'tex') {
          children.add(_buildDisplayMathWidget(context, codeLines.join(' ')));
          isFirstItem = false;
          continue;
        }

        children.add(_buildTerminalCodeWidget(
          context: context,
          code: codeLines.join('\n'),
          language: lang,
        ));
        isFirstItem = false;
        continue;
      }

      // 1. Divider handling (---, ***, ___)
      if (trimmed == '---' || trimmed == '***' || trimmed == '___' || (trimmed.startsWith('---') && trimmed.length <= 5)) {
        if (!isFirstItem && children.isNotEmpty) {
          children.add(
            const Padding(
              padding: EdgeInsets.symmetric(vertical: 6),
              child: Divider(height: 1, thickness: 0.8, color: Color(0xFFE2E8F0)),
            ),
          );
        }
        continue;
      }

      // 2. Markdown Table Detection & Parsing
      if (_isTableRow(trimmed) && i + 1 < lines.length && _isTableSeparator(lines[i + 1])) {
        final headers = _parseTableCells(trimmed);
        i++; // Skip separator line

        final List<List<String>> rows = [];
        int j = i + 1;
        while (j < lines.length && _isTableRow(lines[j]) && !_isTableSeparator(lines[j])) {
          final cells = _parseTableCells(lines[j]);
          while (cells.length < headers.length) {
            cells.add('');
          }
          rows.add(cells);
          j++;
        }
        i = j - 1; // Advance loop index

        children.add(_buildMarkdownTable(context, headers, rows));
        isFirstItem = false;
        continue;
      }

      isFirstItem = false;

      // 3. Headings
      if (trimmed.startsWith('#### ') || trimmed.startsWith('##### ')) {
        final rawTitle = trimmed.substring(trimmed.indexOf(' ') + 1);
        children.add(
          Padding(
            padding: const EdgeInsets.only(top: 8, bottom: 3),
            child: _buildRichInlineText(
              rawTitle,
              baseFontSize: 14.5,
              defaultTextColor: AppTheme.primaryNavy,
              isBold: true,
            ),
          ),
        );
      } else if (trimmed.startsWith('### ')) {
        final rawTitle = trimmed.substring(4);
        children.add(
          Padding(
            padding: const EdgeInsets.only(top: 8, bottom: 4),
            child: _buildRichInlineText(
              rawTitle,
              baseFontSize: 15.5,
              defaultTextColor: AppTheme.primaryNavy,
              isBold: true,
            ),
          ),
        );
      } else if (trimmed.startsWith('## ')) {
        final rawTitle = trimmed.substring(3);
        children.add(
          Padding(
            padding: const EdgeInsets.only(top: 10, bottom: 4),
            child: _buildRichInlineText(
              rawTitle,
              baseFontSize: 17,
              defaultTextColor: AppTheme.primaryNavy,
              isBold: true,
            ),
          ),
        );
      } else if (trimmed.startsWith('# ')) {
        final rawTitle = trimmed.substring(2);
        children.add(
          Padding(
            padding: const EdgeInsets.only(top: 12, bottom: 6),
            child: _buildRichInlineText(
              rawTitle,
              baseFontSize: 19,
              defaultTextColor: AppTheme.primaryNavy,
              isBold: true,
            ),
          ),
        );
      } else if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        final content = trimmed.substring(2);
        children.add(
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 2.5),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('•  ', style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF2563EB))),
                Expanded(child: _buildRichInlineText(content)),
              ],
            ),
          ),
        );
      } else if (RegExp(r'^[A-Z]\.\s').hasMatch(trimmed)) {
        final match = RegExp(r'^([A-Z]\.)\s*(.*)$').firstMatch(trimmed);
        final letter = match?.group(1) ?? 'A.';
        final title = (match?.group(2) ?? '').replaceAll('**', '').replaceAll('*', '').trim();
        children.add(
          Padding(
            padding: const EdgeInsets.only(top: 10, bottom: 4),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(
                    color: const Color(0xFFEFF6FF),
                    borderRadius: BorderRadius.circular(6),
                    border: Border.all(color: const Color(0xFFBFDBFE)),
                  ),
                  child: Text(
                    letter,
                    style: GoogleFonts.dmSans(
                      fontSize: 12,
                      fontWeight: FontWeight.w900,
                      color: const Color(0xFF1E40AF),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    title,
                    style: GoogleFonts.dmSans(
                      fontSize: 15,
                      fontWeight: FontWeight.w800,
                      color: AppTheme.primaryNavy,
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      } else if (RegExp(r'^\d+\.\s').hasMatch(trimmed)) {
        final match = RegExp(r'^(\d+\.)\s*(.*)$').firstMatch(trimmed);
        final num = match?.group(1) ?? '1.';
        final content = match?.group(2) ?? '';
        children.add(
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 2.5),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('$num  ', style: const TextStyle(fontWeight: FontWeight.w700, color: Color(0xFF2563EB))),
                Expanded(child: _buildRichInlineText(content)),
              ],
            ),
          ),
        );
      } else if (trimmed.startsWith('> ')) {
        final quote = trimmed.substring(2);
        children.add(
          Container(
            margin: const EdgeInsets.symmetric(vertical: 4),
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            decoration: BoxDecoration(
              color: const Color(0xFFF1F5F9),
              borderRadius: BorderRadius.circular(6),
              border: const Border(
                left: BorderSide(color: Color(0xFF2563EB), width: 3),
              ),
            ),
            child: _buildRichInlineText(quote),
          ),
        );
      } else {
        children.add(
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 2),
            child: _buildRichInlineText(trimmed),
          ),
        );
      }
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: children,
    );
  }

  Widget _buildRichInlineText(
    String text, {
    double? baseFontSize,
    Color? defaultTextColor,
    bool isBold = false,
  }) {
    final double effectiveFontSize = baseFontSize ?? this.baseFontSize ?? 13.8;
    final Color effectiveColor = defaultTextColor ?? this.defaultTextColor ?? const Color(0xFF334155);
    final TextStyle defaultStyle = GoogleFonts.inter(
      fontSize: effectiveFontSize,
      height: 1.45,
      fontWeight: isBold ? FontWeight.w800 : FontWeight.w400,
      color: isBold ? (defaultTextColor ?? const Color(0xFF0F172A)) : effectiveColor,
    );

    final spans = _buildRichInlineSpans(
      text,
      defaultStyle,
      baseFontSize: effectiveFontSize,
      defaultTextColor: effectiveColor,
      depth: 0,
    );

    return Text.rich(
      TextSpan(children: spans),
      style: defaultStyle,
    );
  }

  List<InlineSpan> _buildRichInlineSpans(
    String text,
    TextStyle currentStyle, {
    required double baseFontSize,
    required Color defaultTextColor,
    int depth = 0,
  }) {
    if (text.isEmpty) return [];

    final String cleaned = _preprocessInlineText(text);

    // Recursion guard
    if (depth > 3) {
      return [TextSpan(text: cleaned, style: currentStyle)];
    }

    final regex = RegExp(
      r'('
      r'\$\$[\s\S]+?\$\$|'
      r'\\\[[\s\S]+?\\\]|'
      r'\\\([\s\S]+?\\\)|'
      r'\$(?!\$)[^\$\n]+?\$|'
      r'<sub\b[^>]*>[\s\S]+?</sub>|'
      r'<sup\b[^>]*>[\s\S]+?</sup>|'
      r'<mark\b[^>]*>[\s\S]+?</mark>|'
      r'\*\*(.+?)\*\*|'
      r'__(.+?)__|'
      r'\*(?!\*)[^*\n]+?\*|'
      r'`[^`\n]+?`|'
      r'(?<=^|\s|[.,;:!?(])_(?!_)([^_\n]+?)_(?=$|\s|[.,;:!?)]|\b)'
      r')',
      caseSensitive: false,
    );

    final matches = regex.allMatches(cleaned);
    if (matches.isEmpty) {
      final plainText = cleaned.replaceAll(RegExp(r'^\*+|\*+$'), '');
      if (plainText.isEmpty) return [];
      return [TextSpan(text: plainText, style: currentStyle)];
    }

    final List<InlineSpan> spans = [];
    int lastIndex = 0;

    for (final match in matches) {
      if (match.start > lastIndex) {
        final pre = cleaned.substring(lastIndex, match.start).replaceAll(RegExp(r'^\*+|\*+$'), '');
        if (pre.isNotEmpty) {
          spans.add(TextSpan(text: pre, style: currentStyle));
        }
      }

      final token = match.group(0)!;

      // 1. Math Display Delimiters: $$...$$ or \[...\]
      if ((token.startsWith(r'$$') && token.endsWith(r'$$') && token.length >= 4) ||
          (token.startsWith(r'\[') && token.endsWith(r'\]') && token.length >= 4)) {
        final mathContent = _cleanTex(token);
        spans.add(WidgetSpan(
          alignment: PlaceholderAlignment.middle,
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 2, vertical: 1),
            child: Math.tex(
              mathContent,
              mathStyle: MathStyle.display,
              textStyle: TextStyle(
                fontSize: baseFontSize + 0.5,
                color: currentStyle.color ?? defaultTextColor,
              ),
              onErrorFallback: (_) => Text(
                mathContent,
                style: GoogleFonts.jetBrainsMono(
                  fontSize: baseFontSize,
                  color: currentStyle.color ?? defaultTextColor,
                ),
              ),
            ),
          ),
        ));
      }
      // 2. Inline Math Delimiters: \(...\) or $...$
      else if ((token.startsWith(r'\(') && token.endsWith(r'\)') && token.length >= 4) ||
               (token.startsWith(r'$') && token.endsWith(r'$') && token.length >= 2)) {
        final mathContent = _cleanTex(token);
        spans.add(WidgetSpan(
          alignment: PlaceholderAlignment.middle,
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 2),
            child: Math.tex(
              mathContent,
              mathStyle: MathStyle.text,
              textStyle: TextStyle(
                fontSize: baseFontSize,
                color: currentStyle.color ?? defaultTextColor,
              ),
              onErrorFallback: (_) => Text(
                mathContent,
                style: GoogleFonts.jetBrainsMono(
                  fontSize: baseFontSize,
                  color: currentStyle.color ?? defaultTextColor,
                ),
              ),
            ),
          ),
        ));
      }
      // 3. HTML Subscript: <sub>...</sub>
      else if (token.toLowerCase().startsWith('<sub') && token.toLowerCase().endsWith('</sub>')) {
        final innerMatch = RegExp(r'<sub\b[^>]*>([\s\S]*?)</sub>', caseSensitive: false).firstMatch(token);
        final subText = innerMatch?.group(1) ?? '';
        spans.add(_buildSubscriptSpan(subText, currentStyle, baseFontSize));
      }
      // 4. HTML Superscript: <sup>...</sup>
      else if (token.toLowerCase().startsWith('<sup') && token.toLowerCase().endsWith('</sup>')) {
        final innerMatch = RegExp(r'<sup\b[^>]*>([\s\S]*?)</sup>', caseSensitive: false).firstMatch(token);
        final supText = innerMatch?.group(1) ?? '';
        spans.add(_buildSuperscriptSpan(supText, currentStyle, baseFontSize));
      }
      // 5. Highlight: <mark>...</mark>
      else if (token.toLowerCase().startsWith('<mark') && token.toLowerCase().endsWith('</mark>')) {
        final innerMatch = RegExp(r'<mark\b[^>]*>([\s\S]*?)</mark>', caseSensitive: false).firstMatch(token);
        final markText = innerMatch?.group(1) ?? '';
        spans.add(TextSpan(
          text: markText,
          style: currentStyle.copyWith(
            backgroundColor: const Color(0xFFFEF08A),
            color: const Color(0xFF854D0E),
            fontWeight: FontWeight.w600,
          ),
        ));
      }
      // 6. Bold: **...** or __...__ (Recursive to support nested math, code, sub/sup)
      else if ((token.startsWith('**') && token.endsWith('**') && token.length >= 4) ||
               (token.startsWith('__') && token.endsWith('__') && token.length >= 4)) {
        final inner = token.substring(2, token.length - 2);
        final boldStyle = currentStyle.copyWith(
          fontWeight: FontWeight.w800,
          color: const Color(0xFF0F172A),
        );
        spans.addAll(_buildRichInlineSpans(
          inner,
          boldStyle,
          baseFontSize: baseFontSize,
          defaultTextColor: defaultTextColor,
          depth: depth + 1,
        ));
      }
      // 7. Italic: *...* or _..._
      else if ((token.startsWith('*') && token.endsWith('*') && token.length >= 2) ||
               (token.startsWith('_') && token.endsWith('_') && token.length >= 2)) {
        final inner = token.substring(1, token.length - 1);
        final italicStyle = currentStyle.copyWith(
          fontStyle: FontStyle.italic,
          fontWeight: FontWeight.w500,
          color: const Color(0xFF1E293B),
        );
        spans.addAll(_buildRichInlineSpans(
          inner,
          italicStyle,
          baseFontSize: baseFontSize,
          defaultTextColor: defaultTextColor,
          depth: depth + 1,
        ));
      }
      // 8. Inline Code: `...`
      else if (token.startsWith('`') && token.endsWith('`') && token.length >= 2) {
        final inner = token.substring(1, token.length - 1);
        spans.add(TextSpan(
          text: ' $inner ',
          style: GoogleFonts.jetBrainsMono(
            fontSize: baseFontSize - 1.3,
            fontWeight: FontWeight.w600,
            color: const Color(0xFF1E40AF),
            backgroundColor: const Color(0xFFEFF6FF),
          ),
        ));
      }

      lastIndex = match.end;
    }

    if (lastIndex < cleaned.length) {
      final post = cleaned.substring(lastIndex).replaceAll(RegExp(r'^\*+|\*+$'), '');
      if (post.isNotEmpty) {
        spans.add(TextSpan(text: post, style: currentStyle));
      }
    }

    return spans;
  }

  String _preprocessInlineText(String text) {
    String res = text
        .replaceAll(RegExp(r'<br\s*/?>', caseSensitive: false), '\n')
        .replaceAll(RegExp(r'</p>', caseSensitive: false), '\n')
        .replaceAll(RegExp(r'<p>', caseSensitive: false), '');

    res = _decodeHtmlEntities(res);

    // Convert <b> and <strong> to **...**
    res = res.replaceAll(RegExp(r'<b\b[^>]*>(.*?)</b>', caseSensitive: false, dotAll: true), r'**$1**');
    res = res.replaceAll(RegExp(r'<strong\b[^>]*>(.*?)</strong>', caseSensitive: false, dotAll: true), r'**$1**');

    // Convert <i> and <em> to *...*
    res = res.replaceAll(RegExp(r'<i\b[^>]*>(.*?)</i>', caseSensitive: false, dotAll: true), r'*$1*');
    res = res.replaceAll(RegExp(r'<em\b[^>]*>(.*?)</em>', caseSensitive: false, dotAll: true), r'*$1*');

    // Convert <code> to `...`
    res = res.replaceAll(RegExp(r'<code\b[^>]*>(.*?)</code>', caseSensitive: false, dotAll: true), r'`$1`');

    // Clean quotes with asterisks: *"quote"* -> "quote"
    res = res.replaceAll(RegExp(r'\*\"(.*?)\"\*'), '"\$1"');
    res = res.replaceAll(RegExp(r'\"\*(.*?)\*\"'), '"\$1"');

    // If bold wraps pure math like **\(... \)** or **$...$**, normalize delimiters
    res = res.replaceAllMapped(RegExp(r'\*\*\s*(\\\([\s\S]+?\\\))\s*\*\*'), (m) => m.group(1)!);
    res = res.replaceAllMapped(RegExp(r'\*\*\s*(\$\$[\s\S]+?\$\$)\s*\*\*'), (m) => m.group(1)!);
    res = res.replaceAllMapped(RegExp(r'\*\*\s*(\\\[[\s\S]+?\\\])\s*\*\*'), (m) => m.group(1)!);
    res = res.replaceAllMapped(RegExp(r'\*\*\s*(\$[^\$\n]+?\$)\s*\*\*'), (m) => m.group(1)!);

    return res;
  }

  String _decodeHtmlEntities(String input) {
    return input
        .replaceAll('&nbsp;', ' ')
        .replaceAll('&amp;', '&')
        .replaceAll('&lt;', '<')
        .replaceAll('&gt;', '>')
        .replaceAll('&quot;', '"')
        .replaceAll('&apos;', "'")
        .replaceAll('&plusmn;', '±')
        .replaceAll('&times;', '×')
        .replaceAll('&divide;', '÷')
        .replaceAll('&le;', '≤')
        .replaceAll('&ge;', '≥')
        .replaceAll('&ne;', '≠')
        .replaceAll('&approx;', '≈')
        .replaceAll('&infin;', '∞')
        .replaceAll('&alpha;', 'α')
        .replaceAll('&beta;', 'β')
        .replaceAll('&gamma;', 'γ')
        .replaceAll('&delta;', 'δ')
        .replaceAll('&lambda;', 'λ')
        .replaceAll('&mu;', 'µ')
        .replaceAll('&micro;', 'µ')
        .replaceAll('&pi;', 'π')
        .replaceAll('&sigma;', 'σ')
        .replaceAll('&tau;', 'τ')
        .replaceAll('&omega;', 'ω')
        .replaceAll('&deg;', '°');
  }

  InlineSpan _buildSubscriptSpan(String text, TextStyle parentStyle, double baseFontSize) {
    final cleanSub = text.replaceAll(RegExp(r'<[^>]*>'), '').trim();
    return WidgetSpan(
      alignment: PlaceholderAlignment.middle,
      child: Transform.translate(
        offset: const Offset(0, 3.5),
        child: Text(
          cleanSub,
          style: parentStyle.copyWith(
            fontSize: baseFontSize * 0.76,
            fontWeight: parentStyle.fontWeight ?? FontWeight.w600,
          ),
        ),
      ),
    );
  }

  InlineSpan _buildSuperscriptSpan(String text, TextStyle parentStyle, double baseFontSize) {
    final cleanSup = text.replaceAll(RegExp(r'<[^>]*>'), '').trim();
    return WidgetSpan(
      alignment: PlaceholderAlignment.middle,
      child: Transform.translate(
        offset: const Offset(0, -4.5),
        child: Text(
          cleanSup,
          style: parentStyle.copyWith(
            fontSize: baseFontSize * 0.76,
            fontWeight: parentStyle.fontWeight ?? FontWeight.w600,
          ),
        ),
      ),
    );
  }

  String _cleanTex(String raw) {
    String t = raw.trim();
    if (t.startsWith(r'\[') && t.endsWith(r'\]') && t.length >= 4) {
      t = t.substring(2, t.length - 2).trim();
    } else if (t.startsWith(r'$$') && t.endsWith(r'$$') && t.length >= 4) {
      t = t.substring(2, t.length - 2).trim();
    } else if (t.startsWith(r'\(') && t.endsWith(r'\)') && t.length >= 4) {
      t = t.substring(2, t.length - 2).trim();
    } else if (t.startsWith(r'$') && t.endsWith(r'$') && t.length >= 2) {
      t = t.substring(1, t.length - 1).trim();
    }
    if (t.startsWith('**') && t.endsWith('**') && t.length > 4) {
      t = t.substring(2, t.length - 2).trim();
    }
    t = t.replaceAll(r'\n', ' ');
    // Escape unescaped % so KaTeX doesn't treat it as a comment
    t = t.replaceAll(RegExp(r'(?<!\\)%'), r'\%');
    return t;
  }

  bool _isTableSeparator(String line) {
    final t = line.trim();
    if (!t.contains('|') || !t.contains('-')) return false;
    return RegExp(r'^\|?(\s*:?-{2,}:?\s*\|?)+\s*$').hasMatch(t);
  }

  bool _isTableRow(String line) {
    final t = line.trim();
    if (!t.contains('|')) return false;
    final pipes = t.split('|').length - 1;
    return pipes >= 2;
  }

  List<String> _parseTableCells(String line) {
    String t = line.trim();
    if (t.startsWith('|')) t = t.substring(1);
    if (t.endsWith('|')) t = t.substring(0, t.length - 1);
    return t.split('|').map((c) => c.trim()).toList();
  }

  Widget _buildTerminalCodeWidget({
    required BuildContext context,
    required String code,
    required String language,
  }) {
    final cleanLang = language.trim().isNotEmpty ? language.trim().toUpperCase() : 'TERMINAL';
    final cleanCode = code
        .replaceAll(r'\n', '\n')
        .replaceAll(r'\\n', '\n')
        .replaceAll(RegExp(r'^`+\s*([a-zA-Z0-9_\-]*\s*)?'), '')
        .replaceAll(RegExp(r'`+$'), '')
        .trimRight();
    final codeLines = cleanCode.split('\n');

    return Container(
      margin: const EdgeInsets.symmetric(vertical: 8),
      decoration: BoxDecoration(
        color: const Color(0xFF0F172A), // Deep Slate IDE / Terminal
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFF334155), width: 1.2),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.1),
            blurRadius: 8,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Terminal Window Titlebar
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: const BoxDecoration(
              color: Color(0xFF1E293B),
              border: Border(bottom: BorderSide(color: Color(0xFF334155), width: 1)),
            ),
            child: Row(
              children: [
                // macOS / Linux style terminal window buttons
                Container(width: 9.5, height: 9.5, decoration: const BoxDecoration(color: Color(0xFFEF4444), shape: BoxShape.circle)),
                const SizedBox(width: 5.5),
                Container(width: 9.5, height: 9.5, decoration: const BoxDecoration(color: Color(0xFFF59E0B), shape: BoxShape.circle)),
                const SizedBox(width: 5.5),
                Container(width: 9.5, height: 9.5, decoration: const BoxDecoration(color: Color(0xFF10B981), shape: BoxShape.circle)),
                const SizedBox(width: 12),
                const Icon(Icons.terminal_rounded, size: 14, color: Color(0xFF94A3B8)),
                const SizedBox(width: 5),
                Text(
                  cleanLang,
                  style: GoogleFonts.jetBrainsMono(
                    color: const Color(0xFF38BDF8),
                    fontWeight: FontWeight.w800,
                    fontSize: 11,
                    letterSpacing: 0.5,
                  ),
                ),
                const Spacer(),
                InkWell(
                  onTap: () {
                    Clipboard.setData(ClipboardData(text: cleanCode));
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Code copied to clipboard!'),
                        duration: Duration(seconds: 2),
                        behavior: SnackBarBehavior.floating,
                      ),
                    );
                  },
                  borderRadius: BorderRadius.circular(6),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3.5),
                    decoration: BoxDecoration(
                      color: const Color(0xFF334155),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Icons.copy_rounded, size: 12, color: Color(0xFFF1F5F9)),
                        const SizedBox(width: 4),
                        Text(
                          'Copy Code',
                          style: GoogleFonts.inter(
                            color: const Color(0xFFF1F5F9),
                            fontWeight: FontWeight.w600,
                            fontSize: 11,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
          // Code Content with Line Numbering & Horizontal Scroll
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            physics: const BouncingScrollPhysics(),
            padding: const EdgeInsets.all(12),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Gutter line numbers
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    for (int n = 1; n <= codeLines.length; n++)
                      Text(
                        '$n ',
                        style: GoogleFonts.jetBrainsMono(
                          fontSize: 12,
                          height: 1.5,
                          color: const Color(0xFF64748B),
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                  ],
                ),
                const SizedBox(width: 12),
                // Code lines
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    for (final line in codeLines)
                      _buildSyntaxTintedLine(line),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSyntaxTintedLine(String line) {
    final t = line.trimLeft();
    Color textColor = const Color(0xFFF1F5F9);
    FontWeight weight = FontWeight.w400;

    if (t.startsWith('#') || t.startsWith('//') || t.startsWith('/*')) {
      textColor = const Color(0xFF4ADE80); // Comments soft green
    } else if (t.startsWith('import ') ||
        t.startsWith('from ') ||
        t.startsWith('def ') ||
        t.startsWith('class ') ||
        t.startsWith('return ') ||
        t.startsWith('if ') ||
        t.startsWith('elif ') ||
        t.startsWith('else:') ||
        t.startsWith('for ') ||
        t.startsWith('while ') ||
        t.startsWith('try:') ||
        t.startsWith('except ') ||
        t.startsWith('conda ') ||
        t.startsWith('pip ')) {
      textColor = const Color(0xFF38BDF8); // Keywords cyan
      weight = FontWeight.w600;
    } else if (t.startsWith('print(') || t.startsWith('pd.') || t.startsWith('np.')) {
      textColor = const Color(0xFFF472B6); // Functions soft pink
    }

    return Text(
      line.isEmpty ? ' ' : line,
      style: GoogleFonts.jetBrainsMono(
        fontSize: 12,
        height: 1.5,
        color: textColor,
        fontWeight: weight,
      ),
    );
  }

  Widget _buildMarkdownTable(BuildContext context, List<String> headers, List<List<String>> rows) {
    if (headers.isEmpty && rows.isEmpty) return const SizedBox.shrink();

    // Check if this table is actually a single-column code container wrapped by the model
    final isSingleColCodeTable = headers.length == 1 &&
        (headers.first.toLowerCase().contains('code') ||
            headers.first.toLowerCase().contains('example') ||
            headers.first.toLowerCase().contains('script') ||
            headers.first.toLowerCase().contains('terminal') ||
            (rows.isNotEmpty &&
                rows.every((r) =>
                    r.isNotEmpty &&
                    (r.first.contains(r'\n') ||
                        r.first.contains('import ') ||
                        r.first.contains('pd.') ||
                        r.first.contains('#')))));

    if (isSingleColCodeTable && rows.isNotEmpty) {
      final buffer = StringBuffer();
      for (final r in rows) {
        if (r.isNotEmpty) {
          String cell = r.first.trim();
          if (cell.startsWith('```')) cell = cell.replaceFirst(RegExp(r'^```[a-zA-Z0-9_\-]*\s*'), '');
          if (cell.endsWith('```')) cell = cell.substring(0, cell.length - 3);
          if (cell.startsWith('`')) cell = cell.replaceFirst(RegExp(r'^`+\s*([a-zA-Z0-9_\-]*\s*)?'), '');
          if (cell.endsWith('`')) cell = cell.replaceAll(RegExp(r'`+$'), '');
          cell = cell.replaceAll(r'\n', '\n').replaceAll(r'\\n', '\n').trim();
          if (cell.isNotEmpty) {
            buffer.writeln(cell);
          }
        }
      }
      return _buildTerminalCodeWidget(
        context: context,
        code: buffer.toString(),
        language: 'python',
      );
    }

    final colCount = headers.isNotEmpty ? headers.length : (rows.isNotEmpty ? rows.first.length : 1);

    // Detect if any cell has lengthy descriptive text (> 25 characters)
    bool hasLongContent = false;
    for (final r in rows) {
      for (final c in r) {
        if (c.length > 25) {
          hasLongContent = true;
          break;
        }
      }
      if (hasLongContent) break;
    }

    // Tables with 3+ columns, or 2-column tables with descriptive content, are wide/scrollable
    final isWideTable = colCount >= 3 || (colCount == 2 && hasLongContent);

    return Container(
      margin: const EdgeInsets.symmetric(vertical: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (isWideTable)
            Padding(
              padding: const EdgeInsets.only(bottom: 4, left: 2),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.swipe_rounded, size: 13, color: Color(0xFF2563EB)),
                  const SizedBox(width: 4),
                  Text(
                    'Scrollable Table (Swipe ↔ to view all $colCount columns)',
                    style: GoogleFonts.inter(
                      fontSize: 10.5,
                      color: const Color(0xFF2563EB),
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ],
              ),
            ),
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFFCBD5E1), width: 1.1),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.03),
                  blurRadius: 6,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            clipBehavior: Clip.antiAlias,
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              physics: const BouncingScrollPhysics(),
              child: ConstrainedBox(
                constraints: BoxConstraints(
                  minWidth: MediaQuery.of(context).size.width - 48,
                ),
                child: Table(
                  defaultVerticalAlignment: TableCellVerticalAlignment.middle,
                  columnWidths: isWideTable
                      ? {
                          for (int c = 0; c < colCount; c++)
                            c: const IntrinsicColumnWidth(),
                        }
                      : (colCount == 2
                          ? const {
                              0: FlexColumnWidth(1.0),
                              1: FlexColumnWidth(1.8),
                            }
                          : {
                              for (int c = 0; c < colCount; c++)
                                c: const FlexColumnWidth(),
                            }),
                  children: [
                    // Header Row
                    if (headers.isNotEmpty)
                      TableRow(
                        decoration: const BoxDecoration(
                          color: Color(0xFFEFF6FF),
                          border: Border(bottom: BorderSide(color: Color(0xFF93C5FD), width: 1.5)),
                        ),
                        children: headers.map((h) {
                          return Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                            alignment: Alignment.centerLeft,
                            child: ConstrainedBox(
                              constraints: BoxConstraints(
                                maxWidth: isWideTable ? (colCount >= 4 ? 200 : 250) : 300,
                                minWidth: isWideTable ? (colCount >= 4 ? 100 : 120) : 60,
                              ),
                              child: _buildRichInlineText(
                                h.replaceAll(RegExp(r'<br\s*/?>', caseSensitive: false), ' '),
                                baseFontSize: 12,
                                defaultTextColor: const Color(0xFF1E3A8A),
                                isBold: true,
                              ),
                            ),
                          );
                        }).toList(),
                      ),

                    // Data Rows
                    for (int r = 0; r < rows.length; r++)
                      TableRow(
                        decoration: BoxDecoration(
                          color: r % 2 == 1 ? const Color(0xFFF8FAFC) : Colors.white,
                          border: r < rows.length - 1
                              ? const Border(bottom: BorderSide(color: Color(0xFFE2E8F0), width: 0.8))
                              : null,
                        ),
                        children: [
                          for (int c = 0; c < colCount; c++)
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 7),
                              alignment: Alignment.centerLeft,
                              child: ConstrainedBox(
                                constraints: BoxConstraints(
                                  maxWidth: isWideTable ? (colCount >= 4 ? 200 : 250) : 300,
                                  minWidth: isWideTable ? (colCount >= 4 ? 100 : 120) : 60,
                                ),
                                child: _buildRichInlineText(
                                  (c < rows[r].length ? rows[r][c] : '')
                                      .replaceAll(r'\n', '\n')
                                      .replaceAll(r'\\n', '\n'),
                                  baseFontSize: 12.5,
                                ),
                              ),
                            ),
                        ],
                      ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDisplayMathWidget(BuildContext context, String rawTex) {
    final String cleanTex = _cleanTex(rawTex);

    return Container(
      margin: const EdgeInsets.symmetric(vertical: 8),
      width: double.infinity,
      decoration: BoxDecoration(
        color: const Color(0xFFF8FAFC),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFBFDBFE), width: 1.2),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF2563EB).withValues(alpha: 0.04),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Header pill
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
            decoration: const BoxDecoration(
              color: Color(0xFFEFF6FF),
              borderRadius: BorderRadius.vertical(top: Radius.circular(10.8)),
              border: Border(bottom: BorderSide(color: Color(0xFFDBEAFE), width: 1)),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    const Icon(Icons.functions_rounded, size: 14, color: Color(0xFF2563EB)),
                    const SizedBox(width: 6),
                    Text(
                      'FORMULA',
                      style: GoogleFonts.inter(
                        fontSize: 10,
                        fontWeight: FontWeight.w800,
                        color: const Color(0xFF1E40AF),
                        letterSpacing: 0.8,
                      ),
                    ),
                  ],
                ),
                InkWell(
                  onTap: () {
                    Clipboard.setData(ClipboardData(text: cleanTex));
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Formula copied to clipboard!'),
                        duration: Duration(seconds: 1),
                        behavior: SnackBarBehavior.floating,
                      ),
                    );
                  },
                  child: const Padding(
                    padding: EdgeInsets.all(2),
                    child: Icon(Icons.copy_rounded, size: 13, color: Color(0xFF64748B)),
                  ),
                ),
              ],
            ),
          ),
          // Math Formula Render
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              physics: const BouncingScrollPhysics(),
              child: Math.tex(
                cleanTex,
                mathStyle: MathStyle.display,
                textStyle: const TextStyle(
                  fontSize: 15.5,
                  color: Color(0xFF0F172A),
                ),
                onErrorFallback: (err) {
                  return SelectableText(
                    cleanTex,
                    style: GoogleFonts.jetBrainsMono(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: const Color(0xFF1E293B),
                    ),
                  );
                },
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMarkdownImage(BuildContext context, String alt, String url) {
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 10),
      alignment: Alignment.center,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(12),
            child: Container(
              constraints: const BoxConstraints(maxHeight: 340),
              decoration: BoxDecoration(
                color: const Color(0xFFF8FAFC),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: CachedNetworkImage(
                imageUrl: url,
                fit: BoxFit.contain,
                placeholder: (context, _) => Container(
                  height: 160,
                  color: const Color(0xFFF1F5F9),
                  child: const Center(
                    child: SizedBox(
                      width: 24,
                      height: 24,
                      child: CircularProgressIndicator(strokeWidth: 2.5),
                    ),
                  ),
                ),
                errorWidget: (context, _, error) => Container(
                  padding: const EdgeInsets.all(14),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.broken_image_rounded, color: Color(0xFF94A3B8), size: 20),
                      const SizedBox(width: 8),
                      Flexible(
                        child: Text(
                          alt.isNotEmpty ? alt : 'Image preview unavailable',
                          style: GoogleFonts.inter(fontSize: 12, color: const Color(0xFF64748B)),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
          if (alt.trim().isNotEmpty) ...[
            const SizedBox(height: 6),
            Text(
              alt.trim(),
              style: GoogleFonts.inter(
                fontSize: 11.5,
                fontStyle: FontStyle.italic,
                color: const Color(0xFF64748B),
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ],
      ),
    );
  }
}
