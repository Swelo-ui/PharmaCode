import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SEMESTERS, TYPE_META, getSemester, getSubject } from "@/lib/syllabus";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import {
    breadcrumbSchema,
    subjectCourseSchema,
} from "@/lib/schema";
import { absUrl } from "@/lib/site";

interface Params {
    semSlug: string;
    subjectSlug: string;
}

function parseSemSlug(slug: string): number | null {
    const m = /^semester-(\d+)$/.exec(slug);
    if (!m) return null;
    const n = Number(m[1]);
    return Number.isInteger(n) && n >= 1 && n <= 8 ? n : null;
}

export function generateStaticParams() {
    return SEMESTERS.flatMap((s) =>
        s.subjects.map((sub) => ({
            semSlug: `semester-${s.num}`,
            subjectSlug: sub.slug,
        })),
    );
}

export async function generateMetadata({
    params,
}: {
    params: Params;
}): Promise<Metadata> {
    const num = parseSemSlug(params.semSlug);
    if (num === null) return { title: "Subject not found" };
    const result = getSubject(num, params.subjectSlug);
    if (!result) return { title: "Subject not found" };

    const { semester, subject } = result;
    const url = absUrl(`/syllabus/semester-${semester.num}/${subject.slug}/`);
    const title = `${subject.code}: ${subject.name} | Sem ${semester.num}`;
    const description = `${subject.code} ${subject.name} — Semester ${semester.num} B.Pharm NEP 2020 syllabus. Unit-wise topics, key concepts and free PDF notes (${subject.credits} credits).`;

    return {
        title,
        description,
        alternates: { canonical: url },
        openGraph: { title, description, url },
    };
}

