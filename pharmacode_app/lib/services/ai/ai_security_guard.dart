import 'package:flutter/foundation.dart';

/// Result of input security inspection
class SecurityCheckResult {
  final bool isBlocked;
  final String? blockReason;
  final String? sanitizedInput;
  final String? cannedResponse;

  const SecurityCheckResult({
    required this.isBlocked,
    this.blockReason,
    this.sanitizedInput,
    this.cannedResponse,
  });

  static const SecurityCheckResult safe = SecurityCheckResult(isBlocked: false);
}

/// Robust security guard for PharmaCode AI Tutor:
/// 1. Prevents API key extraction, prompt leakage, and jailbreak commands
/// 2. Sanitizes input to avoid script/payload injection
/// 3. Scrubs output to guarantee no API keys or internal tokens are ever displayed
class AiSecurityGuard {
  AiSecurityGuard._();

  static const int maxInputLength = 2048;

  /// Patterns that attempt to extract internal system prompts, API keys, or developer configurations
  static final List<RegExp> _leakPatterns = [
    RegExp(r'\b(?:api[_\-\s]?key|apikey|secret[_\-\s]?key)\b', caseSensitive: false),
    RegExp(r'\b(?:system[_\-\s]?prompt|developer[_\-\s]?prompt|hidden[_\-\s]?prompt)\b', caseSensitive: false),
    RegExp(r'\b(?:authorization[_\-\s]?header|bearer[_\-\s]?token|access[_\-\s]?token)\b', caseSensitive: false),
    RegExp(r'\b(?:dump[_\-\s]?memory|dump[_\-\s]?env|print[_\-\s]?env|list[_\-\s]?secrets)\b', caseSensitive: false),
    RegExp(r'\b(?:reveal|show|print|output|display|repeat)\s+(?:all\s+)?(?:system|developer|hidden|internal)\s+(?:prompt|instructions?|rules?|keys?)\b', caseSensitive: false),
    RegExp(r'\b(?:ignore|override|bypass)\s+(?:all\s+)?(?:previous|prior|system)\s+(?:instructions?|rules?|constraints?)\s+(?:and\s+)?(?:print|reveal|give)\b', caseSensitive: false),
    RegExp(r'\b(?:groq[_\-\s]?key|gemini[_\-\s]?key|nvidia[_\-\s]?key|openrouter[_\-\s]?key)\b', caseSensitive: false),
  ];

  /// Common API key formats to scrub from any model outputs
  static final List<RegExp> _credentialSignatures = [
    RegExp(r'gsk_[a-zA-Z0-9]{20,}'), // Groq API key
    RegExp(r'AIzaSy[a-zA-Z0-9_\-]{33}'), // Google Gemini API key
    RegExp(r'nvapi\-[a-zA-Z0-9_\-]{40,}'), // NVIDIA NIM key
    RegExp(r'sk\-or\-v1\-[a-zA-Z0-9]{40,}'), // OpenRouter key
    RegExp(r'Bearer\s+[a-zA-Z0-9\._\-]{25,}', caseSensitive: false), // Auth Bearer token
  ];

  /// Inspect user input before sending to AI
  static SecurityCheckResult inspectInput(String input) {
    final trimmed = input.trim();

    // 1. Length validation (DoS prevention)
    if (trimmed.length > maxInputLength) {
      return SecurityCheckResult(
        isBlocked: true,
        blockReason: 'Payload exceeds maximum allowed length ($maxInputLength characters).',
        cannedResponse: 'Aapka question bohot bada hai (maximum $maxInputLength characters allowed). Kripya apna sawal concise karke poochiye.',
      );
    }

    // 2. Malicious script injection detection
    if (RegExp(r'<\s*script[^>]*>', caseSensitive: false).hasMatch(trimmed) ||
        RegExp(r'javascript\s*:', caseSensitive: false).hasMatch(trimmed)) {
      return const SecurityCheckResult(
        isBlocked: true,
        blockReason: 'Script injection detected.',
        cannedResponse: 'Security Alert: Malformed content detected. Kripya academic pharmacy question plain text me poochiye.',
      );
    }

    // 3. API Key & System Prompt Extraction Detection
    for (final pattern in _leakPatterns) {
      if (pattern.hasMatch(trimmed)) {
        debugPrint('[AiSecurityGuard] Blocked credential/prompt extraction attempt: "$trimmed"');
        return const SecurityCheckResult(
          isBlocked: true,
          blockReason: 'Potential credential or system prompt extraction attempt.',
          cannedResponse:
              'Yeh PharmaCode ki proprietary security information hai aur ise share nahi kiya ja sakta.\n\n'
              'Main hoon aapka **PharmaCode AI Tutor** — main sirf aapke PCI B.Pharm syllabus, notes, exam questions aur pharmacy career guidance me madad karne ke liye designed hoon. Chaliye pharmacy ka koi topic discuss karte hain!',
        );
      }
    }

    return SecurityCheckResult.safe;
  }

  /// Scrub any accidental credential leaks from AI response text
  static String scrubOutput(String response) {
    if (response.isEmpty) return response;

    String scrubbed = response;
    for (final sig in _credentialSignatures) {
      scrubbed = scrubbed.replaceAll(sig, '[PROTECTED_CREDENTIAL]');
    }

    return scrubbed;
  }
}
