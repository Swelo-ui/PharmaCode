// app/syllabus/[semSlug]/[subjectSlug]/page.tsx
// Shows FULL PDF-level detailed syllabus for each subject
import { notFound } from "next/navigation";
import Link from "next/link";
import {
    getSemesterBySlug,
    getSubjectBySlug,
    getAllSemesters,
    type SubjectUnit,
} from "@/lib/syllabus";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import {
    Download,
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    BookOpen,
    Clock,
    CreditCard,
    Star,
    Link2,
    ClipboardList,
    FileText,
} from "lucide-react";
import type { Metadata } from "next";

/* ── Static params ─────────────────────────────────── */
export async function generateStaticParams() {
    const pairs: { semSlug: string; subjectSlug: string }[] = [];
    for (const sem of getAllSemesters())
        for (const sub of sem.subjects)
            pairs.push({ semSlug: `semester-${sem.num}`, subjectSlug: sub.slug });
    return pairs;
}

/* ── Metadata ──────────────────────────────────────── */
export async function generateMetadata({
    params,
}: {
    params: { semSlug: string; subjectSlug: string };
}): Promise<Metadata> {
    const sem = getSemesterBySlug(params.semSlug);
    if (!sem) return {};
    const subject = getSubjectBySlug(sem, params.subjectSlug);
    if (!subject) return {};
    const canonical = `https://pharmacode.in/syllabus/semester-${sem.num}/${subject.slug}/`;
    return {
        title: `${subject.code}: ${subject.name} | Sem ${sem.num} | PharmaCode`,
        description: `${subject.code} ${subject.name} — Complete unit-wise detailed syllabus as per PCI NEP 2020. All ${subject.units.length} units with sub-topics. Free PDF notes download. Semester ${sem.num}.`,
        alternates: { canonical },
        openGraph: {
            title: `${subject.code}: ${subject.name} | PharmaCode`,
            description: `Detailed syllabus for ${subject.name} — Semester ${sem.num}, B.Pharm NEP 2020.`,
            url: canonical,
        },
    };
}

const TYPE_META: Record<string, { label: string; bg: string; color: string }> = {
    T: { label: "Theory", bg: "#EEF2FF", color: "#3730A3" },
    P: { label: "Practical", bg: "#F0FDF4", color: "#14532D" },
    I: { label: "Internship", bg: "#FFF7ED", color: "#92400E" },
    RP: { label: "Research Project", bg: "#FAF5FF", color: "#581C87" },
};

