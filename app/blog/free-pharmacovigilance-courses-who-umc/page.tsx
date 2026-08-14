import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, faqSchema, articleSchema } from "@/lib/schema";
import { absUrl } from "@/lib/site";
import { ProtectedDemoGrid } from "@/components/ProtectedDemoGrid";
import {
    BookOpen, CheckCircle2, GraduationCap, Shield,
    Clock, Globe, Award, Sparkles, ArrowRight, ArrowDown, ExternalLink,
    AlertTriangle, Layers, FileCheck, Stethoscope, BarChart3,
    Check, Users, HelpCircle, Lightbulb, Bookmark
} from "lucide-react";

export const metadata: Metadata = {
    title: "10 Free Pharmacovigilance Courses with Certificates — WHO-UMC Platform",
    description:
        "Access 10 free Pharmacovigilance & Drug Safety courses with certificates from Uppsala Monitoring Centre (WHO-UMC). Perfect for B.Pharm, M.Pharm students, freshers & PV job seekers.",
    alternates: { canonical: absUrl("/blog/free-pharmacovigilance-courses-who-umc/") },
    keywords: [
        "free pharmacovigilance courses",
        "WHO UMC pharmacovigilance courses",
        "Uppsala Monitoring Centre courses",
        "pharmacovigilance course with certificate free",
        "drug safety free certification",
        "WHODrug course free",
        "VigiBase introductory course",
        "medication errors course WHO",
        "B.Pharm pharmacovigilance training",
        "M.Pharm drug safety courses",
        "PV certification for freshers",
        "PharmaCode free courses",
    ],
    openGraph: {
        title: "10 Free Pharmacovigilance Courses with Certificates — WHO-UMC",
        description: "Build practical drug safety & PV knowledge with 10 free online courses from WHO-UMC with certificates. Ideal for B.Pharm & M.Pharm students.",
        url: absUrl("/blog/free-pharmacovigilance-courses-who-umc/"),
        images: [{ url: absUrl("/blog/free-pv-courses/who-umc-free-pv-courses.jpeg"), width: 1200, height: 630, alt: "Free Pharmacovigilance Courses WHO UMC" }],
    },
};

const WHO_UMC_CATALOG_URL = "https://learning.who-umc.org/visitor_class_catalog/category/21580";
const PV_INTERVIEW_KIT_URL = "/blog/pharmacovigilance-interview-preparation-kit/";

const PROMO_DEMO_PAGES = [
    { num: "01", title: "Cover & TOC", url: "/blog/pv-kit/demo-01.png", subtitle: "Full Sequence" },
    { num: "04", title: "PV Foundations", url: "/blog/pv-kit/demo-04.png", subtitle: "Definitions & Scope" },
    { num: "06", title: "ICSR Processing", url: "/blog/pv-kit/demo-06.png", subtitle: "Case Workflow" },
    { num: "07", title: "Signal Flowchart", url: "/blog/pv-kit/demo-07.png", subtitle: "Detection Steps" },
];

