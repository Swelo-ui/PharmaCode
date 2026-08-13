import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { absUrl } from "@/lib/site";
import {
    Briefcase, CheckCircle2, ArrowRight, ShieldCheck,
    Building, Microscope, HeartPulse, Sparkles
} from "lucide-react";

export const metadata: Metadata = {
    title: "B.Pharm Career Guidance — QA, QC, PV, RA & Clinical Research | PharmaCode",
    description:
        "PharmaCode Career Partner — guidance into Pharmacovigilance (PV), Regulatory Affairs (RA), QA/QC, and Clinical Research with ATS resume building and interview prep.",
    alternates: { canonical: absUrl("/career/") },
    keywords: [
        "B.Pharm career guidance",
        "pharmacovigilance jobs freshers",
        "regulatory affairs career path",
        "pharma QA QC job preparation",
        "clinical research career B.Pharm",
        "ATS resume for pharmacy students",
        "pharma interview preparation kit",
    ],
    openGraph: {
        title: "B.Pharm Career Guidance & Placement Support — PharmaCode",
        description: "Right Guidance. Real Opportunities. Better Tomorrow. Career support for B.Pharm students.",
        url: absUrl("/career/"),
        images: [{ url: absUrl("/pic2.jpg"), width: 1200, height: 630, alt: "PharmaCode Career Guidance" }],
    },
};

