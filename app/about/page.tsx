import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { absUrl } from "@/lib/site";
import {
    Sparkles, ShieldCheck, Compass, FileCheck2,
    Briefcase, GraduationCap, ArrowRight,
    BookOpen, Award, Target, HelpCircle, Newspaper, Library, Users2, FileText,
    TrendingUp, UserCheck, CheckCircle2
} from "lucide-react";

export const metadata: Metadata = {
    title: "About PharmaCode — Your Career. Our Guidance. Real Opportunities.",
    description:
        "Learn about PharmaCode — India's trusted platform for B.Pharm students & graduates. Guiding you into QA, RA, Pharmacovigilance, and Clinical Research roles with free notes and career support.",
    alternates: { canonical: absUrl("/about/") },
    keywords: [
        "About PharmaCode",
        "PharmaCode career guidance",
        "B.Pharm career opportunities",
        "Pharmacovigilance guidance freshers",
        "Regulatory Affairs career B.Pharm",
        "QA QC pharmacy jobs India",
        "PCI NEP 2020 free study material",
    ],
    openGraph: {
        title: "About PharmaCode — Code · Cure · Care",
        description: "Your Career. Our Guidance. Real Opportunities. Empowering B.Pharm Students & Graduates.",
        url: absUrl("/about/"),
        images: [{ url: absUrl("/pic3.jpg"), width: 1200, height: 630, alt: "PharmaCode Career Guidance & Notes" }],
    },
};

