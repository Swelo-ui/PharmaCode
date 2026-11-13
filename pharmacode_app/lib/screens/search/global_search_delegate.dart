import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme.dart';
import '../../models/syllabus_models.dart';
import '../../services/syllabus_service.dart';
import '../syllabus/subject_detail_screen.dart';

class GlobalSearchDelegate extends SearchDelegate<Subject?> {
  GlobalSearchDelegate()
      : super(
          searchFieldLabel: 'Search subjects, units, topics...',
          searchFieldStyle: GoogleFonts.dmSans(
            color: AppTheme.textDark,
            fontSize: 15,
            fontWeight: FontWeight.w600,
          ),
        );

  @override
  ThemeData appBarTheme(BuildContext context) {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      scaffoldBackgroundColor: AppTheme.background,
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.white,
        elevation: 0,
        scrolledUnderElevation: 0,
        iconTheme: IconThemeData(color: AppTheme.primaryNavy),
      ),
      inputDecorationTheme: InputDecorationTheme(
        border: InputBorder.none,
        hintStyle: GoogleFonts.dmSans(
          color: AppTheme.textMuted,
          fontSize: 15,
        ),
      ),
    );
  }

  @override
  List<Widget>? buildActions(BuildContext context) {
    return [
      if (query.isNotEmpty)
        IconButton(
          icon: const Icon(Icons.clear_rounded, color: AppTheme.textMuted),
          onPressed: () {
            query = '';
          },
        ),
    ];
  }

  @override
  Widget? buildLeading(BuildContext context) {
    return IconButton(
      icon: const Icon(Icons.arrow_back_rounded, color: AppTheme.primaryNavy),
      onPressed: () {
        close(context, null);
      },
    );
  }

  @override
  Widget buildResults(BuildContext context) {
    return _buildSearchResults(context);
  }

  @override
  Widget buildSuggestions(BuildContext context) {
    if (query.trim().isEmpty) {
      return _buildSearchQuickPicks(context);
    }
    return _buildSearchResults(context);
  }

  Widget _buildSearchQuickPicks(BuildContext context) {
    final quickPicks = [
      'Python',
      'AI in Pharma',
      'Pharmacology',
      'Quality Assurance',
      'Medicinal Chemistry',
      'Biopharmaceutics',
      'Regulatory Affairs',
      'Hospital Pharmacy',
    ];

    return ListView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.all(16),
      children: [
        Text(
          'Popular Searches',
          style: GoogleFonts.dmSans(
            color: AppTheme.primaryNavy,
            fontSize: 15,
            fontWeight: FontWeight.w900,
            letterSpacing: -0.2,
          ),
        ),
        const SizedBox(height: 12),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: quickPicks.map((pick) {
            return InkWell(
              onTap: () {
                query = pick;
                showResults(context);
              },
              borderRadius: BorderRadius.circular(10),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: AppTheme.borderSoft, width: 1.5),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.trending_up_rounded, size: 14, color: AppTheme.brandBlue),
                    const SizedBox(width: 6),
                    Text(
                      pick,
                      style: GoogleFonts.dmSans(
                        color: AppTheme.textDark,
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ],
                ),
              ),
            );
          }).toList(),
        ),
      ],
    );
  }

  Widget _buildSearchResults(BuildContext context) {
    final results = SyllabusService().searchSubjects(query);

    if (results.isEmpty) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.search_off_rounded, size: 48, color: AppTheme.textMuted),
              const SizedBox(height: 16),
              Text(
                'No subjects or topics match "$query"',
                textAlign: TextAlign.center,
                style: GoogleFonts.dmSans(
                  color: AppTheme.textDark,
                  fontSize: 15,
                  fontWeight: FontWeight.w700,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Try searching for another keyword like "Pharmacology", "Python", "BP101T", etc.',
                textAlign: TextAlign.center,
                style: GoogleFonts.dmSans(color: AppTheme.textMuted, fontSize: 12),
              ),
            ],
          ),
        ),
      );
    }

    return ListView.builder(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 24),
      itemCount: results.length,
      itemBuilder: (context, index) {
        final sub = results[index];

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
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => SubjectDetailScreen(subject: sub)),
                );
              },
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Top Row: Code Badge + Meta Tag + Chevron
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: const Color(0xFFEEF2FF),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            sub.code,
                            style: GoogleFonts.dmSans(
                              color: const Color(0xFF3730A3),
                              fontWeight: FontWeight.w900,
                              fontSize: 11.5,
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: const Color(0xFFF1F5F9),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            '${sub.credits} Credits · ${sub.typeLabel}',
                            style: GoogleFonts.dmSans(
                              color: const Color(0xFF475569),
                              fontWeight: FontWeight.w700,
                              fontSize: 11,
                            ),
                          ),
                        ),
                        const Spacer(),
                        const Icon(
                          Icons.arrow_forward_ios_rounded,
                          size: 13,
                          color: AppTheme.textMuted,
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),

                    // Full-width Subject Name (No squeezing or weird multi-line wrapping)
                    Text(
                      sub.name,
                      style: GoogleFonts.dmSans(
                        color: AppTheme.primaryNavy,
                        fontWeight: FontWeight.w800,
                        fontSize: 14.5,
                        height: 1.35,
                      ),
                    ),
                    const SizedBox(height: 10),

                    // Bottom info: Units & Syllabus indicator
                    Row(
                      children: [
                        const Icon(
                          Icons.menu_book_rounded,
                          size: 14,
                          color: AppTheme.brandBlue,
                        ),
                        const SizedBox(width: 6),
                        Text(
                          '${sub.units.length} Units PCI Syllabus & Study Notes',
                          style: GoogleFonts.dmSans(
                            color: AppTheme.textMuted,
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
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
    );
  }
}
