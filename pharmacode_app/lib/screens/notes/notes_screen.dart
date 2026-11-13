import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/ads/ad_service.dart';
import '../../core/billing/in_app_purchase_service.dart';
import '../../core/in_app_browser.dart';
import '../../core/theme.dart';
import '../../core/widgets/ad_banner_widget.dart';
import '../../core/widgets/prebook_vip_sheet.dart';
import '../../models/syllabus_models.dart';
import '../../services/syllabus_service.dart';
import '../../services/pdf_service.dart';
import '../syllabus/subject_detail_screen.dart';

class NotesScreen extends StatefulWidget {
  const NotesScreen({super.key});

  @override
  State<NotesScreen> createState() => _NotesScreenState();
}

class _NotesScreenState extends State<NotesScreen> {
  int _selectedSemester = 0; // 0 = All

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
                        final isVip = InAppPurchaseService.instance.isVipUnlocked;
                        final adminPdf = PdfService.instance.getPdfForSubject(subject.code);
                        final targetUrl = adminPdf != null
                            ? PdfService.instance.getTrackedDownloadUrl(adminPdf.id)
                            : (subject.slug.isNotEmpty
                                ? 'https://pharmacode.vercel.app/syllabus/semester-$semNum/${subject.slug}/'
                                : 'https://pharmacode.vercel.app/notes/');
                        if (isVip) {
                          openInAppUrl(context, targetUrl);
                        } else {
                          AdService.instance.showInterstitialAd(
                            onDismissed: () {
                              openInAppUrl(context, targetUrl);
                            },
                          );
                        }
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
              const SizedBox(height: 10),
              SizedBox(
                width: double.infinity,
                child: TextButton.icon(
                  onPressed: () {
                    Navigator.pop(context);
                    showPreBookVipSheet(context);
                  },
                  icon: const Icon(Icons.workspace_premium_rounded, color: Color(0xFFD97706), size: 18),
                  label: Text(
                    'Pre-Book Study Material Pass @ ₹199 (VIP)',
                    style: GoogleFonts.dmSans(fontWeight: FontWeight.w800, fontSize: 12, color: AppTheme.brandBlue),
                  ),
                ),
              ),
              const SizedBox(height: 6),
            ],
          ),
        );
      },
    );
  }

  Widget _buildPreBookBanner() {
    return ValueListenableBuilder<Set<String>>(
      valueListenable: InAppPurchaseService.instance.unlockedNotifier,
      builder: (context, unlockedSet, _) {
        final isVip = InAppPurchaseService.instance.isVipUnlocked;

        return InkWell(
          onTap: () => showPreBookVipSheet(context),
          borderRadius: BorderRadius.circular(16),
          child: Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF0F172A), Color(0xFF1E3A8A)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFF1E3A8A).withValues(alpha: 0.2),
                  blurRadius: 10,
                  offset: const Offset(0, 3),
                ),
              ],
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(9),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFFF59E0B), Color(0xFFD97706)],
                    ),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(Icons.stars_rounded, color: Colors.white, size: 22),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Text(
                            isVip ? 'VIP Study Pass Active' : 'Pre-Book Study Material',
                            style: GoogleFonts.dmSans(
                              color: Colors.white,
                              fontWeight: FontWeight.w900,
                              fontSize: 13.5,
                            ),
                          ),
                          const SizedBox(width: 6),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(
                              color: isVip ? const Color(0xFF10B981) : Colors.amber,
                              borderRadius: BorderRadius.circular(5),
                            ),
                            child: Text(
                              isVip ? 'ACTIVE' : '₹199 ONLY',
                              style: GoogleFonts.dmSans(
                                color: isVip ? Colors.white : const Color(0xFF0F172A),
                                fontWeight: FontWeight.w900,
                                fontSize: 9.5,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 3),
                      Text(
                        isVip
                            ? 'All future notes & guides unlocked + WhatsApp mentor support'
                            : 'All future notes free + Real-time WhatsApp & Email support',
                        style: GoogleFonts.dmSans(
                          color: Colors.white.withValues(alpha: 0.85),
                          fontSize: 11,
                          height: 1.25,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 6),
                const Icon(Icons.arrow_forward_ios_rounded, color: Colors.white70, size: 14),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildNoteCard(Subject sub, int semNum) {
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
        borderRadius: BorderRadius.circular(16),
        child: InkWell(
          borderRadius: BorderRadius.circular(16),
          onTap: () => _downloadNote(sub, semNum),
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
                      ),
                      child: Text(
                        'Sem $semNum',
                        style: GoogleFonts.dmSans(
                          color: semColor,
                          fontWeight: FontWeight.w900,
                          fontSize: 10.5,
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
                          fontSize: 10.5,
                        ),
                      ),
                    ),
                    const Spacer(),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: const Color(0xFFECFDF5),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(Icons.check_circle_rounded, size: 12, color: Color(0xFF059669)),
                          const SizedBox(width: 4),
                          Text(
                            '${sub.units.length} Units Notes',
                            style: GoogleFonts.dmSans(
                              color: const Color(0xFF059669),
                              fontWeight: FontWeight.w800,
                              fontSize: 10,
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
                    fontSize: 14.5,
                    fontWeight: FontWeight.w800,
                    height: 1.35,
                  ),
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Text(
                      '${sub.credits} Credits · Theory',
                      style: GoogleFonts.dmSans(
                        color: AppTheme.textMuted,
                        fontSize: 11.5,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const Spacer(),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
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
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
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
              fontSize: 11.5,
            ),
          ),
        ),
      ),
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
            notesList.add(MapEntry(sem.num, sub));
          }
        }
      }
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // ── Sticky Semester Filter Strip (Compact & Clean) ───────────
        Container(
          color: Colors.white,
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
          child: SingleChildScrollView(
            physics: const BouncingScrollPhysics(),
            scrollDirection: Axis.horizontal,
            child: Row(
              children: [
                _buildSemFilterChip('All Semesters', 0),
                ...List.generate(8, (i) => _buildSemFilterChip('Sem ${i + 1}', i + 1)),
              ],
            ),
          ),
        ),
        const Divider(height: 1, color: AppTheme.borderSoft),

        // ── Scrollable Body: Banners + Full-Height Notes List ─────────
        Expanded(
          child: ListView(
            physics: const BouncingScrollPhysics(),
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 24),
            children: [
              // 1. Pre-Booking VIP Study Material Pass Banner
              _buildPreBookBanner(),
              const SizedBox(height: 14),

              // 2. Notes Section Header with Count
              Row(
                children: [
                  Text(
                    _selectedSemester == 0 ? 'All PCI Study Notes' : 'Semester $_selectedSemester Notes',
                    style: GoogleFonts.dmSans(
                      color: AppTheme.primaryNavy,
                      fontSize: 15,
                      fontWeight: FontWeight.w900,
                      letterSpacing: -0.2,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                    decoration: BoxDecoration(
                      color: const Color(0xFFEFF6FF),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text(
                      '${notesList.length} Notes',
                      style: GoogleFonts.dmSans(
                        color: const Color(0xFF2563EB),
                        fontWeight: FontWeight.w800,
                        fontSize: 11,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),

              // 4. Notes Cards
              if (notesList.isEmpty)
                Padding(
                  padding: const EdgeInsets.all(40),
                  child: Center(
                    child: Text(
                      'No study notes available for this semester.',
                      style: GoogleFonts.dmSans(color: AppTheme.textMuted, fontSize: 13),
                    ),
                  ),
                )
              else
                ...notesList.map((item) => _buildNoteCard(item.value, item.key)),
            ],
          ),
        ),

        // Bottom Banner Ad
        const AdBannerWidget(),
      ],
    );
  }
}
