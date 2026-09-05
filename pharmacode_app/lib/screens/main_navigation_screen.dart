import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:share_plus/share_plus.dart';
import '../core/in_app_browser.dart';
import '../core/theme.dart';
import '../features/auth/domain/user_entity.dart';
import '../features/auth/presentation/auth_controller.dart';
import '../features/notifications/presentation/notification_controller.dart';
import '../widgets/user_avatar.dart';
import 'auth/login_screen.dart';
import 'profile/profile_screen.dart';
import 'home/home_screen.dart';
import 'syllabus/syllabus_screen.dart';
import 'notes/notes_screen.dart';
import 'blogs/blogs_screen.dart';
import 'bookmarks/bookmarks_screen.dart';
import 'notifications/notifications_screen.dart';
import 'search/global_search_delegate.dart';
import 'ai/pharma_helper_screen.dart';
import '../widgets/pharma_mascot_widget.dart';

class MainNavigationScreen extends ConsumerStatefulWidget {
  const MainNavigationScreen({super.key});

  @override
  ConsumerState<MainNavigationScreen> createState() => _MainNavigationScreenState();
}

class _MainNavigationScreenState extends ConsumerState<MainNavigationScreen>
    with SingleTickerProviderStateMixin {
  int _currentIndex = 0;
  int _targetSemester = 1;
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

  void _navigateToSemester(int semNum) {
    setState(() {
      _targetSemester = semNum;
      _currentIndex = 1;
    });
  }

  void _openWebsite() {
    openInAppUrl(context, 'https://pharmacode.vercel.app');
  }

  void _shareApp() {
    SharePlus.instance.share(
      ShareParams(
        text: '📱 PharmaCode App — Complete B.Pharm NEP 2020 Syllabus, Free Notes, Python & AI Guides!\nhttps://pharmacode.vercel.app',
        subject: 'PharmaCode - B.Pharm NEP 2020 Study Companion',
      ),
    );
  }

  void _onProfileButtonTapped() {
    final isLoggedIn = ref.read(isLoggedInProvider);
    if (isLoggedIn) {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) => ProfileScreen(
            onProfileUpdated: () {
              ref.read(authControllerProvider.notifier).refreshUser();
            },
          ),
        ),
      ).then((_) {
        ref.read(authControllerProvider.notifier).refreshUser();
      });
    } else {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) => LoginScreen(
            onLoginSuccess: () {
              ref.read(authControllerProvider.notifier).refreshUser();
            },
          ),
        ),
      ).then((_) {
        ref.read(authControllerProvider.notifier).refreshUser();
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final user = ref.watch(currentUserProvider);
    final isLoggedIn = ref.watch(isLoggedInProvider);
    final unreadCount = ref.watch(unreadNotificationsCountProvider);

    final List<Widget> screens = [
      HomeScreen(
        onNavigateToSemester: _navigateToSemester,
        onNavigateToNotes: () => setState(() => _currentIndex = 2),
        onNavigateToBlogs: () => setState(() => _currentIndex = 3),
      ),
      SyllabusScreen(key: ValueKey<int>(_targetSemester), initialSemester: _targetSemester),
      const NotesScreen(),
      BlogsScreen(onNavigateToNotes: () => setState(() => _currentIndex = 2)),
      const BookmarksScreen(),
    ];

    return Scaffold(
      key: _scaffoldKey,
      backgroundColor: AppTheme.background,
      appBar: _buildAppBar(
        isLoggedIn: isLoggedIn,
        avatarKey: user?.avatarKey ?? 'mascot',
        photoUrl: user?.photoUrl ?? '',
        displayName: user?.displayName ?? 'Student',
        unreadCount: unreadCount,
      ),
      drawer: _buildDrawer(isLoggedIn: isLoggedIn, user: user, unreadCount: unreadCount),
      body: AnimatedSwitcher(
        duration: const Duration(milliseconds: 250),
        switchInCurve: Curves.easeOutCubic,
        switchOutCurve: Curves.easeInCubic,
        transitionBuilder: (child, animation) => FadeTransition(
          opacity: animation,
          child: child,
        ),
        child: KeyedSubtree(
          key: ValueKey<int>(_currentIndex),
          child: screens[_currentIndex],
        ),
      ),
      bottomNavigationBar: _buildBottomNav(),
    );
  }

  AppBar _buildAppBar({
    required bool isLoggedIn,
    required String avatarKey,
    required String photoUrl,
    required String displayName,
    required int unreadCount,
  }) {
    const titles = ['PharmaCode', 'Syllabus', 'Free Notes', 'Career Guides', 'Bookmarks'];

    return AppBar(
      titleSpacing: 0,
      leading: IconButton(
        icon: const Icon(Icons.menu_rounded),
        onPressed: () => _scaffoldKey.currentState?.openDrawer(),
        tooltip: 'Menu',
      ),
      title: _currentIndex == 0
          ? FittedBox(
              fit: BoxFit.scaleDown,
              alignment: Alignment.centerLeft,
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    width: 36,
                    height: 36,
                    margin: const EdgeInsets.only(right: 7),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(9),
                      child: Image.asset(
                        'assets/images/app_icon.png',
                        fit: BoxFit.contain,
                        filterQuality: FilterQuality.high,
                      ),
                    ),
                  ),
                  RichText(
                    text: TextSpan(
                      children: [
                        TextSpan(
                          text: 'Pharma',
                          style: GoogleFonts.dmSans(
                            color: AppTheme.primaryNavy,
                            fontWeight: FontWeight.w900,
                            fontSize: 22.5,
                            letterSpacing: -0.5,
                          ),
                        ),
                        TextSpan(
                          text: 'Code',
                          style: GoogleFonts.dmSans(
                            color: AppTheme.brandBlue,
                            fontWeight: FontWeight.w900,
                            fontSize: 22.5,
                            letterSpacing: -0.5,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            )
          : Text(
              titles[_currentIndex],
              style: GoogleFonts.dmSans(
                color: AppTheme.primaryNavy,
                fontWeight: FontWeight.w900,
                fontSize: 19,
              ),
            ),
      actions: [
        IconButton(
          constraints: const BoxConstraints(minWidth: 32, minHeight: 32),
          padding: const EdgeInsets.all(4),
          icon: const Icon(Icons.search_rounded, size: 20),
          onPressed: () => showSearch(context: context, delegate: GlobalSearchDelegate()),
          tooltip: 'Search',
        ),
        IconButton(
          constraints: const BoxConstraints(minWidth: 32, minHeight: 32),
          padding: const EdgeInsets.all(4),
          icon: Icon(
            _currentIndex == 2 ? Icons.file_download_rounded : Icons.file_download_outlined,
            size: 20,
            color: _currentIndex == 2 ? AppTheme.brandBlue : AppTheme.primaryNavy,
          ),
          onPressed: () {
            HapticFeedback.selectionClick();
            setState(() => _currentIndex = 2);
          },
          tooltip: 'Free Notes & Downloads',
        ),
        Stack(
          alignment: Alignment.center,
          children: [
            IconButton(
              constraints: const BoxConstraints(minWidth: 32, minHeight: 32),
              padding: const EdgeInsets.all(4),
              icon: const Icon(Icons.notifications_outlined, size: 20),
              onPressed: () => Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const NotificationsScreen()),
              ),
              tooltip: 'Notifications',
            ),
            if (unreadCount > 0)
              Positioned(
                top: 3,
                right: 3,
                child: Container(
                  width: 14,
                  height: 14,
                  decoration: const BoxDecoration(color: Color(0xFFEF4444), shape: BoxShape.circle),
                  alignment: Alignment.center,
                  child: Text(
                    unreadCount > 9 ? '9+' : '$unreadCount',
                    style: const TextStyle(color: Colors.white, fontSize: 8, fontWeight: FontWeight.bold),
                  ),
                ),
              ),
          ],
        ),
        if (isLoggedIn)
          GestureDetector(
            onTap: _onProfileButtonTapped,
            child: Container(
              margin: const EdgeInsets.only(right: 4, left: 2),
              padding: const EdgeInsets.all(1.5),
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(color: const Color(0xFF10B981), width: 1.8),
              ),
              child: UserAvatar(
                avatarKey: avatarKey,
                photoUrl: photoUrl,
                name: displayName,
                size: 25,
                showOnlineDot: true,
              ),
            ),
          )
        else
          IconButton(
            constraints: const BoxConstraints(minWidth: 32, minHeight: 32),
            padding: const EdgeInsets.all(4),
            icon: const Icon(
              Icons.account_circle_outlined,
              color: AppTheme.primaryNavy,
              size: 21,
            ),
            onPressed: _onProfileButtonTapped,
            tooltip: 'Sign In',
          ),
        const SizedBox(width: 2),
      ],
    );
  }

  Widget _buildBottomNav() {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        border: const Border(top: BorderSide(color: AppTheme.borderSoft, width: 1)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 12,
            offset: const Offset(0, -3),
          ),
        ],
      ),
      child: SafeArea(
        top: false,
        child: SizedBox(
          height: 62,
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              _buildNavItem(
                index: 0,
                label: 'Home',
                icon: Icons.home_outlined,
                selectedIcon: Icons.home_rounded,
              ),
              _buildNavItem(
                index: 1,
                label: 'Syllabus',
                icon: Icons.menu_book_outlined,
                selectedIcon: Icons.menu_book_rounded,
              ),
              Expanded(
                child: AnimatedAiNavButton(
                  onTap: () {
                    HapticFeedback.lightImpact();
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const PharmaHelperScreen()),
                    );
                  },
                ),
              ),
              _buildNavItem(
                index: 3,
                label: 'Career',
                icon: Icons.work_outline_rounded,
                selectedIcon: Icons.work_rounded,
              ),
              _buildNavItem(
                index: 4,
                label: 'Saved',
                icon: Icons.bookmark_outline_rounded,
                selectedIcon: Icons.bookmark_rounded,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildNavItem({
    required int index,
    required String label,
    required IconData icon,
    required IconData selectedIcon,
  }) {
    final isSelected = _currentIndex == index;
    final color = isSelected ? AppTheme.brandBlue : const Color(0xFF64748B);

    return Expanded(
      child: InkWell(
        onTap: () {
          HapticFeedback.selectionClick();
          setState(() => _currentIndex = index);
        },
        splashColor: Colors.transparent,
        highlightColor: Colors.transparent,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            AnimatedContainer(
              duration: const Duration(milliseconds: 180),
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 3),
              decoration: BoxDecoration(
                color: isSelected ? const Color(0xFFDBEAFE).withValues(alpha: 0.5) : Colors.transparent,
                borderRadius: BorderRadius.circular(16),
              ),
              child: Icon(
                isSelected ? selectedIcon : icon,
                color: color,
                size: 22,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              label,
              style: GoogleFonts.dmSans(
                fontSize: 11,
                fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
                color: color,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDrawer({
    required bool isLoggedIn,
    required UserEntity? user,
    required int unreadCount,
  }) {
    final userName = user != null && user.displayName.isNotEmpty ? user.displayName : 'Guest Student';
    final userEmail = user != null && user.email.isNotEmpty ? user.email : 'Offline Mode • Free Study Access';
    final avatarKey = user?.avatarKey ?? 'mascot';
    final photoUrl = user?.photoUrl ?? '';

    return Drawer(
      backgroundColor: Colors.white,
      child: Column(
        children: [
          // Drawer Header
          Container(
            width: double.infinity,
            padding: EdgeInsets.only(
              top: MediaQuery.of(context).padding.top + 16,
              left: 20, right: 20, bottom: 20,
            ),
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                colors: [Color(0xFF0F1D5C), Color(0xFF1A2B6B), Color(0xFF2E4BAD)],
                begin: Alignment.topLeft, end: Alignment.bottomRight,
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      width: 46, height: 46,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(14),
                      ),
                      padding: const EdgeInsets.all(4),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(10),
                        child: Image.asset('assets/images/app_icon.png',
                            fit: BoxFit.contain, filterQuality: FilterQuality.high),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        RichText(
                          text: TextSpan(children: [
                            TextSpan(text: 'Pharma', style: GoogleFonts.dmSans(
                                color: Colors.white, fontSize: 20, fontWeight: FontWeight.w900)),
                            TextSpan(text: 'Code', style: GoogleFonts.dmSans(
                                color: const Color(0xFF93C5FD), fontSize: 20, fontWeight: FontWeight.w900)),
                          ]),
                        ),
                        Text('B.Pharm PCI NEP 2020',
                          style: GoogleFonts.dmSans(color: const Color(0xFFC7D2FE), fontSize: 11, fontWeight: FontWeight.w600)),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 16),

                // Student User Profile Box (Spacious 2-Row Layout)
                Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.12),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: Colors.white.withValues(alpha: 0.2)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      InkWell(
                        onTap: () {
                          Navigator.pop(context);
                          _onProfileButtonTapped();
                        },
                        borderRadius: BorderRadius.circular(10),
                        child: Row(
                          children: [
                            UserAvatar(
                              avatarKey: avatarKey,
                              photoUrl: photoUrl,
                              name: isLoggedIn ? userName : 'Guest',
                              size: 40,
                              showOnlineDot: isLoggedIn,
                            ),
                            const SizedBox(width: 10),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      Flexible(
                                        child: Text(
                                          isLoggedIn ? userName : 'Guest Student',
                                          maxLines: 1,
                                          overflow: TextOverflow.ellipsis,
                                          style: GoogleFonts.dmSans(color: Colors.white, fontWeight: FontWeight.w800, fontSize: 13),
                                        ),
                                      ),
                                      if (isLoggedIn) ...[
                                        const SizedBox(width: 4),
                                        const Icon(Icons.verified_rounded, color: Color(0xFF6EE7B7), size: 14),
                                      ],
                                    ],
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    userEmail,
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: GoogleFonts.dmSans(color: const Color(0xFFC7D2FE), fontSize: 11, fontWeight: FontWeight.w500),
                                  ),
                                ],
                              ),
                            ),
                            if (isLoggedIn)
                              const Icon(Icons.arrow_forward_ios_rounded, color: Colors.white70, size: 12),
                          ],
                        ),
                      ),
                      const SizedBox(height: 12),
                      if (isLoggedIn)
                        Row(
                          children: [
                            Expanded(
                              child: SizedBox(
                                height: 35,
                                child: ElevatedButton.icon(
                                  onPressed: () {
                                    Navigator.pop(context);
                                    _onProfileButtonTapped();
                                  },
                                  icon: const Icon(Icons.manage_accounts_rounded, size: 14, color: AppTheme.primaryNavy),
                                  label: Text(
                                    'Edit Profile & Settings',
                                    style: GoogleFonts.dmSans(
                                      color: AppTheme.primaryNavy,
                                      fontSize: 11.5,
                                      fontWeight: FontWeight.w800,
                                    ),
                                  ),
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: Colors.white,
                                    elevation: 0,
                                    padding: EdgeInsets.zero,
                                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(9)),
                                  ),
                                ),
                              ),
                            ),
                            const SizedBox(width: 8),
                            SizedBox(
                              height: 35,
                              width: 38,
                              child: ElevatedButton(
                                onPressed: () {
                                  Navigator.pop(context);
                                  _showLogoutConfirmation();
                                },
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Colors.white.withValues(alpha: 0.15),
                                  elevation: 0,
                                  padding: EdgeInsets.zero,
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(9)),
                                ),
                                child: const Icon(Icons.logout_rounded, size: 16, color: Color(0xFFFCA5A5)),
                              ),
                            ),
                          ],
                        )
                      else
                        SizedBox(
                          width: double.infinity,
                          height: 38,
                          child: ElevatedButton(
                            onPressed: () {
                              Navigator.pop(context);
                              _onProfileButtonTapped();
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.white,
                              elevation: 0,
                              padding: const EdgeInsets.symmetric(horizontal: 12),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                            ),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                const Icon(Icons.login_rounded, size: 14, color: AppTheme.primaryNavy),
                                const SizedBox(width: 6),
                                Flexible(
                                  child: Text(
                                    'Sign In to Sync Bookmarks',
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: GoogleFonts.dmSans(
                                      color: AppTheme.primaryNavy,
                                      fontSize: 11.5,
                                      fontWeight: FontWeight.w800,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Navigation Items
          Expanded(
            child: ListView(
              physics: const BouncingScrollPhysics(),
              padding: const EdgeInsets.symmetric(vertical: 8),
              children: [
                _drawerItem(Icons.home_rounded, 'Home', 0),
                Container(
                  margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFFEEF2FF), Color(0xFFE0E7FF)],
                    ),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: const Color(0xFFC7D2FE)),
                  ),
                  child: ListTile(
                    contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 2),
                    leading: const PharmaMascotWidget(size: 32, showBadge: true),
                    title: Text(
                      'PharmaHelper AI',
                      style: GoogleFonts.dmSans(
                        fontWeight: FontWeight.w800,
                        color: AppTheme.primaryNavy,
                        fontSize: 14,
                      ),
                    ),
                    subtitle: Text(
                      '24/7 B.Pharm Tutor • Hinglish',
                      style: GoogleFonts.inter(
                        fontSize: 11,
                        color: const Color(0xFF4F46E5),
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    trailing: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: const Color(0xFF2563EB),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        'NEW',
                        style: GoogleFonts.inter(
                          color: Colors.white,
                          fontSize: 9,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                    ),
                    onTap: () {
                      Navigator.pop(context);
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const PharmaHelperScreen()),
                      );
                    },
                  ),
                ),
                const Divider(height: 8, indent: 16, endIndent: 16),

                Padding(
                  padding: const EdgeInsets.fromLTRB(16, 8, 16, 4),
                  child: Text('ALL SEMESTERS',
                    style: GoogleFonts.dmSans(color: AppTheme.textMuted, fontSize: 10, fontWeight: FontWeight.w800, letterSpacing: 1.2)),
                ),
                ...List.generate(8, (i) {
                  final n = i + 1;
                  final color = AppTheme.getSemesterColor(n);
                  final bg = AppTheme.getSemesterBg(n);
                  return ListTile(
                    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 0),
                    dense: true,
                    leading: Container(
                      width: 32, height: 32,
                      decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(8)),
                      alignment: Alignment.center,
                      child: Text('$n', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 13)),
                    ),
                    title: Text('Semester $n', style: GoogleFonts.dmSans(fontWeight: FontWeight.w700, fontSize: 14, color: AppTheme.textDark)),
                    trailing: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(6)),
                      child: Text('Sem $n', style: GoogleFonts.dmSans(color: color, fontSize: 10, fontWeight: FontWeight.w900)),
                    ),
                    onTap: () {
                      Navigator.pop(context);
                      _navigateToSemester(n);
                    },
                  );
                }),

                const Divider(height: 16, indent: 16, endIndent: 16),
                _drawerItem(Icons.download_rounded, 'Free PDF Notes', 2, color: AppTheme.brandTeal),
                _drawerItem(Icons.work_rounded, 'Career Guides & Kits', 3, color: AppTheme.brandPurple),
                _drawerItem(Icons.bookmark_rounded, 'Saved Bookmarks', 4, color: AppTheme.brandAmber),

                const Divider(height: 16, indent: 16, endIndent: 16),
                ListTile(
                  leading: const Icon(Icons.notifications_active_rounded, color: Color(0xFFEC4899), size: 22),
                  title: Text('Notifications', style: GoogleFonts.dmSans(fontWeight: FontWeight.w700, fontSize: 14)),
                  trailing: unreadCount > 0
                      ? Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: const Color(0xFFEF4444),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Text(
                            '$unreadCount NEW',
                            style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.w900),
                          ),
                        )
                      : const SizedBox.shrink(),
                  onTap: () {
                    Navigator.pop(context);
                    Navigator.push(context, MaterialPageRoute(builder: (_) => const NotificationsScreen()));
                  },
                ),
                ListTile(
                  leading: const Icon(Icons.public_rounded, color: AppTheme.textMuted, size: 22),
                  title: Text('Visit Website', style: GoogleFonts.dmSans(fontWeight: FontWeight.w700, fontSize: 14)),
                  subtitle: Text('pharmacode.vercel.app', style: GoogleFonts.dmSans(color: AppTheme.textMuted, fontSize: 11)),
                  onTap: () { Navigator.pop(context); _openWebsite(); },
                ),
                ListTile(
                  leading: const Icon(Icons.share_rounded, color: AppTheme.textMuted, size: 22),
                  title: Text('Share with Friends', style: GoogleFonts.dmSans(fontWeight: FontWeight.w700, fontSize: 14)),
                  onTap: () { Navigator.pop(context); _shareApp(); },
                ),
              ],
            ),
          ),

          // Footer
          Container(
            padding: EdgeInsets.only(bottom: MediaQuery.of(context).padding.bottom + 12, top: 12),
            child: Text('PharmaCode v1.0.1 · PCI NEP 2020',
              style: GoogleFonts.dmSans(color: AppTheme.textMuted, fontSize: 11)),
          ),
        ],
      ),
    );
  }

  void _showLogoutConfirmation() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
        title: Text('Sign Out', style: GoogleFonts.dmSans(fontWeight: FontWeight.w900, color: AppTheme.primaryNavy)),
        content: Text('Are you sure you want to sign out from your student account?',
            style: GoogleFonts.dmSans(fontSize: 13, color: AppTheme.textDark)),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: Text('Cancel', style: GoogleFonts.dmSans(fontWeight: FontWeight.w700, color: AppTheme.textMuted)),
          ),
          ElevatedButton(
            onPressed: () async {
              Navigator.pop(ctx);
              await ref.read(authControllerProvider.notifier).signOut();
              if (mounted) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('Signed out successfully', style: GoogleFonts.dmSans(fontWeight: FontWeight.w700)),
                    behavior: SnackBarBehavior.floating,
                  ),
                );
              }
            },
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFFDC2626)),
            child: Text('Sign Out', style: GoogleFonts.dmSans(fontWeight: FontWeight.w800)),
          ),
        ],
      ),
    );
  }

  Widget _drawerItem(IconData icon, String label, int index, {Color? color}) {
    final isSelected = _currentIndex == index;
    final c = color ?? AppTheme.brandBlue;
    return ListTile(
      leading: Icon(icon, color: isSelected ? c : AppTheme.textMuted, size: 22),
      title: Text(label,
        style: GoogleFonts.dmSans(
          fontWeight: isSelected ? FontWeight.w800 : FontWeight.w700,
          fontSize: 14,
          color: isSelected ? c : AppTheme.textDark,
        )),
      selected: isSelected,
      selectedTileColor: c.withValues(alpha: 0.08),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      contentPadding: const EdgeInsets.symmetric(horizontal: 16),
      onTap: () {
        Navigator.pop(context);
        setState(() => _currentIndex = index);
      },
    );
  }
}

