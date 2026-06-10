import type { Metadata } from "next";
import { SEMESTERS, TOTAL_CREDITS, TOTAL_SUBJECTS } from "@/lib/syllabus";
import { SemCard } from "@/components/SemCard";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { absUrl } from "@/lib/site";

export const metadata: Metadata = {
    title: "B.Pharm Complete Syllabus NEP 2020 — All 8 Semesters | PCI Approved",
    description: `Complete B.Pharm syllabus as per PCI NEP 2020 — all 8 semesters, ${TOTAL_SUBJECTS}+ subjects, ${TOTAL_CREDITS} credits. Unit-wise breakdown with Python, ML & AI topics. Free notes PDF for every subject.`,
    keywords: [
        "B.Pharm syllabus NEP 2020",
        "B.Pharm complete syllabus all semesters",
        "PCI NEP 2020 syllabus PDF",
        "B.Pharm 1st semester syllabus",
        "B.Pharm 2nd semester syllabus",
        "B.Pharm 3rd semester syllabus",
        "B.Pharm 4th semester syllabus",
        "B.Pharm 5th semester syllabus",
        "B.Pharm 6th semester syllabus",
        "B.Pharm 7th semester syllabus",
        "B.Pharm 8th semester syllabus",
        "pharmacy syllabus 2024 2025 2026",
        "B.Pharm subjects list NEP 2020",
        "B.Pharm credits semester wise",
        "new pharmacy syllabus India",
        "B.Pharm Python programming syllabus",
        "B.Pharm AI machine learning subjects",
        "GPAT syllabus B.Pharm",
    ],
    alternates: { canonical: absUrl("/syllabus/") },
    openGraph: {
        title: "B.Pharm Complete Syllabus NEP 2020 — All 8 Semesters | PharmaCode",
        description: `All ${TOTAL_SUBJECTS}+ subjects · ${TOTAL_CREDITS} credits · Python & AI integrated · Free notes PDF`,
        url: absUrl("/syllabus/"),
        images: [{ url: absUrl("/og-image.png"), width: 1200, height: 630, alt: "PharmaCode B.Pharm NEP 2020 Syllabus" }],
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

    const faqs = [
        {
            q: "What is B.Pharm NEP 2020 syllabus?",
            a: "B.Pharm NEP 2020 (National Education Policy 2020) is the latest PCI-approved curriculum for Bachelor of Pharmacy in India. It covers 8 semesters with modern subjects like Python Programming, Machine Learning, AI in Pharmacy, Biopharmaceutics, and mandatory internships. Total credits are structured semester-wise.",
        },
        {
            q: "How many semesters are there in B.Pharm NEP 2020?",
            a: "B.Pharm NEP 2020 has 8 semesters spread over 4 years. Each semester has theory subjects, practical subjects, and some semesters include mandatory internships or research projects.",
        },
        {
            q: "Is Python compulsory in B.Pharm NEP 2020?",
            a: "Yes, BP101T (Basics of Python Programming for Pharmaceutical Sciences) is compulsory in Semester 1 of B.Pharm NEP 2020. Python, Machine Learning (Sem 3), and AI Applications in Pharmaceutical Sciences (Sem 6) are key new-age subjects integrated throughout the curriculum.",
        },
        {
            q: "Where can I download B.Pharm NEP 2020 notes for free?",
            a: "PharmaCode provides free unit-wise B.Pharm notes PDF for all 8 semesters as per PCI NEP 2020 syllabus. No login or registration required. Visit the Notes section on PharmaCode for all subject PDFs.",
        },
        {
            q: "What subjects are there in B.Pharm Semester 1 NEP 2020?",
            a: "B.Pharm Semester 1 NEP 2020 includes: BP101T Python Programming, BP102T General Pharmacy, BP103T Healthcare Psychology & Communication Skills, BP104T Human Anatomy Physiology & Pathophysiology I, BP105T Introduction to Pharmacognosy, and BP106T Pharmaceutical Inorganic & Analytical Chemistry.",
        },
    ];

    return (
        <div className="mx-auto w-full max-w-[960px] px-5 sm:px-8 py-8 sm:py-10">
            <JsonLd data={breadcrumbSchema(breadcrumbs)} />
            <JsonLd data={faqSchema(faqs)} />
            <Breadcrumb items={breadcrumbs} />


            <h1 className="fade-up mb-2.5 font-display text-[26px] sm:text-[36px] font-black text-primary leading-tight">
                B.Pharm Complete Syllabus — NEP 2020
            </h1>
            <p className="fade-up fade-up-1 mb-7 max-w-[560px] font-[DM_Sans] text-[14px] sm:text-[15px] text-[#6B7FA3]">
                PCI approved curriculum · 8 Semesters · {TOTAL_CREDITS} Total Credits ·
                Python, ML &amp; AI integrated from Semester 1
            </p>

            {/* Stats pills */}
            <div className="mb-9 flex flex-wrap gap-2 sm:gap-2.5">
                {STATS.map(([n, l, bg, c], i) => (
                    <div
                        key={l}
                        className={`scale-in fade-up-${i + 1} rounded-[12px] py-2.5 px-3 sm:px-5 text-center flex-1 sm:flex-none`}
                        style={{ background: bg, minWidth: "clamp(72px, 18vw, 88px)" }}
                    >
                        <div className="font-display text-[18px] sm:text-[22px] font-black" style={{ color: c }}>{n}</div>
                        <div className="font-[DM_Sans] text-[10px] sm:text-[11px] text-[#9CA3AF]">{l}</div>
                    </div>
                ))}
            </div>

            {/* Semester grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {SEMESTERS.map((s, i) => (
                    <div key={s.num} className={`fade-up fade-up-${Math.min(i + 1, 8)}`}>
                        <SemCard sem={s} />
                    </div>
                ))}
            </div>
        </div>
    );
}
