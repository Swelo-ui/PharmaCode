import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SEMESTERS, getSemester } from "@/lib/syllabus";
import { SubjectRow } from "@/components/SubjectRow";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, semesterCourseSchema } from "@/lib/schema";
import { absUrl } from "@/lib/site";

interface Params {
    semSlug: string;
}

/** Parse "semester-3" → 3. Returns null if invalid. */
function parseSemSlug(slug: string): number | null {
    const m = /^semester-(\d+)$/.exec(slug);
    if (!m) return null;
    const n = Number(m[1]);
    return Number.isInteger(n) && n >= 1 && n <= 8 ? n : null;
}

export function generateStaticParams() {
    return SEMESTERS.map((s) => ({ semSlug: `semester-${s.num}` }));
}

export async function generateMetadata({
    params,
}: {
    params: Params;
}): Promise<Metadata> {
    const num = parseSemSlug(params.semSlug);
    const sem = num !== null ? getSemester(num) : undefined;
    if (!sem) return { title: "Semester not found" };

    const url = absUrl(`/syllabus/${params.semSlug}/`);
    const title = `Semester ${sem.num} B.Pharm Syllabus NEP 2020 | ${sem.credits} Credits`;
    const description = `Semester ${sem.num} B.Pharm syllabus as per PCI NEP 2020 — ${sem.label}. ${sem.subjects.length} subjects, ${sem.credits} credits, full unit-wise breakdown with free PDF notes.`;

    return {
        title,
        description,
        alternates: { canonical: url },
        openGraph: { title, description, url },
    };
}