/* ── Course list data ── */
const COURSES = [
    {
        num: "01",
        title: "Introduction to Pharmacovigilance",
        level: "Introductory",
        duration: "Approx. 45 - 60 mins",
        cert: "Certificate Available",
        color: "#4C6EF5",
        icon: BookOpen,
        description: "Covers the fundamental building blocks of drug safety — including history of PV, key definitions, why medicine safety monitoring is critical, and the global scope of pharmacovigilance.",
        topics: ["PV History & Thalidomide Tragedy", "Key Definitions & Terminology", "Need & Scope of Drug Safety Monitoring"],
    },
    {
        num: "02",
        title: "Medication Errors: Introductory Course",
        level: "Introductory",
        duration: "Approx. 1 Hour",
        cert: "Certificate Available",
        color: "#10B981",
        icon: Shield,
        description: "Focuses on defining medication errors, distinguishing them from adverse drug reactions (ADRs), and understanding their global scope and impact on modern healthcare systems.",
        topics: ["Defining Medication Errors vs ADRs", "Classification & Causes of Errors", "Impact on Health Systems"],
    },
    {
        num: "03",
        title: "Managing Medication Error Reports",
        level: "Intermediate",
        duration: "Approx. 1 - 1.5 Hours",
        cert: "Certificate Available",
        color: "#F59E0B",
        icon: Layers,
        description: "A detailed practical course on how to properly receive, structure, validate, and manage reports regarding medication errors in clinical and pharmacovigilance settings.",
        topics: ["Report Ingestion & Verification", "Standardized Documentation", "Workflow for Case Processing"],
    },
    {
        num: "04",
        title: "Medication Errors: From Detection to Prevention",
        level: "Advanced",
        duration: "Approx. 1.5 - 2 Hours",
        cert: "Certificate Available",
        color: "#EC4899",
        icon: AlertTriangle,
        description: "An advanced-level module emphasizing systemic strategies, root cause analysis, and risk mitigation tools to detect and prevent medication errors across hospitals and pharma.",
        topics: ["Root Cause Analysis (RCA)", "Risk Mitigation Strategies", "Systemic Error Prevention Models"],
    },
    {
        num: "05",
        title: "Essentials of Pharmacovigilance Communications",
        level: "Intermediate",
        duration: "Approx. 1 Hour",
        cert: "Certificate Available",
        color: "#8B5CF6",
        icon: Users,
        description: "Teaches key communication methods to effectively share reliable safety alerts, risk communications, and adverse event data with healthcare professionals, patients, and regulators.",
        topics: ["Targeted Safety Alerts", "Crisis & Risk Communication", "Communication Channels & Transparency"],
    },
    {
        num: "06",
        title: "Collecting High-Quality ADR Reports",
        level: "Intermediate",
        duration: "Approx. 1 - 2 Hours",
        cert: "Certificate Available",
        color: "#06B6D4",
        icon: FileCheck,
        description: "Introduces key concepts and strategies to collect, verify, and complete high-quality Adverse Drug Reaction (ADR) reports prior to causality analysis and database entry.",
        topics: ["4 Minimum Criteria for Valid ADR Case", "Quality Control & Data Verification", "Follow-up Strategies for Missing Info"],
    },
    {
        num: "07",
        title: "WHODrug Introductory Course",
        level: "Introductory",
        duration: "Approx. 1 Hour",
        cert: "Certificate Available",
        color: "#F97316",
        icon: Stethoscope,
        description: "Provides participants with an essential understanding of the WHODrug dictionary — its hierarchical structure, contents, and how to access and search drug codes.",
        topics: ["WHODrug Dictionary Hierarchy", "Drug Trade Names & Active Ingredients", "Basic Coding Principles"],
    },
    {
        num: "08",
        title: "WHODrug Intermediate Course",
        level: "Intermediate / Restricted",
        duration: "Approx. 2 Hours",
        cert: "Certificate Available*",
        color: "#BE185D",
        icon: BarChart3,
        description: "Deep dive into WHODrug coding rules and advanced data retrieval. *Note: Restricted access for members of organizations participating in the WHO PIDM programme.",
        topics: ["Advanced Coding Conventions", "Drug Data Retrieval", "WHO PIDM Access Rules"],
    },
    {
        num: "09",
        title: "VigiBase Introductory Course",
        level: "Introductory",
        duration: "Approx. 1 - 1.5 Hours",
        cert: "Certificate Available",
        color: "#7C3AED",
        icon: Globe,
        description: "An introductory course on VigiBase — the unique global database maintained by WHO-UMC containing over 30+ million individual case safety reports (ICSRs) from 150+ countries.",
        topics: ["What is VigiBase & How It Works", "Global ICSR Data Flow", "Signal Detection Concepts"],
    },
    {
        num: "10",
        title: "Regulatory Aspects of Pharmacovigilance",
        level: "Comprehensive",
        duration: "Approx. 2 - 3 Hours",
        cert: "Certificate Available*",
        color: "#059669",
        icon: Shield,
        description: "A comprehensive course covering national and international regulatory frameworks, reporting timelines, Good Pharmacovigilance Practices (GVP), and compliance requirements.",
        topics: ["Global & Indian Regulatory Frameworks", "Reporting Timelines (7/15 Days)", "GVP Modules & Compliance"],
    },
];

