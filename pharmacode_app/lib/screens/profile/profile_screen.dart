import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:share_plus/share_plus.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../core/animations.dart';
import '../../core/in_app_browser.dart';
import '../../core/theme.dart';
import '../../services/auth_service.dart';
import '../../widgets/user_avatar.dart';

class ProfileScreen extends StatefulWidget {
  final VoidCallback? onProfileUpdated;

  const ProfileScreen({super.key, this.onProfileUpdated});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final AuthService _auth = AuthService();

  String _name = '';
  String _email = '';
  String _photoUrl = '';
  String _avatarKey = 'mascot';
  String _college = '';
  String _batch = 'Batch 2024–28';
  int _selectedSemester = 1;
  bool _notificationsEnabled = true;
  bool _hapticEnabled = true;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadProfile();
  }

  Future<void> _loadProfile() async {
    final user = _auth.currentUser;
    final avatar = await _auth.getUserAvatar();
    final sem = await _auth.getUserSemester();
    final college = await _auth.getUserCollege();
    final batch = await _auth.getUserBatch();
    final prefs = await SharedPreferences.getInstance();

    if (mounted) {
      setState(() {
        _name = user?.displayName ?? 'B.Pharm Student';
        _email = user?.email ?? '';
        _photoUrl = user?.photoURL ?? '';
        _avatarKey = avatar;
        _selectedSemester = sem;
        _college = college;
        _batch = batch;
        _notificationsEnabled = prefs.getBool('pref_notifications') ?? true;
        _hapticEnabled = prefs.getBool('pref_haptic') ?? true;
        _isLoading = false;
      });
    }
  }

  // ── 1. EDIT NAME MODAL ───────────────────────────────────────────────────────
  void _showEditNameSheet() {
    final controller = TextEditingController(text: _name);
    final formKey = GlobalKey<FormState>();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        bool isUpdating = false;

        return StatefulBuilder(
          builder: (modalCtx, setModalState) {
            return Container(
              padding: EdgeInsets.only(
                top: 20,
                left: 20,
                right: 20,
                bottom: MediaQuery.of(modalCtx).viewInsets.bottom + 24,
              ),
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
              ),
              child: Form(
                key: formKey,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Center(
                      child: Container(
                        width: 42,
                        height: 4.5,
                        decoration: BoxDecoration(
                          color: Colors.grey.shade300,
                          borderRadius: BorderRadius.circular(10),
                        ),
                      ),
                    ),
                    const SizedBox(height: 18),
                    Text(
                      'Edit Display Name',
                      style: GoogleFonts.dmSans(
                        color: AppTheme.primaryNavy,
                        fontSize: 18,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      'Your name is shown on study notes, bookmarks & career certificates.',
                      style: GoogleFonts.dmSans(color: AppTheme.textMuted, fontSize: 12),
                    ),
                    const SizedBox(height: 16),
                    TextFormField(
                      controller: controller,
                      autofocus: true,
                      textCapitalization: TextCapitalization.words,
                      style: GoogleFonts.dmSans(fontSize: 15, fontWeight: FontWeight.w600),
                      decoration: InputDecoration(
                        labelText: 'Full Name',
                        prefixIcon: const Icon(Icons.person_outline_rounded),
                        filled: true,
                        fillColor: const Color(0xFFF8FAFC),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: const BorderSide(color: AppTheme.borderSoft),
                        ),
                        enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: const BorderSide(color: AppTheme.borderSoft),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: const BorderSide(color: AppTheme.brandBlue, width: 1.8),
                        ),
                      ),
                      validator: (val) {
                        if (val == null || val.trim().isEmpty) {
                          return 'Please enter a valid name';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 20),
                    SizedBox(
                      width: double.infinity,
                      height: 48,
                      child: ElevatedButton(
                        onPressed: isUpdating
                            ? null
                            : () async {
                                if (!formKey.currentState!.validate()) return;
                                setModalState(() => isUpdating = true);
                                final newName = controller.text.trim();
                                await _auth.updateDisplayName(newName);
                                if (ctx.mounted) {
                                  Navigator.pop(ctx);
                                }
                                if (mounted) {
                                  setState(() => _name = newName);
                                  widget.onProfileUpdated?.call();
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    const SnackBar(
                                      content: Text('Profile name updated successfully! ✨'),
                                      backgroundColor: Color(0xFF10B981),
                                      behavior: SnackBarBehavior.floating,
                                    ),
                                  );
                                }
                              },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppTheme.brandBlue,
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                        child: isUpdating
                            ? const SizedBox(
                                width: 20,
                                height: 20,
                                child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                              )
                            : Text(
                                'Save Name',
                                style: GoogleFonts.dmSans(fontWeight: FontWeight.w800, fontSize: 14),
                              ),
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }

  // ── 2. AVATAR PICKER MODAL ──────────────────────────────────────────────────
  void _showAvatarPickerModal() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        return Container(
          padding: const EdgeInsets.fromLTRB(20, 16, 20, 24),
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 42,
                  height: 4.5,
                  decoration: BoxDecoration(
                    color: Colors.grey.shade300,
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Text(
                'Choose Student Avatar',
                style: GoogleFonts.dmSans(
                  color: AppTheme.primaryNavy,
                  fontSize: 18,
                  fontWeight: FontWeight.w900,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                'Personalize your PharmaCode presence with iconic academic personas.',
                style: GoogleFonts.dmSans(color: AppTheme.textMuted, fontSize: 12),
              ),
              const SizedBox(height: 18),
              Flexible(
                child: SingleChildScrollView(
                  child: Column(
                    children: [
                      // Google Photo Option if available
                      if (_photoUrl.isNotEmpty) ...[
                        _buildAvatarOptionTile(
                          key: 'google',
                          title: 'Google Profile Photo',
                          subtitle: 'Connected from your Google Account',
                          avatarWidget: Container(
                            width: 44,
                            height: 44,
                            decoration: const BoxDecoration(shape: BoxShape.circle),
                            child: ClipOval(
                              child: Image.network(_photoUrl, fit: BoxFit.cover),
                            ),
                          ),
                          onSelect: () => _setAvatar('google', ctx),
                        ),
                        const Divider(height: 16),
                      ],

                      // Grid of Pharma Avatars
                      GridView.builder(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: 4,
                          crossAxisSpacing: 12,
                          mainAxisSpacing: 14,
                          childAspectRatio: 0.82,
                        ),
                        itemCount: kPharmaAvatars.length,
                        itemBuilder: (context, i) {
                          final item = kPharmaAvatars[i];
                          final isSelected = _avatarKey == item.key;

                          return BouncingCard(
                            onTap: () => _setAvatar(item.key, ctx),
                            child: Column(
                              children: [
                                Container(
                                  width: 54,
                                  height: 54,
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    border: Border.all(
                                      color: isSelected ? AppTheme.brandBlue : Colors.transparent,
                                      width: 2.5,
                                    ),
                                  ),
                                  padding: const EdgeInsets.all(2),
                                  child: UserAvatar(
                                    avatarKey: item.key,
                                    photoUrl: '',
                                    name: _name,
                                    size: 46,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  item.label,
                                  textAlign: TextAlign.center,
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: GoogleFonts.dmSans(
                                    color: isSelected ? AppTheme.brandBlue : AppTheme.textDark,
                                    fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
                                    fontSize: 10.5,
                                  ),
                                ),
                              ],
                            ),
                          );
                        },
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildAvatarOptionTile({
    required String key,
    required String title,
    required String subtitle,
    required Widget avatarWidget,
    required VoidCallback onSelect,
  }) {
    final isSelected = _avatarKey == key;
    return InkWell(
      onTap: onSelect,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFFEFF6FF) : Colors.transparent,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: isSelected ? AppTheme.brandBlue : AppTheme.borderSoft),
        ),
        child: Row(
          children: [
            avatarWidget,
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: GoogleFonts.dmSans(fontWeight: FontWeight.w800, fontSize: 13.5)),
                  Text(subtitle, style: GoogleFonts.dmSans(color: AppTheme.textMuted, fontSize: 11)),
                ],
              ),
            ),
            if (isSelected)
              const Icon(Icons.check_circle_rounded, color: AppTheme.brandBlue, size: 20),
          ],
        ),
      ),
    );
  }

  Future<void> _setAvatar(String key, BuildContext ctx) async {
    await _auth.setUserAvatar(key);
    setState(() => _avatarKey = key);
    widget.onProfileUpdated?.call();
    if (ctx.mounted) Navigator.pop(ctx);
    if (_hapticEnabled) HapticFeedback.selectionClick();
  }

  // ── 3. SEMESTER SELECTOR MODAL ──────────────────────────────────────────────
  void _showSemesterPicker() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        return Container(
          padding: const EdgeInsets.fromLTRB(20, 16, 20, 24),
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 42,
                  height: 4.5,
                  decoration: BoxDecoration(
                    color: Colors.grey.shade300,
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Text(
                'Select Current Semester',
                style: GoogleFonts.dmSans(
                  color: AppTheme.primaryNavy,
                  fontSize: 18,
                  fontWeight: FontWeight.w900,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                'Personalizes quick notes & syllabus access directly for your semester.',
                style: GoogleFonts.dmSans(color: AppTheme.textMuted, fontSize: 12),
              ),
              const SizedBox(height: 16),
              GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 4,
                  crossAxisSpacing: 10,
                  mainAxisSpacing: 10,
                  childAspectRatio: 1.2,
                ),
                itemCount: 8,
                itemBuilder: (context, i) {
                  final semNum = i + 1;
                  final isSelected = _selectedSemester == semNum;
                  final color = AppTheme.getSemesterColor(semNum);

                  return BouncingCard(
                    onTap: () async {
                      await _auth.setUserSemester(semNum);
                      setState(() => _selectedSemester = semNum);
                      widget.onProfileUpdated?.call();
                      if (ctx.mounted) Navigator.pop(ctx);
                      if (_hapticEnabled) HapticFeedback.selectionClick();
                    },
                    child: Container(
                      decoration: BoxDecoration(
                        color: isSelected ? color : Colors.white,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: isSelected ? color : AppTheme.borderSoft,
                          width: isSelected ? 2 : 1.2,
                        ),
                        boxShadow: isSelected
                            ? [
                                BoxShadow(
                                  color: color.withValues(alpha: 0.3),
                                  blurRadius: 6,
                                  offset: const Offset(0, 2),
                                ),
                              ]
                            : null,
                      ),
                      alignment: Alignment.center,
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            'Sem $semNum',
                            style: GoogleFonts.dmSans(
                              color: isSelected ? Colors.white : AppTheme.textDark,
                              fontWeight: FontWeight.w900,
                              fontSize: 13,
                            ),
                          ),
                          if (isSelected)
                            const Icon(Icons.check_rounded, color: Colors.white, size: 14),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ],
          ),
        );
      },
    );
  }

  // ── 4. EDIT COLLEGE DIALOG ──────────────────────────────────────────────────
  void _showEditCollegeDialog() {
    final controller = TextEditingController(text: _college);

    showDialog(
      context: context,
      builder: (ctx) {
        return AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
          title: Text(
            'College / Institute',
            style: GoogleFonts.dmSans(color: AppTheme.primaryNavy, fontWeight: FontWeight.w900, fontSize: 17),
          ),
          content: TextField(
            controller: controller,
            textCapitalization: TextCapitalization.words,
            style: GoogleFonts.dmSans(fontSize: 14, fontWeight: FontWeight.w600),
            decoration: InputDecoration(
              hintText: 'e.g. Delhi Pharmaceutical Sciences & Research University',
              filled: true,
              fillColor: const Color(0xFFF8FAFC),
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: Text('Cancel', style: GoogleFonts.dmSans(color: AppTheme.textMuted)),
            ),
            ElevatedButton(
              onPressed: () async {
                final newCol = controller.text.trim();
                await _auth.setUserCollege(newCol);
                setState(() => _college = newCol);
                if (ctx.mounted) Navigator.pop(ctx);
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.brandBlue,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              ),
              child: Text('Save', style: GoogleFonts.dmSans(fontWeight: FontWeight.w800)),
            ),
          ],
        );
      },
    );
  }

  // ── 5. LOGOUT CONFIRMATION ──────────────────────────────────────────────────
  void _showLogoutConfirmation() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Row(
          children: [
            Container(
              width: 38,
              height: 38,
              decoration: BoxDecoration(
                color: const Color(0xFFFEF2F2),
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(Icons.logout_rounded, color: Color(0xFFDC2626), size: 20),
            ),
            const SizedBox(width: 12),
            Text(
              'Sign Out',
              style: GoogleFonts.dmSans(color: AppTheme.primaryNavy, fontWeight: FontWeight.w900, fontSize: 18),
            ),
          ],
        ),
        content: Text(
          'Are you sure you want to sign out of PharmaCode? Your offline study notes and bookmarks will remain saved.',
          style: GoogleFonts.dmSans(color: AppTheme.textBody, fontSize: 13, height: 1.45),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: Text('Cancel', style: GoogleFonts.dmSans(color: AppTheme.textMuted, fontWeight: FontWeight.w700)),
          ),
          ElevatedButton(
            onPressed: () async {
              Navigator.pop(ctx); // Close dialog
              await _auth.signOut();
              widget.onProfileUpdated?.call();
              if (mounted) {
                Navigator.pop(context); // Exit profile screen
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Successfully signed out.'),
                    behavior: SnackBarBehavior.floating,
                  ),
                );
              }
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFDC2626),
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
            child: Text('Sign Out', style: GoogleFonts.dmSans(fontWeight: FontWeight.w800)),
          ),
        ],
      ),
    );
  }

  void _shareApp() {
    SharePlus.instance.share(
      ShareParams(
        text: '🎓 PharmaCode App — Complete B.Pharm PCI NEP 2020 Syllabus, Free Notes & Career Kits!\nhttps://pharmacode.vercel.app',
        subject: 'PharmaCode - B.Pharm Study Companion',
      ),
    );
  }

  void _openWebsite() {
    openInAppUrl(context, 'https://pharmacode.vercel.app');
  }

  void _openPrivacyPolicy() {
    openInAppUrl(context, 'https://pharmacode.vercel.app/privacy-policy.html');
  }

  void _openTerms() {
    openInAppUrl(context, 'https://pharmacode.vercel.app/terms.html');
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return Scaffold(
        backgroundColor: AppTheme.background,
        appBar: AppBar(title: const Text('Student Profile')),
        body: const Center(child: CircularProgressIndicator()),
      );
    }

    final isGoogleUser = _auth.currentUser?.providerData.any((p) => p.providerId == 'google.com') ?? false;

    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        title: Text(
          'Student Profile',
          style: GoogleFonts.dmSans(color: AppTheme.primaryNavy, fontWeight: FontWeight.w900),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.share_rounded, color: AppTheme.primaryNavy),
            onPressed: _shareApp,
            tooltip: 'Share App',
          ),
        ],
      ),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.fromLTRB(16, 12, 16, 36),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ── 1. MAIN PROFILE CARD ──────────────────────────────────────────
            _buildMainProfileCard(isGoogleUser),

            const SizedBox(height: 20),

            // ── 2. ACADEMIC DETAILS CARD ──────────────────────────────────────
            _buildSectionTitle('Academic Information', Icons.school_rounded, AppTheme.brandBlue),
            const SizedBox(height: 8),
            _buildAcademicCard(),

            const SizedBox(height: 20),

            // ── 3. PREFERENCES & SETTINGS ─────────────────────────────────────
            _buildSectionTitle('Study & App Settings', Icons.tune_rounded, AppTheme.brandPurple),
            const SizedBox(height: 8),
            _buildPreferencesCard(),

            const SizedBox(height: 20),

            // ── 4. RESOURCES & COMMUNITY ──────────────────────────────────────
            _buildSectionTitle('PharmaCode Platform', Icons.public_rounded, AppTheme.brandTeal),
            const SizedBox(height: 8),
            _buildPlatformLinksCard(),

            const SizedBox(height: 24),

            // ── 5. LOGOUT BUTTON ──────────────────────────────────────────────
            BouncingCard(
              onTap: _showLogoutConfirmation,
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(vertical: 14),
                decoration: BoxDecoration(
                  color: const Color(0xFFFEF2F2),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: const Color(0xFFFECACA), width: 1.5),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.logout_rounded, color: Color(0xFFDC2626), size: 18),
                    const SizedBox(width: 8),
                    Text(
                      'Sign Out of Account',
                      style: GoogleFonts.dmSans(
                        color: const Color(0xFFDC2626),
                        fontWeight: FontWeight.w900,
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 20),

            // Footer
            Center(
              child: Text(
                'PharmaCode v1.0.1 • B.Pharm PCI NEP 2020\nCrafted with ❤️ for Pharmacy Students',
                textAlign: TextAlign.center,
                style: GoogleFonts.dmSans(color: AppTheme.textMuted, fontSize: 11, height: 1.5),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ── PROFILE CARD ────────────────────────────────────────────────────────────
  Widget _buildMainProfileCard(bool isGoogleUser) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: AppTheme.borderSoft, width: 1.5),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.03),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        children: [
          // Avatar with Camera / Change Badge
          BouncingCard(
            onTap: _showAvatarPickerModal,
            child: Stack(
              clipBehavior: Clip.none,
              children: [
                Container(
                  padding: const EdgeInsets.all(3),
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(color: AppTheme.brandBlue.withValues(alpha: 0.3), width: 2),
                  ),
                  child: UserAvatar(
                    avatarKey: _avatarKey,
                    photoUrl: _photoUrl,
                    name: _name,
                    size: 86,
                    showOnlineDot: true,
                  ),
                ),
                Positioned(
                  right: 0,
                  bottom: 2,
                  child: Container(
                    padding: const EdgeInsets.all(6),
                    decoration: BoxDecoration(
                      color: AppTheme.brandBlue,
                      shape: BoxShape.circle,
                      border: Border.all(color: Colors.white, width: 2),
                      boxShadow: [
                        BoxShadow(
                          color: AppTheme.brandBlue.withValues(alpha: 0.3),
                          blurRadius: 4,
                          offset: const Offset(0, 1),
                        ),
                      ],
                    ),
                    child: const Icon(Icons.camera_alt_rounded, color: Colors.white, size: 14),
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 12),

          // Name with Edit Button
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                _name,
                style: GoogleFonts.dmSans(
                  color: AppTheme.primaryNavy,
                  fontSize: 20,
                  fontWeight: FontWeight.w900,
                  letterSpacing: -0.3,
                ),
              ),
              const SizedBox(width: 6),
              GestureDetector(
                onTap: _showEditNameSheet,
                child: Container(
                  padding: const EdgeInsets.all(5),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF1F5F9),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Icon(Icons.edit_rounded, color: AppTheme.brandBlue, size: 14),
                ),
              ),
            ],
          ),

          const SizedBox(height: 4),

          // Email
          Text(
            _email,
            style: GoogleFonts.dmSans(
              color: AppTheme.textMuted,
              fontSize: 13,
              fontWeight: FontWeight.w500,
            ),
          ),

          const SizedBox(height: 12),

          // Badges Row
          Wrap(
            spacing: 8,
            runSpacing: 6,
            alignment: WrapAlignment.center,
            children: [
              // Provider Badge
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: const Color(0xFFEFF6FF),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: const Color(0xFFBFDBFE)),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      isGoogleUser ? Icons.verified_user_rounded : Icons.mark_email_read_rounded,
                      size: 13,
                      color: const Color(0xFF2563EB),
                    ),
                    const SizedBox(width: 5),
                    Text(
                      isGoogleUser ? 'Google Verified' : 'Email Account',
                      style: GoogleFonts.dmSans(
                        color: const Color(0xFF1E40AF),
                        fontWeight: FontWeight.w800,
                        fontSize: 10.5,
                      ),
                    ),
                  ],
                ),
              ),

              // Student Status Badge
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: const Color(0xFFECFDF5),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: const Color(0xFFA7F3D0)),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const PulsingLiveDot(color: Color(0xFF059669), size: 6),
                    const SizedBox(width: 5),
                    Text(
                      'B.Pharm Student Active',
                      style: GoogleFonts.dmSans(
                        color: const Color(0xFF065F46),
                        fontWeight: FontWeight.w800,
                        fontSize: 10.5,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  // ── ACADEMIC CARD ───────────────────────────────────────────────────────────
  Widget _buildAcademicCard() {
    final semColor = AppTheme.getSemesterColor(_selectedSemester);

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppTheme.borderSoft, width: 1.5),
      ),
      child: Column(
        children: [
          // Current Semester Tile
          ListTile(
            leading: Container(
              width: 38,
              height: 38,
              decoration: BoxDecoration(
                color: semColor.withValues(alpha: 0.12),
                borderRadius: BorderRadius.circular(10),
              ),
              alignment: Alignment.center,
              child: Text(
                '$_selectedSemester',
                style: GoogleFonts.dmSans(color: semColor, fontWeight: FontWeight.w900, fontSize: 16),
              ),
            ),
            title: Text(
              'Current Semester',
              style: GoogleFonts.dmSans(fontWeight: FontWeight.w800, fontSize: 14),
            ),
            subtitle: Text(
              'Semester $_selectedSemester • PCI NEP 2020',
              style: GoogleFonts.dmSans(color: AppTheme.textMuted, fontSize: 12),
            ),
            trailing: Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: semColor.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    'Change',
                    style: GoogleFonts.dmSans(color: semColor, fontWeight: FontWeight.w800, fontSize: 11),
                  ),
                  const SizedBox(width: 2),
                  Icon(Icons.chevron_right_rounded, size: 14, color: semColor),
                ],
              ),
            ),
            onTap: _showSemesterPicker,
          ),
          const Divider(height: 1),

          // College / University Tile
          ListTile(
            leading: Container(
              width: 38,
              height: 38,
              decoration: BoxDecoration(
                color: const Color(0xFFF3E8FF),
                borderRadius: BorderRadius.circular(10),
              ),
              alignment: Alignment.center,
              child: const Icon(Icons.account_balance_rounded, color: Color(0xFF7C3AED), size: 18),
            ),
            title: Text(
              'College / Institute',
              style: GoogleFonts.dmSans(fontWeight: FontWeight.w800, fontSize: 14),
            ),
            subtitle: Text(
              _college.isNotEmpty ? _college : 'Tap to add your pharmacy college',
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: GoogleFonts.dmSans(color: AppTheme.textMuted, fontSize: 12),
            ),
            trailing: const Icon(Icons.edit_outlined, size: 16, color: AppTheme.textMuted),
            onTap: _showEditCollegeDialog,
          ),
          const Divider(height: 1),

          // Target Batch Tile
          ListTile(
            leading: Container(
              width: 38,
              height: 38,
              decoration: BoxDecoration(
                color: const Color(0xFFFFFBEB),
                borderRadius: BorderRadius.circular(10),
              ),
              alignment: Alignment.center,
              child: const Icon(Icons.calendar_month_rounded, color: Color(0xFFD97706), size: 18),
            ),
            title: Text(
              'Batch & Curriculum',
              style: GoogleFonts.dmSans(fontWeight: FontWeight.w800, fontSize: 14),
            ),
            subtitle: Text(
              '$_batch • PCI 2026–27',
              style: GoogleFonts.dmSans(color: AppTheme.textMuted, fontSize: 12),
            ),
          ),
        ],
      ),
    );
  }

  // ── PREFERENCES CARD ────────────────────────────────────────────────────────
  Widget _buildPreferencesCard() {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppTheme.borderSoft, width: 1.5),
      ),
      child: Column(
        children: [
          SwitchListTile(
            value: _notificationsEnabled,
            activeThumbColor: AppTheme.brandBlue,
            activeTrackColor: AppTheme.brandBlue.withValues(alpha: 0.3),
            secondary: Container(
              width: 38,
              height: 38,
              decoration: BoxDecoration(
                color: const Color(0xFFEFF6FF),
                borderRadius: BorderRadius.circular(10),
              ),
              alignment: Alignment.center,
              child: const Icon(Icons.notifications_active_rounded, color: AppTheme.brandBlue, size: 18),
            ),
            title: Text(
              'Study Tips & Alerts',
              style: GoogleFonts.dmSans(fontWeight: FontWeight.w800, fontSize: 14),
            ),
            subtitle: Text(
              'Receive daily PCI syllabus tips & exam alerts',
              style: GoogleFonts.dmSans(color: AppTheme.textMuted, fontSize: 12),
            ),
            onChanged: (val) async {
              final prefs = await SharedPreferences.getInstance();
              await prefs.setBool('pref_notifications', val);
              setState(() => _notificationsEnabled = val);
            },
          ),
          const Divider(height: 1),
          SwitchListTile(
            value: _hapticEnabled,
            activeThumbColor: AppTheme.brandBlue,
            activeTrackColor: AppTheme.brandBlue.withValues(alpha: 0.3),
            secondary: Container(
              width: 38,
              height: 38,
              decoration: BoxDecoration(
                color: const Color(0xFFF5F3FF),
                borderRadius: BorderRadius.circular(10),
              ),
              alignment: Alignment.center,
              child: const Icon(Icons.vibration_rounded, color: Color(0xFF7C3AED), size: 18),
            ),
            title: Text(
              'Haptic Touch Feedback',
              style: GoogleFonts.dmSans(fontWeight: FontWeight.w800, fontSize: 14),
            ),
            subtitle: Text(
              'Subtle tactile feel on buttons & cards',
              style: GoogleFonts.dmSans(color: AppTheme.textMuted, fontSize: 12),
            ),
            onChanged: (val) async {
              final prefs = await SharedPreferences.getInstance();
              await prefs.setBool('pref_haptic', val);
              setState(() => _hapticEnabled = val);
              if (val) HapticFeedback.mediumImpact();
            },
          ),
        ],
      ),
    );
  }

  // ── PLATFORM LINKS CARD ─────────────────────────────────────────────────────
  Widget _buildPlatformLinksCard() {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppTheme.borderSoft, width: 1.5),
      ),
      child: Column(
        children: [
          ListTile(
            leading: Container(
              width: 38,
              height: 38,
              decoration: BoxDecoration(
                color: const Color(0xFFECFDF5),
                borderRadius: BorderRadius.circular(10),
              ),
              alignment: Alignment.center,
              child: const Icon(Icons.open_in_browser_rounded, color: Color(0xFF059669), size: 18),
            ),
            title: Text(
              'Official Website',
              style: GoogleFonts.dmSans(fontWeight: FontWeight.w800, fontSize: 14),
            ),
            subtitle: Text(
              'pharmacode.vercel.app',
              style: GoogleFonts.dmSans(color: AppTheme.textMuted, fontSize: 12),
            ),
            trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 14, color: AppTheme.textMuted),
            onTap: _openWebsite,
          ),
          const Divider(height: 1),
          ListTile(
            leading: Container(
              width: 38,
              height: 38,
              decoration: BoxDecoration(
                color: const Color(0xFFEEF2FF),
                borderRadius: BorderRadius.circular(10),
              ),
              alignment: Alignment.center,
              child: const Icon(Icons.share_rounded, color: Color(0xFF4F46E5), size: 18),
            ),
            title: Text(
              'Share with Batchmates',
              style: GoogleFonts.dmSans(fontWeight: FontWeight.w800, fontSize: 14),
            ),
            subtitle: Text(
              'Help your classmates get free notes & kits',
              style: GoogleFonts.dmSans(color: AppTheme.textMuted, fontSize: 12),
            ),
            trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 14, color: AppTheme.textMuted),
            onTap: _shareApp,
          ),
          const Divider(height: 1),
          ListTile(
            leading: Container(
              width: 38,
              height: 38,
              decoration: BoxDecoration(
                color: const Color(0xFFF0FDF4),
                borderRadius: BorderRadius.circular(10),
              ),
              alignment: Alignment.center,
              child: const Icon(Icons.shield_outlined, color: Color(0xFF16A34A), size: 18),
            ),
            title: Text(
              'Privacy Policy & Data Safety',
              style: GoogleFonts.dmSans(fontWeight: FontWeight.w800, fontSize: 14),
            ),
            subtitle: Text(
              'Google Play 2026 data safety compliance',
              style: GoogleFonts.dmSans(color: AppTheme.textMuted, fontSize: 12),
            ),
            trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 14, color: AppTheme.textMuted),
            onTap: _openPrivacyPolicy,
          ),
          const Divider(height: 1),
          ListTile(
            leading: Container(
              width: 38,
              height: 38,
              decoration: BoxDecoration(
                color: const Color(0xFFFFFBEB),
                borderRadius: BorderRadius.circular(10),
              ),
              alignment: Alignment.center,
              child: const Icon(Icons.gavel_rounded, color: Color(0xFFD97706), size: 18),
            ),
            title: Text(
              'Terms of Service & Disclaimer',
              style: GoogleFonts.dmSans(fontWeight: FontWeight.w800, fontSize: 14),
            ),
            subtitle: Text(
              'Academic scope & medical disclaimer',
              style: GoogleFonts.dmSans(color: AppTheme.textMuted, fontSize: 12),
            ),
            trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 14, color: AppTheme.textMuted),
            onTap: _openTerms,
          ),
        ],
      ),
    );
  }

  Widget _buildSectionTitle(String title, IconData icon, Color color) {
    return Row(
      children: [
        Container(
          width: 26,
          height: 26,
          decoration: BoxDecoration(
            color: color.withValues(alpha: 0.12),
            borderRadius: BorderRadius.circular(7),
          ),
          alignment: Alignment.center,
          child: Icon(icon, color: color, size: 14),
        ),
        const SizedBox(width: 8),
        Text(
          title,
          style: GoogleFonts.dmSans(
            color: AppTheme.primaryNavy,
            fontSize: 15,
            fontWeight: FontWeight.w900,
            letterSpacing: -0.2,
          ),
        ),
      ],
    );
  }
}