export default function CareerPage() {
    const breadcrumbs = [
        { name: "Home", href: "/" },
        { name: "Career Guidance", href: "/career/" },
    ];

    return (
        <div className="mx-auto w-full max-w-[1080px] px-3.5 xs:px-5 sm:px-8 py-6 sm:py-10">
            <JsonLd data={breadcrumbSchema(breadcrumbs)} />
            <Breadcrumb items={breadcrumbs} />

            {/* ── HERO BANNER (MATCHES PV KIT BLOG STYLING) ── */}
            <div className="rounded-[20px] sm:rounded-[24px] bg-gradient-to-r from-[#0F1D5C] via-[#1A2B6B] to-[#2E4BAD] p-5 sm:p-8 md:p-10 text-white mb-8 sm:mb-10 shadow-lg">
                
                {/* 2-Pill Badge System — PV Kit Style */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#10B981]/25 border border-[#10B981]/40 px-3.5 py-1 text-[11px] font-extrabold text-[#6EE7B7] uppercase tracking-wider shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                        ✨ India&apos;s Most Trusted Platform
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-3.5 py-1 text-[11px] font-extrabold text-white/90 uppercase tracking-wider">
                        B.Pharm Students &amp; Graduates
                    </span>
                </div>

                <h1 className="font-display text-[24px] xs:text-[28px] sm:text-[40px] font-black leading-[1.15] mb-3 tracking-tight">
                    Right Guidance. <span className="text-[#6EE7B7]">Real Opportunities.</span>
                    <br />
                    <span className="text-[#FCA5A5]">Better Tomorrow.</span>
                </h1>
                <p className="font-[DM_Sans] text-[13.5px] sm:text-[16px] text-[#C7D2FE] max-w-[640px] leading-relaxed mb-6">
                    PharmaCode is your career partner, guiding you with preparation, knowledge &amp; real industry opportunities in Pharmacovigilance, Regulatory Affairs, QA/QC, and Clinical Research.
                </p>
                <div className="flex flex-col xs:flex-row flex-wrap gap-2.5 sm:gap-3">
                    <Link
                        href="/blog/pharmacovigilance-interview-preparation-kit/"
                        className="w-full xs:w-auto px-5 py-3 rounded-[12px] bg-white text-[#0F1D5C] font-[DM_Sans] font-bold text-[13px] sm:text-[14px] hover:bg-[#EEF2FF] shadow-md transition-all flex items-center justify-center gap-2"
                    >
                        PV Interview Kit (44 Pages) <ArrowRight size={15} />
                    </Link>
                    <Link
                        href="/notes/"
                        className="w-full xs:w-auto px-5 py-3 rounded-[12px] bg-white/10 text-white border border-white/25 font-[DM_Sans] font-semibold text-[13px] sm:text-[14px] hover:bg-white/20 transition-all flex items-center justify-center"
                    >
                        Free Study Notes
                    </Link>
                </div>
            </div>

            {/* ── CAREER DOMAINS IN PHARMA ── */}
            <div className="mb-10 sm:mb-14">
                <div className="text-center mb-6 sm:mb-8">
                    <h2 className="font-display text-[22px] sm:text-[30px] font-black text-[#1A2B6B]">
                        Key Pharma Industry Career Paths
                    </h2>
                    <p className="font-[DM_Sans] text-[12.5px] sm:text-[13px] text-[#6B7FA3]">
                        Explore core sectors open to B.Pharm graduates under the PCI NEP 2020 framework
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
                    {[
                        {
                            title: "Pharmacovigilance (PV)",
                            desc: "ICSR case processing, MedDRA coding, adverse event reporting, WHO-UMC causality assessment, and signal detection.",
                            icon: HeartPulse,
                            tag: "High Demand",
                            color: "#DC2626",
                            bg: "#FEF2F2",
                            href: "/blog/pharmacovigilance-interview-preparation-kit/",
                        },
                        {
                            title: "Regulatory Affairs (RA)",
                            desc: "eCTD dossiers, FDA/EMA filings, drug approval workflows, labeling compliance (BP707T), and regulatory audit prep.",
                            icon: Building,
                            tag: "Core Sector",
                            color: "#2563EB",
                            bg: "#EFF6FF",
                            href: "/syllabus/semester-7/bp707t-regulatory-affairs/",
                        },
                        {
                            title: "Quality Assurance & QC",
                            desc: "HPLC, Dissolution, GMP, GLP, validation, OOS/OOT investigation (BP505T), and ICH Q8/Q9/Q10 quality systems.",
                            icon: ShieldCheck,
                            tag: "Industry Standard",
                            color: "#059669",
                            bg: "#ECFDF5",
                            href: "/syllabus/semester-5/bp505t-pharmaceutical-quality-assurance/",
                        },
                        {
                            title: "Clinical Research (CRO)",
                            desc: "GCP guidelines, clinical trial monitoring (CRA), protocol development, ethics committee filings, and clinical data management.",
                            icon: Microscope,
                            tag: "Growing Field",
                            color: "#7C3AED",
                            bg: "#F5F3FF",
                            href: "/syllabus/semester-7/bp703t-ai-in-clinical-applications/",
                        },
                        {
                            title: "Python & AI in Pharma",
                            desc: "Drug discovery algorithms (BP604T), QSAR modeling, clinical trial analytics, and automated data pipelines (BP101T).",
                            icon: Sparkles,
                            tag: "NEP 2020 New Age",
                            color: "#D97706",
                            bg: "#FFFBEB",
                            href: "/syllabus/semester-1/bp101t-basics-of-python-programming-for-pharmaceutical-sciences/",
                        },
                        {
                            title: "Production & Manufacturing",
                            desc: "Formulation of sterile dosage forms (BP805T), solid dosage forms (BP504T), HVAC, and cleanroom operations.",
                            icon: Briefcase,
                            tag: "Plant Operations",
                            color: "#0891B2",
                            bg: "#ECFEFF",
                            href: "/syllabus/semester-5/bp504t-pharmaceutical-dosage-form-ii/",
                        },
                    ].map((domain) => (
                        <div
                            key={domain.title}
                            className="rounded-[14px] sm:rounded-[18px] border border-[#E8EDFF] bg-white p-4 sm:p-5 shadow-2xs flex flex-col justify-between hover:shadow-md transition-all duration-200"
                        >
                            <div>
                                <div className="flex items-start justify-between gap-2 mb-2.5">
                                    <div className="flex items-center gap-2.5">
                                        <div
                                            className="w-9 h-9 sm:w-10 sm:h-10 rounded-[10px] sm:rounded-[12px] flex items-center justify-center shrink-0"
                                            style={{ background: domain.bg, color: domain.color }}
                                        >
                                            <domain.icon size={18} />
                                        </div>
                                        <h3 className="font-display text-[15px] sm:text-[17px] font-bold text-[#1A2B6B] leading-tight">
                                            {domain.title}
                                        </h3>
                                    </div>
                                    <span
                                        className="px-2 py-0.5 rounded-full text-[9.5px] sm:text-[10px] font-bold uppercase tracking-wider shrink-0 mt-0.5"
                                        style={{ background: domain.bg, color: domain.color }}
                                    >
                                        {domain.tag}
                                    </span>
                                </div>
                                <p className="font-[DM_Sans] text-[12.5px] sm:text-[13px] text-[#4B5563] leading-relaxed mb-3">
                                    {domain.desc}
                                </p>
                            </div>
                            <Link
                                href={domain.href}
                                className="inline-flex items-center gap-1.5 text-[12.5px] sm:text-[13px] font-bold text-[#4C6EF5] hover:underline pt-1"
                            >
                                Explore Study Guide <ArrowRight size={14} />
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── POSTER VISUAL & COMMUNITY SECTION (PIC2 SHOWCASE) ── */}
            <div className="rounded-[20px] sm:rounded-[24px] bg-[#F8FAFF] border border-[#E0E8FF] p-5 sm:p-10 mb-8 sm:mb-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
                    <div className="lg:col-span-6 space-y-3.5 sm:space-y-4">
                        <span className="px-3 py-1 rounded-full bg-[#1A2B6B] text-white font-[DM_Sans] text-[10px] sm:text-[11px] font-bold inline-block">
                            Join PharmaCode Community
                        </span>
                        <h2 className="font-display text-[20px] xs:text-[24px] sm:text-[32px] font-black text-[#1A2B6B] leading-tight">
                            Smart Preparation. Strong Knowledge. Successful Interview.
                        </h2>
                        <ul className="space-y-2 sm:space-y-2.5">
                            {[
                                "Daily Valuable Content & Pharma Updates",
                                "ATS-Friendly Resume Building Guidance",
                                "Interview Q&A with Real Case Studies",
                                "Free PCI NEP 2020 Study Notes PDF",
                            ].map((item) => (
                                <li key={item} className="flex items-center gap-2 text-[12.5px] sm:text-[14px] text-[#4B5563] font-[DM_Sans]">
                                    <CheckCircle2 size={16} className="text-[#10B981] shrink-0" />
                                    <span className="leading-snug">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="lg:col-span-6 flex justify-center">
                        <div className="rounded-[16px] sm:rounded-[20px] border-2 border-[#E8EDFF] bg-white p-2.5 sm:p-3 shadow-xl max-w-[420px] w-full">
                            <Image
                                src="/pic2.jpg"
                                alt="PharmaCode Career Guidance & Knowledge Roadmap Poster"
                                width={500}
                                height={700}
                                className="rounded-[12px] sm:rounded-[14px] w-full h-auto object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
