import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/in_app_browser.dart';
import '../../core/theme.dart';
import '../../features/auth/domain/auth_state.dart';
import '../../features/auth/presentation/auth_controller.dart';
import '../../services/auth_service.dart';
import 'signup_screen.dart';

class LoginScreen extends ConsumerStatefulWidget {
  final VoidCallback? onLoginSuccess;

  const LoginScreen({super.key, this.onLoginSuccess});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailCtrl = TextEditingController();
  final _passwordCtrl = TextEditingController();

  bool _isLoading = false;
  bool _obscurePassword = true;
  String? _errorMessage;

  @override
  void dispose() {
    _emailCtrl.dispose();
    _passwordCtrl.dispose();
    super.dispose();
  }

  void _login() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final success = await ref.read(authControllerProvider.notifier).signInWithEmail(
        email: _emailCtrl.text,
        password: _passwordCtrl.text,
      );

      if (success && mounted) {
        final user = ref.read(currentUserProvider);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Welcome back, ${user?.displayName ?? "Student"}!', style: GoogleFonts.dmSans(fontWeight: FontWeight.w700)),
            backgroundColor: AppTheme.brandGreen,
            behavior: SnackBarBehavior.floating,
          ),
        );
        if (widget.onLoginSuccess != null) {
          widget.onLoginSuccess!();
        } else {
          Navigator.pop(context);
        }
      } else if (!success && mounted) {
        final authState = ref.read(authControllerProvider);
        setState(() {
          _errorMessage = authState is AuthError ? authState.message : 'Sign in failed. Please check your credentials.';
        });
      }
    } catch (e) {
      setState(() {
        _errorMessage = e.toString();
      });
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  void _loginWithGoogle() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final success = await ref.read(authControllerProvider.notifier).signInWithGoogle();
      if (success && mounted) {
        final user = ref.read(currentUserProvider);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Welcome, ${user?.displayName ?? "Student"}!', style: GoogleFonts.dmSans(fontWeight: FontWeight.w700)),
            backgroundColor: AppTheme.brandGreen,
            behavior: SnackBarBehavior.floating,
          ),
        );
        if (widget.onLoginSuccess != null) {
          widget.onLoginSuccess!();
        } else {
          Navigator.pop(context);
        }
      } else if (!success && mounted) {
        final authState = ref.read(authControllerProvider);
        if (authState is AuthError) {
          setState(() {
            _errorMessage = authState.message;
          });
        }
      }
    } catch (e) {
      setState(() {
        _errorMessage = e.toString();
      });
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  Widget _googleLogo() {
    return Container(
      width: 22,
      height: 22,
      decoration: const BoxDecoration(
        color: Colors.white,
        shape: BoxShape.circle,
      ),
      alignment: Alignment.center,
      child: Text(
        'G',
        style: GoogleFonts.dmSans(
          fontSize: 18,
          fontWeight: FontWeight.w900,
          color: const Color(0xFF4285F4),
        ),
      ),
    );
  }

  void _showForgotPasswordDialog() {
    final resetEmailCtrl = TextEditingController(text: _emailCtrl.text);
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
        title: Text('Reset Password', style: GoogleFonts.dmSans(fontWeight: FontWeight.w900, color: AppTheme.primaryNavy)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Enter your registered email address to receive password reset link.',
                style: GoogleFonts.dmSans(fontSize: 13, color: AppTheme.textMuted)),
            const SizedBox(height: 14),
            TextField(
              controller: resetEmailCtrl,
              keyboardType: TextInputType.emailAddress,
              decoration: const InputDecoration(
                hintText: 'student@example.com',
                prefixIcon: Icon(Icons.email_outlined, size: 20, color: AppTheme.textMuted),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: Text('Cancel', style: GoogleFonts.dmSans(fontWeight: FontWeight.w700, color: AppTheme.textMuted)),
          ),
          ElevatedButton(
            onPressed: () async {
              final email = resetEmailCtrl.text.trim();
              if (email.isEmpty || !email.contains('@')) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Please enter a valid email address')),
                );
                return;
              }
              Navigator.pop(ctx);
              try {
                await ref.read(authControllerProvider.notifier).sendPasswordResetEmail(email);
                if (mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text('Password reset link sent to $email', style: GoogleFonts.dmSans(fontWeight: FontWeight.w700)),
                      backgroundColor: AppTheme.brandTeal,
                      behavior: SnackBarBehavior.floating,
                    ),
                  );
                }
              } catch (e) {
                if (mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text(e.toString()), backgroundColor: AppTheme.brandRed),
                  );
                }
              }
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppTheme.primaryNavy,
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
            child: Text('Send Link', style: GoogleFonts.dmSans(fontWeight: FontWeight.w700)),
          ),
        ],
      ),
    );
  }

  void _showSha1HelperDialog() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: const Color(0xFFFEF3C7),
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(Icons.key_rounded, color: Color(0xFFD97706), size: 22),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Text(
                'Google Sign-In SHA-1 Setup',
                style: GoogleFonts.dmSans(
                  fontWeight: FontWeight.w900,
                  fontSize: 16,
                  color: AppTheme.primaryNavy,
                ),
              ),
            ),
          ],
        ),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Google Play Services requires your app\'s signing SHA-1 fingerprint in Firebase Console:',
                style: GoogleFonts.dmSans(fontSize: 13, color: AppTheme.textBody, height: 1.4),
              ),
              const SizedBox(height: 14),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xFFF3F4F6),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: const Color(0xFFE5E7EB)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('SHA-1 Fingerprint:',
                            style: GoogleFonts.dmSans(fontWeight: FontWeight.w800, fontSize: 11, color: AppTheme.primaryNavy)),
                        InkWell(
                          onTap: () {
                            Clipboard.setData(ClipboardData(text: AuthService.debugSha1));
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('SHA-1 copied to clipboard!'), duration: Duration(seconds: 2)),
                            );
                          },
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                            decoration: BoxDecoration(
                              color: AppTheme.brandBlue,
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                const Icon(Icons.copy_rounded, color: Colors.white, size: 12),
                                const SizedBox(width: 4),
                                Text('Copy', style: GoogleFonts.dmSans(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w700)),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    SelectableText(
                      AuthService.debugSha1,
                      style: const TextStyle(fontFamily: 'monospace', fontSize: 11, color: Color(0xFF1F2937), fontWeight: FontWeight.w600),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 10),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xFFF3F4F6),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: const Color(0xFFE5E7EB)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('SHA-256 Fingerprint:',
                            style: GoogleFonts.dmSans(fontWeight: FontWeight.w800, fontSize: 11, color: AppTheme.primaryNavy)),
                        InkWell(
                          onTap: () {
                            Clipboard.setData(ClipboardData(text: AuthService.debugSha256));
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('SHA-256 copied to clipboard!'), duration: Duration(seconds: 2)),
                            );
                          },
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                            decoration: BoxDecoration(
                              color: AppTheme.brandBlue,
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                const Icon(Icons.copy_rounded, color: Colors.white, size: 12),
                                const SizedBox(width: 4),
                                Text('Copy', style: GoogleFonts.dmSans(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w700)),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    SelectableText(
                      AuthService.debugSha256,
                      style: const TextStyle(fontFamily: 'monospace', fontSize: 10, color: Color(0xFF1F2937), fontWeight: FontWeight.w600),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 14),
              Text('How to fix in 1 minute:', style: GoogleFonts.dmSans(fontWeight: FontWeight.w800, fontSize: 12, color: AppTheme.primaryNavy)),
              const SizedBox(height: 4),
              Text('1. Open Firebase Console -> Project Settings (⚙️)\n2. Select "com.pharmacode.bpharm" app\n3. Click "Add fingerprint" & paste the SHA-1\n4. Download new google-services.json',
                  style: GoogleFonts.dmSans(fontSize: 11.5, color: AppTheme.textMuted, height: 1.45)),
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: const Color(0xFFECFDF5),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: const Color(0xFFA7F3D0)),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.check_circle_outline_rounded, color: Color(0xFF059669), size: 18),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'Email & Password login is already active! You can sign in with your email right now.',
                        style: GoogleFonts.dmSans(color: const Color(0xFF065F46), fontSize: 11.5, fontWeight: FontWeight.w600),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: Text('Close', style: GoogleFonts.dmSans(fontWeight: FontWeight.w700, color: AppTheme.textMuted)),
          ),
          ElevatedButton.icon(
            onPressed: () {
              const url = 'https://console.firebase.google.com/project/pharmacode-f95c9/settings/general';
              openInAppUrl(context, url);
            },
            icon: const Icon(Icons.open_in_browser_rounded, size: 16),
            label: Text('Open Firebase Console', style: GoogleFonts.dmSans(fontWeight: FontWeight.w700, fontSize: 12)),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppTheme.primaryNavy,
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text(
              'Skip / Guest',
              style: GoogleFonts.dmSans(
                color: AppTheme.brandBlue,
                fontWeight: FontWeight.w800,
                fontSize: 13,
              ),
            ),
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            physics: const BouncingScrollPhysics(),
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Logo & Brand
                  Center(
                    child: Column(
                      children: [
                        Container(
                          width: 68,
                          height: 68,
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(18),
                            boxShadow: [
                              BoxShadow(
                                color: AppTheme.brandBlue.withValues(alpha: 0.2),
                                blurRadius: 20,
                                offset: const Offset(0, 6),
                              ),
                            ],
                          ),
                          padding: const EdgeInsets.all(6),
                          child: ClipRRect(
                            borderRadius: BorderRadius.circular(12),
                            child: Image.asset(
                              'assets/images/app_icon.png',
                              fit: BoxFit.contain,
                              filterQuality: FilterQuality.high,
                            ),
                          ),
                        ),
                        const SizedBox(height: 14),
                        RichText(
                          text: TextSpan(
                            children: [
                              TextSpan(
                                text: 'Pharma',
                                style: GoogleFonts.dmSans(
                                  color: AppTheme.primaryNavy,
                                  fontSize: 26,
                                  fontWeight: FontWeight.w900,
                                  letterSpacing: -0.5,
                                ),
                              ),
                              TextSpan(
                                text: 'Code',
                                style: GoogleFonts.dmSans(
                                  color: AppTheme.brandBlue,
                                  fontSize: 26,
                                  fontWeight: FontWeight.w900,
                                  letterSpacing: -0.5,
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Student Portal · B.Pharm NEP 2020',
                          style: GoogleFonts.dmSans(
                            color: AppTheme.textMuted,
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 32),

                  Text(
                    'Sign In to Your Account',
                    style: GoogleFonts.dmSans(
                      color: AppTheme.primaryNavy,
                      fontSize: 20,
                      fontWeight: FontWeight.w900,
                      letterSpacing: -0.3,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'Access your customized syllabus bookmarks and study alerts.',
                    style: GoogleFonts.dmSans(color: AppTheme.textMuted, fontSize: 13),
                  ),

                  const SizedBox(height: 24),

                  if (_errorMessage != null) ...[
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: const Color(0xFFFEF2F2),
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: const Color(0xFFFCA5A5), width: 1.5),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              const Icon(Icons.error_outline_rounded, color: Color(0xFFDC2626), size: 20),
                              const SizedBox(width: 8),
                              Expanded(
                                child: Text(
                                  _errorMessage!.contains('SHA1') || _errorMessage!.contains('SHA-1') || _errorMessage!.contains('10')
                                      ? 'Google Sign-In: SHA-1 Setup Needed'
                                      : 'Sign In Notice',
                                  style: GoogleFonts.dmSans(color: const Color(0xFF991B1B), fontSize: 13, fontWeight: FontWeight.w900),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 6),
                          Text(
                            _errorMessage!,
                            style: GoogleFonts.dmSans(color: const Color(0xFF7F1D1D), fontSize: 12, height: 1.4),
                          ),
                          if (_errorMessage!.contains('SHA1') || _errorMessage!.contains('SHA-1') || _errorMessage!.contains('10')) ...[
                            const SizedBox(height: 10),
                            SizedBox(
                              width: double.infinity,
                              child: OutlinedButton.icon(
                                onPressed: _showSha1HelperDialog,
                                icon: const Icon(Icons.copy_rounded, size: 14),
                                label: Text(
                                  'Fix SHA-1 Keys & Instructions',
                                  style: GoogleFonts.dmSans(fontWeight: FontWeight.w800, fontSize: 12),
                                ),
                                style: OutlinedButton.styleFrom(
                                  foregroundColor: const Color(0xFF991B1B),
                                  side: const BorderSide(color: Color(0xFFDC2626)),
                                  padding: const EdgeInsets.symmetric(vertical: 8),
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                                ),
                              ),
                            ),
                          ],
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),
                  ],

                  // Google Sign-In Button
                  SizedBox(
                    width: double.infinity,
                    height: 50,
                    child: OutlinedButton(
                      onPressed: _isLoading ? null : _loginWithGoogle,
                      style: OutlinedButton.styleFrom(
                        backgroundColor: Colors.white,
                        side: const BorderSide(color: Color(0xFFD1D5DB), width: 1.5),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          _googleLogo(),
                          const SizedBox(width: 10),
                          Text(
                            'Continue with Google',
                            style: GoogleFonts.dmSans(
                              fontSize: 14,
                              fontWeight: FontWeight.w800,
                              color: AppTheme.textDark,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 18),

                  // Divider OR
                  Row(
                    children: [
                      const Expanded(child: Divider(color: AppTheme.borderSoft)),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 14),
                        child: Text(
                          'OR SIGN IN WITH EMAIL',
                          style: GoogleFonts.dmSans(
                            color: AppTheme.textMuted,
                            fontSize: 10,
                            fontWeight: FontWeight.w800,
                            letterSpacing: 0.8,
                          ),
                        ),
                      ),
                      const Expanded(child: Divider(color: AppTheme.borderSoft)),
                    ],
                  ),

                  const SizedBox(height: 18),

                  // Email Field
                  Text(
                    'Email Address',
                    style: GoogleFonts.dmSans(fontSize: 13, fontWeight: FontWeight.w800, color: AppTheme.textDark),
                  ),
                  const SizedBox(height: 6),
                  TextFormField(
                    controller: _emailCtrl,
                    keyboardType: TextInputType.emailAddress,
                    decoration: const InputDecoration(
                      hintText: 'e.g. rahul.sharma@gmail.com',
                      prefixIcon: Icon(Icons.email_outlined, color: AppTheme.textMuted, size: 20),
                    ),
                    validator: (value) {
                      if (value == null || value.trim().isEmpty) {
                        return 'Please enter your email';
                      }
                      if (!value.contains('@') || !value.contains('.')) {
                        return 'Please enter a valid email address';
                      }
                      return null;
                    },
                  ),

                  const SizedBox(height: 18),

                  // Password Field
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Password',
                        style: GoogleFonts.dmSans(fontSize: 13, fontWeight: FontWeight.w800, color: AppTheme.textDark),
                      ),
                      GestureDetector(
                        onTap: _showForgotPasswordDialog,
                        child: Text(
                          'Forgot Password?',
                          style: GoogleFonts.dmSans(fontSize: 12, fontWeight: FontWeight.w800, color: AppTheme.brandBlue),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  TextFormField(
                    controller: _passwordCtrl,
                    obscureText: _obscurePassword,
                    decoration: InputDecoration(
                      hintText: '••••••••',
                      prefixIcon: const Icon(Icons.lock_outline_rounded, color: AppTheme.textMuted, size: 20),
                      suffixIcon: IconButton(
                        icon: Icon(
                          _obscurePassword ? Icons.visibility_off_outlined : Icons.visibility_outlined,
                          color: AppTheme.textMuted,
                          size: 20,
                        ),
                        onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
                      ),
                    ),
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter your password';
                      }
                      if (value.length < 6) {
                        return 'Password must be at least 6 characters';
                      }
                      return null;
                    },
                  ),

                  const SizedBox(height: 28),

                  // Sign In Button
                  SizedBox(
                    width: double.infinity,
                    height: 52,
                    child: ElevatedButton(
                      onPressed: _isLoading ? null : _login,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.primaryNavy,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      ),
                      child: _isLoading
                          ? const SizedBox(
                              width: 22,
                              height: 22,
                              child: CircularProgressIndicator(strokeWidth: 2.5, color: Colors.white),
                            )
                          : Text(
                              'Sign In',
                              style: GoogleFonts.dmSans(fontSize: 15, fontWeight: FontWeight.w900, color: Colors.white),
                            ),
                    ),
                  ),

                  const SizedBox(height: 20),

                  // Continue as Guest Button
                  SizedBox(
                    width: double.infinity,
                    height: 48,
                    child: OutlinedButton.icon(
                      onPressed: () => Navigator.pop(context),
                      icon: const Icon(Icons.person_outline_rounded, size: 18, color: AppTheme.textMuted),
                      label: Text(
                        'Continue as Guest Student',
                        style: GoogleFonts.dmSans(fontSize: 13, fontWeight: FontWeight.w800, color: AppTheme.textDark),
                      ),
                      style: OutlinedButton.styleFrom(
                        side: const BorderSide(color: AppTheme.borderSoft, width: 1.5),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      ),
                    ),
                  ),

                  const SizedBox(height: 28),

                  // Navigate to Sign Up
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        "Don't have an account? ",
                        style: GoogleFonts.dmSans(color: AppTheme.textMuted, fontSize: 13),
                      ),
                      GestureDetector(
                        onTap: () {
                          Navigator.pushReplacement(
                            context,
                            MaterialPageRoute(
                              builder: (_) => SignUpScreen(onSignUpSuccess: widget.onLoginSuccess),
                            ),
                          );
                        },
                        child: Text(
                          'Sign Up',
                          style: GoogleFonts.dmSans(
                            color: AppTheme.brandBlue,
                            fontWeight: FontWeight.w900,
                            fontSize: 13,
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
      ),
    );
  }
}
