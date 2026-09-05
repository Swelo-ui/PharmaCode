import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
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
    // 0. Pre-process text to convert HTML line breaks (<br>, <br/>, <br />) into newlines
    // Preserve markdown table rows without breaking table structure
    final rawLines = rawText.split('\n');
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

      // 0. Fenced Code Block Detection (```python ... ``` or ` bash ...)
      if (trimmed.startsWith('```') ||
          RegExp(r'^`{1,3}\s*(?:python|bash|sh|shell|sql|r|terminal|dart|javascript|json|html|css)', caseSensitive: false).hasMatch(trimmed)) {
        String lang = 'terminal';
        final langMatch = RegExp(r'^`{1,3}\s*([a-zA-Z0-9_\-]+)?', caseSensitive: false).firstMatch(trimmed);
        if (langMatch != null && langMatch.group(1) != null && langMatch.group(1)!.isNotEmpty) {
          lang = langMatch.group(1)!.toLowerCase();
        }

        final codeLines = <String>[];
        int k = i + 1;
        while (k < lines.length &&
            !lines[k].trim().startsWith('```') &&
            !RegExp(r'^`{1,3}\s*$').hasMatch(lines[k].trim())) {
          codeLines.add(lines[k]);
          k++;
        }
        if (k < lines.length &&
            (lines[k].trim().startsWith('```') || RegExp(r'^`{1,3}\s*$').hasMatch(lines[k].trim()))) {
          i = k; // Advance past closing backticks
        } else {
          i = k - 1;
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
        final title = rawTitle.replaceAll('**', '').replaceAll('*', '').trim();
        children.add(
          Padding(
            padding: const EdgeInsets.only(top: 8, bottom: 3),
            child: Text(
              title,
              style: GoogleFonts.dmSans(
                fontSize: 14.5,
                fontWeight: FontWeight.w800,
                color: AppTheme.primaryNavy,
              ),
            ),
          ),
        );
      } else if (trimmed.startsWith('### ')) {
        final rawTitle = trimmed.substring(4);
        final title = rawTitle.replaceAll('**', '').replaceAll('*', '').trim();
        children.add(
          Padding(
            padding: const EdgeInsets.only(top: 8, bottom: 4),
            child: Text(
              title,
              style: GoogleFonts.dmSans(
                fontSize: 15.5,
                fontWeight: FontWeight.w800,
                color: AppTheme.primaryNavy,
              ),
            ),
          ),
        );
      } else if (trimmed.startsWith('## ')) {
        final rawTitle = trimmed.substring(3);
        final title = rawTitle.replaceAll('**', '').replaceAll('*', '').trim();
        children.add(
          Padding(
            padding: const EdgeInsets.only(top: 10, bottom: 4),
            child: Text(
              title,
              style: GoogleFonts.dmSans(
                fontSize: 17,
                fontWeight: FontWeight.w900,
                color: AppTheme.primaryNavy,
              ),
            ),
          ),
        );
      } else if (trimmed.startsWith('# ')) {
        final rawTitle = trimmed.substring(2);
        final title = rawTitle.replaceAll('**', '').replaceAll('*', '').trim();
        children.add(
          Padding(
            padding: const EdgeInsets.only(top: 12, bottom: 6),
            child: Text(
              title,
              style: GoogleFonts.dmSans(
                fontSize: 19,
                fontWeight: FontWeight.w900,
                color: AppTheme.primaryNavy,
              ),
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

  Widget _buildRichInlineText(String text) {
    String cleaned = text
        .replaceAll(RegExp(r'<br\s*/?>', caseSensitive: false), '\n')
        .replaceAll(RegExp(r'</p>', caseSensitive: false), '\n')
        .replaceAll(RegExp(r'<p>', caseSensitive: false), '');
    cleaned = cleaned.replaceAll(RegExp(r'\*\"(.*?)\"\*'), '"\$1"');
    cleaned = cleaned.replaceAll(RegExp(r'\"\*(.*?)\*\"'), '"\$1"');

    final double effectiveFontSize = baseFontSize ?? 13.8;
    final Color effectiveColor = defaultTextColor ?? const Color(0xFF334155);

    // If entire line is wrapped in bold: **Heading text**
    if (cleaned.startsWith('**') && cleaned.endsWith('**') && cleaned.length > 4 && !cleaned.substring(2, cleaned.length - 2).contains('**')) {
      return Text(
        cleaned.substring(2, cleaned.length - 2),
        style: GoogleFonts.inter(
          fontSize: effectiveFontSize + 0.2,
          height: 1.45,
          fontWeight: FontWeight.w800,
          color: const Color(0xFF0F172A),
        ),
      );
    }

    // Tokenise markdown spans: bold (**...**), italic (*...* or _..._), code (`...`)
    final regex = RegExp(r'(\*\*[^*]+?\*\*|\*[^*\s][^*]*?\*|`[^`]+?`|_[^_\s][^_]*?_)');
    final matches = regex.allMatches(cleaned);

    if (matches.isEmpty) {
      final plainText = cleaned.replaceAll(RegExp(r'^\*+|\*+$'), '').trim();
      return Text(
        plainText,
        style: GoogleFonts.inter(
          fontSize: effectiveFontSize,
          height: 1.45,
          fontWeight: FontWeight.w400,
          color: effectiveColor,
        ),
      );
    }

    final List<TextSpan> spans = [];
    int lastIndex = 0;

    for (final match in matches) {
      if (match.start > lastIndex) {
        final pre = cleaned.substring(lastIndex, match.start).replaceAll(RegExp(r'^\*+|\*+$'), '');
        if (pre.isNotEmpty) {
          spans.add(TextSpan(
            text: pre,
            style: GoogleFonts.inter(
              fontSize: effectiveFontSize,
              height: 1.45,
              fontWeight: FontWeight.w400,
              color: effectiveColor,
            ),
          ));
        }
      }

      final token = match.group(0)!;
      if (token.startsWith('**') && token.endsWith('**') && token.length > 4) {
        final inner = token.substring(2, token.length - 2);
        spans.add(TextSpan(
          text: inner,
          style: GoogleFonts.inter(
            fontSize: effectiveFontSize,
            height: 1.45,
            fontWeight: FontWeight.w800,
            color: const Color(0xFF0F172A),
          ),
        ));
      } else if (token.startsWith('*') && token.endsWith('*') && token.length > 2) {
        final inner = token.substring(1, token.length - 1);
        spans.add(TextSpan(
          text: inner,
          style: GoogleFonts.inter(
            fontSize: effectiveFontSize,
            height: 1.45,
            fontStyle: FontStyle.italic,
            fontWeight: FontWeight.w500,
            color: const Color(0xFF1E293B),
          ),
        ));
      } else if (token.startsWith('_') && token.endsWith('_') && token.length > 2) {
        final inner = token.substring(1, token.length - 1);
        spans.add(TextSpan(
          text: inner,
          style: GoogleFonts.inter(
            fontSize: effectiveFontSize,
            height: 1.45,
            fontStyle: FontStyle.italic,
            fontWeight: FontWeight.w500,
            color: const Color(0xFF1E293B),
          ),
        ));
      } else if (token.startsWith('`') && token.endsWith('`') && token.length > 2) {
        final inner = token.substring(1, token.length - 1);
        spans.add(TextSpan(
          text: ' $inner ',
          style: GoogleFonts.jetBrainsMono(
            fontSize: effectiveFontSize - 1.3,
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
        spans.add(TextSpan(
          text: post,
          style: GoogleFonts.inter(
            fontSize: effectiveFontSize,
            height: 1.45,
            fontWeight: FontWeight.w400,
            color: effectiveColor,
          ),
        ));
      }
    }

    return Text.rich(TextSpan(children: spans));
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

    return Container(
      margin: const EdgeInsets.symmetric(vertical: 8),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFFCBD5E1), width: 1.2),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.03),
            blurRadius: 8,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      clipBehavior: Clip.antiAlias,
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        physics: const BouncingScrollPhysics(),
        child: ConstrainedBox(
          constraints: BoxConstraints(
            minWidth: MediaQuery.of(context).size.width - 70,
          ),
          child: Table(
            defaultVerticalAlignment: TableCellVerticalAlignment.middle,
            columnWidths: {
              for (int c = 0; c < colCount; c++)
                c: const IntrinsicColumnWidth(),
            },
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
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                      alignment: Alignment.centerLeft,
                      child: Text(
                        h.replaceAll(RegExp(r'<br\s*/?>', caseSensitive: false), ' ').replaceAll('**', '').replaceAll('*', '').trim(),
                        style: GoogleFonts.dmSans(
                          fontWeight: FontWeight.w900,
                          fontSize: 13,
                          color: const Color(0xFF1E3A8A),
                          letterSpacing: -0.2,
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
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                        alignment: Alignment.centerLeft,
                        child: ConstrainedBox(
                          constraints: const BoxConstraints(maxWidth: 280, minWidth: 90),
                          child: _buildRichInlineText(
                            (c < rows[r].length ? rows[r][c] : '')
                                .replaceAll(r'\n', '\n')
                                .replaceAll(r'\\n', '\n'),
                          ),
                        ),
                      ),
                  ],
                ),
            ],
          ),
        ),
      ),
    );
  }
}
