// app/syllabus/[semSlug]/[subjectSlug]/page.tsx
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
import { absUrl } from "@/lib/site";
import { faqSchema } from "@/lib/schema";
import {
    Download,
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    Star,
    Link2,
    ClipboardList,
    BookOpen,
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
    const canonical = absUrl(`/syllabus/semester-${sem.num}/${subject.slug}/`);
    const semSuffix = ["1st","2nd","3rd","4th","5th","6th","7th","8th"][sem.num - 1];
    return {
        // Format: "BP101T Python Programming Notes PDF | B.Pharm Sem 1 NEP 2020"
        title: `${subject.code} ${subject.name} Notes | B.Pharm ${semSuffix} Sem NEP 2020`,
        description: `${subject.code} ${subject.name} — Complete ${subject.units.length}-unit syllabus as per PCI NEP 2020. Free PDF notes download. B.Pharm Semester ${sem.num} (${sem.label}). ${subject.credits} credits.`,
        keywords: [
            `${subject.code} notes`,
            `${subject.code} notes PDF`,
            `${subject.code} ${subject.name}`,
            `${subject.name} B.Pharm notes`,
            `${subject.name} notes PDF free download`,
            `${subject.name} syllabus NEP 2020`,
            `B.Pharm semester ${sem.num} ${subject.name.split(" ")[0].toLowerCase()} notes`,
            `${subject.code} unit wise notes`,
            `B.Pharm ${semSuffix} sem ${subject.name.split(" ")[0].toLowerCase()} syllabus`,
            `PCI NEP 2020 ${subject.name}`,
        ],
        alternates: { canonical },
        openGraph: {
            title: `${subject.code} ${subject.name} Notes | PharmaCode`,
            description: `Free PDF notes for ${subject.code} — ${subject.units.length} units, B.Pharm Sem ${sem.num}, NEP 2020.`,
            url: canonical,
            images: [{ url: absUrl("/og-image.png"), width: 1200, height: 630, alt: `${subject.code} ${subject.name} Notes` }],
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
        <div className="bg-white rounded-[14px] overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 border border-[#F0F4FF]">
            {/* Unit header — number circle + title + hours pill */}
            <div className="px-4 sm:px-5 py-3 sm:py-3.5 flex items-center gap-3">
                <div
                    className="shrink-0 w-[30px] h-[30px] sm:w-[32px] sm:h-[32px] rounded-full flex items-center justify-center text-white font-[DM_Sans] font-black text-[11px] sm:text-[12px]"
                    style={{ background: semColor }}
                >
                    {index + 1}
                </div>
                <span className="flex-1 font-[Nunito] font-bold text-[13px] sm:text-[15px] text-[#1A2B6B] leading-snug">
                    {unit.title}
                </span>
                {unit.hours && (
                    <span
                        className="shrink-0 font-[DM_Sans] text-[10px] sm:text-[11px] font-semibold px-2.5 py-[3px] rounded-full whitespace-nowrap"
                        style={{ background: semBg, color: semColor }}
                    >
                        {unit.hours}
                    </span>
                )}
            </div>

            {/* Divider */}
            <div className="mx-4 sm:mx-5 h-px bg-[#F0F4FF]" />

            {/* Sub-topics list */}
            {unit.topics.length > 0 && (
                <div className="px-4 sm:px-5 pt-3 pb-2">
                    <ul className="flex flex-col gap-2">
                        {unit.topics.map((topic, i) => (
                            <li key={i} className="flex gap-2.5 items-start">
                                <span
                                    className="shrink-0 mt-[6px] w-[5px] h-[5px] rounded-sm rotate-45"
                                    style={{ background: semColor, minWidth: 5 }}
                                />
                                <span
                                    className="font-[DM_Sans] text-[12px] sm:text-[13px] text-[#4B5563] leading-[1.65]"
                                    style={{ wordBreak: "break-word" }}
                                >
                                    {topic}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Per-unit download button */}
            <div className="px-4 sm:px-5 py-3">
                <button
                    className="w-full flex items-center justify-center gap-2 py-2 sm:py-2.5 rounded-[10px] text-[12px] sm:text-[13px] font-semibold font-[DM_Sans] transition-all duration-150 hover:opacity-90 active:scale-[0.98]"
                    style={{
                        background: semBg,
                        color: semColor,
                        border: `1.5px solid ${semColor}33`,
                    }}
                >
                    <Download size={13} />
                    Unit {index + 1} Notes PDF
                </button>
            </div>
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
    const canonical = absUrl(`/syllabus/semester-${sem.num}/${subject.slug}/`);

    /* Total lecture hours from units */
    const totalHours = subject.units
        .map((u) => {
            const match = u.hours?.match(/(\d+)/);
            return match ? parseInt(match[1]) : 0;
        })
        .reduce((a, b) => a + b, 0);

    /* JSON-LD — Course Schema */
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
        isAccessibleForFree: true,
        provider: {
            "@type": "EducationalOrganization",
            name: "PharmaCode",
            url: absUrl("/"),
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
            { "@type": "ListItem", position: 1, name: "Home", item: absUrl("/") },
            { "@type": "ListItem", position: 2, name: "Syllabus", item: absUrl("/syllabus/") },
            { "@type": "ListItem", position: 3, name: `Semester ${sem.num}`, item: absUrl(`/syllabus/semester-${sem.num}/`) },
            { "@type": "ListItem", position: 4, name: subject.code, item: canonical },
        ],
    };

    /* FAQ Schema — subject specific common student questions */
    const subjectFaqs = faqSchema([
        {
            q: `What are the units in ${subject.code} ${subject.name}?`,
            a: subject.units.length > 0
                ? `${subject.code} ${subject.name} has ${subject.units.length} units: ${subject.units.map((u,i)=>`Unit ${i+1}: ${u.title}`).join(", ")}.`
                : `${subject.code} ${subject.name} is a ${subject.credits}-credit subject in B.Pharm Semester ${sem.num} as per PCI NEP 2020 curriculum.`,
        },
        {
            q: `How many credits is ${subject.code} in B.Pharm NEP 2020?`,
            a: `${subject.code} (${subject.name}) carries ${subject.credits} credits in B.Pharm Semester ${sem.num} as per PCI NEP 2020 syllabus.`,
        },
        {
            q: `Where can I download ${subject.code} notes PDF for free?`,
            a: `You can download free ${subject.code} ${subject.name} notes PDF from PharmaCode. All unit-wise notes are available without login or registration.`,
        },
    ]);


    return (
        <>
            <JsonLd data={jsonLd} />
            <JsonLd data={breadcrumbLd} />
            <JsonLd data={subjectFaqs} />
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
                    className="rounded-[20px] px-4 py-5 sm:px-5 sm:py-5 mt-4 mb-0"
                    style={{ background: sem.bg, border: `1.5px solid ${sem.color}33` }}
                >
                    {/* Badge row — code, sem, credits, type, key */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-3">
                        <span
                            className="font-mono text-[10px] font-bold px-2 py-[3px] rounded-[6px] bg-[#1A2B6B] text-white"
                        >
                            {subject.code}
                        </span>
                        <span
                            className="font-[DM_Sans] text-[10px] font-bold px-2 py-[3px] rounded-[6px]"
                            style={{ background: sem.color, color: "#fff" }}
                        >
                            Semester {sem.num}
                        </span>
                        <span className="font-[DM_Sans] text-[10px] font-semibold px-2 py-[3px] rounded-[6px] bg-white text-[#4B5563]"
                            style={{ border: `1px solid ${sem.color}33` }}>
                            {subject.credits} credits
                        </span>
                        <span
                            className="font-[DM_Sans] text-[10px] font-semibold px-2 py-[3px] rounded-[6px] bg-white text-[#4B5563]"
                            style={{ border: `1px solid ${sem.color}33` }}
                        >
                            {tm.label}
                        </span>
                        {subject.highlight && (
                            <span className="inline-flex items-center gap-1 font-[DM_Sans] text-[10px] font-bold px-2 py-[3px] rounded-[6px] bg-[#FEF3C7] text-[#92400E]">
                                <Star size={9} fill="currentColor" className="shrink-0" />
                                KEY SUBJECT
                            </span>
                        )}
                    </div>

                    {/* Subject title */}
                    <h1
                        className="font-[Nunito] font-black text-[22px] sm:text-[26px] text-[#1A2B6B] leading-[1.2] mb-2"
                        style={{ wordBreak: "break-word" }}
                    >
                        {subject.name}
                    </h1>

                    {/* Description line */}
                    <p className="font-[DM_Sans] text-[13px] text-[#6B7FA3] leading-[1.6]">
                        Complete unit-wise syllabus for {subject.code} as per the PCI B.Pharm NEP 2020 curriculum
                        {` (Semester ${sem.num} — ${sem.label})`}.
                    </p>
                </div>

                {/* ── CTA Buttons — full width, outside card ───── */}
                <div className="flex flex-col gap-2.5 mt-3 mb-6">
                    <button
                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-[14px] text-white text-[14px] font-bold font-[DM_Sans] transition-all duration-150 hover:opacity-90 hover:shadow-lg active:scale-[0.98]"
                        style={{ background: sem.color }}
                    >
                        <Download size={16} />
                        Download {subject.code} Notes PDF
                    </button>
                    <Link
                        href={`/syllabus/semester-${sem.num}`}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-[14px] text-[14px] font-semibold font-[DM_Sans] bg-white transition-all duration-150 hover:shadow-sm"
                        style={{ border: `1.5px solid ${sem.color}55`, color: sem.color }}
                    >
                        <ArrowLeft size={15} />
                        All Sem {sem.num} Subjects
                    </Link>
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

                {/* ── Bottom CTA ───────────────────────────────── */}
                <div
                    className="mt-8 rounded-[16px] px-4 py-5 sm:px-6 sm:py-6 text-center"
                    style={{ background: sem.bg, border: `1.5px solid ${sem.color}33` }}
                >
                    <p className="font-[Nunito] font-bold text-[14px] sm:text-[15px] text-[#1A2B6B] mb-1">
                        Get complete notes for {subject.code}
                    </p>
                    <p className="font-[DM_Sans] text-[12px] text-[#6B7FA3]">
                        Click any unit above to download its PDF notes — free, no login required
                    </p>
                </div>

                {/* ── What's coming next ───────────────────────── */}
                <div className="mt-6 rounded-[16px] px-4 py-4 sm:px-5 sm:py-5 bg-white border border-[#E8EDFF] shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                        <BookOpen size={17} className="shrink-0" style={{ color: sem.color }} />
                        <h3 className="font-[Nunito] font-extrabold text-[15px] sm:text-[16px] text-[#1A2B6B]">
                            What&apos;s coming next on this page
                        </h3>
                    </div>
                    <ul className="flex flex-col gap-2.5">
                        {[
                            "Reference textbooks and recommended reading list",
                            "Previous year question papers (PYQ)",
                            "Topic-wise short notes and revision summaries",
                            "Suggested external resources and video tutorials",
                        ].map((item) => (
                            <li key={item} className="flex gap-2.5 items-start">
                                <span className="shrink-0 mt-[8px] w-[5px] h-[5px] rounded-full bg-[#9CA3AF]" style={{ minWidth: 5 }} />
                                <span className="font-[DM_Sans] text-[13px] sm:text-[14px] text-[#6B7FA3] leading-[1.6]">
                                    {item}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* ── Other subjects in this semester ──────────── */}
                <div className="mt-8 mb-2">
                    <h3 className="font-[Nunito] font-extrabold text-[17px] sm:text-[19px] text-[#1A2B6B] mb-3">
                        Other subjects in Semester {sem.num}
                    </h3>
                    {/* Grouped card — no gap between rows, divider lines only */}
                    <div className="rounded-[14px] overflow-hidden border border-[#E8EDFF] bg-white">
                        {sem.subjects
                            .filter((s) => s.slug !== subject.slug)
                            .map((s, idx, arr) => {
                                const isTheory = s.type === "T";
                                const typeColors: Record<string, { bg: string; color: string }> = {
                                    T: { bg: "#EEF2FF", color: "#3730A3" },
                                    P: { bg: "#F0FDF4", color: "#14532D" },
                                    I: { bg: "#FFF7ED", color: "#92400E" },
                                    RP: { bg: "#FAF5FF", color: "#581C87" },
                                };
                                const tc = typeColors[s.type] ?? typeColors.T;
                                const isLast = idx === arr.length - 1;
                                return (
                                    <Link
                                        key={s.slug}
                                        href={isTheory ? `/syllabus/semester-${sem.num}/${s.slug}` : `/syllabus/semester-${sem.num}`}
                                        className={`flex items-center gap-3 px-4 py-3.5 hover:bg-[#F8FAFF] active:bg-[#F0F4FF] transition-colors duration-100${!isLast ? " border-b border-[#F0F4FF]" : ""}`}
                                    >
                                        <span
                                            className="shrink-0 font-mono text-[9px] sm:text-[10px] font-bold px-2 py-[3px] rounded-[5px] whitespace-nowrap"
                                            style={{ background: tc.bg, color: tc.color }}
                                        >
                                            {s.code}
                                        </span>
                                        {/* Mobile: truncate after ~28 chars; Desktop: full */}
                                        <span className="font-[DM_Sans] text-[13px] sm:text-[14px] text-[#1A2B6B] leading-snug flex-1 min-w-0 truncate sm:whitespace-normal sm:overflow-visible">
                                            {s.name}
                                        </span>
                                    </Link>
                                );
                            })}
                    </div>
                </div>

                {/* ── Prev / Next Subject navigation ───────────── */}
                {(() => {
                    const allT = sem.subjects.filter((s) => s.type === "T");
                    const idx = allT.findIndex((s) => s.slug === subject.slug);
                    const prevSub = idx > 0 ? allT[idx - 1] : null;
                    const nextSub = idx < allT.length - 1 ? allT[idx + 1] : null;
                    const isLastTheory = idx === allT.length - 1;
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
                            ) : isLastTheory ? (
                                <Link
                                    href={`/syllabus/semester-${sem.num}`}
                                    className="flex-1 sm:flex-none flex items-center justify-end gap-2 px-3 sm:px-4 py-2.5 rounded-[10px] text-[12px] sm:text-[13px] font-semibold font-[DM_Sans] bg-white transition-all hover:shadow-sm"
                                    style={{ border: `1.5px solid ${sem.color}55`, color: sem.color }}
                                >
                                    <span>All Sem {sem.num} Subjects</span>
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