const FAQS = [
    {
        q: "Are these Pharmacovigilance courses really 100% free?",
        a: "Yes! All courses listed on the Uppsala Monitoring Centre (WHO-UMC) official learning platform are 100% free of cost with global access for pharmacy students, healthcare professionals, and researchers.",
    },
    {
        q: "Do I get certificates upon completing these courses?",
        a: "Yes! Most courses provide a downloadable verified certificate upon passing the end-of-course assessment. You can add these certificates directly to your resume and LinkedIn profile.",
    },
    {
        q: "Who should take these courses?",
        a: "These courses are ideal for B.Pharm, M.Pharm, Pharm.D, Nursing, and Life Sciences students as well as professionals seeking roles in Pharmacovigilance (PV), Drug Safety, Clinical Research (CRO), and Regulatory Affairs.",
    },
    {
        q: "Why is the WHODrug Intermediate course restricted?",
        a: "The WHODrug Intermediate course requires specialized access restricted to members of organizations actively participating in the WHO Programme for International Drug Monitoring (PIDM). However, all other introductory courses are open to everyone.",
    },
    {
        q: "How do I start learning?",
        a: "Simply click on the official WHO-UMC catalog link provided on this page, register a free user account, browse the course catalog, and enroll in your chosen course instantly.",
    },
];

