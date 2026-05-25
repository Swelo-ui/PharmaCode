import type { Metadata } from "next";
import { SEMESTERS, TOTAL_CREDITS, TOTAL_SUBJECTS } from "@/lib/syllabus";
import { SemCard } from "@/components/SemCard";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { absUrl } from "@/lib/site";

export const metadata: Metadata = {
    title: "Complete B.Pharm Syllabus NEP 2020 — All 8 Semesters",
    description: `PCI approved B.Pharm syllabus as per NEP 2020 — all 8 semesters, ${TOTAL_CREDITS} credits, ${TOTAL_SUBJECTS}+ subjects with unit-wise breakdown. Python, ML & AI integrated from Sem 1.`,
    alternates: { canonical: absUrl("/syllabus/") },
    openGraph: {
        title: "Complete B.Pharm Syllabus NEP 2020 | PharmaCode",
        description: `All 8 semesters · ${TOTAL_CREDITS} credits · Python & AI integrated.`,
        url: absUrl("/syllabus/"),
    },
};

const STATS: [string, string, string, string][] = [
    ["8", "Semesters", "#EEF2FF", "#4C6EF5"],
    [String(TOTAL_CREDITS), "Credits", "#F0FDF4", "#15803D"],
    [`${TOTAL_SUBJECTS}+`, "Subjects", "#FFF7ED", "#C2410C"],
    ["Free", "Downloads", "#FAF5FF", "#7E22CE"],
];

export default function SyllabusPage() {
    const breadcrumbs = [
        { name: "Home", href: "/" },
        { name: "Syllabus", href: "/syllabus/" },
    ];

    return (
        <div className="mx-auto max-w-[960px] px-5 py-9">
            <JsonLd data={breadcrumbSchema(breadcrumbs)} />
            <Breadcrumb items={breadcrumbs} />

            <h1 className="mb-2.5 font-display text-[36px] font-black text-primary">
                B.Pharm Complete Syllabus — NEP 2020
            </h1>
            <p className="mb-7 max-w-[560px] text-[15px] text-[#6B7FA3]">
                PCI approved curriculum · 8 Semesters · {TOTAL_CREDITS} Total Credits ·
                Python, ML & AI integrated from Semester 1
            </p>

            <div className="mb-9 flex flex-wrap gap-2.5">
                {STATS.map(([n, l, bg, c]) => (
                    <div
                        key={l}
                        className="min-w-[88px] rounded-[12px] px-5 py-3 text-center"
                        style={{ background: bg }}
                    >
                        <div
                            className="font-display text-[22px] font-black"
                            style={{ color: c }}
                        >
                            {n}
                        </div>
                        <div className="text-[11px] text-[#9CA3AF]">{l}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {SEMESTERS.map((s) => (
                    <SemCard key={s.num} sem={s} />
                ))}
            </div>
        </div>
    );
}