/// Animated Floating AI Button in the center of Bottom Navigation
class AnimatedAiNavButton extends StatefulWidget {
  final VoidCallback onTap;

  const AnimatedAiNavButton({super.key, required this.onTap});

  @override
  State<AnimatedAiNavButton> createState() => _AnimatedAiNavButtonState();
}

class _AnimatedAiNavButtonState extends State<AnimatedAiNavButton>
    with SingleTickerProviderStateMixin {
  late AnimationController _ctrl;
  late Animation<double> _pulseAnim;
  late Animation<double> _glowAnim;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1800),
    )..repeat(reverse: true);

    _pulseAnim = Tween<double>(begin: 1.0, end: 1.08).animate(
      CurvedAnimation(parent: _ctrl, curve: Curves.easeInOut),
    );

    _glowAnim = Tween<double>(begin: 8.0, end: 16.0).animate(
      CurvedAnimation(parent: _ctrl, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: widget.onTap,
      splashColor: Colors.transparent,
      highlightColor: Colors.transparent,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          AnimatedBuilder(
            animation: _ctrl,
            builder: (context, child) {
              return Transform.scale(
                scale: _pulseAnim.value,
                child: Container(
                  width: 44,
                  height: 44,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: const LinearGradient(
                      colors: [Color(0xFF3B82F6), Color(0xFF4F46E5), Color(0xFF6366F1)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: const Color(0xFF4F46E5).withValues(alpha: 0.4),
                        blurRadius: _glowAnim.value,
                        spreadRadius: 1,
                        offset: const Offset(0, 3),
                      ),
                    ],
                  ),
                  child: child,
                ),
              );
            },
            child: Center(
              child: Stack(
                alignment: Alignment.center,
                children: [
                  // Microchip outline matching design
                  Container(
                    width: 22,
                    height: 22,
                    decoration: BoxDecoration(
                      border: Border.all(color: Colors.white.withValues(alpha: 0.9), width: 1.8),
                      borderRadius: BorderRadius.circular(5),
                    ),
                  ),
                  // Center glowing sparkles
                  const Icon(
                    Icons.auto_awesome,
                    color: Colors.white,
                    size: 13,
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 3),
          Text(
            'AI',
            style: GoogleFonts.dmSans(
              fontSize: 11,
              fontWeight: FontWeight.w900,
              color: const Color(0xFF3B82F6),
              letterSpacing: 0.3,
            ),
          ),
        ],
      ),
    );
  }
}

