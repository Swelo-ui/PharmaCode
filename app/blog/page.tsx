import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { absUrl } from "@/lib/site";
import { PenLine, ArrowRight, Sparkles } from "lucide-react";

export const metadata: Metadata = {
    title: "Pharmacy Study Tips, Syllabus Guides & Career Advice — Blog",
    description:
        "PharmaCode blog — B.Pharm syllabus guides, GPAT preparation tips, Python & AI in pharmacy, career advice and study strategies for pharmacy students.",
    alternates: { canonical: absUrl("/blog/") },
    keywords: [
        "B.Pharm blog",
        "pharmacy study tips",
        "GPAT preparation tips",
        "B.Pharm NEP 2020 syllabus comparison",
        "Python in pharmacy guides",
        "AI in pharmaceutical sciences blog",
        "pharmacovigilance vs regulatory affairs",
        "pharmacy career advice India",
        "B.Pharm semester 4 internship template",
        "pharmacy student notes updates",
        "pharmacovigilance interview preparation",
        "PV interview guide PDF",
    ],
    openGraph: {
        title: "PharmaCode Blog — Pharmacy Study Guides & Career Tips",
        description: "B.Pharm NEP 2020 syllabus comparison, GPAT preparation tips, Python & AI in pharmacy, and career advice for pharmacy students.",
        url: absUrl("/blog/"),
        images: [{ url: absUrl("/og-image.png"), width: 1200, height: 630, alt: "PharmaCode Blog" }],
    },
};

const POSTS: {
    tag: string;
    title: string;
    date: string;
    color: string;
    bg: string;
    href?: string;
    isNew?: boolean;
}[] = [
    {
        tag: "🎓 Free PV Courses",
        title: "10 Free Pharmacovigilance Courses with Certificates — WHO-UMC Platform",
        date: "Aug 2026",
        color: "#059669",
        bg: "linear-gradient(135deg, #ECFDF5, #F0FDF4, #EEF2FF)",
        href: "/blog/free-pharmacovigilance-courses-who-umc/",
        isNew: true,
    },
    {
        tag: "🔥 PV Interview Kit",
        title: "Pharmacovigilance — Complete Guide & Interview Preparation Kit (44 Pages)",
        date: "Aug 2026",
        color: "#DC2626",
        bg: "linear-gradient(135deg, #FEF2F2, #FFF1F2, #EEF2FF)",
        href: "/blog/pharmacovigilance-interview-preparation-kit/",
        isNew: true,
    },
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
        <div className="mx-auto w-full max-w-[960px] px-5 sm:px-8 py-8 sm:py-10">
            <JsonLd data={breadcrumbSchema(breadcrumbs)} />
            <Breadcrumb items={breadcrumbs} />

            <h1 className="fade-up mb-2 font-display text-[26px] sm:text-[32px] font-black text-primary leading-tight flex items-center gap-3">
                <PenLine size={28} strokeWidth={2.5} className="text-secondary shrink-0" />
                PharmaCode Blog
            </h1>
            <p className="fade-up fade-up-1 mb-7 font-[DM_Sans] text-[13px] sm:text-[14px] text-[#6B7FA3]">
                Study guides, career tips, syllabus analysis and more
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {POSTS.map((p, i) => {
                    const CardWrapper = p.href ? Link : "div";
                    const wrapperProps = p.href ? { href: p.href } : {};

                    return (
                        <article
                            key={i}
                            className={`fade-up fade-up-${Math.min(i + 1, 8)} lift flex flex-col justify-between overflow-hidden rounded-[16px] border bg-white ${p.isNew ? "border-[#FCA5A5] ring-2 ring-[#FCA5A5]/30 shadow-lg" : "border-[#E8EDFF]"}`}
                        >
                            {/* @ts-expect-error polymorphic wrapper */}
                            <CardWrapper {...wrapperProps} className={p.href ? "block" : ""}>
                                <div>
                                    <div
                                        className="px-[18px] pb-3.5 pt-5 relative"
                                        style={{ background: p.bg }}
                                    >
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span
                                                className="rounded-md px-2.5 py-[3px] text-[10px] sm:text-[11px] font-bold"
                                                style={{
                                                    background: `${p.color}22`,
                                                    color: p.color,
                                                }}
                                            >
                                                {p.tag}
                                            </span>
                                            {p.isNew && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-[#DC2626] px-2 py-[2px] text-[9px] font-bold text-white uppercase tracking-wider">
                                                    <Sparkles size={9} strokeWidth={2.5} /> New
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="px-[18px] pt-4">
                                        <h3
                                            className="mb-2.5 font-display text-[14px] sm:text-[15px] font-extrabold leading-tight text-primary line-clamp-2"
                                            style={{ minHeight: "2.5rem" }}
                                        >
                                            {p.title}
                                        </h3>
                                    </div>
                                </div>
                                <div className="px-[18px] pb-[18px] pt-2">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <span className="text-[11px] sm:text-[12px] text-[#9CA3AF]">{p.date}</span>
                                        <span
                                            className="inline-flex items-center gap-1.5 rounded-lg border-[1.5px] bg-transparent px-3.5 py-1.5 text-[11px] sm:text-[12px] font-bold transition-all duration-150 hover:bg-[#F8FAFF]"
                                            style={{ borderColor: p.color, color: p.color }}
                                        >
                                            {p.href ? "View" : "Read"} <ArrowRight size={12} strokeWidth={2.5} />
                                        </span>
                                    </div>
                                </div>
                            </CardWrapper>
                        </article>
                    );
                })}
            </div>
        </div>
    );
}