export default function SubjectPage({ params }: { params: Params }) {
    const num = parseSemSlug(params.semSlug);
    if (num === null) notFound();
    const result = getSubject(num, params.subjectSlug);
    if (!result) notFound();

    const { semester: sem, subject: sub } = result;
    const tm = TYPE_META[sub.type] || TYPE_META.T;

    const breadcrumbs = [
        { name: "Home", href: "/" },
        { name: "Syllabus", href: "/syllabus/" },
        { name: `Semester ${sem.num}`, href: `/syllabus/semester-${sem.num}/` },
        {
            name: sub.code,
            href: `/syllabus/semester-${sem.num}/${sub.slug}/`,
        },
    ];

    // Sibling subjects in same semester for related links
    const siblings = sem.subjects.filter((s) => s.code !== sub.code).slice(0, 6);

    // Find current semester's other key subjects
    const semFromList = getSemester(sem.num)!;

    return (
        <div className="mx-auto max-w-[860px] px-4 sm:px-6 py-6 sm:py-8">
            <JsonLd
                data={[breadcrumbSchema(breadcrumbs), subjectCourseSchema(sem, sub)]}
            />
            <Breadcrumb items={breadcrumbs} />

            {/* Header card — responsive padding */}
            <div
                className="mb-7 rounded-[20px] border-2 px-4 py-4 sm:px-6 sm:py-6"
                style={{ background: sem.bg, borderColor: `${sem.color}44` }}
            >
                <div className="mb-2.5 flex flex-wrap gap-1.5 sm:gap-2">
                    <span
                        className="rounded-md px-2.5 py-[3px] font-mono text-[11px] sm:text-[12px] font-bold"
                        style={{ background: tm.bg, color: tm.color }}
                    >
                        {sub.code}
                    </span>
                    <span
                        className="rounded-md px-2.5 py-[3px] text-[10px] sm:text-[11px] font-semibold"
                        style={{ background: "#fff", color: sem.color }}
                    >
                        Semester {sem.num}
                    </span>
                    <span className="rounded-md bg-[#F0F4FF] px-2.5 py-[3px] text-[10px] sm:text-[11px] font-bold text-secondary">
                        {sub.credits} credits
                    </span>
                    <span
                        className="rounded-md px-2.5 py-[3px] text-[10px] sm:text-[11px] font-semibold"
                        style={{ background: tm.bg, color: tm.color }}
                    >
                        {tm.label}
                    </span>
                    {sub.highlight && (
                        <span className="rounded-md bg-[#FEF3C7] px-2.5 py-[3px] text-[10px] sm:text-[11px] font-bold text-[#92400E]">
                            ★ KEY SUBJECT
                        </span>
                    )}
                </div>
                <h1 className="font-display text-[22px] sm:text-[28px] font-black leading-tight text-primary">
                    {sub.name}
                </h1>
                <p className="mt-2 max-w-prose font-[DM_Sans] text-[13px] sm:text-[14px] text-[#374151] leading-relaxed">
                    Complete unit-wise syllabus for {sub.code} as per the PCI B.Pharm NEP
                    2020 curriculum (Semester {sem.num} — {sem.label}).
                </p>
            </div>

            {/* Download CTA — stacked layout on mobile */}
            <div className="mb-7 flex flex-col sm:flex-row gap-3">
                <button
                    type="button"
                    className="w-full sm:flex-1 py-3 px-5 rounded-[12px] text-[#ffffff] text-[14px] font-bold font-[DM_Sans] transition-all duration-150 hover:opacity-90 hover:shadow-md"
                    style={{ background: sem.color }}
                >
                    📥 Download {sub.code} Notes PDF
                </button>
                <Link
                    href={`/syllabus/semester-${sem.num}/`}
                    className="w-full sm:w-auto text-center py-3 px-5 rounded-[12px] border-[1.5px] bg-white text-[14px] font-semibold font-[DM_Sans] transition-all duration-150 hover:bg-[#EEF2FF]"
                    style={{ borderColor: sem.color, color: sem.color }}
                >
                    ← All Sem {sem.num} Subjects
                </Link>
            </div>

            {/* Units */}
            <h2 className="mb-3 font-display text-[18px] sm:text-[20px] font-extrabold text-primary">
                {sub.type === "T" ? "Unit-wise Syllabus" : "Coverage"}
            </h2>
            <div className="space-y-3">
                {sub.units.map((u, i) => {
                    const [head, ...rest] = u.split(":");
                    const body = rest.join(":").trim();
                    const heading = body ? head : null;
                    const text = body || head;
                    return (
                        <div
                            key={i}
                            className="rounded-[14px] border border-[#E8EDFF] bg-white p-4"
                        >
                            <div className="mb-2 flex items-center gap-2">
                                <span
                                    className="rounded-md px-2 py-0.5 font-display text-[10px] sm:text-[11px] font-extrabold text-white"
                                    style={{ background: sem.color }}
                                >
                                    {sub.type === "T" ? `Unit ${i + 1}` : "•"}
                                </span>
                                {heading && (
                                    <span className="font-display text-[13px] sm:text-[14px] font-bold text-primary">
                                        {heading.replace(/^Unit\s+[IVX0-9]+/i, "").trim() ||
                                            heading}
                                    </span>
                                )}
                            </div>
                            <p className="font-[DM_Sans] text-[13px] sm:text-[14px] leading-[1.6] text-[#374151]">{text}</p>
                        </div>
                    );
                })}
            </div>

            {/* Reference section */}
            <section className="mt-8 rounded-[14px] border border-[#E8EDFF] bg-[#F8FAFF] p-5">
                <h3 className="mb-2 font-display text-[15px] sm:text-[16px] font-extrabold text-primary">
                    📚 What&apos;s coming next on this page
                </h3>
                <ul className="list-disc space-y-1.5 pl-5 font-[DM_Sans] text-[12px] sm:text-[13px] text-[#6B7FA3]">
                    <li>Reference textbooks and recommended reading list</li>
                    <li>Previous year question papers (PYQ)</li>
                    <li>Topic-wise short notes and revision summaries</li>
                    <li>Suggested external resources and video tutorials</li>
                </ul>
            </section>

            {/* Sibling subjects */}
            {siblings.length > 0 && (
                <section className="mt-8">
                    <h3 className="mb-3 font-display text-[15px] sm:text-[16px] font-extrabold text-primary">
                        Other subjects in Semester {sem.num}
                    </h3>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {siblings.map((s) => (
                            <Link
                                key={s.code}
                                href={`/syllabus/semester-${semFromList.num}/${s.slug}/`}
                                className="flex items-center gap-2 rounded-[10px] border border-[#E8EDFF] bg-white px-3 py-2.5 text-[12px] sm:text-[13px] hover:border-[var(--c)] transition-all duration-150"
                                style={
                                    { ["--c" as string]: semFromList.color } as React.CSSProperties
                                }
                            >
                                <span
                                    className="rounded-md px-2 py-0.5 font-mono text-[9px] sm:text-[10px] font-bold"
                                    style={{
                                        background:
                                            (TYPE_META[s.type] || TYPE_META.T).bg,
                                        color: (TYPE_META[s.type] || TYPE_META.T).color,
                                    }}
                                >
                                    {s.code}
                                </span>
                                <span className="truncate text-primary">{s.name}</span>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
