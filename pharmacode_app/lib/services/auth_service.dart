import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AuthService {
  static final AuthService _instance = AuthService._internal();
  factory AuthService() => _instance;
  AuthService._internal();

  /// SHA fingerprints extracted from app signing keystore
  static const String appPackageName = 'com.pharmacode.bpharm';
  static const String debugSha1 = '96:81:77:58:CE:7C:F2:81:C4:BF:23:42:F2:27:DB:2C:81:CD:BC:7A';
  static const String debugSha256 = '90:33:A4:C5:35:AF:6F:A8:82:9C:05:0D:CB:E8:E5:A0:C9:A8:10:86:E9:3E:2F:80:40:32:EA:E0:57:C4:C7:51';
  static const String webClientId = '1072247356262-g5ftdn1lh52uell7kfdhgo7ud1o59pll.apps.googleusercontent.com';

  final FirebaseAuth _auth = FirebaseAuth.instance;
  final GoogleSignIn _googleSignIn = GoogleSignIn(
    serverClientId: webClientId,
  );

  User? get currentUser => _auth.currentUser;
  bool get isLoggedIn => _auth.currentUser != null;
  Stream<User?> get authStateChanges => _auth.authStateChanges();

  String get displayName => _auth.currentUser?.displayName ?? 'Student';
  String get email => _auth.currentUser?.email ?? '';
  String get photoUrl => _auth.currentUser?.photoURL ?? '';

  /// Update user's display name
  Future<void> updateDisplayName(String name) async {
    final trimmed = name.trim();
    if (trimmed.isEmpty) return;
    await _auth.currentUser?.updateDisplayName(trimmed);
    await _auth.currentUser?.reload();
  }

  /// Update user's photo URL
  Future<void> updatePhotoURL(String photoUrl) async {
    await _auth.currentUser?.updatePhotoURL(photoUrl);
    await _auth.currentUser?.reload();
  }

  /// User Avatar key (e.g. 'mascot', 'scholar', 'pharmacist', 'scientist', 'doctor', 'tech', 'topper', 'biotech')
  Future<String> getUserAvatar() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('user_avatar') ?? 'mascot';
  }

  Future<void> setUserAvatar(String avatarKey) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('user_avatar', avatarKey);
  }

  /// User College / University
  Future<String> getUserCollege() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('user_college') ?? '';
  }

  Future<void> setUserCollege(String college) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('user_college', college.trim());
  }

  /// User Batch
  Future<String> getUserBatch() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('user_batch') ?? 'Batch 2024–28';
  }

  Future<void> setUserBatch(String batch) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('user_batch', batch.trim());
  }

  Future<int> getUserSemester() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getInt('user_semester') ?? 1;
  }

  Future<void> setUserSemester(int sem) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setInt('user_semester', sem);
  }

  /// Sign Up with Email and Password
  Future<UserCredential> signUpWithEmail({
    required String email,
    required String password,
    required String name,
    required int semester,
  }) async {
    try {
      final credential = await _auth.createUserWithEmailAndPassword(
        email: email.trim(),
        password: password,
      );

      if (credential.user != null) {
        await credential.user!.updateDisplayName(name.trim());
        await setUserSemester(semester);
      }

      return credential;
    } on FirebaseAuthException catch (e) {
      throw _handleAuthException(e);
    } catch (e) {
      throw 'An error occurred during registration: $e';
    }
  }

  /// Sign In with Email and Password
  Future<UserCredential> signInWithEmail({
    required String email,
    required String password,
  }) async {
    try {
      final credential = await _auth.signInWithEmailAndPassword(
        email: email.trim(),
        password: password,
      );
      return credential;
    } on FirebaseAuthException catch (e) {
      throw _handleAuthException(e);
    } catch (e) {
      throw 'An error occurred during login: $e';
    }
  }

  /// Sign In with Google
  Future<UserCredential?> signInWithGoogle() async {
    try {
      final GoogleSignInAccount? googleUser = await _googleSignIn.signIn();
      if (googleUser == null) return null; // Cancelled by user

      final GoogleSignInAuthentication googleAuth = await googleUser.authentication;
      final AuthCredential credential = GoogleAuthProvider.credential(
        accessToken: googleAuth.accessToken,
        idToken: googleAuth.idToken,
      );

      return await _auth.signInWithCredential(credential);
    } on PlatformException catch (e) {
      // Error code 10 = DEVELOPER_ERROR (SHA-1 fingerprint not added in Firebase Console)
      if (e.code == 'sign_in_failed' || e.message?.contains('10') == true || e.toString().contains('10')) {
        throw 'SHA1_CONFIG_REQUIRED: Firebase Console me SHA-1 fingerprint add karna hoga. (Neeche diye "Fix SHA-1" par tap karein ya Email se Sign In karein).';
      }
      throw 'Google Sign-In failed (${e.code}): ${e.message ?? 'Unknown error'}';
    } on FirebaseAuthException catch (e) {
      throw _handleAuthException(e);
    } catch (e) {
      final str = e.toString();
      if (str.contains('10') || str.contains('sign_in_failed')) {
        throw 'SHA1_CONFIG_REQUIRED: Firebase Console me SHA-1 fingerprint add karna hoga. (Neeche diye "Fix SHA-1" par tap karein ya Email se Sign In karein).';
      }
      throw 'Google Sign-In could not complete: $e';
    }
  }

  /// Send Password Reset Email
  Future<void> sendPasswordReset(String email) async {
    try {
      await _auth.sendPasswordResetEmail(email: email.trim());
    } on FirebaseAuthException catch (e) {
      throw _handleAuthException(e);
    } catch (e) {
      throw 'Could not send password reset email: $e';
    }
  }

  /// Sign Out
  Future<void> signOut() async {
    try {
      await Future.wait([
        _auth.signOut(),
        _googleSignIn.signOut(),
      ]);
    } catch (e) {
      debugPrint('Error signing out: $e');
    }
  }

  /// Clean user-friendly error messages
  String _handleAuthException(FirebaseAuthException e) {
    switch (e.code) {
      case 'user-not-found':
        return 'No account found with this email address.';
      case 'wrong-password':
      case 'invalid-credential':
        return 'Incorrect password. Please try again or reset your password.';
      case 'email-already-in-use':
        return 'An account already exists with this email address. Please login.';
      case 'invalid-email':
        return 'The email address is formatted incorrectly.';
      case 'weak-password':
        return 'Password is too weak. Please use at least 6 characters.';
      case 'network-request-failed':
        return 'Network connection failed. Please check your internet.';
      case 'too-many-requests':
        return 'Too many failed attempts. Please wait a few moments and try again.';
      default:
        return e.message ?? 'Authentication failed. Please try again.';
    }
  }
}
