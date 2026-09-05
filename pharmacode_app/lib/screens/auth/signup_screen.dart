import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/in_app_browser.dart';
import '../../core/theme.dart';
import '../../features/auth/domain/auth_state.dart';
import '../../features/auth/presentation/auth_controller.dart';
import '../main_navigation_screen.dart';
import 'login_screen.dart';

class SignUpScreen extends ConsumerStatefulWidget {
  final VoidCallback? onSignUpSuccess;

  const SignUpScreen({super.key, this.onSignUpSuccess});

  @override
  ConsumerState<SignUpScreen> createState() => _SignUpScreenState();
}

class _SignUpScreenState extends ConsumerState<SignUpScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameCtrl = TextEditingController();
  final _emailCtrl = TextEditingController();
  final _passwordCtrl = TextEditingController();

  int _selectedSemester = 1;
  bool _isLoading = false;
  bool _obscurePassword = true;
  String? _errorMessage;

  @override
  void dispose() {
    _nameCtrl.dispose();
    _emailCtrl.dispose();
    _passwordCtrl.dispose();
    super.dispose();
  }

  void _signup() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final success = await ref.read(authControllerProvider.notifier).signUpWithEmail(
        name: _nameCtrl.text,
        email: _emailCtrl.text,
        password: _passwordCtrl.text,
        semester: _selectedSemester,
      );

      if (success && mounted) {
        final user = ref.read(currentUserProvider);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Account created successfully! Welcome, ${user?.displayName ?? _nameCtrl.text.trim()}!',
                style: GoogleFonts.dmSans(fontWeight: FontWeight.w700)),
            backgroundColor: AppTheme.brandGreen,
            behavior: SnackBarBehavior.floating,
          ),
        );
        if (widget.onSignUpSuccess != null) {
          widget.onSignUpSuccess!();
        }
        Navigator.of(context).pushAndRemoveUntil(
          MaterialPageRoute(builder: (_) => const MainNavigationScreen()),
          (route) => false,
        );
      } else if (!success && mounted) {
        final authState = ref.read(authControllerProvider);
        setState(() {
          _errorMessage = authState is AuthError ? authState.message : 'Sign up failed. Please try again.';
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

  void _signUpWithGoogle() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final success = await ref.read(authControllerProvider.notifier).signInWithGoogle();
      if (success && mounted) {
        await ref.read(authControllerProvider.notifier).updateProfile(semester: _selectedSemester);
        if (!mounted) return;
        final user = ref.read(currentUserProvider);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Account created! Welcome, ${user?.displayName ?? "Student"}!', style: GoogleFonts.dmSans(fontWeight: FontWeight.w700)),
            backgroundColor: AppTheme.brandGreen,
            behavior: SnackBarBehavior.floating,
          ),
        );
        if (widget.onSignUpSuccess != null) {
          widget.onSignUpSuccess!();
        }
        Navigator.of(context).pushAndRemoveUntil(
          MaterialPageRoute(builder: (_) => const MainNavigationScreen()),
          (route) => false,
        );
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
        final msg = e.toString();
        _errorMessage = msg.startsWith('Exception: ') ? msg.substring(11) : msg;
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


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          TextButton(
            onPressed: () {
              Navigator.of(context).pushAndRemoveUntil(
                MaterialPageRoute(builder: (_) => const MainNavigationScreen()),
                (route) => false,
              );
            },
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
                  Text(
                    'Create Student Account',
                    style: GoogleFonts.dmSans(
                      color: AppTheme.primaryNavy,
                      fontSize: 22,
                      fontWeight: FontWeight.w900,
                      letterSpacing: -0.3,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'Join thousands of B.Pharm students using PharmaCode for NEP 2020 syllabus.',
                    style: GoogleFonts.dmSans(color: AppTheme.textMuted, fontSize: 13),
                  ),

                  const SizedBox(height: 24),

                  if (_errorMessage != null) ...[
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                      decoration: BoxDecoration(
                        color: const Color(0xFFFEF2F2),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: const Color(0xFFFCA5A5), width: 1.2),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.info_outline_rounded, color: Color(0xFFDC2626), size: 18),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Text(
                              _errorMessage!,
                              style: GoogleFonts.dmSans(
                                color: const Color(0xFF991B1B),
                                fontSize: 12.5,
                                fontWeight: FontWeight.w600,
                                height: 1.3,
                              ),
                            ),
                          ),
                          InkWell(
                            onTap: () => setState(() => _errorMessage = null),
                            child: const Padding(
                              padding: EdgeInsets.all(4),
                              child: Icon(Icons.close_rounded, color: Color(0xFF991B1B), size: 16),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),
                  ],

                  // Google Sign-Up Button
                  SizedBox(
                    width: double.infinity,
                    height: 50,
                    child: OutlinedButton(
                      onPressed: _isLoading ? null : _signUpWithGoogle,
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
                            'Sign Up with Google',
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
                          'OR REGISTER WITH EMAIL',
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

                  // Full Name Field
                  Text(
                    'Full Name',
                    style: GoogleFonts.dmSans(fontSize: 13, fontWeight: FontWeight.w800, color: AppTheme.textDark),
                  ),
                  const SizedBox(height: 6),
                  TextFormField(
                    controller: _nameCtrl,
                    keyboardType: TextInputType.name,
                    decoration: const InputDecoration(
                      hintText: 'e.g. Rahul Sharma',
                      prefixIcon: Icon(Icons.person_outline_rounded, color: AppTheme.textMuted, size: 20),
                    ),
                    validator: (value) {
                      if (value == null || value.trim().isEmpty) {
                        return 'Please enter your name';
                      }
                      return null;
                    },
                  ),

                  const SizedBox(height: 18),

                  // Current Semester Dropdown
                  Text(
                    'Current Semester',
                    style: GoogleFonts.dmSans(fontSize: 13, fontWeight: FontWeight.w800, color: AppTheme.textDark),
                  ),
                  const SizedBox(height: 6),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF4F7FB),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: AppTheme.borderSoft, width: 1.5),
                    ),
                    child: DropdownButtonHideUnderline(
                      child: DropdownButton<int>(
                        value: _selectedSemester,
                        isExpanded: true,
                        icon: const Icon(Icons.keyboard_arrow_down_rounded, color: AppTheme.textMuted),
                        items: List.generate(8, (i) {
                          final sem = i + 1;
                          final color = AppTheme.getSemesterColor(sem);
                          return DropdownMenuItem<int>(
                            value: sem,
                            child: Row(
                              children: [
                                Container(
                                  width: 22,
                                  height: 22,
                                  decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(6)),
                                  alignment: Alignment.center,
                                  child: Text('$sem', style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold)),
                                ),
                                const SizedBox(width: 10),
                                Text('Semester $sem', style: GoogleFonts.dmSans(fontWeight: FontWeight.w700, fontSize: 13)),
                              ],
                            ),
                          );
                        }),
                        onChanged: (val) {
                          if (val != null) setState(() => _selectedSemester = val);
                        },
                      ),
                    ),
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
                  Text(
                    'Password',
                    style: GoogleFonts.dmSans(fontSize: 13, fontWeight: FontWeight.w800, color: AppTheme.textDark),
                  ),
                  const SizedBox(height: 6),
                  TextFormField(
                    controller: _passwordCtrl,
                    obscureText: _obscurePassword,
                    decoration: InputDecoration(
                      hintText: 'At least 6 characters',
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
                        return 'Please create a password';
                      }
                      if (value.length < 6) {
                        return 'Password must be at least 6 characters';
                      }
                      return null;
                    },
                  ),

                  const SizedBox(height: 28),

                  // Sign Up Button
                  SizedBox(
                    width: double.infinity,
                    height: 52,
                    child: ElevatedButton(
                      onPressed: _isLoading ? null : _signup,
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
                              'Create Account',
                              style: GoogleFonts.dmSans(fontSize: 15, fontWeight: FontWeight.w900, color: Colors.white),
                            ),
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Navigate to Login
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        "Already have an account? ",
                        style: GoogleFonts.dmSans(color: AppTheme.textMuted, fontSize: 13),
                      ),
                      GestureDetector(
                        onTap: () {
                          Navigator.pushReplacement(
                            context,
                            MaterialPageRoute(
                              builder: (_) => LoginScreen(onLoginSuccess: widget.onSignUpSuccess),
                            ),
                          );
                        },
                        child: Text(
                          'Sign In',
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
