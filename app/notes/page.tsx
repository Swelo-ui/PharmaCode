import type { Metadata } from "next";
import Link from "next/link";
import { SEMESTERS } from "@/lib/syllabus";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, itemListSchema } from "@/lib/schema";
import { absUrl } from "@/lib/site";
import { Download, FileText, Star } from "lucide-react";

export const metadata: Metadata = {
    title: "B.Pharm Notes PDF Free Download — All 8 Semesters NEP 2020 | PharmaCode",
    description:
        "Free B.Pharm notes PDF download — all 8 semesters as per PCI NEP 2020 syllabus. Unit-wise notes for 50+ subjects including Pharmacology, Medicinal Chemistry, Python, AI. No login required.",
    keywords: [
        "B.Pharm notes PDF free download",
        "B.Pharm notes free download all semester",
        "pharmacy notes PDF NEP 2020",
        "B.Pharm 1st sem notes PDF",
        "B.Pharm 2nd sem notes PDF",
        "B.Pharm 3rd sem notes PDF",
        "B.Pharm 4th sem notes PDF",
        "B.Pharm 5th sem notes PDF",
        "B.Pharm 6th sem notes PDF",
        "B.Pharm 7th sem notes PDF",
        "B.Pharm 8th sem notes PDF",
        "pharmacology notes B.Pharm PDF",
        "medicinal chemistry notes B.Pharm",
        "pharmaceutical chemistry notes PDF",
        "B.Pharm Python programming notes",
        "biochemistry B.Pharm notes",
        "free pharmacy study material India",
        "B.Pharm notes without login",
        "PCI NEP 2020 notes PDF",
    ],
    alternates: { canonical: absUrl("/notes/") },
    openGraph: {
        title: "B.Pharm Notes PDF Free Download — All Semesters | PharmaCode",
        description: "Free B.Pharm PDF notes for all 8 semesters. PCI NEP 2020 syllabus. No login required.",
        url: absUrl("/notes/"),
        images: [{ url: absUrl("/og-image.png"), width: 1200, height: 630, alt: "PharmaCode Free B.Pharm Notes PDF" }],
    },
};

export default function NotesPage() {
    const breadcrumbs = [
        { name: "Home", href: "/" },
        { name: "Notes", href: "/notes/" },
    ];

    // ItemList schema — sab theory subjects ki list
    const allNotes = SEMESTERS.flatMap((sem) =>
        sem.subjects
            .filter((s) => s.type === "T" && s.units.length > 0)
            .map((s, i) => ({
                name: `${s.code} ${s.name} Notes PDF — B.Pharm Sem ${sem.num}`,
                url: `/syllabus/semester-${sem.num}/${s.slug}/`,
                position: i + 1,
            }))
    ).map((item, i) => ({ ...item, position: i + 1 }));

    return (
        <div className="mx-auto w-full max-w-[960px] px-5 sm:px-8 py-8 sm:py-10">
            <JsonLd data={breadcrumbSchema(breadcrumbs)} />
            <JsonLd data={itemListSchema(allNotes)} />
            <Breadcrumb items={breadcrumbs} />


            <h1 className="fade-up mb-2 font-display text-[26px] sm:text-[32px] font-black text-primary leading-tight flex items-center gap-3">
                <Download size={28} strokeWidth={2.5} className="text-secondary shrink-0" />
                B.Pharm Notes — Free Download
            </h1>
            <p className="fade-up fade-up-1 mb-7 font-[DM_Sans] text-[13px] sm:text-[14px] text-[#6B7FA3]">
                PCI NEP 2020 · All 8 Semesters · PDF format · No login required
            </p>

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 md:grid-cols-3">
                {SEMESTERS.flatMap((sem, si) =>
                    sem.subjects
                        .filter((s) => s.type === "T" && s.units.length > 0)
                        .slice(0, 2)
                        .map((s, ci) => (
                            <article
                                key={sem.num + s.code}
                                className={`fade-up fade-up-${Math.min(si * 2 + ci + 1, 8)} lift flex flex-col justify-between gap-3.5 rounded-[14px] border border-[#E8EDFF] bg-white p-[18px]`}
                            >
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center gap-1">
                                        <span
                                            className="rounded-md px-2.5 py-[3px] text-[10px] sm:text-[11px] font-bold"
                                            style={{ background: sem.badge, color: sem.color }}
                                        >
                                            Sem {sem.num}
                                        </span>
                                        {s.highlight && (
                                            <span className="inline-flex items-center gap-1 rounded-md bg-[#FEF9C3] px-2 py-[3px] text-[9px] sm:text-[10px] font-bold text-[#854D0E] whitespace-nowrap">
                                                <Star size={9} strokeWidth={2.5} className="fill-[#854D0E]" />
                                                KEY SUBJECT
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <div
                                            className="mb-1 font-mono text-[10px] sm:text-[11px]"
                                            style={{ color: sem.color }}
                                        >
                                            {s.code}
                                        </div>
                                        <Link
                                            href={`/syllabus/semester-${sem.num}/${s.slug}/`}
                                            className="block text-[13px] sm:text-[14px] font-semibold leading-snug text-primary hover:underline hover:text-secondary line-clamp-2"
                                            style={{ minHeight: "2.8rem" }}
                                        >
                                            {s.name}
                                        </Link>
                                    </div>
                                </div>
                                <div className="space-y-2.5">
                                    {/* Stats row — handles wrapping cleanly */}
                                    <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] sm:text-[11px] text-[#9CA3AF]">
                                        <span className="flex items-center gap-1">
                                            <FileText size={11} strokeWidth={2} />
                                            PDF · ~2.4 MB · {s.units.length} Units
                                        </span>
                                        <span className="whitespace-nowrap flex items-center gap-1">
                                            <Download size={11} strokeWidth={2} />
                                            1.4k downloads
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        className="flex w-full items-center justify-center gap-2 rounded-[10px] py-2.5 text-[12px] font-bold text-white transition-all duration-150 hover:opacity-90 hover:shadow-sm active:scale-[0.98]"
                                        style={{ background: sem.color }}
                                    >
                                        <Download size={13} strokeWidth={2.5} />
                                        Download Free
                                    </button>
                                </div>
                            </article>
                        )),
                )}
            </div>
        </div>
    );
}
