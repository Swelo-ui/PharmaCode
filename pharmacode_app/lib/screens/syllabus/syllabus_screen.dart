import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/constants/app_spacing.dart';
import '../../core/theme.dart';
import '../../core/widgets/ad_native_card.dart';
import '../../core/widgets/empty_state_view.dart';
import '../../core/widgets/error_state_view.dart';
import '../../core/widgets/shimmer_skeleton.dart';
import '../../features/syllabus/presentation/syllabus_controller.dart';
import '../../features/syllabus/presentation/widgets/subject_card.dart';
import '../../models/syllabus_models.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';

class SyllabusScreen extends ConsumerStatefulWidget {
  final int initialSemester;

  const SyllabusScreen({super.key, this.initialSemester = 1});

  @override
  ConsumerState<SyllabusScreen> createState() => _SyllabusScreenState();
}

class _SyllabusScreenState extends ConsumerState<SyllabusScreen>
    with TickerProviderStateMixin {
  TabController? _tabCtrl;
  String _searchQuery = '';
  int _expandedSubject = -1;

  void _setupTabController(int count) {
    if (_tabCtrl != null && _tabCtrl!.length == count) return;
    _tabCtrl?.dispose();
    final idx = (widget.initialSemester - 1).clamp(0, count - 1);
    _tabCtrl = TabController(length: count, vsync: this, initialIndex: idx);
    _tabCtrl!.addListener(() {
      if (mounted) {
        setState(() {
          _expandedSubject = -1;
          _searchQuery = '';
        });
      }
    });
  }

  @override
  void dispose() {
    _tabCtrl?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final semestersAsync = ref.watch(semestersFutureProvider);

    return semestersAsync.when(
      loading: () => Scaffold(
        backgroundColor: Theme.of(context).scaffoldBackgroundColor,
        body: const Padding(
          padding: AppSpacing.screenPadding,
          child: ShimmerListLoader(itemCount: 6, itemSkeleton: ShimmerSubjectCard()),
        ),
      ),
      error: (error, _) => Scaffold(
        backgroundColor: Theme.of(context).scaffoldBackgroundColor,
        body: ErrorStateView(
          errorMessage: error.toString(),
          onRetry: () => ref.refresh(semestersFutureProvider),
        ),
      ),
      data: (semesters) {
        if (semesters.isEmpty) {
          return const Scaffold(
            body: EmptyStateView(
              icon: Icons.menu_book_rounded,
              title: 'No Semesters Found',
              message: 'Syllabus content is currently unavailable.',
            ),
          );
        }

        _setupTabController(semesters.length);

        return Column(
          children: [
            // ─── Tab Bar ─────────────────────────────────────────────
            Container(
              color: Colors.white,
              child: TabBar(
                controller: _tabCtrl,
                isScrollable: true,
                tabAlignment: TabAlignment.start,
                padding: const EdgeInsets.fromLTRB(16, 8, 16, 0),
                labelPadding: const EdgeInsets.symmetric(horizontal: 4),
                indicator: const UnderlineTabIndicator(
                  borderSide: BorderSide(width: 0, color: Colors.transparent),
                ),
                dividerColor: Colors.transparent,
                tabs: List.generate(semesters.length, (i) {
                  final semNum = semesters[i].num;
                  final isSelected = (_tabCtrl?.index ?? 0) == i;
                  final color = AppTheme.getSemesterColor(semNum);
                  final bg = AppTheme.getSemesterBg(semNum);

                  return Tab(
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 200),
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
                      decoration: BoxDecoration(
                        color: isSelected ? color : bg,
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Text(
                        'Sem $semNum',
                        style: GoogleFonts.dmSans(
                          fontWeight: FontWeight.w800,
                          fontSize: 12.5,
                          color: isSelected ? Colors.white : color,
                        ),
                      ),
                    ),
                  );
                }),
              ),
            ),

            const Divider(height: 1, color: AppTheme.borderSoft),

            // ─── Tab Views ───────────────────────────────────────────
            Expanded(
              child: TabBarView(
                controller: _tabCtrl,
                physics: const BouncingScrollPhysics(),
                children: List.generate(
                  semesters.length,
                  (i) => _buildSemesterTab(semesters[i]),
                ),
              ),
            ),
          ],
        );
      },
    );
  }

  Widget _buildSemesterTab(Semester sem) {
    final color = AppTheme.getSemesterColor(sem.num);
    final bg = AppTheme.getSemesterBg(sem.num);

    final filteredSubjects = _searchQuery.isEmpty
        ? sem.subjects
        : sem.subjects.where((s) {
            final q = _searchQuery.toLowerCase();
            return s.name.toLowerCase().contains(q) ||
                s.code.toLowerCase().contains(q) ||
                s.units.any((u) => u.title.toLowerCase().contains(q));
          }).toList();

    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 32),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Semester Info Card
          Container(
            padding: AppSpacing.paddingMd,
            decoration: BoxDecoration(
              color: bg,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: color.withValues(alpha: 0.3)),
            ),
            child: Row(
              children: [
                Container(
                  width: 44,
                  height: 44,
                  decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(12)),
                  alignment: Alignment.center,
                  child: Text(
                    '${sem.num}',
                    style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 20),
                  ),
                ),
                const SizedBox(width: AppSpacing.md),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Semester ${sem.num}',
                        style: GoogleFonts.dmSans(color: color, fontWeight: FontWeight.w900, fontSize: 16),
                      ),
                      Text(
                        '${sem.subjects.length} Subjects · ${sem.credits} Total Credits · PCI NEP 2020',
                        style: GoogleFonts.dmSans(color: AppTheme.textBody, fontSize: 11.5, fontWeight: FontWeight.w500),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: AppSpacing.md),

          // Search Field
          TextField(
            onChanged: (val) => setState(() => _searchQuery = val.trim()),
            decoration: InputDecoration(
              hintText: 'Search semester ${sem.num} subjects or units...',
              prefixIcon: const Icon(Icons.search_rounded, size: 20, color: AppTheme.textMuted),
              suffixIcon: _searchQuery.isNotEmpty
                  ? IconButton(
                      icon: const Icon(Icons.clear_rounded, size: 18),
                      onPressed: () => setState(() => _searchQuery = ''),
                    )
                  : null,
            ),
          ),

          const SizedBox(height: AppSpacing.md),

          // Subject Cards
          if (filteredSubjects.isEmpty)
            const Padding(
              padding: EdgeInsets.only(top: 32),
              child: EmptyStateView(
                icon: Icons.search_off_rounded,
                title: 'No Matching Subjects',
                message: 'Try searching with a different subject code or topic keyword.',
              ),
            )
          else
            ...List.generate(filteredSubjects.length, (idx) {
              final sub = filteredSubjects[idx];
              final isExp = _expandedSubject == idx;

              return Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  SubjectCard(
                    subject: sub,
                    semesterNum: sem.num,
                    isExpanded: isExp,
                    onToggleExpand: () {
                      setState(() {
                        _expandedSubject = isExp ? -1 : idx;
                      });
                    },
                  ),
                  if ((idx + 1) % 3 == 0 && idx != filteredSubjects.length - 1)
                    const AdNativeCard(
                      templateType: TemplateType.small,
                      margin: EdgeInsets.only(bottom: 12),
                    ),
                ],
              );
            }),
        ],
      ),
    );
  }
}
