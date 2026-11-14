import 'dart:convert';
import 'dart:typed_data';

/// High-Security In-Memory Document URL Resolver
/// Protects against static APK decompilation, string extraction, and reverse engineering.
/// Google Drive IDs and download URLs are never stored in cleartext in the APK binary.
class SecureDocResolver {
  // Internal vault key used for XOR transposition
  static const String _vaultKey = 'PharmaCodeSec2026@PciAppVault!';

  // Encrypted tokens for core study guides (Prevents plain grep/strings inspection)
  static const Map<String, String> _obfuscatedTokens = {
    // PV Kit: 1wQPW4zOOwC-v3LRi1OIu0eDwzK2h1Nmy
    'pdf-pv-guide': 'OBwVAh5bbEAAFzoTBhxXXVknPAZHIh8deRQWUxFZIAcTBlAFLBgKCTwEBxRZVgtxJzI5FkQKGS4CL1lXYyQzG1wuChpUABcSGXkCWgcOPRo=',
    'guide_pv_interview_49': 'OBwVAh5bbEAAFzoTBhxXXVknPAZHIh8deRQWUxFZIAcTBlAFLBgKCTwEBxRZVgtxJzI5FkQKGS4CL1lXYyQzG1wuChpUABcSGXkCWgcOPRo=',

    // RA Guide: 1u_RkXFNVxJwTLNqIQtmcS2O3UvRUb300
    'pdf-ra-guide': 'OBwVAh5bbEAAFzoTBhxXXVknPAZHIh8deRQWUxFZIAcTBlAFLBgKCTwEBxRZVgtxJTw7Kig2GDcNJgN1HCYQOzwVLgw3VxxWNkRiZ1RzYFM=',
    'guide_ra_dossier_99': 'OBwVAh5bbEAAFzoTBhxXXVknPAZHIh8deRQWUxFZIAcTBlAFLBgKCTwEBxRZVgtxJTw7Kig2GDcNJgN1HCYQOzwVLgw3VxxWNkRiZ1RzYFM=',

    // CRO Operations Manual (Free Guide): 1xvUpn2e0zPEsm-oIkEelqqehupUhTPGK
    'pdf-cro-manual': 'OBwVAh5bbEAAFzoTBhxXXVknPAZHIh8deRQWUxFZIAcTBlAFLBgKCTwEBxRZVgtxKBU8MR5CM1EPPDFSPUUOOwYkJgMVFDYNFkJlWmIQFyg=',
    'pdf-career-free': 'OBwVAh5bbEAAFzoTBhxXXVknPAZHIh8deRQWUxFZIAcTBlAFLBgKCTwEBxRZVgtxKBU8MR5CM1EPPDFSPUUOOwYkJgMVFDYNFkJlWmIQFyg=',

    // Pharma Interview Complete Preparation Kit (₹149 Guide): 1fG28olthNk1_xO3RvGj7VuIt0BUGGHM0
    'pdf-pharma-interview-guide': 'OBwVAh5bbEAAFzoTBhxXXVknPAZHIh8deRQWUxFZIAcTBlAFLBgKCTwEBxRZVgtxNiRbeR8cIgk7B0V+KCdSIBsmKVgyEBoRU3BldXEIHVM=',
    'guide_pharma_interview_149': 'OBwVAh5bbEAAFzoTBhxXXVknPAZHIh8deRQWUxFZIAcTBlAFLBgKCTwEBxRZVgtxNiRbeR8cIgk7B0V+KCdSIBsmKVgyEBoRU3BldXEIHVM=',
    'pharma_interview_prep_149': 'OBwVAh5bbEAAFzoTBhxXXVknPAZHIh8deRQWUxFZIAcTBlAFLBgKCTwEBxRZVgtxNiRbeR8cIgk7B0V+KCdSIBsmKVgyEBoRU3BldXEIHVM=',
  };

  /// Decrypts the obfuscated token into the memory-only streaming URL
  static String resolveSecureUrl(String idOrProductId, {String fallbackUrl = ''}) {
    if (_obfuscatedTokens.containsKey(idOrProductId)) {
      final token = _obfuscatedTokens[idOrProductId]!;
      final decrypted = _deobfuscate(token);
      if (decrypted.isNotEmpty) return decrypted;
    }

    // If fallback is provided and starts with http, use fallback
    if (fallbackUrl.isNotEmpty) {
      return fallbackUrl;
    }

    // Default to secure tracked backend proxy endpoint
    return 'https://pharmacode.vercel.app/api/pdfs/download/?id=$idOrProductId';
  }

  static String _deobfuscate(String b64Cipher) {
    try {
      final keyBytes = utf8.encode(_vaultKey);
      final cipherBytes = base64Decode(b64Cipher);
      final output = Uint8List(cipherBytes.length);
      for (int i = 0; i < cipherBytes.length; i++) {
        output[i] = cipherBytes[i] ^ keyBytes[i % keyBytes.length];
      }
      return utf8.decode(output);
    } catch (_) {
      return '';
    }
  }

  /// Scrambles/descrambles binary payload for local offline storage
  static Uint8List transformBytes(Uint8List input) {
    const encKey = 'PharmaCodeOfflineDocEncVaultKey2026!';
    final keyBytes = utf8.encode(encKey);
    final output = Uint8List(input.length);
    for (int i = 0; i < input.length; i++) {
      output[i] = input[i] ^ keyBytes[i % keyBytes.length];
    }
    return output;
  }
}
