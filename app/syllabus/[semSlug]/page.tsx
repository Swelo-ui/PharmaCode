// app/syllabus/[semSlug]/page.tsx
// Semester detail page — passes semNum to SubjectRow for "View Full Page" links
import { notFound } from "next/navigation";
import Link from "next/link";
import { getSemesterBySlug, getAllSemesters, type Subject } from "@/lib/syllabus";
import SubjectRow from "@/components/SubjectRow";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import {
    ChevronLeft,
    ChevronRight,
    Lightbulb,
    FlaskConical,
    Microscope,
} from "lucide-react";
import type { Metadata } from "next";

export async function generateStaticParams() {
    return getAllSemesters().map((s) => ({ semSlug: `semester-${s.num}` }));
}

export async function generateMetadata({
    params,
}: {
    params: { semSlug: string };
}): Promise<Metadata> {
    const sem = getSemesterBySlug(params.semSlug);
    if (!sem) return {};
    return {
        title: `Semester ${sem.num} B.Pharm Syllabus NEP 2020 | ${sem.credits} Credits`,
        description: `Complete Semester ${sem.num} B.Pharm syllabus as per PCI NEP 2020. ${sem.subjects.length} subjects, ${sem.credits} credits. Unit-wise detailed breakdown and free notes.`,
        alternates: { canonical: `https://pharmacode.in/syllabus/semester-${sem.num}/` },
        openGraph: {
            title: `Semester ${sem.num} B.Pharm Syllabus NEP 2020 | PharmaCode`,
            description: `Complete Semester ${sem.num} B.Pharm syllabus as per PCI NEP 2020. ${sem.subjects.length} subjects, ${sem.credits} credits.`,
            url: `https://pharmacode.in/syllabus/semester-${sem.num}/`,
        },
    };
}

