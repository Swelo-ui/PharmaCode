import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/ads/ad_service.dart';
import '../../core/in_app_browser.dart';
import '../../core/theme.dart';
import '../../core/widgets/ad_banner_widget.dart';
import '../../models/syllabus_models.dart';
import '../../services/syllabus_service.dart';
import '../syllabus/subject_detail_screen.dart';

class NotesScreen extends StatefulWidget {
  const NotesScreen({super.key});

  @override
  State<NotesScreen> createState() => _NotesScreenState();
}

class _NotesScreenState extends State<NotesScreen> {
  int _selectedSemester = 0; // 0 = All
  String _searchQuery = '';

  void _unlockGpatFormulaKit() {
    AdService.instance.showRewardedAd(
      onUserEarnedReward: (reward) {
        if (!mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Row(
              children: [
                const Icon(Icons.stars_rounded, color: Colors.amber, size: 22),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    'Unlocked! Enjoy full GPAT Formula & Rapid Revision Kit.',
                    style: GoogleFonts.dmSans(fontWeight: FontWeight.w700),
                  ),
                ),
              ],
            ),
            backgroundColor: AppTheme.primaryNavy,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          ),
        );
        openInAppUrl(context, 'https://pharmacode.vercel.app/notes/');
      },
      onFailed: () {
        if (!mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              'Opening GPAT Rapid Revision Kit directly...',
              style: GoogleFonts.dmSans(fontWeight: FontWeight.w600),
            ),
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          ),
        );
        openInAppUrl(context, 'https://pharmacode.vercel.app/notes/');
      },
    );
  }

  void _downloadNote(Subject subject, int semNum) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) {
        final semColor = AppTheme.getSemesterColor(semNum);
        return Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: const Color(0xFFEEF2FF),
                      borderRadius: BorderRadius.circular(14),
                    ),
                    child: const Icon(Icons.picture_as_pdf_rounded, color: Color(0xFF4C6EF5), size: 28),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          '${subject.code} Notes PDF',
                          style: GoogleFonts.dmSans(
                            color: AppTheme.primaryNavy,
                            fontSize: 16,
                            fontWeight: FontWeight.w900,
                          ),
                        ),
                        Text(
                          'Semester $semNum · Unit-wise Study Material',
                          style: GoogleFonts.dmSans(color: AppTheme.textMuted, fontSize: 12),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Text(
                'Complete unit-wise study notes prepared per PCI NEP 2020 syllabus. 100% free with direct browser download, no registration or paywall required.',
                style: GoogleFonts.dmSans(color: AppTheme.textDark, fontSize: 13, height: 1.45),
              ),
              const SizedBox(height: 24),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () {
                        Navigator.pop(context);
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (_) => SubjectDetailScreen(subject: subject)),
                        );
                      },
                      style: OutlinedButton.styleFrom(
                        side: BorderSide(color: semColor, width: 1.5),
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      child: Text(
                        'View Syllabus',
                        style: GoogleFonts.dmSans(color: semColor, fontWeight: FontWeight.w800),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () {
                        Navigator.pop(context);
                        AdService.instance.showInterstitialAd(
                          onDismissed: () {
                            openInAppUrl(context, 'https://pharmacode.vercel.app/notes/');
                          },
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: semColor,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      child: Text(
                        'Open PDF Notes',
                        style: GoogleFonts.dmSans(fontWeight: FontWeight.w800),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final semesters = SyllabusService().semesters;

    final List<MapEntry<int, Subject>> notesList = [];
    for (var sem in semesters) {
      if (_selectedSemester == 0 || _selectedSemester == sem.num) {
        for (var sub in sem.subjects) {
          if (sub.type == 'T' && sub.units.isNotEmpty) {
            final matchesQuery = _searchQuery.isEmpty ||
                sub.code.toLowerCase().contains(_searchQuery.toLowerCase()) ||
                sub.name.toLowerCase().contains(_searchQuery.toLowerCase());
            if (matchesQuery) {
              notesList.add(MapEntry(sem.num, sub));
            }
          }
        }
      }
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // ── Top Header Strip ─────────────────────────────────────────
        Container(
          color: Colors.white,
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      color: const Color(0xFFEEF2FF),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    alignment: Alignment.center,
                    child: const Icon(Icons.download_rounded, color: Color(0xFF4C6EF5), size: 22),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'B.Pharm Notes — Free Download',
                          style: GoogleFonts.dmSans(
                            color: AppTheme.primaryNavy,
                            fontSize: 16,
                            fontWeight: FontWeight.w900,
                            letterSpacing: -0.3,
                          ),
                        ),
                        Text(
                          'PCI NEP 2020 · All 8 Semesters · 100% Free',
                          style: GoogleFonts.dmSans(color: AppTheme.textMuted, fontSize: 11),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 14),

              // Search Field
              TextField(
                onChanged: (val) {
                  setState(() {
                    _searchQuery = val;
                  });
                },
                decoration: InputDecoration(
                  hintText: 'Search notes by subject name or code...',
                  prefixIcon: const Icon(Icons.search_rounded, color: AppTheme.textMuted, size: 20),
                  suffixIcon: _searchQuery.isNotEmpty
                      ? IconButton(
                          icon: const Icon(Icons.close_rounded, color: AppTheme.textMuted, size: 18),
                          onPressed: () => setState(() => _searchQuery = ''),
                        )
                      : null,
                ),
              ),
              const SizedBox(height: 12),

              // Semester Horizontal Filter Pills
              SingleChildScrollView(
                physics: const BouncingScrollPhysics(),
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: [
                    _buildSemFilterChip('All Semesters', 0),
                    ...List.generate(8, (i) => _buildSemFilterChip('Sem ${i + 1}', i + 1)),
                  ],
                ),
              ),

              const SizedBox(height: 12),

              // GPAT & Rapid Revision Kit (Rewarded Ad trigger)
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF0F1D5C), Color(0xFF1E3A8A)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(14),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFF0F1D5C).withValues(alpha: 0.15),
                      blurRadius: 10,
                      offset: const Offset(0, 3),
                    ),
                  ],
                ),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.15),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Icon(Icons.workspace_premium_rounded, color: Colors.amber, size: 22),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'GPAT Rapid Revision Sheets',
                            style: GoogleFonts.dmSans(
                              color: Colors.white,
                              fontWeight: FontWeight.w800,
                              fontSize: 13,
                            ),
                          ),
                          Text(
                            'Watch 1 quick clip to unlock formula notes',
                            style: GoogleFonts.dmSans(
                              color: Colors.white.withValues(alpha: 0.8),
                              fontSize: 11,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                    ),
                    ElevatedButton(
                      onPressed: _unlockGpatFormulaKit,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.amber,
                        foregroundColor: const Color(0xFF0F1D5C),
                        elevation: 0,
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                      ),
                      child: Text(
                        'Unlock',
                        style: GoogleFonts.dmSans(fontWeight: FontWeight.w900, fontSize: 12),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),

        const Divider(height: 1, color: AppTheme.borderSoft),

        // ── Notes List ─────────────────────────────────────────────
        Expanded(
          child: notesList.isEmpty
              ? Center(
                  child: Padding(
                    padding: const EdgeInsets.all(32),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.search_off_rounded, size: 48, color: AppTheme.textMuted),
                        const SizedBox(height: 12),
                        Text(
                          'No study notes found',
                          style: GoogleFonts.dmSans(
                            color: AppTheme.textDark,
                            fontSize: 16,
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          'Try searching for another term or selecting All Semesters',
                          textAlign: TextAlign.center,
                          style: GoogleFonts.dmSans(color: AppTheme.textMuted, fontSize: 13),
                        ),
                      ],
                    ),
                  ),
                )
              : ListView.builder(
                  physics: const BouncingScrollPhysics(),
                  padding: const EdgeInsets.fromLTRB(16, 14, 16, 24),
                  itemCount: notesList.length,
                  itemBuilder: (context, index) {
                    final item = notesList[index];
                    final semNum = item.key;
                    final sub = item.value;
                    final semColor = AppTheme.getSemesterColor(semNum);
                    final semBg = AppTheme.getSemesterBg(semNum);

                    return Container(
                      margin: const EdgeInsets.only(bottom: 12),
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
                      child: Material(
                        color: Colors.transparent,
                        child: InkWell(
                          onTap: () => _downloadNote(sub, semNum),
                          borderRadius: BorderRadius.circular(16),
                          child: Padding(
                            padding: const EdgeInsets.all(16),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                      decoration: BoxDecoration(
                                        color: semBg,
                                        borderRadius: BorderRadius.circular(6),
                                        border: Border.all(color: semColor.withValues(alpha: 0.3)),
                                      ),
                                      child: Text(
                                        'Sem $semNum',
                                        style: GoogleFonts.dmSans(
                                          color: semColor,
                                          fontWeight: FontWeight.w900,
                                          fontSize: 10,
                                        ),
                                      ),
                                    ),
                                    const SizedBox(width: 8),
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                      decoration: BoxDecoration(
                                        color: const Color(0xFFEEF2FF),
                                        borderRadius: BorderRadius.circular(6),
                                      ),
                                      child: Text(
                                        sub.code,
                                        style: GoogleFonts.dmSans(
                                          color: const Color(0xFF3730A3),
                                          fontWeight: FontWeight.w900,
                                          fontSize: 10,
                                        ),
                                      ),
                                    ),
                                    const Spacer(),
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                                      decoration: BoxDecoration(
                                        color: const Color(0xFFECFDF5),
                                        borderRadius: BorderRadius.circular(6),
                                      ),
                                      child: Row(
                                        mainAxisSize: MainAxisSize.min,
                                        children: [
                                          const Icon(Icons.check_circle_rounded, size: 10, color: Color(0xFF059669)),
                                          const SizedBox(width: 3),
                                          Text(
                                            '${sub.units.length} Units Notes',
                                            style: GoogleFonts.dmSans(
                                              color: const Color(0xFF059669),
                                              fontWeight: FontWeight.w800,
                                              fontSize: 9,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 12),
                                Text(
                                  sub.name,
                                  style: GoogleFonts.dmSans(
                                    color: AppTheme.textDark,
                                    fontSize: 14,
                                    fontWeight: FontWeight.w800,
                                    height: 1.3,
                                  ),
                                ),
                                const SizedBox(height: 12),
                                Row(
                                  children: [
                                    Text(
                                      '${sub.credits} Credits · Theory',
                                      style: GoogleFonts.dmSans(
                                        color: AppTheme.textMuted,
                                        fontSize: 11,
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                    const Spacer(),
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                                      decoration: BoxDecoration(
                                        color: semColor.withValues(alpha: 0.1),
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      child: Row(
                                        mainAxisSize: MainAxisSize.min,
                                        children: [
                                          Icon(Icons.download_rounded, size: 14, color: semColor),
                                          const SizedBox(width: 4),
                                          Text(
                                            'Get PDF',
                                            style: GoogleFonts.dmSans(
                                              color: semColor,
                                              fontWeight: FontWeight.w800,
                                              fontSize: 11,
                                            ),
                                          ),
                                        ],
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
                  },
                ),
        ),
        // Bottom Banner Ad
        const AdBannerWidget(),
      ],
    );
  }

  Widget _buildSemFilterChip(String label, int semNum) {
    final isSelected = _selectedSemester == semNum;
    final color = semNum == 0 ? AppTheme.brandBlue : AppTheme.getSemesterColor(semNum);

    return Padding(
      padding: const EdgeInsets.only(right: 8),
      child: InkWell(
        onTap: () {
          setState(() {
            _selectedSemester = semNum;
          });
        },
        borderRadius: BorderRadius.circular(10),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
          decoration: BoxDecoration(
            color: isSelected ? color : const Color(0xFFF4F7FB),
            borderRadius: BorderRadius.circular(10),
            border: Border.all(
              color: isSelected ? color : AppTheme.borderSoft,
              width: 1.5,
            ),
          ),
          child: Text(
            label,
            style: GoogleFonts.dmSans(
              color: isSelected ? Colors.white : AppTheme.textMuted,
              fontWeight: FontWeight.w800,
              fontSize: 11,
            ),
          ),
        ),
      ),
    );
  }
}