/* ── Unit Card Component ───────────────────────────── */
function UnitCard({
    unit,
    index,
    semColor,
    semBg,
}: {
    unit: SubjectUnit;
    index: number;
    semColor: string;
    semBg: string;
}) {
    return (
        <div
            className="bg-white rounded-[16px] overflow-hidden border border-[#E8EDFF] transition-all duration-200 hover:shadow-md hover:border-opacity-80"
            style={{ borderLeftWidth: 4, borderLeftColor: semColor }}
        >
            {/* Unit header */}
            <div
                className="px-4 sm:px-5 py-3 flex items-center gap-3"
                style={{ background: semBg }}
            >
                <span
                    className="shrink-0 font-[DM_Sans] font-black text-[11px] px-2.5 py-[4px] rounded-[7px] text-white whitespace-nowrap"
                    style={{ background: semColor }}
                >
                    Unit {unit.num}
                </span>
                <span className="font-[Nunito] font-bold text-[14px] sm:text-[15px] text-[#1A2B6B] leading-tight">
                    {unit.title}
                </span>
                {unit.hours && (
                    <span className="ml-auto shrink-0 font-[DM_Sans] text-[11px] text-[#9CA3AF] whitespace-nowrap">
                        {unit.hours}
                    </span>
                )}
            </div>
            {/* Sub-topics list */}
            {unit.topics.length > 0 && (
                <div className="px-4 sm:px-5 py-3 sm:py-4">
                    <ul className="flex flex-col gap-2.5">
                        {unit.topics.map((topic, i) => (
                            <li key={i} className="flex gap-2.5 items-start">
                                <span
                                    className="shrink-0 mt-[5px] w-[6px] h-[6px] rounded-full"
                                    style={{ background: semColor, minWidth: 6 }}
                                />
                                <span
                                    className="font-[DM_Sans] text-[12px] sm:text-[13px] text-[#374151] leading-[1.65]"
                                    style={{ wordBreak: "break-word" }}
                                >
                                    {topic}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

/* ── Page ──────────────────────────────────────────── */
export default function SubjectPage({
    params,
}: {
    params: { semSlug: string; subjectSlug: string };
}) {
    const sem = getSemesterBySlug(params.semSlug);
    if (!sem) notFound();
    const subject = getSubjectBySlug(sem, params.subjectSlug);
    if (!subject) notFound();

    const tm = TYPE_META[subject.type] ?? TYPE_META.T;
    const canonical = `https://pharmacode.in/syllabus/semester-${sem.num}/${subject.slug}/`;

    /* Total lecture hours from units */
    const totalHours = subject.units
        .map((u) => {
            const match = u.hours?.match(/(\d+)/);
            return match ? parseInt(match[1]) : 0;
        })
        .reduce((a, b) => a + b, 0);

    /* JSON-LD */
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Course",
        name: subject.name,
        courseCode: subject.code,
        description: `${subject.code} ${subject.name} — Complete detailed syllabus as per PCI B.Pharm NEP 2020. Semester ${sem.num}.`,
        url: canonical,
        numberOfCredits: subject.credits,
        educationalLevel: "Undergraduate — B.Pharm",
        inLanguage: "en-IN",
        provider: {
            "@type": "Organization",
            name: "PharmaCode",
            url: "https://pharmacode.in",
        },
        hasCourseInstance: {
            "@type": "CourseInstance",
            courseMode: "full-time",
            name: `Semester ${sem.num} — B.Pharm NEP 2020`,
        },
    };

    /* Breadcrumb JSON-LD */
    const breadcrumbLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://pharmacode.in/" },
            { "@type": "ListItem", position: 2, name: "Syllabus", item: "https://pharmacode.in/syllabus/" },
            { "@type": "ListItem", position: 3, name: `Semester ${sem.num}`, item: `https://pharmacode.in/syllabus/semester-${sem.num}/` },
            { "@type": "ListItem", position: 4, name: subject.code, item: canonical },
        ],
    };

    return (
        <>
            <JsonLd data={jsonLd} />
            <JsonLd data={breadcrumbLd} />
            <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
                {/* Breadcrumb */}
                <Breadcrumb
                    items={[
                        { name: "Home", href: "/" },
                        { name: "Syllabus", href: "/syllabus" },
                        { name: `Semester ${sem.num}`, href: `/syllabus/semester-${sem.num}` },
                        { name: subject.code, href: canonical },
                    ]}
                />

                {/* ── Subject Header Card ──────────────────────── */}
                <div
                    className="rounded-[20px] px-4 py-5 sm:px-6 sm:py-6 mt-5 mb-6"
                    style={{ background: sem.bg, border: `2px solid ${sem.color}44` }}
                >
                    {/* Badge row */}
                    <div className="flex flex-wrap gap-2 mb-3">
                        <span
                            className="font-mono text-[10px] sm:text-[11px] font-bold px-2.5 py-[4px] rounded-[7px]"
                            style={{ background: "#1A2B6B", color: "#fff" }}
                        >
                            {subject.code}
                        </span>
                        <span
                            className="font-[DM_Sans] text-[11px] font-bold px-2.5 py-[4px] rounded-[7px]"
                            style={{ background: tm.bg, color: tm.color }}
                        >
                            {tm.label}
                        </span>
                        <span className="font-[DM_Sans] text-[11px] font-bold px-2.5 py-[4px] rounded-[7px] bg-[#F0F4FF] text-[#4C6EF5]">
                            {subject.credits} Credits
                        </span>
                        {totalHours > 0 && (
                            <span className="font-[DM_Sans] text-[11px] font-bold px-2.5 py-[4px] rounded-[7px] bg-[#ECFDF5] text-[#065F46]">
                                {totalHours} Hours
                            </span>
                        )}
                        {subject.highlight && (
                            <span className="font-[DM_Sans] text-[11px] font-bold px-2.5 py-[4px] rounded-[7px] bg-[#FEF3C7] text-[#92400E] flex items-center gap-1">
                                <Star size={10} fill="currentColor" />
                                KEY SUBJECT
                            </span>
                        )}
                        <span
                            className="font-[DM_Sans] text-[11px] font-bold px-2.5 py-[4px] rounded-[7px] text-white"
                            style={{ background: sem.color }}
                        >
                            Semester {sem.num}
                        </span>
                    </div>

                    {/* Subject title H1 */}
                    <h1
                        className="font-[Nunito] font-black text-[20px] sm:text-[26px] md:text-[28px] text-[#1A2B6B] leading-[1.2] mb-4"
                        style={{ wordBreak: "break-word" }}
                    >
                        {subject.name}
                    </h1>

                    {/* Quick stats row */}
                    <div className="flex flex-wrap gap-3 mb-4">
                        {[
                            { icon: <BookOpen size={14} />, label: "Units", value: subject.units.length.toString() },
                            { icon: <Clock size={14} />, label: "Total Hours", value: totalHours > 0 ? `${totalHours}h` : "—" },
                            { icon: <CreditCard size={14} />, label: "Credits", value: subject.credits.toString() },
                        ].map((stat) => (
                            <div
                                key={stat.label}
                                className="flex items-center gap-1.5 bg-white rounded-[10px] px-3 py-2"
                                style={{ border: `1px solid ${sem.color}33` }}
                            >
                                <span className="text-[#6B7FA3]">{stat.icon}</span>
                                <span className="font-[DM_Sans] text-[12px] text-[#6B7FA3]">{stat.label}:</span>
                                <span
                                    className="font-[Nunito] font-bold text-[13px]"
                                    style={{ color: sem.color }}
                                >
                                    {stat.value}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Download + Back CTA buttons */}
                    <div className="flex flex-col sm:flex-row gap-2.5">
                        <button
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-[11px] text-white text-[13px] sm:text-[14px] font-bold font-[DM_Sans] transition-all duration-150 hover:opacity-90 hover:shadow-md active:scale-[0.98]"
                            style={{ background: sem.color }}
                        >
                            <Download size={15} />
                            Download {subject.code} Notes PDF
                        </button>
                        <Link
                            href={`/syllabus/semester-${sem.num}`}
                            className="flex items-center justify-center gap-2 px-5 py-3 rounded-[11px] text-[13px] sm:text-[14px] font-semibold font-[DM_Sans] bg-white transition-all duration-150 hover:shadow-sm"
                            style={{
                                border: `1.5px solid ${sem.color}66`,
                                color: sem.color,
                            }}
                        >
                            <ArrowLeft size={15} />
                            All Sem {sem.num} Subjects
                        </Link>
                    </div>
                </div>

                {/* ── SEO: Canonical URL display ───────────────── */}
                <div className="flex items-center gap-2 mb-6 px-3 py-2 bg-[#F8FAFF] rounded-[8px] border border-[#E8EDFF]">
                    <Link2 size={13} className="text-[#9CA3AF] shrink-0" />
                    <span className="font-[DM_Sans] text-[11px] text-[#9CA3AF]">URL:</span>
                    <code className="font-mono text-[10px] sm:text-[11px] text-[#4C6EF5] break-all">
                        {canonical}
                    </code>
                </div>

                {/* ── Unit-wise Detailed Syllabus ───────────────── */}
                {subject.units.length > 0 ? (
                    <section>
                        <div className="flex items-center gap-3 mb-5">
                            <h2 className="font-[Nunito] font-extrabold text-[18px] sm:text-[20px] text-[#1A2B6B]">
                                Unit-wise Syllabus
                            </h2>
                            <span
                                className="font-[DM_Sans] text-[11px] font-bold px-2.5 py-[3px] rounded-[6px] text-white"
                                style={{ background: sem.color }}
                            >
                                {subject.units.length} Units
                            </span>
                        </div>
                        <div className="flex flex-col gap-3 sm:gap-4">
                            {subject.units.map((unit, i) => (
                                <UnitCard
                                    key={unit.num}
                                    unit={unit}
                                    index={i}
                                    semColor={sem.color}
                                    semBg={sem.bg}
                                />
                            ))}
                        </div>
                    </section>
                ) : (
                    /* No units yet — placeholder */
                    <div
                        className="rounded-[16px] px-5 py-10 text-center"
                        style={{ background: sem.bg, border: `1.5px dashed ${sem.color}55` }}
                    >
                        <div className="flex justify-center mb-3">
                            <ClipboardList size={36} className="text-[#9CA3AF]" />
                        </div>
                        <p className="font-[Nunito] font-bold text-[15px] text-[#1A2B6B] mb-1">
                            Detailed Syllabus Coming Soon
                        </p>
                        <p className="font-[DM_Sans] text-[13px] text-[#6B7FA3]">
                            Check back shortly or download the notes PDF for full content.
                        </p>
                    </div>
                )}

                {/* ── Bottom Download CTA ───────────────────────── */}
                <div
                    className="mt-8 rounded-[16px] px-4 py-5 sm:px-6 sm:py-6 text-center"
                    style={{ background: sem.bg, border: `1.5px solid ${sem.color}33` }}
                >
                    <p className="font-[Nunito] font-bold text-[14px] sm:text-[15px] text-[#1A2B6B] mb-1.5">
                        Get complete notes for {subject.code}
                    </p>
                    <p className="font-[DM_Sans] text-[12px] text-[#6B7FA3] mb-3">
                        PDF notes covering all {subject.units.length} units — free, no login required
                    </p>
                    <button
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-[11px] text-white text-[14px] font-bold font-[DM_Sans] transition-all duration-150 hover:opacity-90 hover:shadow-md"
                        style={{ background: sem.color }}
                    >
                        <Download size={15} />
                        Download Free PDF Notes
                    </button>
                </div>

                {/* ── Prev / Next Subject navigation ───────────── */}
                {(() => {
                    const allT = sem.subjects.filter((s) => s.type === "T");
                    const idx = allT.findIndex((s) => s.slug === subject.slug);
                    const prevSub = idx > 0 ? allT[idx - 1] : null;
                    const nextSub = idx < allT.length - 1 ? allT[idx + 1] : null;
                    return (
                        <div className="flex justify-between gap-3 mt-6 pt-6 border-t border-[#E8EDFF]">
                            {prevSub ? (
                                <Link
                                    href={`/syllabus/semester-${sem.num}/${prevSub.slug}`}
                                    className="flex-1 sm:flex-none flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-[10px] text-[12px] sm:text-[13px] font-semibold font-[DM_Sans] bg-white transition-all hover:shadow-sm"
                                    style={{ border: `1.5px solid ${sem.color}55`, color: sem.color }}
                                >
                                    <ChevronLeft size={15} />
                                    <span className="truncate max-w-[120px] sm:max-w-[180px]">{prevSub.code}</span>
                                </Link>
                            ) : (
                                <div />
                            )}
                            {nextSub ? (
                                <Link
                                    href={`/syllabus/semester-${sem.num}/${nextSub.slug}`}
                                    className="flex-1 sm:flex-none flex items-center justify-end gap-2 px-3 sm:px-4 py-2.5 rounded-[10px] text-[12px] sm:text-[13px] font-semibold font-[DM_Sans] bg-white transition-all hover:shadow-sm"
                                    style={{ border: `1.5px solid ${sem.color}55`, color: sem.color }}
                                >
                                    <span className="truncate max-w-[120px] sm:max-w-[180px]">{nextSub.code}</span>
                                    <ChevronRight size={15} />
                                </Link>
                            ) : (
                                <div />
                            )}
                        </div>
                    );
                })()}
            </div>
        </>
    );
}
