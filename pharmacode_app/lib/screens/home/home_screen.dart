import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/animations.dart';
import '../../core/theme.dart';
import '../../data/ticker_data.dart';
import '../../data/faqs_data.dart';
import '../../data/blogs_data.dart';
import '../../services/syllabus_service.dart';
import '../syllabus/subject_detail_screen.dart';
import '../blogs/blog_detail_screen.dart';
import '../ai/pharma_helper_screen.dart';
import '../../widgets/pharma_mascot_widget.dart';

class HomeScreen extends StatefulWidget {
  final Function(int) onNavigateToSemester;
  final VoidCallback onNavigateToNotes;
  final VoidCallback onNavigateToBlogs;

  const HomeScreen({
    super.key,
    required this.onNavigateToSemester,
    required this.onNavigateToNotes,
    required this.onNavigateToBlogs,
  });

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> with TickerProviderStateMixin {
  late AnimationController _tickerCtrl;
  late Animation<double> _tickerFade;
  int _currentTicker = 0;
  int _expandedFaq = -1;

  @override
  void initState() {
    super.initState();
    _tickerCtrl = AnimationController(vsync: this, duration: const Duration(milliseconds: 600));
    _tickerFade = CurvedAnimation(parent: _tickerCtrl, curve: Curves.easeInOut);
    _tickerCtrl.forward();
    _nextTicker();
  }

  void _nextTicker() {
    Future.delayed(const Duration(seconds: 4), () {
      if (!mounted) return;
      _tickerCtrl.reverse().then((_) {
        if (!mounted) return;
        setState(() => _currentTicker = (_currentTicker + 1) % tickerItems.length);
        _tickerCtrl.forward();
        _nextTicker();
      });
    });
  }

  @override
  void dispose() {
    _tickerCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final svc = SyllabusService();
    final semesters = svc.semesters;
    final ticker = tickerItems[_currentTicker];
    final screenW = MediaQuery.of(context).size.width;

    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // ─── 1. HERO ──────────────────────────────────────────────────────
          _buildHero(context),

          // ─── 2. TICKER ─────────────────────────────────────────────────────
          _buildTicker(ticker),

          // ─── 3. AI PHARMAHELPER CARD ───────────────────────────────────────
          _buildAiTutorCard(context),

          // ─── 4. SEMESTER GRID ──────────────────────────────────────────────
          _buildSectionHeader(context, 'All 8 Semesters', Icons.menu_book_rounded, AppTheme.brandBlue),
          _buildSemesterGrid(semesters, screenW),

          // ─── 4. PHOTO CAROUSEL ────────────────────────────────────────────
          _buildPhotoCarousel(context),

          // ─── 5. FEATURED SUBJECTS ──────────────────────────────────────────
          _buildSectionHeader(context, 'Key B.Pharm Subjects', Icons.star_rounded, AppTheme.brandAmber),
          _buildFeaturedSubjects(context, svc),

          // ─── 6. LATEST GUIDES ─────────────────────────────────────────────
          _buildSectionHeader(context, 'Career Guides & Kits', Icons.article_rounded, AppTheme.brandPurple,
              onMore: widget.onNavigateToBlogs),
          _buildBlogStrip(context),

          // ─── 7. WHY PHARMACODE ────────────────────────────────────────────
          _buildWhySection(context),

          // ─── 8. FAQ ───────────────────────────────────────────────────────
          _buildSectionHeader(context, 'Frequently Asked', Icons.help_outline_rounded, AppTheme.brandTeal),
          _buildFaqs(context),

          const SizedBox(height: 32),
        ],
      ),
    );
  }

  // ─── HERO ──────────────────────────────────────────────────────────────────
  Widget _buildHero(BuildContext context) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.all(16),
      clipBehavior: Clip.antiAlias,
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF0F1D5C), Color(0xFF1E3A8A), Color(0xFF3B5BDB)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF1A2B6B).withValues(alpha: 0.4),
            blurRadius: 24,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Stack(
        children: [
          // Decorative circles
          Positioned(top: -40, right: -40,
            child: Container(width: 160, height: 160,
              decoration: BoxDecoration(shape: BoxShape.circle,
                color: Colors.white.withValues(alpha: 0.05)))),
          Positioned(bottom: -30, left: -20,
            child: Container(width: 120, height: 120,
              decoration: BoxDecoration(shape: BoxShape.circle,
                color: Colors.white.withValues(alpha: 0.04)))),

          Padding(
            padding: const EdgeInsets.fromLTRB(20, 28, 20, 24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Live badge
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: Colors.white.withValues(alpha: 0.25)),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(width: 7, height: 7,
                        decoration: const BoxDecoration(color: Color(0xFF6EE7B7), shape: BoxShape.circle)),
                      const SizedBox(width: 6),
                      Text('PCI NEP 2020  ·  Batch 2026–27',
                        style: GoogleFonts.dmSans(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w700)),
                    ],
                  ),
                ),
                const SizedBox(height: 18),

                // Logo + Headline row
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      width: 56, height: 56,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(14),
                        boxShadow: [BoxShadow(
                          color: Colors.black.withValues(alpha: 0.2), blurRadius: 12, offset: const Offset(0, 4))],
                      ),
                      padding: const EdgeInsets.all(5),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(10),
                        child: Image.asset('assets/images/app_icon.png',
                          fit: BoxFit.contain, filterQuality: FilterQuality.high),
                      ),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('B.Pharm Complete\nSyllabus & Notes',
                            style: GoogleFonts.dmSans(
                              color: Colors.white, fontSize: 20,
                              fontWeight: FontWeight.w900, height: 1.2, letterSpacing: -0.4)),
                          const SizedBox(height: 6),
                          Wrap(
                            spacing: 8,
                            children: [
                              _dotTag('Code', const Color(0xFF93C5FD)),
                              _dotTag('Cure', const Color(0xFF6EE7B7)),
                              _dotTag('Care', const Color(0xFFFCA5A5)),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 20),

                // Stats Row
                Row(
                  children: [
                    _statChip('8', 'Semesters'),
                    const SizedBox(width: 8),
                    _statChip('212', 'Credits'),
                    const SizedBox(width: 8),
                    _statChip('77+', 'Subjects'),
                    const SizedBox(width: 8),
                    _statChip('100%', 'Free'),
                  ],
                ),
                const SizedBox(height: 20),

                // CTA Buttons
                Row(
                  children: [
                    Expanded(
                      child: ElevatedButton.icon(
                        onPressed: () => widget.onNavigateToSemester(1),
                        icon: const Icon(Icons.menu_book_rounded, size: 16),
                        label: Text('Syllabus', style: GoogleFonts.dmSans(fontWeight: FontWeight.w800, fontSize: 13)),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.white,
                          foregroundColor: AppTheme.primaryNavy,
                          padding: const EdgeInsets.symmetric(vertical: 13),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: OutlinedButton.icon(
                        onPressed: widget.onNavigateToNotes,
                        icon: const Icon(Icons.download_rounded, size: 16, color: Colors.white),
                        label: Text('Free Notes', style: GoogleFonts.dmSans(fontWeight: FontWeight.w800, fontSize: 13, color: Colors.white)),
                        style: OutlinedButton.styleFrom(
                          side: const BorderSide(color: Colors.white54, width: 1.5),
                          padding: const EdgeInsets.symmetric(vertical: 13),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _dotTag(String text, Color color) {
    return Row(mainAxisSize: MainAxisSize.min, children: [
      Container(width: 6, height: 6, decoration: BoxDecoration(color: color, shape: BoxShape.circle)),
      const SizedBox(width: 4),
      Text(text, style: GoogleFonts.dmSans(color: color, fontSize: 12, fontWeight: FontWeight.w700)),
    ]);
  }

  Widget _statChip(String value, String label) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 8),
        decoration: BoxDecoration(
          color: Colors.white.withValues(alpha: 0.1),
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: Colors.white.withValues(alpha: 0.2)),
        ),
        child: Column(children: [
          Text(value, style: GoogleFonts.dmSans(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 15)),
          Text(label, style: GoogleFonts.dmSans(color: Colors.white70, fontWeight: FontWeight.w600, fontSize: 9)),
        ]),
      ),
    );
  }

  // ─── TICKER ───────────────────────────────────────────────────────────────
  Widget _buildTicker(TickerItem ticker) {
    final color = AppTheme.parseHex(ticker.colorHex);
    return Container(
      margin: const EdgeInsets.fromLTRB(16, 0, 16, 8),
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: const Color(0xFF0F1D5C),
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF0F1D5C).withValues(alpha: 0.15),
            blurRadius: 8,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: FadeTransition(
        opacity: _tickerFade,
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(6)),
              child: Text(
                ticker.tag,
                style: GoogleFonts.dmSans(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 10),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Text(
                ticker.text,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                style: GoogleFonts.dmSans(
                  color: Colors.white,
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  height: 1.3,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ─── AI PHARMAHELPER CARD ──────────────────────────────────────────────────
  Widget _buildAiTutorCard(BuildContext context) {
    return Container(
      margin: const EdgeInsets.fromLTRB(16, 6, 16, 12),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF1E1B4B), Color(0xFF2E1065), Color(0xFF312E81)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF312E81).withValues(alpha: 0.35),
            blurRadius: 16,
            offset: const Offset(0, 6),
          ),
        ],
        border: Border.all(color: Colors.white.withValues(alpha: 0.15)),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(20),
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const PharmaHelperScreen()),
            );
          },
          child: Padding(
            padding: const EdgeInsets.all(18),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const PharmaMascotWidget(size: 46, showBadge: true),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Flexible(
                                child: Text(
                                  'PharmaHelper',
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: GoogleFonts.dmSans(
                                    color: Colors.white,
                                    fontWeight: FontWeight.w900,
                                    fontSize: 17,
                                    letterSpacing: -0.3,
                                  ),
                                ),
                              ),
                              const SizedBox(width: 8),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                decoration: BoxDecoration(
                                  gradient: const LinearGradient(
                                    colors: [Color(0xFF10B981), Color(0xFF059669)],
                                  ),
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: Text(
                                  'FREE AI TUTOR',
                                  style: GoogleFonts.inter(
                                    color: Colors.white,
                                    fontSize: 9,
                                    fontWeight: FontWeight.w800,
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 3),
                          Text(
                            'Your 24/7 B.Pharm Mentor • Hinglish & English',
                            style: GoogleFonts.inter(
                              color: const Color(0xFFC7D2FE),
                              fontSize: 12,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Text(
                  'Tough pharmacology ya chemistry concepts ko easy Hinglish me samjho, 5-mark exam answers banao, aur full syllabus navigate karo!',
                  style: GoogleFonts.inter(
                    color: Colors.white.withValues(alpha: 0.9),
                    fontSize: 12.5,
                    height: 1.4,
                  ),
                ),
                const SizedBox(height: 14),
                Row(
                  children: [
                    Expanded(
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 12),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(12),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withValues(alpha: 0.1),
                              blurRadius: 6,
                              offset: const Offset(0, 2),
                            ),
                          ],
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(Icons.chat_bubble_outline_rounded, color: Color(0xFF312E81), size: 16),
                            const SizedBox(width: 8),
                            Text(
                              'Ask PharmaHelper Now',
                              style: GoogleFonts.dmSans(
                                color: const Color(0xFF312E81),
                                fontWeight: FontWeight.w800,
                                fontSize: 13,
                              ),
                            ),
                          ],
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
    );
  }

  // ─── SECTION HEADER ───────────────────────────────────────────────────────
  Widget _buildSectionHeader(BuildContext context, String title, IconData icon, Color color, {VoidCallback? onMore}) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 20, 16, 10),
      child: Row(
        children: [
          Container(
            width: 32, height: 32,
            decoration: BoxDecoration(color: color.withValues(alpha: 0.12), borderRadius: BorderRadius.circular(8)),
            alignment: Alignment.center,
            child: Icon(icon, color: color, size: 17),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Text(title, style: GoogleFonts.dmSans(
              color: AppTheme.textDark, fontWeight: FontWeight.w900, fontSize: 16)),
          ),
          if (onMore != null)
            TextButton(
              onPressed: onMore,
              child: Text('See all', style: GoogleFonts.dmSans(
                color: AppTheme.brandBlue, fontWeight: FontWeight.w700, fontSize: 12)),
            ),
        ],
      ),
    );
  }

  // ─── SEMESTER GRID ────────────────────────────────────────────────────────
  Widget _buildSemesterGrid(List semesters, double screenW) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: GridView.builder(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          crossAxisSpacing: 12,
          mainAxisSpacing: 12,
          childAspectRatio: 1.55,
        ),
        itemCount: semesters.length,
        itemBuilder: (context, i) {
          final sem = semesters[i];
          final color = AppTheme.getSemesterColor(sem.num);
          final bg = AppTheme.getSemesterBg(sem.num);
          final tCount = sem.subjects.where((s) => s.type == 'T').length;
          final pCount = sem.subjects.where((s) => s.type == 'P').length;

          return BouncingCard(
            onTap: () => widget.onNavigateToSemester(sem.num),
            child: Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppTheme.borderSoft, width: 1.5),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.02),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        width: 38, height: 38,
                        decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(10)),
                        alignment: Alignment.center,
                        child: Text('${sem.num}', style: GoogleFonts.dmSans(
                          color: Colors.white, fontWeight: FontWeight.w900, fontSize: 16)),
                      ),
                      const Spacer(),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                        decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(6)),
                        child: Text('${sem.credits}cr', style: GoogleFonts.dmSans(
                          color: color, fontWeight: FontWeight.w900, fontSize: 10)),
                      ),
                    ],
                  ),
                  const Spacer(),
                  Text('Semester ${sem.num}', style: GoogleFonts.dmSans(
                    color: AppTheme.textDark, fontWeight: FontWeight.w800, fontSize: 13)),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      if (tCount > 0) _miniBadge('${tCount}T', const Color(0xFFEEF2FF), const Color(0xFF3730A3)),
                      if (tCount > 0 && pCount > 0) const SizedBox(width: 4),
                      if (pCount > 0) _miniBadge('${pCount}P', const Color(0xFFECFDF5), const Color(0xFF14532D)),
                    ],
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _miniBadge(String label, Color bg, Color fg) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
      decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(5)),
      child: Text(label, style: GoogleFonts.dmSans(color: fg, fontWeight: FontWeight.w800, fontSize: 9)),
    );
  }

  void _openFullImageViewer(BuildContext context, String imagePath, String title) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (ctx) => Scaffold(
          backgroundColor: Colors.black,
          appBar: AppBar(
            backgroundColor: Colors.black,
            iconTheme: const IconThemeData(color: Colors.white),
            title: Text(
              title,
              style: GoogleFonts.dmSans(color: Colors.white, fontSize: 15, fontWeight: FontWeight.w800),
            ),
            actions: [
              IconButton(
                icon: const Icon(Icons.close_rounded, color: Colors.white),
                onPressed: () => Navigator.pop(ctx),
              ),
            ],
          ),
          body: Center(
            child: InteractiveViewer(
              panEnabled: true,
              minScale: 0.8,
              maxScale: 5.0,
              child: Image.asset(
                imagePath,
                fit: BoxFit.contain,
                filterQuality: FilterQuality.high,
              ),
            ),
          ),
        ),
      ),
    );
  }

  // ─── PHOTO CAROUSEL ───────────────────────────────────────────────────────
  Widget _buildPhotoCarousel(BuildContext context) {
    final photos = [
      ('assets/images/pic1.png', 'B.Pharm NEP 2020 Curriculum', 'Official Career Guidance Banner'),
      ('assets/images/pic2.jpg', 'Career Roadmap & Training', 'Student Knowledge & Skills Chart'),
      ('assets/images/pic3.jpg', 'Guidance & Success Roadmap', 'Your Career. Our Guidance.'),
      ('assets/images/pic4.jpg', 'Smart Resource & Community Hub', 'Empowering Pharmacy Students'),
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 20, 16, 10),
          child: Row(
            children: [
              Container(
                width: 32,
                height: 32,
                decoration: BoxDecoration(
                  color: AppTheme.brandPink.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(8),
                ),
                alignment: Alignment.center,
                child: const Icon(Icons.photo_library_rounded, color: AppTheme.brandPink, size: 17),
              ),
              const SizedBox(width: 10),
              Text(
                'Guidance Posters & Gallery',
                style: GoogleFonts.dmSans(
                  color: AppTheme.textDark,
                  fontWeight: FontWeight.w900,
                  fontSize: 16,
                ),
              ),
              const Spacer(),
              Text(
                'Tap to zoom',
                style: GoogleFonts.dmSans(
                  color: AppTheme.textMuted,
                  fontSize: 11,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
        SizedBox(
          height: 250,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            physics: const BouncingScrollPhysics(),
            itemCount: photos.length,
            itemBuilder: (context, i) {
              final (src, title, subtitle) = photos[i];
              final isLandscape = src.endsWith('.png');
              final cardWidth = isLandscape ? 260.0 : 175.0;

              return Container(
                width: cardWidth,
                margin: const EdgeInsets.only(right: 12),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppTheme.borderSoft, width: 1.5),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.04),
                      blurRadius: 10,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Material(
                  color: Colors.transparent,
                  child: InkWell(
                    onTap: () => _openFullImageViewer(context, src, title),
                    borderRadius: BorderRadius.circular(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Image Container with BoxFit.contain - NEVER CROPPED!
                        Expanded(
                          child: Stack(
                            children: [
                              Container(
                                width: double.infinity,
                                decoration: const BoxDecoration(
                                  color: Color(0xFFF8FAFC),
                                  borderRadius: BorderRadius.vertical(top: Radius.circular(15)),
                                ),
                                padding: const EdgeInsets.all(6),
                                child: ClipRRect(
                                  borderRadius: BorderRadius.circular(10),
                                  child: Image.asset(
                                    src,
                                    fit: BoxFit.contain,
                                    filterQuality: FilterQuality.high,
                                  ),
                                ),
                              ),
                              Positioned(
                                top: 8,
                                right: 8,
                                child: Container(
                                  padding: const EdgeInsets.all(5),
                                  decoration: BoxDecoration(
                                    color: Colors.white.withValues(alpha: 0.9),
                                    shape: BoxShape.circle,
                                    boxShadow: [
                                      BoxShadow(
                                        color: Colors.black.withValues(alpha: 0.1),
                                        blurRadius: 4,
                                      ),
                                    ],
                                  ),
                                  child: const Icon(Icons.zoom_in_rounded, size: 14, color: AppTheme.primaryNavy),
                                ),
                              ),
                            ],
                          ),
                        ),
                        // Caption Bar
                        Container(
                          padding: const EdgeInsets.fromLTRB(10, 8, 10, 10),
                          decoration: const BoxDecoration(
                            border: Border(top: BorderSide(color: AppTheme.borderSoft, width: 1)),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                title,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: GoogleFonts.dmSans(
                                  color: AppTheme.textDark,
                                  fontWeight: FontWeight.w800,
                                  fontSize: 11,
                                ),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                subtitle,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: GoogleFonts.dmSans(
                                  color: AppTheme.textMuted,
                                  fontSize: 10,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  // ─── FEATURED SUBJECTS ────────────────────────────────────────────────────
  Widget _buildFeaturedSubjects(BuildContext context, SyllabusService svc) {
    final featuredCodes = ['BP101T', 'BP104T', 'BP202T', 'BP301T', 'BP402T', 'BP505T', 'BP604T', 'BP705T'];
    final subjects = featuredCodes
        .map((code) => svc.getSubjectByCode(code))
        .where((s) => s != null)
        .cast<dynamic>()
        .toList();

    if (subjects.isEmpty) return const SizedBox();

    return ListView.separated(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      padding: const EdgeInsets.symmetric(horizontal: 16),
      itemCount: subjects.length,
      separatorBuilder: (context, index) => const SizedBox(height: 8),
      itemBuilder: (context, i) {
        final sub = subjects[i];
        final semNum = _findSemNum(svc, sub.code);
        final color = AppTheme.getSemesterColor(semNum);
        final bg = AppTheme.getSemesterBg(semNum);

        return Material(
          color: Colors.white,
          borderRadius: BorderRadius.circular(14),
          child: InkWell(
            onTap: () => Navigator.push(context,
              MaterialPageRoute(builder: (_) => SubjectDetailScreen(subject: sub))),
            borderRadius: BorderRadius.circular(14),
            child: Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: AppTheme.borderSoft, width: 1.5),
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(color: const Color(0xFFEEF2FF), borderRadius: BorderRadius.circular(7)),
                    child: Text(sub.code,
                      style: GoogleFonts.dmSans(
                        color: const Color(0xFF3730A3), fontWeight: FontWeight.w900, fontSize: 10)),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(sub.name,
                      style: GoogleFonts.dmSans(
                        color: AppTheme.textDark, fontWeight: FontWeight.w700, fontSize: 13)),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
                    decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(6)),
                    child: Text('${sub.credits}cr', style: GoogleFonts.dmSans(
                      color: color, fontWeight: FontWeight.w900, fontSize: 10)),
                  ),
                  const SizedBox(width: 8),
                  Icon(Icons.arrow_forward_ios_rounded, size: 13, color: AppTheme.textMuted),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  int _findSemNum(SyllabusService svc, String code) {
    for (final sem in svc.semesters) {
      for (final sub in sem.subjects) {
        if (sub.code == code) return sem.num;
      }
    }
    return 1;
  }

  // ─── BLOG STRIP ───────────────────────────────────────────────────────────
  Widget _buildBlogStrip(BuildContext context) {
    final blogs = blogsData.take(4).toList();
    return SizedBox(
      height: 170,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        physics: const BouncingScrollPhysics(),
        itemCount: blogs.length,
        itemBuilder: (context, i) {
          final blog = blogs[i];
          final color = AppTheme.parseHex(blog.colorHex);
          final bg = AppTheme.parseHex(blog.bgHex);
          return GestureDetector(
            onTap: () => Navigator.push(context,
              MaterialPageRoute(builder: (_) => BlogDetailScreen(blog: blog))),
            child: Container(
              width: 220,
              margin: const EdgeInsets.only(right: 12),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppTheme.borderSoft, width: 1.5),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(6),
                        border: Border.all(color: color.withValues(alpha: 0.3))),
                      child: Text(blog.tag, style: GoogleFonts.dmSans(
                        color: color, fontWeight: FontWeight.w900, fontSize: 9)),
                    ),
                    const Spacer(),
                    if (blog.isNew)
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 2),
                        decoration: BoxDecoration(color: const Color(0xFFDC2626), borderRadius: BorderRadius.circular(4)),
                        child: Text('NEW', style: GoogleFonts.dmSans(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 8)),
                      ),
                  ]),
                  const SizedBox(height: 10),
                  Expanded(
                    child: Text(blog.title, maxLines: 3, overflow: TextOverflow.ellipsis,
                      style: GoogleFonts.dmSans(
                        color: AppTheme.textDark, fontWeight: FontWeight.w800, fontSize: 13, height: 1.3)),
                  ),
                  const SizedBox(height: 8),
                  Row(children: [
                    Text(blog.readTime, style: GoogleFonts.dmSans(
                      color: AppTheme.textMuted, fontSize: 10, fontWeight: FontWeight.w600)),
                    const Spacer(),
                    Icon(Icons.arrow_forward_rounded, size: 14, color: color),
                  ]),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  // ─── WHY PHARMACODE ───────────────────────────────────────────────────────
  Widget _buildWhySection(BuildContext context) {
    final features = [
      (Icons.code_rounded, 'Python & AI Built-In', 'BP101T to BP801T includes Python, ML, AI Ethics & QSAR', AppTheme.brandBlue),
      (Icons.layers_rounded, 'Unit-wise Breakdown', 'Every subject split into 5 units with topics & hours', AppTheme.brandGreen),
      (Icons.download_done_rounded, '100% Free Notes', 'No login, no paywall — all PDF notes completely free', AppTheme.brandTeal),
      (Icons.search_rounded, 'Instant Search', 'Search any subject, code, topic or unit keyword instantly', AppTheme.brandPurple),
      (Icons.work_outline_rounded, 'Internship Guides', 'Hospital (Sem 4) & Industry (Sem 6) internship kit', AppTheme.brandAmber),
      (Icons.emoji_events_rounded, 'GPAT Ready', 'High-yield topics and unit headings marked for GPAT 2027', AppTheme.brandPink),
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSectionHeader(context, 'Why PharmaCode?', Icons.verified_rounded, AppTheme.brandGreen),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2, crossAxisSpacing: 10, mainAxisSpacing: 10, childAspectRatio: 1.6),
            itemCount: features.length,
            itemBuilder: (context, i) {
              final (icon, title, desc, color) = features[i];
              return Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: AppTheme.borderSoft, width: 1.5),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      width: 32, height: 32,
                      decoration: BoxDecoration(
                        color: color.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(8)),
                      alignment: Alignment.center,
                      child: Icon(icon, color: color, size: 16),
                    ),
                    const Spacer(),
                    Text(title, style: GoogleFonts.dmSans(
                      color: AppTheme.textDark, fontWeight: FontWeight.w800, fontSize: 12, height: 1.2)),
                    const SizedBox(height: 3),
                    Text(desc, maxLines: 2, overflow: TextOverflow.ellipsis,
                      style: GoogleFonts.dmSans(color: AppTheme.textMuted, fontSize: 10, height: 1.3)),
                  ],
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  // ─── FAQ ─────────────────────────────────────────────────────────────────
  Widget _buildFaqs(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        children: List.generate(faqsData.length, (i) {
          final faq = faqsData[i];
          final isExpanded = _expandedFaq == i;
          return AnimatedContainer(
            duration: const Duration(milliseconds: 250),
            curve: Curves.easeOutCubic,
            margin: const EdgeInsets.only(bottom: 8),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(
                color: isExpanded ? AppTheme.brandBlue.withValues(alpha: 0.4) : AppTheme.borderSoft,
                width: 1.5,
              ),
            ),
            child: Material(
              color: Colors.transparent,
              child: InkWell(
                onTap: () => setState(() => _expandedFaq = isExpanded ? -1 : i),
                borderRadius: BorderRadius.circular(14),
                child: Padding(
                  padding: const EdgeInsets.all(14),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Expanded(
                            child: Text(faq.question, style: GoogleFonts.dmSans(
                              color: AppTheme.textDark, fontWeight: FontWeight.w800, fontSize: 13)),
                          ),
                          const SizedBox(width: 8),
                          AnimatedRotation(
                            turns: isExpanded ? 0.5 : 0,
                            duration: const Duration(milliseconds: 250),
                            child: Icon(Icons.expand_more_rounded,
                              color: isExpanded ? AppTheme.brandBlue : AppTheme.textMuted, size: 20),
                          ),
                        ],
                      ),
                      AnimatedCrossFade(
                        duration: const Duration(milliseconds: 250),
                        firstChild: const SizedBox.shrink(),
                        secondChild: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const SizedBox(height: 10),
                            const Divider(color: AppTheme.borderSoft, height: 1),
                            const SizedBox(height: 10),
                            Text(faq.answer, style: GoogleFonts.dmSans(
                              color: AppTheme.textBody, fontSize: 13, height: 1.5)),
                          ],
                        ),
                        crossFadeState: isExpanded ? CrossFadeState.showSecond : CrossFadeState.showFirst,
                      ),
                    ],
                  ),
                ),
              ),
            ),
          );
        }),
      ),
    );
  }
}