export default function AboutPage() {
    const breadcrumbs = [
        { name: "Home", href: "/" },
        { name: "About", href: "/about/" },
    ];

    const aboutSchema = {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        name: "About PharmaCode",
        description: "India's trusted career guidance & NEP 2020 syllabus platform for B.Pharm students.",
        url: absUrl("/about/"),
        mainEntity: {
            "@type": "EducationalOrganization",
            name: "PharmaCode",
            url: absUrl("/"),
            logo: absUrl("/logo.png"),
            description: "Guiding B.Pharm graduates into QA, RA, Pharmacovigilance, and Clinical Research.",
        },
    };

    return (
        <div className="mx-auto w-full max-w-[1080px] px-3.5 xs:px-5 sm:px-8 py-6 sm:py-10">
            <JsonLd data={breadcrumbSchema(breadcrumbs)} />
            <JsonLd data={aboutSchema} />
            <Breadcrumb items={breadcrumbs} />

            {/* ── HERO BANNER ── */}
            <div className="relative overflow-hidden rounded-[20px] sm:rounded-[24px] bg-gradient-to-br from-[#0F1D5C] via-[#1A2B6B] to-[#3B59C8] p-5 xs:p-6 sm:p-10 text-white mb-6 sm:mb-8 shadow-xl border border-white/10">
                {/* Glow Background blobs */}
                <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#4C6EF5]/25 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#93C5FD]/15 blur-3xl pointer-events-none" />

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
                    <div className="lg:col-span-7 space-y-3.5 sm:space-y-4">
                        {/* Live badge */}
                        <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-[10px] sm:text-[12px] font-semibold text-[#93C5FD] backdrop-blur-md flex-wrap">
                            <Sparkles size={13} className="text-[#6EE7B7] shrink-0" />
                            <span>PharmaCode • Code • Cure • Care</span>
                        </div>

                        <h1 className="font-display text-[24px] xs:text-[28px] sm:text-[40px] font-black leading-[1.15] tracking-tight">
                            Your Career. <span className="text-[#6EE7B7]">Our Guidance.</span>
                            <br />
                            <span className="text-[#FCA5A5]">Real Opportunities.</span>
                        </h1>

                        <p className="font-[DM_Sans] text-[13.5px] sm:text-[16px] text-[#C7D2FE] leading-relaxed max-w-[580px]">
                            Guiding B.Pharm graduates and students into pharma industry roles — QA, RA, Pharmacovigilance, and Clinical Research.
                        </p>

                        {/* Speech Bubble Pill */}
                        <div className="inline-flex items-center gap-2 rounded-xl bg-white/15 border border-white/20 px-3.5 py-2 text-[12px] sm:text-[13px] font-bold text-white backdrop-blur-sm max-w-full">
                            <span>💬 Let&apos;s build your future together!</span>
                        </div>

                        {/* CTA Row */}
                        <div className="pt-2 flex flex-col xs:flex-row flex-wrap gap-2.5 sm:gap-3">
                            <Link
                                href="/career/"
                                className="w-full xs:w-auto px-5 sm:px-6 py-3 rounded-[12px] bg-white text-[#0F1D5C] font-[DM_Sans] font-bold text-[13px] sm:text-[14px] hover:bg-[#EEF2FF] shadow-lg transition-all flex items-center justify-center gap-2"
                            >
                                Explore Career Guidance <ArrowRight size={16} />
                            </Link>
                            <Link
                                href="/notes/"
                                className="w-full xs:w-auto px-5 sm:px-6 py-3 rounded-[12px] bg-white/10 text-white border border-white/25 font-[DM_Sans] font-semibold text-[13px] sm:text-[14px] hover:bg-white/20 transition-all flex items-center justify-center"
                            >
                                Free Study Notes
                            </Link>
                        </div>
                    </div>

                    {/* Right side poster graphic (pic1.png) */}
                    <div className="lg:col-span-5 flex justify-center">
                        <div className="relative rounded-[16px] sm:rounded-[20px] overflow-hidden border-2 border-white/20 shadow-2xl bg-white/5 backdrop-blur-sm p-1.5 sm:p-2 hover:scale-[1.01] transition-transform duration-300 w-full max-w-[500px]">
                            <Image
                                src="/pic1.png"
                                alt="PharmaCode — Your Career. Our Guidance. Real Opportunities."
                                width={600}
                                height={400}
                                className="rounded-[12px] sm:rounded-[16px] object-cover w-full h-auto"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* ── METRICS STATS BAR (FROM PIC3.JPG) ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-12">
                {[
                    { label: "5000+ Happy Students", sub: "Guided Nationwide", icon: UserCheck, color: "#2563EB", bg: "#EFF6FF" },
                    { label: "100+ Expert Resources", sub: "PCI Syllabus Aligned", icon: BookOpen, color: "#059669", bg: "#ECFDF5" },
                    { label: "100+ Industry Insights", sub: "QA, QC, PV & RA", icon: TrendingUp, color: "#D97706", bg: "#FFFBEB" },
                    { label: "Daily Updated Content", sub: "News & Job Alerts", icon: Sparkles, color: "#E11D48", bg: "#FFF1F2" },
                ].map((stat) => (
                    <div
                        key={stat.label}
                        className="rounded-[16px] border border-[#E8EDFF] bg-white p-3.5 sm:p-4 text-center flex flex-col items-center justify-center shadow-2xs hover:shadow-md transition-shadow"
                    >
                        <div
                            className="w-10 h-10 rounded-[12px] flex items-center justify-center mb-2"
                            style={{ background: stat.bg, color: stat.color }}
                        >
                            <stat.icon size={20} />
                        </div>
                        <span className="font-display font-black text-[14px] sm:text-[16px] text-[#1A2B6B] leading-tight">
                            {stat.label}
                        </span>
                        <span className="font-[DM_Sans] text-[11px] sm:text-[12px] text-[#6B7FA3] mt-0.5">
                            {stat.sub}
                        </span>
                    </div>
                ))}
            </div>

            {/* ── TRUST BADGES ROW ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 mb-8 sm:mb-12">
                {[
                    { label: "Industry-Focused Guidance", icon: Target, bg: "#EEF2FF", color: "#3730A3" },
                    { label: "100% Personalized Support", icon: Users2, bg: "#ECFDF5", color: "#065F46" },
                    { label: "Real Growth Opportunities", icon: Award, bg: "#FFF7ED", color: "#92400E" },
                    { label: "Trusted by Pharma Students", icon: ShieldCheck, bg: "#FAF5FF", color: "#581C87" },
                ].map((item) => (
                    <div
                        key={item.label}
                        className="rounded-[14px] sm:rounded-[16px] border border-[#E8EDFF] bg-white p-3 sm:p-4 text-center flex flex-col items-center justify-center gap-1.5 sm:gap-2 shadow-2xs hover:shadow-md transition-shadow"
                    >
                        <div
                            className="w-9 h-9 sm:w-10 sm:h-10 rounded-[10px] sm:rounded-[12px] flex items-center justify-center shrink-0"
                            style={{ background: item.bg, color: item.color }}
                        >
                            <item.icon size={18} />
                        </div>
                        <span className="font-[DM_Sans] font-bold text-[11px] sm:text-[13px] text-[#1A2B6B] leading-tight">
                            {item.label}
                        </span>
                    </div>
                ))}
            </div>

            {/* ── CORE MISSION & SLOGAN CARD ── */}
            <div className="rounded-[18px] sm:rounded-[20px] border-2 border-[#DDE8FF] bg-gradient-to-r from-[#F8FAFF] via-white to-[#EEF2FF] p-5 sm:p-8 mb-8 sm:mb-12 shadow-2xs">
                <div className="max-w-[800px] mx-auto text-center space-y-3 sm:space-y-4">
                    <span className="inline-block px-3 py-1 rounded-full bg-[#1A2B6B] text-white font-[DM_Sans] text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider">
                        Our Core Philosophy
                    </span>
                    <h2 className="font-display text-[20px] xs:text-[22px] sm:text-[30px] font-black text-[#1A2B6B] leading-tight">
                        &ldquo;We Don&apos;t Just Coach, We Care.&rdquo;
                    </h2>
                    <p className="font-[DM_Sans] text-[13.5px] xs:text-[15px] sm:text-[17px] text-[#4B5563] font-medium leading-relaxed max-w-[720px] mx-auto">
                        &ldquo;Let&apos;s <span className="font-extrabold text-[#2563EB]">Code</span> a Better Career. Let&apos;s <span className="font-extrabold text-[#059669]">Cure</span> with Knowledge. Let&apos;s <span className="font-extrabold text-[#E11D48]">Care</span> for Better Tomorrow.&rdquo;
                    </p>
                    <div className="pt-1">
                        <div className="inline-flex items-center justify-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-[#EEF2FF] text-[#3730A3] font-[DM_Sans] font-bold text-[12px] sm:text-[14px] border border-[#C7D2FE] max-w-full text-center">
                            <span>🎯 Our Mission: Empower Every Pharma Student To Build A Meaningful &amp; Successful Career.</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── SERVICES WE PROVIDE (COMPACT MOBILE FRIENDLY LAYOUT) ── */}
            <div className="mb-10 sm:mb-14">
                <div className="text-center mb-6 sm:mb-8">
                    <h2 className="font-display text-[22px] sm:text-[32px] font-black text-[#1A2B6B]">
                        Services &amp; Career Guidance We Offer
                    </h2>
                    <p className="font-[DM_Sans] text-[13px] sm:text-[14px] text-[#6B7FA3]">
                        Comprehensive support for B.Pharm students from Semester 1 through industry placement
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
                    {[
                        {
                            icon: Compass,
                            title: "Career Guidance",
                            desc: "Choose the right path in QA, QC, Production, Pharmacovigilance (PV), Regulatory Affairs (RA), CRO & clinical research.",
                            bg: "#EEF2FF",
                            color: "#4C6EF5",
                        },
                        {
                            icon: FileCheck2,
                            title: "Resume Building",
                            desc: "ATS-friendly, role-specific resumes crafted to highlight pharmaceutical competencies and get noticed by recruiters.",
                            bg: "#ECFDF5",
                            color: "#10B981",
                        },
                        {
                            icon: Briefcase,
                            title: "Interview Preparation",
                            desc: "HR & Technical rounds with real interview questions, case processing logic, MedDRA coding & mock practice.",
                            bg: "#FFF1F2",
                            color: "#F43F5E",
                        },
                        {
                            icon: Target,
                            title: "Career Path Clarity",
                            desc: "In-depth insights based on real pharma industry trends, salary structures, and growth trajectories.",
                            bg: "#FFF7ED",
                            color: "#F97316",
                        },
                        {
                            icon: GraduationCap,
                            title: "Industry Hiring Insights",
                            desc: "NEP 2020 aligned opportunities, skill maps, and hiring updates from top Indian & multinational pharma companies.",
                            bg: "#F5F3FF",
                            color: "#8B5CF6",
                        },
                        {
                            icon: BookOpen,
                            title: "Preparation Guides",
                            desc: "Unit-wise notes, practical manuals, formula cheat-sheets, SOP summaries & comprehensive study resources.",
                            bg: "#ECFEFF",
                            color: "#06B6D4",
                        },
                    ].map((s) => (
                        <div
                            key={s.title}
                            className="rounded-[14px] sm:rounded-[18px] border border-[#E8EDFF] bg-white p-4 sm:p-5 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-start"
                        >
                            <div className="flex items-center gap-3 mb-2.5">
                                <div
                                    className="w-9 h-9 sm:w-11 sm:h-11 rounded-[10px] sm:rounded-[12px] flex items-center justify-center shrink-0"
                                    style={{ background: s.bg, color: s.color }}
                                >
                                    <s.icon size={20} />
                                </div>
                                <h3 className="font-display text-[15px] sm:text-[17px] font-bold text-[#1A2B6B] leading-tight">
                                    {s.title}
                                </h3>
                            </div>
                            <p className="font-[DM_Sans] text-[12.5px] sm:text-[13px] text-[#4B5563] leading-relaxed">
                                {s.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── SMART PREPARATION KNOWLEDGE HUB ── */}
            <div className="rounded-[20px] sm:rounded-[24px] bg-[#F8FAFF] border border-[#E0E8FF] p-5 sm:p-10 mb-10 sm:mb-14">
                <div className="max-w-[700px] mb-6 sm:mb-8">
                    <span className="text-[11px] sm:text-[12px] font-bold text-[#4C6EF5] uppercase tracking-wider font-[DM_Sans] block mb-1">
                        Smart Preparation. Strong Knowledge. Successful Interview.
                    </span>
                    <h2 className="font-display text-[20px] sm:text-[30px] font-black text-[#1A2B6B]">
                        PharmaCode Knowledge &amp; Resource Hub
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
                    {[
                        {
                            title: "Daily Pharma News Digest",
                            desc: "Stay informed with daily global pharma updates, regulatory warnings, and industry developments.",
                            icon: Newspaper,
                        },
                        {
                            title: "Preparation Guides",
                            desc: "Detailed guides on QA, QC, PV, RA, Production, and clinical research methodologies.",
                            icon: FileText,
                        },
                        {
                            title: "Knowledge Bank",
                            desc: "Essential concepts, SOPs, Abbreviations, Flowcharts, Shortcuts & revision tricks.",
                            icon: Library,
                        },
                        {
                            title: "Job & Internship Updates",
                            desc: "Verified pharma jobs & internship slot guidance from top pharmaceutical companies.",
                            icon: Briefcase,
                        },
                        {
                            title: "Interview Resources",
                            desc: "Common questions, sample answers, scenario-based questions & interview tips.",
                            icon: HelpCircle,
                        },
                        {
                            title: "Study Resources",
                            desc: "PCI NEP 2020 unit-wise PDF notes, ebooks, cheat sheets & exam practice material.",
                            icon: BookOpen,
                        },
                    ].map((item) => (
                        <div key={item.title} className="rounded-[14px] sm:rounded-[16px] bg-white border border-[#E8EDFF] p-4 sm:p-5 shadow-2xs">
                            <div className="flex items-center gap-2.5 mb-2">
                                <div className="p-1.5 rounded-[8px] bg-[#EEF2FF] text-[#4C6EF5] shrink-0">
                                    <item.icon size={16} />
                                </div>
                                <h3 className="font-display text-[14px] sm:text-[15px] font-bold text-[#1A2B6B] leading-tight">
                                    {item.title}
                                </h3>
                            </div>
                            <p className="font-[DM_Sans] text-[12px] sm:text-[12.5px] text-[#4B5563] leading-relaxed">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── OFFICIAL CAREER POSTERS SHOWCASE (PERFECT MATCHED PAIR PIC3 & PIC4) ── */}
            <div className="mb-10 sm:mb-14">
                <div className="text-center mb-6 sm:mb-8">
                    <h2 className="font-display text-[22px] sm:text-[30px] font-black text-[#1A2B6B]">
                        PharmaCode Official Career &amp; Success Posters
                    </h2>
                    <p className="font-[DM_Sans] text-[13px] sm:text-[14px] text-[#6B7FA3]">
                        Empowering B.Pharm students and graduates for a brighter tomorrow
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-stretch">
                    {/* Left Poster (pic3.jpg) */}
                    <div className="rounded-[20px] border-2 border-[#E0E8FF] bg-white p-3.5 sm:p-5 shadow-xl flex flex-col justify-between hover:scale-[1.01] transition-transform duration-300">
                        <div>
                            <Image
                                src="/pic3.jpg"
                                alt="PharmaCode Student Success & Guidance Poster"
                                width={700}
                                height={990}
                                className="rounded-[14px] sm:rounded-[16px] w-full h-auto object-cover"
                            />
                        </div>
                        <div className="mt-3.5 text-center">
                            <p className="font-display font-black text-[15px] sm:text-[16px] text-[#1A2B6B]">
                                Student Guidance &amp; Success Roadmap
                            </p>
                            <p className="font-[DM_Sans] text-[12px] text-[#6B7FA3] mt-0.5">
                                Your Career. Our Guidance. Real Opportunities.
                            </p>
                        </div>
                    </div>

                    {/* Right Poster (pic4.jpg) */}
                    <div className="rounded-[20px] border-2 border-[#E0E8FF] bg-white p-3.5 sm:p-5 shadow-xl flex flex-col justify-between hover:scale-[1.01] transition-transform duration-300">
                        <div>
                            <Image
                                src="/pic4.jpg"
                                alt="PharmaCode Career Partner & Community Poster"
                                width={700}
                                height={990}
                                className="rounded-[14px] sm:rounded-[16px] w-full h-auto object-cover"
                            />
                        </div>
                        <div className="mt-3.5 text-center">
                            <p className="font-display font-black text-[15px] sm:text-[16px] text-[#1A2B6B]">
                                Community &amp; Smart Resource Hub
                            </p>
                            <p className="font-[DM_Sans] text-[12px] text-[#6B7FA3] mt-0.5">
                                Right Guidance. Real Opportunities. Stronger Tomorrow.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
