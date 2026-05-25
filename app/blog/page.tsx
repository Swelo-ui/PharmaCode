import type { Metadata } from "next";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { absUrl } from "@/lib/site";

export const metadata: Metadata = {
    title: "Pharmacy Study Tips, Syllabus Guides & Career Advice — Blog",
    description:
        "PharmaCode blog — B.Pharm syllabus guides, GPAT preparation tips, Python & AI in pharmacy, career advice and study strategies for pharmacy students.",
    alternates: { canonical: absUrl("/blog/") },
};

const POSTS = [
    {
        tag: "Syllabus Guide",
        title: "B.Pharm NEP 2020 vs Old Curriculum — Complete Comparison",
        date: "May 2026",
        color: "#4C6EF5",
        bg: "#EEF2FF",
    },
    {
        tag: "Python in Pharma",
        title: "BP101T Python Programming — Beginner's Guide for Pharmacy Students",
        date: "May 2026",
        color: "#10B981",
        bg: "#ECFDF5",
    },
    {
        tag: "AI & Pharma",
        title: "BP604T AI in Pharmaceutical Sciences — All Units Explained",
        date: "Apr 2026",
        color: "#06B6D4",
        bg: "#ECFEFF",
    },
    {
        tag: "Career",
        title: "Pharmacovigilance vs Regulatory Affairs — Which Career to Choose?",
        date: "Apr 2026",
        color: "#F97316",
        bg: "#FFF7ED",
    },
    {
        tag: "GPAT Prep",
        title: "GPAT 2027 High-Weightage Topics from NEP 2020 Syllabus",
        date: "Mar 2026",
        color: "#8B5CF6",
        bg: "#F5F3FF",
    },
    {
        tag: "Internship",
        title: "How to Make the Most of Your Semester 4 Mandatory Internship",
        date: "Mar 2026",
        color: "#EC4899",
        bg: "#FDF2F8",
    },
];

export default function BlogPage() {
    const breadcrumbs = [
        { name: "Home", href: "/" },
        { name: "Blog", href: "/blog/" },
    ];

    return (
        <div className="mx-auto max-w-[960px] px-5 py-9">
            <JsonLd data={breadcrumbSchema(breadcrumbs)} />
            <Breadcrumb items={breadcrumbs} />

            <h1 className="mb-2 font-display text-[32px] font-black text-primary">
                📝 PharmaCode Blog
            </h1>
            <p className="mb-7 text-[14px] text-[#6B7FA3]">
                Study guides, career tips, syllabus analysis and more
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {POSTS.map((p, i) => (
                    <article
                        key={i}
                        className="overflow-hidden rounded-[16px] border border-[#E8EDFF] bg-white"
                    >
                        <div className="px-[18px] pb-3.5 pt-5" style={{ background: p.bg }}>
                            <span
                                className="rounded-md px-2.5 py-[3px] text-[11px] font-bold"
                                style={{
                                    background: `${p.color}22`,
                                    color: p.color,
                                }}
                            >
                                {p.tag}
                            </span>
                        </div>
                        <div className="px-[18px] pb-[18px] pt-4">
                            <h3 className="mb-2.5 font-display text-[15px] font-extrabold leading-tight text-primary">
                                {p.title}
                            </h3>
                            <div className="flex items-center justify-between">
                                <span className="text-[12px] text-[#9CA3AF]">{p.date}</span>
                                <button
                                    type="button"
                                    className="rounded-lg border-[1.5px] bg-transparent px-3.5 py-1.5 text-[12px] font-bold"
                                    style={{ borderColor: p.color, color: p.color }}
                                >
                                    Read →
                                </button>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}
