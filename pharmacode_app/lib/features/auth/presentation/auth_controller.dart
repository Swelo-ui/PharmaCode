import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/auth_repository.dart';
import '../domain/auth_state.dart';
import '../domain/user_entity.dart';

final authRepositoryProvider = Provider<AuthRepository>((ref) {
  return AuthRepository();
});

class AuthController extends StateNotifier<AuthState> {
  final AuthRepository _repository;

  AuthController(this._repository) : super(const AuthInitial()) {
    _init();
  }

  Future<void> _init() async {
    state = const AuthLoading();
    try {
      final user = await _repository.getCurrentUserEntity();
      if (user != null) {
        state = Authenticated(user);
      } else {
        state = const Unauthenticated();
      }
    } catch (e) {
      state = AuthError(e.toString());
    }
  }

  Future<bool> signInWithEmail({required String email, required String password}) async {
    state = const AuthLoading();
    try {
      final user = await _repository.signInWithEmail(email: email, password: password);
      state = Authenticated(user);
      return true;
    } catch (e) {
      state = AuthError(e.toString());
      return false;
    }
  }

  Future<bool> signUpWithEmail({
    required String email,
    required String password,
    required String name,
    required int semester,
  }) async {
    state = const AuthLoading();
    try {
      final user = await _repository.signUpWithEmail(
        email: email,
        password: password,
        name: name,
        semester: semester,
      );
      state = Authenticated(user);
      return true;
    } catch (e) {
      state = AuthError(e.toString());
      return false;
    }
  }

  Future<bool> signInWithGoogle() async {
    state = const AuthLoading();
    try {
      final user = await _repository.signInWithGoogle();
      if (user != null) {
        state = Authenticated(user);
        return true;
      } else {
        state = const Unauthenticated();
        return false;
      }
    } catch (e) {
      state = AuthError(e.toString());
      return false;
    }
  }

  Future<void> updateProfile({
    String? displayName,
    String? avatarKey,
    String? college,
    String? batch,
    int? semester,
  }) async {
    try {
      await _repository.updateProfile(
        displayName: displayName,
        avatarKey: avatarKey,
        college: college,
        batch: batch,
        semester: semester,
      );
      final updated = await _repository.getCurrentUserEntity();
      if (updated != null) {
        state = Authenticated(updated);
      }
    } catch (e) {
      state = AuthError(e.toString());
    }
  }

  Future<void> refreshUser() async {
    try {
      final user = await _repository.getCurrentUserEntity();
      if (user != null) {
        state = Authenticated(user);
      } else {
        state = const Unauthenticated();
      }
    } catch (e) {
      state = AuthError(e.toString());
    }
  }

  Future<void> sendPasswordResetEmail(String email) async {
    await _repository.sendPasswordResetEmail(email);
  }

  Future<void> signOut() async {
    await _repository.signOut();
    state = const Unauthenticated();
  }
}

final authControllerProvider = StateNotifierProvider<AuthController, AuthState>((ref) {
  return AuthController(ref.watch(authRepositoryProvider));
});

final currentUserProvider = Provider<UserEntity?>((ref) {
  final authState = ref.watch(authControllerProvider);
  return authState is Authenticated ? authState.user : null;
});

final isLoggedInProvider = Provider<bool>((ref) {
  return ref.watch(currentUserProvider) != null;
});
