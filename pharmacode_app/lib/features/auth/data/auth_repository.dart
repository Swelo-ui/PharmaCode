import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/foundation.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../../core/security/secure_storage.dart';
import '../domain/user_entity.dart';

class AuthRepository {
  static const String webClientId = '1072247356262-g5ftdn1lh52uell7kfdhgo7ud1o59pll.apps.googleusercontent.com';

  final FirebaseAuth _firebaseAuth;
  final GoogleSignIn _googleSignIn;
  final SecureStorageService _secureStorage;

  AuthRepository({
    FirebaseAuth? firebaseAuth,
    GoogleSignIn? googleSignIn,
    SecureStorageService? secureStorage,
  })  : _firebaseAuth = firebaseAuth ?? FirebaseAuth.instance,
        _googleSignIn = googleSignIn ?? GoogleSignIn(serverClientId: webClientId),
        _secureStorage = secureStorage ?? SecureStorageService();

  Stream<User?> get authStateChanges => _firebaseAuth.authStateChanges();

  User? get currentFirebaseUser => _firebaseAuth.currentUser;

  Future<UserEntity?> getCurrentUserEntity() async {
    final user = _firebaseAuth.currentUser;
    if (user == null) return null;

    final prefs = await SharedPreferences.getInstance();
    final avatar = prefs.getString('user_avatar') ?? 'mascot';
    final college = prefs.getString('user_college') ?? '';
    final batch = prefs.getString('user_batch') ?? 'Batch 2024–28';
    final semester = prefs.getInt('user_semester') ?? 1;

    return UserEntity(
      uid: user.uid,
      email: user.email ?? '',
      displayName: user.displayName ?? 'Student',
      photoUrl: user.photoURL ?? '',
      avatarKey: avatar,
      college: college,
      batch: batch,
      semester: semester,
      isEmailVerified: user.emailVerified,
    );
  }

  Future<UserEntity> signInWithEmail({
    required String email,
    required String password,
  }) async {
    final cred = await _firebaseAuth.signInWithEmailAndPassword(
      email: email.trim(),
      password: password,
    );
    final user = cred.user!;
    await _secureStorage.saveUserSession(uid: user.uid, email: user.email ?? '');
    final entity = await getCurrentUserEntity();
    return entity!;
  }

  Future<UserEntity> signUpWithEmail({
    required String email,
    required String password,
    required String name,
    required int semester,
  }) async {
    final cred = await _firebaseAuth.createUserWithEmailAndPassword(
      email: email.trim(),
      password: password,
    );
    final user = cred.user!;
    await user.updateDisplayName(name.trim());
    await user.reload();

    final prefs = await SharedPreferences.getInstance();
    await prefs.setInt('user_semester', semester);
    await _secureStorage.saveUserSession(uid: user.uid, email: user.email ?? '');

    final entity = await getCurrentUserEntity();
    return entity!;
  }

  Future<UserEntity?> signInWithGoogle() async {
    try {
      final googleUser = await _googleSignIn.signIn();
      if (googleUser == null) return null; // Cancelled

      final googleAuth = await googleUser.authentication;
      final credential = GoogleAuthProvider.credential(
        accessToken: googleAuth.accessToken,
        idToken: googleAuth.idToken,
      );

      final cred = await _firebaseAuth.signInWithCredential(credential);
      final user = cred.user!;
      await _secureStorage.saveUserSession(uid: user.uid, email: user.email ?? '');

      return await getCurrentUserEntity();
    } catch (e) {
      debugPrint('Google Sign In Error: $e');
      final errorStr = e.toString();
      if (errorStr.contains('ApiException: 10') || errorStr.contains('sign_in_failed')) {
        throw Exception(
          'Google Sign-In SHA-1 missing in Firebase Console (ApiException: 10). Please tap "Fix SHA-1 Keys" to copy Release SHA-1 and add it to Firebase Console.',
        );
      }
      rethrow;
    }
  }

  Future<void> sendPasswordResetEmail(String email) async {
    await _firebaseAuth.sendPasswordResetEmail(email: email.trim());
  }

  Future<void> updateProfile({
    String? displayName,
    String? avatarKey,
    String? college,
    String? batch,
    int? semester,
  }) async {
    final user = _firebaseAuth.currentUser;
    if (displayName != null && displayName.trim().isNotEmpty) {
      await user?.updateDisplayName(displayName.trim());
      await user?.reload();
    }

    final prefs = await SharedPreferences.getInstance();
    if (avatarKey != null) await prefs.setString('user_avatar', avatarKey);
    if (college != null) await prefs.setString('user_college', college.trim());
    if (batch != null) await prefs.setString('user_batch', batch.trim());
    if (semester != null) await prefs.setInt('user_semester', semester);
  }

  Future<void> signOut() async {
    await _googleSignIn.signOut();
    await _firebaseAuth.signOut();
    await _secureStorage.clearAll();
  }
}