export default function SemesterPage({
    params,
}: {
    params: { semSlug: string };
}) {
    const sem = getSemesterBySlug(params.semSlug);
    if (!sem) notFound();

    const theory = sem.subjects.filter((s: Subject) => s.type === "T");
    const practicals = sem.subjects.filter((s: Subject) => s.type === "P");
    const internship = sem.subjects.filter((s: Subject) => s.type === "I");
    const research = sem.subjects.filter((s: Subject) => s.type === "RP");

    const canonical = `https://pharmacode.in/syllabus/semester-${sem.num}/`;
    const allSems = getAllSemesters();
    const prevSem = sem.num > 1 ? allSems[sem.num - 2] : null;
    const nextSem = sem.num < 8 ? allSems[sem.num] : null;

    const schema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://pharmacode.in/" },
            { "@type": "ListItem", position: 2, name: "Syllabus", item: "https://pharmacode.in/syllabus/" },
            { "@type": "ListItem", position: 3, name: `Semester ${sem.num}`, item: canonical },
        ],
    };

    return (
        <>
            <JsonLd data={schema} />
            <div className="max-w-[960px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
                <Breadcrumb items={[
                    { name: "Home", href: "/" },
                    { name: "Syllabus", href: "/syllabus" },
                    { name: `Semester ${sem.num}`, href: `/syllabus/semester-${sem.num}` },
                ]} />

                {/* ── Header Card ──────────────────────────────── */}
                <div
                    className="rounded-[20px] px-4 py-4 sm:px-7 sm:py-6 mt-4 mb-7"
                    style={{ background: sem.bg, border: `2px solid ${sem.color}44` }}
                >
                    <div className="flex flex-wrap items-start sm:items-center justify-between gap-4">
                        <div className="min-w-0">
                            <div className="flex items-center gap-3 mb-1.5">
                                <h1 className="font-[Nunito] font-black text-[22px] sm:text-[30px] text-[#1A2B6B] leading-tight">
                                    Semester {sem.num}
                                </h1>
                            </div>
                            <p
                                className="font-[DM_Sans] font-semibold text-[13px] sm:text-[14px] mb-1.5"
                                style={{ color: sem.color }}
                            >
                                {sem.label}
                            </p>
                            <code className="font-mono text-[10px] sm:text-[11px] text-[#9CA3AF] break-all">
                                {canonical}
                            </code>
                        </div>
                        <div className="flex flex-wrap gap-2 sm:gap-2.5">
                            {[
                                { v: sem.credits, l: "Credits" },
                                { v: theory.length, l: "Theory" },
                                { v: practicals.length > 0 ? practicals.length : "—", l: "Practical" },
                            ].map(({ v, l }) => (
                                <div
                                    key={l}
                                    className="bg-white rounded-[11px] py-2 px-3 sm:px-4 text-center"
                                    style={{ border: `1px solid ${sem.color}33` }}
                                >
                                    <div
                                        className="font-[Nunito] font-black text-[18px] sm:text-[22px]"
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
                <div className="flex items-start gap-2.5 bg-[#FFFBEB] border border-[#FDE68A] rounded-[10px] px-3 sm:px-4 py-2.5 mb-6">
                    <Lightbulb size={15} className="shrink-0 mt-[1px] text-[#92400E]" />
                    <p className="font-[DM_Sans] text-[12px] sm:text-[13px] text-[#92400E] leading-[1.5]">
                        Click any subject to expand all units with detailed topic content from the official PCI NEP 2020 syllabus
                    </p>
                </div>

                {/* ── Theory Subjects ──────────────────────────── */}
                {theory.length > 0 && (
                    <section className="mb-6">
                        <h2 className="font-[Nunito] font-extrabold text-[18px] sm:text-[20px] text-[#1A2B6B] mb-4">
                            <span className="bg-[#EEF2FF] text-[#3730A3] rounded-[8px] px-3 py-[3px] text-[12px] sm:text-[13px]">
                                Theory Subjects
                            </span>
                        </h2>
                        {theory.map((s: Subject) => (
                            <SubjectRow
                                key={s.code}
                                subject={s}
                                semColor={sem.color}
                                semNum={sem.num}
                            />
                        ))}
                    </section>
                )}

                {/* ── Practical & Electives ────────────────────── */}
                {practicals.length > 0 && (
                    <section className="mb-6">
                        <h2 className="font-[Nunito] font-extrabold text-[18px] sm:text-[20px] text-[#1A2B6B] mb-4">
                            <span className="bg-[#F0FDF4] text-[#14532D] rounded-[8px] px-3 py-[3px] text-[12px] sm:text-[13px]">
                                Practical &amp; Electives
                            </span>
                        </h2>
                        {practicals.map((s: Subject) => (
                            <SubjectRow
                                key={s.code}
                                subject={s}
                                semColor={sem.color}
                                semNum={sem.num}
                            />
                        ))}
                    </section>
                )}

                {/* ── Internship ───────────────────────────────── */}
                {internship.length > 0 && (
                    <section className="mb-6">
                        <h2 className="font-[Nunito] font-extrabold text-[18px] sm:text-[20px] text-[#1A2B6B] mb-4">
                            <span className="bg-[#FFF7ED] text-[#92400E] rounded-[8px] px-3 py-[3px] text-[12px] sm:text-[13px] inline-flex items-center gap-1.5">
                                <FlaskConical size={13} />
                                Internship (Mandatory)
                            </span>
                        </h2>
                        {internship.map((s: Subject) => (
                            <SubjectRow
                                key={s.code}
                                subject={s}
                                semColor={sem.color}
                                semNum={sem.num}
                            />
                        ))}
                    </section>
                )}

                {/* ── Research Project ─────────────────────────── */}
                {research.length > 0 && (
                    <section className="mb-6">
                        <h2 className="font-[Nunito] font-extrabold text-[18px] sm:text-[20px] text-[#1A2B6B] mb-4">
                            <span className="bg-[#FAF5FF] text-[#581C87] rounded-[8px] px-3 py-[3px] text-[12px] sm:text-[13px] inline-flex items-center gap-1.5">
                                <Microscope size={13} />
                                Research Project
                            </span>
                        </h2>
                        {research.map((s: Subject) => (
                            <SubjectRow
                                key={s.code}
                                subject={s}
                                semColor={sem.color}
                                semNum={sem.num}
                            />
                        ))}
                    </section>
                )}

                {/* ── Prev / Next navigation ───────────────────── */}
                <div className="flex justify-between gap-3 mt-8 pt-6 border-t border-[#E8EDFF]">
                    {prevSem ? (
                        <Link
                            href={`/syllabus/semester-${prevSem.num}`}
                            className="flex items-center gap-1.5 px-4 py-2.5 rounded-[10px] text-[13px] font-bold font-[DM_Sans] transition-all duration-150 hover:opacity-90"
                            style={{
                                border: `1.5px solid ${prevSem.color}`,
                                background: prevSem.bg,
                                color: prevSem.color,
                            }}
                        >
                            <ChevronLeft size={15} />
                            Semester {prevSem.num}
                        </Link>
                    ) : (
                        <div />
                    )}
                    {nextSem ? (
                        <Link
                            href={`/syllabus/semester-${nextSem.num}`}
                            className="flex items-center gap-1.5 px-4 py-2.5 rounded-[10px] text-[13px] font-bold font-[DM_Sans] transition-all duration-150 hover:opacity-90"
                            style={{
                                border: `1.5px solid ${nextSem.color}`,
                                background: nextSem.bg,
                                color: nextSem.color,
                            }}
                        >
                            Semester {nextSem.num}
                            <ChevronRight size={15} />
                        </Link>
                    ) : (
                        <div />
                    )}
                </div>
            </div>
        </>
    );
}