export default function FreePVCoursesPage() {
    const breadcrumbs = [
        { name: "Home", href: "/" },
        { name: "Blog", href: "/blog/" },
        { name: "Free PV Courses", href: "/blog/free-pharmacovigilance-courses-who-umc/" },
    ];

    return (
        <div className="w-full">
            <JsonLd data={breadcrumbSchema(breadcrumbs)} />
            <JsonLd data={faqSchema(FAQS)} />
            <JsonLd
                data={articleSchema({
                    title: "10 Free Pharmacovigilance Courses with Certificates — WHO-UMC Platform",
                    description: "Access 10 free Pharmacovigilance & Drug Safety courses with certificates from Uppsala Monitoring Centre (WHO-UMC). Perfect for B.Pharm, M.Pharm students & freshers.",
                    url: "/blog/free-pharmacovigilance-courses-who-umc/",
                    imageUrl: "/blog/free-pv-courses/who-umc-free-pv-courses.jpeg",
                })}
            />

            {/* ══════════════ HERO SECTION ══════════════ */}
            <section
                className="relative overflow-hidden"
                style={{
                    background: "linear-gradient(135deg, #0B1536 0%, #152458 40%, #1E3A8A 75%, #3B82F6 100%)",
                }}
            >
                {/* Background ambient lighting */}
                <div className="absolute top-[-100px] right-[-60px] w-[300px] h-[300px] rounded-full opacity-15" style={{ background: "radial-gradient(circle, #60A5FA, transparent)" }} />
                <div className="absolute bottom-[-100px] left-[-80px] w-[320px] h-[320px] rounded-full opacity-10" style={{ background: "radial-gradient(circle, #34D399, transparent)" }} />

                <div className="mx-auto max-w-[960px] px-4 sm:px-6 md:px-8 pt-6 pb-10 sm:pt-10 sm:pb-14 relative z-10">
                    <div className="mb-4">
                        <Breadcrumb items={breadcrumbs} variant="light" />
                    </div>

                    {/* Verified Free Badges — Android & Mobile Screen Optimized */}
                    <div className="fade-up flex flex-wrap items-center gap-2 mb-5">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#10B981]/25 border border-[#10B981]/40 px-3.5 py-1 text-[11px] font-extrabold text-[#6EE7B7] uppercase tracking-wider shadow-sm">
                            <Sparkles size={13} className="shrink-0 animate-pulse text-[#34D399]" /> 100% Free
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-3.5 py-1 text-[11px] font-extrabold text-white/90 uppercase tracking-wider">
                            <Globe size={13} className="text-[#93C5FD] shrink-0" /> Global Access
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-3.5 py-1 text-[11px] font-extrabold text-white/90 uppercase tracking-wider">
                            <Award size={13} className="text-[#FBBF24] shrink-0" /> Verified Certificates 🏆
                        </span>
                    </div>

                    <h1 className="fade-up fade-up-1 font-display text-[24px] sm:text-[32px] md:text-[40px] font-black text-white leading-[1.2] mb-4">
                        10 Free Pharmacovigilance Courses
                        <br />
                        <span className="text-[#93C5FD]">With Certificates</span> — WHO-UMC Platform
                    </h1>

                    <p className="fade-up fade-up-2 text-[14px] sm:text-[16px] text-white/80 max-w-[660px] leading-[1.7] mb-6 font-sans">
                        Planning a career in <strong className="text-white">Pharmacovigilance, Drug Safety, CRO, or Regulatory Affairs</strong>?
                        Learn directly from the <strong className="text-white">Uppsala Monitoring Centre (WHO-UMC)</strong> learning portal for free and boost your resume.
                    </p>

                    {/* Highlight Stats Pills */}
                    <div className="fade-up fade-up-3 flex flex-wrap gap-2.5 mb-8">
                        {[
                            { icon: Award, label: "Certificates Available", color: "#34D399" },
                            { icon: Clock, label: "45m - 3 Hours Each", color: "#FBBF24" },
                            { icon: Globe, label: "100% Free & Online", color: "#60A5FA" },
                            { icon: GraduationCap, label: "For B.Pharm & M.Pharm", color: "#F472B6" },
                        ].map((item) => (
                            <div
                                key={item.label}
                                className="flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 px-3 py-1.5"
                            >
                                <item.icon size={13} strokeWidth={2.5} style={{ color: item.color }} />
                                <span className="text-[11px] sm:text-[12px] font-bold text-white/90">{item.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* CTA Buttons */}
                    <div className="fade-up fade-up-4 flex flex-wrap gap-3 items-center">
                        <a
                            href="#courses-list"
                            className="btn-press inline-flex items-center gap-2 rounded-[12px] bg-[#34D399] px-5 py-3 text-[13px] sm:text-[14px] font-black text-[#064E3B] shadow-lg hover:bg-[#6EE7B7] transition-all duration-200"
                        >
                            <ArrowDown size={16} strokeWidth={2.5} />
                            Explore All 10 Free Courses ↓
                        </a>
                        <Link
                            href={PV_INTERVIEW_KIT_URL}
                            className="btn-press inline-flex items-center gap-2 rounded-[12px] bg-white/10 backdrop-blur-md border border-white/25 px-5 py-3 text-[13px] sm:text-[14px] font-bold text-white hover:bg-white/20 transition-all duration-200"
                        >
                            <Bookmark size={15} strokeWidth={2} />
                            See PV Interview Preparation Kit
                        </Link>
                    </div>
                </div>
            </section>

            {/* ══════════════ OVERVIEW & IMAGE SECTION ══════════════ */}
            <section className="mx-auto max-w-[960px] px-4 sm:px-6 md:px-8 py-8 sm:py-12">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    <div className="md:col-span-6 order-2 md:order-1 space-y-4">
                        <span className="inline-block rounded-md bg-[#EEF2FF] px-3 py-1 text-[11px] font-bold text-secondary uppercase tracking-wider">
                            Official Learning Portal
                        </span>
                        <h2 className="font-display text-[22px] sm:text-[26px] font-black text-primary leading-tight">
                            Build Practical Knowledge in <span className="text-secondary">Medicine Safety</span>
                        </h2>
                        <p className="font-sans text-[13px] sm:text-[14px] text-[#4B5563] leading-[1.7]">
                            The <strong className="text-primary">Uppsala Monitoring Centre (WHO-UMC)</strong> is the WHO Collaborating Centre for International Drug Monitoring. Their learning platform offers structured, bite-sized courses designed to build real-world skills in pharmacovigilance, adverse reaction collection, and global safety reporting.
                        </p>
                        <ul className="space-y-2 pt-1">
                            {[
                                "B.Pharm & M.Pharm students seeking high-value skills",
                                "Freshers preparing for Pharmacovigilance (PV) interviews",
                                "Drug Safety, CRO, Regulatory & Clinical Research aspirants",
                                "Self-paced study — complete anytime alongside college",
                            ].map((point) => (
                                <li key={point} className="flex items-start gap-2 text-[12px] sm:text-[13px] text-[#374151]">
                                    <CheckCircle2 size={16} strokeWidth={2.5} className="text-[#10B981] shrink-0 mt-0.5" />
                                    <span>{point}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="md:col-span-6 order-1 md:order-2">
                        <div className="rounded-[18px] overflow-hidden border border-[#E8EDFF] shadow-card bg-white p-2">
                            <Image
                                src="/blog/free-pv-courses/who-umc-free-pv-courses.jpeg"
                                alt="Free Pharmacovigilance Courses with Certificates by WHO-UMC Uppsala Monitoring Centre - PharmaCode"
                                width={600}
                                height={400}
                                className="w-full h-auto object-cover rounded-[14px]"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════ SMART CROSS-LINKING CALLOUT BANNER (INTERNAL LINKING) ══════════════ */}
            <section className="mx-auto max-w-[960px] px-4 sm:px-6 md:px-8 pb-8">
                <div className="rounded-[20px] bg-gradient-to-r from-[#0F1D5C] via-[#1E3A8A] to-[#3B82F6] p-5 sm:p-7 text-white shadow-xl relative overflow-hidden">
                    <div className="absolute top-[-30px] right-[-20px] w-[140px] h-[140px] rounded-full bg-white/10 blur-2xl" />
                    
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative z-10">
                        <div className="space-y-2 max-w-[600px]">
                            <div className="inline-flex items-center gap-2 rounded-full bg-[#EF4444] px-3 py-1 text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-white">
                                <Sparkles size={12} /> Complete Interview Guide
                            </div>
                            <h3 className="font-display text-[18px] sm:text-[22px] font-black text-white leading-tight">
                                Preparing for Pharmacovigilance Interviews?
                            </h3>
                            <p className="font-sans text-[12px] sm:text-[13px] text-white/80 leading-[1.6]">
                                Pair these free certifications with our <strong className="text-white">Pharmacovigilance Complete Guide & Interview Preparation Kit (44 Pages PDF)</strong>. Covers ICSR case processing, MedDRA coding, Causality Assessment (WHO-UMC & Naranjo), Signal Detection, PSUR/PBRER & 50+ interview Q&A!
                            </p>
                        </div>

                        <div className="shrink-0 w-full md:w-auto">
                            <Link
                                href={PV_INTERVIEW_KIT_URL}
                                className="btn-press w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-[12px] bg-[#6EE7B7] px-5 py-3 text-[13px] font-black text-[#064E3B] hover:bg-[#A7F3D0] transition-all duration-200 shadow-md"
                            >
                                <span>See PV Interview Prep Kit</span>
                                <ArrowRight size={16} strokeWidth={2.5} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════ ALL 10 COURSES DETAILED LIST ══════════════ */}
            <section id="courses-list" className="bg-[#F8FAFC] py-10 sm:py-14 border-y border-[#E2E8F0] scroll-mt-[65px]">
                <div className="mx-auto max-w-[960px] px-4 sm:px-6 md:px-8">
                    <div className="text-center mb-8 sm:mb-10">
                        <span className="inline-block rounded-md bg-white px-3 py-1 text-[11px] font-bold text-[#3B82F6] mb-2.5 uppercase tracking-wider border border-[#E2E8F0]">
                            📚 Comprehensive Course Breakdown
                        </span>
                        <h2 className="font-display text-[22px] sm:text-[30px] font-black text-primary leading-tight mb-2">
                            Explore All 10 WHO-UMC Courses
                        </h2>
                        <p className="font-sans text-[13px] sm:text-[14px] text-[#64748B] max-w-[600px] mx-auto leading-[1.6]">
                            From introductory principles to regulatory aspects — here is the exact list of available free modules:
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                        {COURSES.map((c) => (
                            <div
                                key={c.num}
                                className="fade-up rounded-[16px] bg-white border border-[#E2E8F0] p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-center justify-between gap-2 mb-3">
                                        <span
                                            className="w-8 h-8 rounded-[10px] font-display text-[12px] font-black flex items-center justify-center"
                                            style={{ background: `${c.color}15`, color: c.color }}
                                        >
                                            {c.num}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <span className="rounded-full bg-[#F1F5F9] px-2.5 py-1 text-[10px] font-bold text-[#475569]">
                                                {c.level}
                                            </span>
                                            <span className="rounded-full bg-[#ECFDF5] border border-[#A7F3D0] px-2.5 py-1 text-[10px] font-bold text-[#059669]">
                                                {c.cert}
                                            </span>
                                        </div>
                                    </div>

                                    <h3 className="font-display text-[15px] sm:text-[16px] font-extrabold text-primary mb-2 flex items-start gap-2">
                                        <c.icon size={18} className="shrink-0 mt-0.5" style={{ color: c.color }} />
                                        {c.title}
                                    </h3>

                                    <p className="font-sans text-[12px] sm:text-[13px] text-[#475569] leading-[1.6] mb-4">
                                        {c.description}
                                    </p>

                                    <div className="space-y-1.5 mb-4 bg-[#F8FAFC] p-3 rounded-[10px] border border-[#F1F5F9]">
                                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#94A3B8]">Key Concepts Covered:</span>
                                        {c.topics.map((t) => (
                                            <div key={t} className="flex items-center gap-1.5 text-[11px] font-medium text-[#334155]">
                                                <Check size={12} className="text-[#10B981] shrink-0" />
                                                <span>{t}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-[11px] font-bold text-[#64748B]">
                                    <span className="flex items-center gap-1">
                                        <Clock size={12} /> {c.duration}
                                    </span>
                                    <a
                                        href={WHO_UMC_CATALOG_URL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-[#2563EB] hover:underline"
                                    >
                                        Enroll Now <ExternalLink size={11} />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════ HOW TO ENROLL STEP BY STEP ══════════════ */}
            <section className="mx-auto max-w-[960px] px-4 sm:px-6 md:px-8 py-10 sm:py-14">
                <div className="text-center mb-8">
                    <span className="inline-block rounded-md bg-[#ECFDF5] px-3 py-1 text-[11px] font-bold text-[#059669] mb-2 uppercase tracking-wider border border-[#A7F3D0]">
                        ⚡ Easy 4-Step Registration
                    </span>
                    <h2 className="font-display text-[22px] sm:text-[28px] font-black text-primary">
                        How to Claim Your Certificates
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        {
                            step: "1",
                            title: "Open Official Portal",
                            desc: "Click the WHO-UMC class catalog link provided on this page to visit the official platform.",
                        },
                        {
                            step: "2",
                            title: "Create Free Account",
                            desc: "Register a free user account using your email ID and personal details.",
                        },
                        {
                            step: "3",
                            title: "Complete Modules",
                            desc: "Watch the video lessons and read interactive study materials at your own pace (45m–3h).",
                        },
                        {
                            step: "4",
                            title: "Download Certificate",
                            desc: "Pass the end-of-course evaluation and download your verified course completion certificate!",
                        },
                    ].map((s) => (
                        <div
                            key={s.step}
                            className="rounded-[16px] bg-white border border-[#E2E8F0] p-5 text-center shadow-sm"
                        >
                            <div className="w-9 h-9 rounded-full bg-[#3B82F6] text-white font-display text-[14px] font-black flex items-center justify-center mx-auto mb-3 shadow-md">
                                {s.step}
                            </div>
                            <h3 className="font-display text-[14px] font-extrabold text-primary mb-1.5">{s.title}</h3>
                            <p className="font-sans text-[12px] text-[#64748B] leading-[1.5]">{s.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Direct Action Link Card */}
                <div className="mt-8 rounded-[18px] bg-white border border-[#CBD5E1] p-6 text-center max-w-[680px] mx-auto shadow-md">
                    <h3 className="font-display text-[16px] sm:text-[18px] font-black text-primary mb-2 flex items-center justify-center gap-2">
                        <GraduationCap size={20} className="text-secondary" />
                        Ready to Start Learning?
                    </h3>
                    <p className="font-sans text-[12px] sm:text-[13px] text-[#475569] mb-5">
                        Access all 10 free courses directly on the Uppsala Monitoring Centre (WHO-UMC) official catalog.
                    </p>
                    <a
                        href={WHO_UMC_CATALOG_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-press inline-flex items-center gap-2 rounded-[12px] bg-[#2563EB] px-6 py-3 text-[13px] sm:text-[14px] font-black text-white shadow-md hover:bg-[#1D4ED8] transition-all duration-200"
                    >
                        <ExternalLink size={16} strokeWidth={2.5} />
                        Go to Official WHO-UMC Learning Portal ↗
                    </a>
                </div>
            </section>

            {/* ══════════════ PROMOTIONAL PV KIT DEMO PREVIEW SHOWCASE ══════════════ */}
            <section className="bg-gradient-to-b from-[#F8FAFC] to-[#EEF2FF] py-10 sm:py-14 border-t border-[#E2E8F0]">
                <div className="mx-auto max-w-[960px] px-4 sm:px-6 md:px-8">
                    <div className="text-center mb-8">
                        <span className="inline-block rounded-md bg-[#EF4444] px-3 py-1 text-[11px] font-bold text-white uppercase tracking-wider mb-2.5 shadow-sm">
                            🚀 Enhance Your Learning
                        </span>
                        <h2 className="font-display text-[22px] sm:text-[28px] font-black text-primary leading-tight mb-2">
                            Certificates Get You Noticed. <span className="text-secondary">Interview Prep Gets You Hired.</span>
                        </h2>
                        <p className="font-sans text-[13px] sm:text-[14px] text-[#64748B] max-w-[620px] mx-auto leading-[1.6]">
                            Having course certificates on your resume is great, but interviewers will test your practical understanding of ICSRs, MedDRA, Naranjo causality scale, and case studies. Check out sample demo pages below:
                        </p>
                    </div>

                    <div className="mb-8">
                        <ProtectedDemoGrid pages={PROMO_DEMO_PAGES} variant="promo" targetHref={PV_INTERVIEW_KIT_URL} />
                    </div>

                    {/* Promotional Callout Card */}
                    <div className="rounded-[20px] bg-gradient-to-r from-[#0F1D5C] via-[#1E3A8A] to-[#2563EB] p-6 sm:p-8 text-white text-center max-w-[760px] mx-auto shadow-xl relative overflow-hidden">
                        <h3 className="font-display text-[18px] sm:text-[22px] font-black text-white mb-2">
                            Get the 44-Page Pharmacovigilance Complete Guide & Kit
                        </h3>
                        <p className="font-sans text-[13px] sm:text-[14px] text-white/80 max-w-[600px] mx-auto leading-[1.6] mb-5">
                            Covers 15 Chapters, 100+ Technical & HR Q&A, ICSR Case Processing Workflow, MedDRA Coding, Causality Assessment (WHO-UMC & Naranjo), and Revision Cheat Sheet!
                        </p>
                        <Link
                            href={PV_INTERVIEW_KIT_URL}
                            className="btn-press inline-flex items-center gap-2 rounded-[12px] bg-[#6EE7B7] px-6 py-3 text-[13px] sm:text-[14px] font-black text-[#064E3B] hover:bg-[#A7F3D0] transition-all duration-200 shadow-md"
                        >
                            <BookOpen size={16} strokeWidth={2.5} />
                            <span>See Complete PV Guide & Demo Pages →</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ══════════════ FAQ SECTION ══════════════ */}
            <section className="mx-auto max-w-[960px] px-4 sm:px-6 md:px-8 py-10 sm:py-14">
                <div className="text-center mb-8">
                    <h2 className="font-display text-[20px] sm:text-[26px] font-black text-primary">
                        Frequently Asked Questions
                    </h2>
                </div>

                <div className="space-y-3 max-w-[720px] mx-auto">
                    {FAQS.map((faq, i) => (
                        <div
                            key={i}
                            className="rounded-[14px] border border-[#E2E8F0] bg-white p-5 hover:border-[#CBD5E1] transition-colors duration-200"
                        >
                            <h3 className="font-display text-[13px] sm:text-[14px] font-extrabold text-primary mb-2 flex items-start gap-2">
                                <span className="shrink-0 w-5 h-5 rounded-full bg-[#EEF2FF] text-secondary text-[11px] font-black flex items-center justify-center mt-0.5">
                                    Q
                                </span>
                                {faq.q}
                            </h3>
                            <p className="font-sans text-[12px] sm:text-[13px] text-[#64748B] leading-[1.7] pl-7">
                                {faq.a}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