export default function SemesterPage({ params }: { params: Params }) {
    const num = parseSemSlug(params.semSlug);
    const sem = num !== null ? getSemester(num) : undefined;
    if (!sem) notFound();

    const breadcrumbs = [
        { name: "Home", href: "/" },
        { name: "Syllabus", href: "/syllabus/" },
        { name: `Semester ${sem.num}`, href: `/syllabus/semester-${sem.num}/` },
    ];

    const theory = sem.subjects.filter((s) => s.type === "T");
    const practical = sem.subjects.filter((s) => s.type === "P");
    const internships = sem.subjects.filter((s) => s.type === "I");
    const research = sem.subjects.filter((s) => s.type === "RP");

    const stats = [
        { v: sem.credits, l: "Credits" },
        { v: theory.length, l: "Theory" },
        { v: practical.length || "—", l: "Practical" },
    ];

    const prev = SEMESTERS.find((s) => s.num === sem.num - 1);
    const next = SEMESTERS.find((s) => s.num === sem.num + 1);

    return (
        <div className="mx-auto max-w-[960px] px-4 sm:px-6 py-6 sm:py-8">
            <JsonLd
                data={[breadcrumbSchema(breadcrumbs), semesterCourseSchema(sem)]}
            />
            <Breadcrumb items={breadcrumbs} />

            {/* ── Semester Header Card ─────────────────────
                FIX: px-4 py-4 on mobile → sm:px-7 sm:py-6
                FIX: H1 text-[22px] → sm:text-[30px]
                FIX: break-all on URL code element
            ─────────────────────────────────────────────── */}
            <div
                className="mb-7 rounded-[20px] border-2 px-4 py-4 sm:px-7 sm:py-6 mt-4"
                style={{ background: sem.bg, borderColor: `${sem.color}44` }}
            >
                <div className="flex flex-wrap items-start sm:items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                        <div className="mb-1.5 flex items-center gap-3">
                            <span
                                className="flex h-[42px] w-[42px] sm:w-[46px] sm:h-[46px] items-center justify-center rounded-[13px] font-display text-[18px] sm:text-[20px] font-black text-white shrink-0"
                                style={{ background: sem.color }}
                            >
                                {sem.num}
                            </span>
                            <h1 className="font-display text-[22px] sm:text-[30px] font-black text-primary leading-tight">
                                Semester {sem.num}
                            </h1>
                        </div>
                        <div
                            className="mb-1.5 font-[DM_Sans] text-[13px] sm:text-[14px] font-semibold"
                            style={{ color: sem.color }}
                        >
                            {sem.label}
                        </div>
                        <code className="font-mono text-[10px] sm:text-[11px] text-[#9CA3AF] break-all">
                            pharmacode.in/syllabus/semester-{sem.num}/
                        </code>
                    </div>

                    {/* Stats boxes */}
                    <div className="flex flex-wrap gap-2 sm:gap-2.5">
                        {stats.map(({ v, l }) => (
                            <div
                                key={l}
                                className="rounded-[11px] border bg-white px-3 sm:px-[18px] py-2 text-center"
                                style={{ borderColor: `${sem.color}33` }}
                            >
                                <div
                                    className="font-display text-[18px] sm:text-[22px] font-black"
                                    style={{ color: sem.color }}
                                >
                                    {v}
                                </div>
                                <div className="font-[DM_Sans] text-[10px] sm:text-[11px] text-[#9CA3AF]">{l}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tip banner */}
            <div className="mb-6 flex items-start gap-2.5 rounded-[10px] border border-[#FDE68A] bg-[#FFFBEB] px-3 sm:px-4 py-2.5">
                <span className="text-[14px] shrink-0 mt-[1px]" aria-hidden>💡</span>
                <span className="font-[DM_Sans] text-[12px] sm:text-[13px] text-[#92400E] leading-[1.5]">
                    Click any subject to expand all 5 units and access free PDF notes
                </span>
            </div>

            {/* Theory */}
            {theory.length > 0 && (
                <section className="mb-6">
                    <h2 className="mb-3.5 flex items-center gap-2 font-display text-[18px] sm:text-[20px] font-extrabold text-primary">
                        <span className="rounded-lg bg-[#EEF2FF] px-3.5 py-[3px] text-[12px] sm:text-[13px] text-[#3730A3]">
                            Theory Subjects
                        </span>
                    </h2>
                    {theory.map((s) => (
                        <SubjectRow
                            key={s.code}
                            sub={s}
                            semNum={sem.num}
                            semColor={sem.color}
                        />
                    ))}
                </section>
            )}

            {/* Practical */}
            {practical.length > 0 && (
                <section className="mb-6">
                    <h2 className="mb-3.5 mt-6 flex items-center gap-2 font-display text-[18px] sm:text-[20px] font-extrabold text-primary">
                        <span className="rounded-lg bg-[#F0FDF4] px-3.5 py-[3px] text-[12px] sm:text-[13px] text-[#14532D]">
                            Practical &amp; Electives
                        </span>
                    </h2>
                    {practical.map((s) => (
                        <SubjectRow
                            key={s.code}
                            sub={s}
                            semNum={sem.num}
                            semColor={sem.color}
                        />
                    ))}
                </section>
            )}

            {/* Internships */}
            {internships.length > 0 && (
                <section className="mb-6">
                    <h2 className="mb-3.5 mt-6 flex items-center gap-2 font-display text-[18px] sm:text-[20px] font-extrabold text-primary">
                        <span className="rounded-lg bg-[#FFF7ED] px-3.5 py-[3px] text-[12px] sm:text-[13px] text-[#92400E]">
                            🏭 Internship (Mandatory)
                        </span>
                    </h2>
                    {internships.map((s) => (
                        <SubjectRow
                            key={s.code}
                            sub={s}
                            semNum={sem.num}
                            semColor={sem.color}
                        />
                    ))}
                </section>
            )}

            {/* Research Project */}
            {research.length > 0 && (
                <section className="mb-6">
                    <h2 className="mb-3.5 mt-6 flex items-center gap-2 font-display text-[18px] sm:text-[20px] font-extrabold text-primary">
                        <span className="rounded-lg bg-[#FAF5FF] px-3.5 py-[3px] text-[12px] sm:text-[13px] text-[#581C87]">
                            🔬 Research Project
                        </span>
                    </h2>
                    {research.map((s) => (
                        <SubjectRow
                            key={s.code}
                            sub={s}
                            semNum={sem.num}
                            semColor={sem.color}
                        />
                    ))}
                </section>
            )}

            {/* Prev / Next navigation */}
            <div className="mt-8 flex justify-between gap-3">
                {prev ? (
                    <Link
                        href={`/syllabus/semester-${prev.num}/`}
                        className="rounded-[10px] border-[1.5px] px-4 py-2.5 text-[13px] font-bold transition-all duration-150 hover:opacity-90"
                        style={{
                            borderColor: prev.color,
                            background: prev.bg,
                            color: prev.color,
                        }}
                    >
                        ← Semester {prev.num}
                    </Link>
                ) : (
                    <span />
                )}
                {next ? (
                    <Link
                        href={`/syllabus/semester-${next.num}/`}
                        className="rounded-[10px] border-[1.5px] px-4 py-2.5 text-[13px] font-bold transition-all duration-150 hover:opacity-90"
                        style={{
                            borderColor: next.color,
                            background: next.bg,
                            color: next.color,
                        }}
                    >
                        Semester {next.num} →
                    </Link>
                ) : (
                    <span />
                )}
            </div>
        </div>
    );
}
