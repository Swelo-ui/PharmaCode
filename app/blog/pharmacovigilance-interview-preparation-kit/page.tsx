import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { absUrl } from "@/lib/site";
import { ProtectedDemoGrid } from "@/components/ProtectedDemoGrid";
import { CountdownTimer, DynamicPriceHeader, DynamicLinkedInBox, DynamicCTAButton, CopyEmailBox, CopyUpiBox } from "./CountdownTimer";
import {
    BookOpen, CheckCircle2, FileText, GraduationCap, Shield,
    Star, Clock, Layers, Brain, ClipboardList, AlertTriangle,
    BarChart3, FileCheck, Stethoscope, Monitor, Users, MessageSquare,
    Target, Lightbulb, Mail, IndianRupee, Smartphone, ArrowRight,
    Sparkles, Award, ChevronRight, Zap, ExternalLink
} from "lucide-react";

export const metadata: Metadata = {
    title: "Pharmacovigilance Complete Guide & Interview Preparation Kit — 44 Pages PDF",
    description:
        "Get the complete Pharmacovigilance Interview Preparation Kit by PharmaCode — 44-page structured PDF covering PV fundamentals, ICSR, MedDRA, causality assessment, signal detection, PSUR, GVP, HR & technical interview Q&A, case studies and revision cheat sheet.",
    alternates: { canonical: absUrl("/blog/pharmacovigilance-interview-preparation-kit/") },
    keywords: [
        "pharmacovigilance interview preparation",
        "PV interview questions",
        "pharmacovigilance guide PDF",
        "ICSR case processing",
        "MedDRA coding",
        "causality assessment WHO-UMC Naranjo",
        "signal detection management",
        "PSUR PBRER DSUR",
        "pharmacovigilance for freshers",
        "B.Pharm PV preparation",
        "M.Pharm pharmacovigilance",
        "PharmaCode PV guide",
        "pharmacovigilance interview questions answers",
        "PV career preparation",
        "good pharmacovigilance practices",
    ],
    openGraph: {
        title: "Pharmacovigilance Complete Guide & Interview Preparation Kit — PharmaCode",
        description: "44-page structured PDF covering PV fundamentals to interview preparation. Built for B.Pharm/M.Pharm students & freshers.",
        url: absUrl("/blog/pharmacovigilance-interview-preparation-kit/"),
        images: [{ url: absUrl("/blog/pv-kit/pharmacode-services.jpeg"), width: 1200, height: 630, alt: "PharmaCode PV Guide" }],
    },
};

const LINKEDIN_POST_URL = "https://www.linkedin.com/posts/pharmacode-edu_pharmacovigilance-pharmajobs-pharmacareers-activity-7491846601469173760-IEc3?utm_source=share&utm_medium=member_android&rcm=ACoAAFJJusgB3neGi-tKhJzWlgrA6W4nkyJxXH4";

/* ── Chapter data ── */
const CHAPTERS = [
    { icon: BookOpen, title: "PV Fundamentals & Terminology", desc: "Core pharmacovigilance concepts, definitions and key terminology used across the industry.", color: "#4C6EF5" },
    { icon: Shield, title: "Global & Indian Regulatory Framework", desc: "WHO, FDA, EMA, CDSCO regulations and how they govern pharmacovigilance globally and in India.", color: "#10B981" },
    { icon: ClipboardList, title: "ICSR & Case Processing Workflow", desc: "Individual Case Safety Reports — from receipt to submission, the complete lifecycle.", color: "#F59E0B" },
    { icon: CheckCircle2, title: "Four Minimum Criteria for a Valid Case", desc: "What makes a case reportable? The four essential elements every PV professional must know.", color: "#EC4899" },
    { icon: Layers, title: "MedDRA & WHODrug Concepts", desc: "Medical terminology coding using MedDRA hierarchy and WHODrug dictionary for drug coding.", color: "#8B5CF6" },
    { icon: Brain, title: "Causality Assessment — WHO-UMC & Naranjo", desc: "How to assess whether a drug caused an adverse event using standardised algorithms.", color: "#06B6D4" },
    { icon: BarChart3, title: "Signal Detection & Management", desc: "Identifying, validating and managing safety signals from post-marketing data.", color: "#F97316" },
    { icon: FileCheck, title: "PSUR / PBRER / DSUR", desc: "Periodic aggregate safety reports — purpose, structure and regulatory requirements.", color: "#BE185D" },
    { icon: AlertTriangle, title: "RMP & REMS", desc: "Risk Management Plans and Risk Evaluation & Mitigation Strategies explained.", color: "#DC2626" },
    { icon: Stethoscope, title: "Good Pharmacovigilance Practices (GVP)", desc: "EU GVP modules and best practices that govern PV operations worldwide.", color: "#059669" },
    { icon: Monitor, title: "PV Databases & Software Concepts", desc: "Argus Safety, ArisGlobal, Oracle AERS and other tools used in PV operations.", color: "#7C3AED" },
    { icon: Users, title: "HR Interview Questions", desc: "Common behavioural and situational questions asked in PV job interviews.", color: "#0891B2" },
    { icon: MessageSquare, title: "Technical Interview Q&A", desc: "Detailed technical questions and model answers for pharmacovigilance roles.", color: "#D97706" },
    { icon: Target, title: "Scenario-Based & Case Studies", desc: "Real-world PV scenarios and case studies to test practical understanding.", color: "#9333EA" },
    { icon: Lightbulb, title: "Resume, Mock Interview & Revision", desc: "ATS-friendly resume tips, mock interview strategy and quick revision cheat sheet.", color: "#E11D48" },
];

/* ── Demo Preview Images Data ── */
const DEMO_PAGES = [
    {
        num: "01",
        title: "Cover & Positioning",
        url: "/blog/pv-kit/demo-01.png",
        subtitle: "Official Guide Cover & Positioning for Freshers",
    },
    {
        num: "02",
        title: "15-Chapter Table of Contents",
        url: "/blog/pv-kit/demo-02.png",
        subtitle: "Structured sequence from PV basics to advanced Q&A",
    },
    {
        num: "03",
        title: "How to Use the Kit",
        url: "/blog/pv-kit/demo-03.png",
        subtitle: "Maximizing your preparation for interviews",
    },
    {
        num: "04",
        title: "Chapter 01 — PV Foundations",
        url: "/blog/pv-kit/demo-04.png",
        subtitle: "Core concepts, terminology & definitions",
    },
    {
        num: "05",
        title: "MedDRA & Signal Detection",
        url: "/blog/pv-kit/demo-05.png",
        subtitle: "Hierarchy, coding conventions & signal management",
    },
    {
        num: "06",
        title: "ICSR & Case Processing",
        url: "/blog/pv-kit/demo-06.png",
        subtitle: "Individual Case Safety Report workflow",
    },
    {
        num: "07",
        title: "Signal Management Flowchart",
        url: "/blog/pv-kit/demo-07.png",
        subtitle: "Visual flow of signal detection & validation",
    },
    {
        num: "08",
        title: "PV Databases & Software Tools",
        url: "/blog/pv-kit/demo-08.png",
        subtitle: "Argus, ArisGlobal, Oracle AERS & database concepts",
    },
];

/* ── Feature pills ── */
const FEATURES = [
    { icon: FileText, label: "44 Pages", color: "#4C6EF5" },
    { icon: Layers, label: "15 Chapters", color: "#10B981" },
    { icon: GraduationCap, label: "Interview Focused", color: "#F59E0B" },
    { icon: Clock, label: "Simple English", color: "#EC4899" },
    { icon: Star, label: "Cheat Sheet Included", color: "#8B5CF6" },
    { icon: Award, label: "Structured Format", color: "#06B6D4" },
];

/* ── How to buy steps ── */
const STEPS = [
    { num: "1", title: "Scan the QR Code", desc: "Use any UPI app — GPay, PhonePe, Paytm, BHIM or any other." },
    { num: "2", title: "Pay ₹99", desc: "Standard price (₹79 launch price for LinkedIn Followers)." },
    { num: "3", title: "Send Screenshot", desc: "Email the payment screenshot to the address shown below." },
    { num: "4", title: "Receive Your PDF", desc: "You'll receive the complete 44-page guide on your email within hours." },
];

export default function PVKitBlogPage() {
    const breadcrumbs = [
        { name: "Home", href: "/" },
        { name: "Blog", href: "/blog/" },
        { name: "PV Interview Kit", href: "/blog/pharmacovigilance-interview-preparation-kit/" },
    ];

    return (
        <div className="w-full">
            <JsonLd data={breadcrumbSchema(breadcrumbs)} />

            {/* ══════════════ HERO SECTION ══════════════ */}
            <section
                className="relative overflow-hidden"
                style={{
                    background: "linear-gradient(135deg, #0F1D5C 0%, #1A2B6B 30%, #243A8E 60%, #4C6EF5 100%)",
                }}
            >
                {/* Decorative orbs */}
                <div className="absolute top-[-80px] right-[-60px] w-[280px] h-[280px] rounded-full opacity-10" style={{ background: "radial-gradient(circle, #7B9BF7, transparent)" }} />
                <div className="absolute bottom-[-100px] left-[-80px] w-[320px] h-[320px] rounded-full opacity-8" style={{ background: "radial-gradient(circle, #FF8FAB, transparent)" }} />

                <div className="mx-auto max-w-[960px] px-5 sm:px-8 pt-6 pb-10 sm:pt-10 sm:pb-14 relative z-10">
                    <div className="mb-4">
                        <Breadcrumb items={breadcrumbs} variant="light" />
                    </div>

                    {/* Countdown Timer Badge */}
                    <CountdownTimer variant="hero" />

                    <h1 className="fade-up fade-up-1 font-display text-[24px] sm:text-[32px] md:text-[38px] font-black text-white leading-[1.2] mb-4">
                        Pharmacovigilance
                        <br />
                        <span className="text-[#93C5FD]">Complete Guide & Interview</span>
                        <br />
                        <span className="text-[#6EE7B7]">Preparation Kit</span>
                    </h1>

                    <p className="fade-up fade-up-2 text-[14px] sm:text-[16px] text-white/75 max-w-[600px] leading-[1.7] mb-6 font-sans">
                        44-page structured PDF — from PV fundamentals to interview preparation.
                        Built specifically for <strong className="text-white">B.Pharm/M.Pharm students</strong>, freshers and early-career professionals.
                    </p>

                    {/* Feature pills */}
                    <div className="fade-up fade-up-3 flex flex-wrap gap-2.5 mb-8">
                        {FEATURES.map((f) => (
                            <div
                                key={f.label}
                                className="flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 px-3 py-1.5"
                            >
                                <f.icon size={14} strokeWidth={2} style={{ color: f.color }} />
                                <span className="text-[11px] sm:text-[12px] font-bold text-white/90">{f.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* CTA buttons */}
                    <div className="fade-up fade-up-4 flex flex-wrap gap-3 items-center">
                        <DynamicCTAButton variant="hero" />
                        <a
                            href={LINKEDIN_POST_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-press inline-flex items-center gap-2 rounded-[12px] bg-white/10 backdrop-blur-sm border border-white/25 px-5 py-3 text-[13px] sm:text-[14px] font-bold text-white hover:bg-white/20 transition-all duration-200"
                        >
                            <ExternalLink size={15} strokeWidth={2} />
                            View Demo PDF on LinkedIn
                        </a>
                    </div>
                </div>
            </section>

            {/* ══════════════ ABOUT PHARMACODE ══════════════ */}
            <section className="mx-auto max-w-[960px] px-5 sm:px-8 py-10 sm:py-14">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="fade-up order-2 md:order-1">
                        <span className="inline-block rounded-md bg-[#EEF2FF] px-3 py-1 text-[11px] font-bold text-secondary mb-3 uppercase tracking-wider">
                            About PharmaCode
                        </span>
                        <h2 className="font-display text-[22px] sm:text-[26px] font-black text-primary leading-tight mb-3">
                            Your Career. Our Guidance.
                            <br />
                            <span className="text-secondary">Real Opportunities.</span>
                        </h2>
                        <p className="font-sans text-[13px] sm:text-[14px] text-[#6B7FA3] leading-[1.7] mb-4">
                            PharmaCode is India&apos;s trusted platform for B.Pharm students and graduates —
                            guiding you with preparation, knowledge &amp; real industry opportunities in Pharmacovigilance,
                            QA, Regulatory Affairs and Clinical Research.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            {[
                                { label: "Industry-Focused", color: "#4C6EF5" },
                                { label: "100% Personalised", color: "#10B981" },
                                { label: "Real Opportunities", color: "#F97316" },
                                { label: "Trusted by Students", color: "#8B5CF6" },
                            ].map((t) => (
                                <span
                                    key={t.label}
                                    className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[11px] sm:text-[12px] font-bold"
                                    style={{ borderColor: `${t.color}40`, color: t.color, background: `${t.color}08` }}
                                >
                                    <CheckCircle2 size={12} strokeWidth={2.5} />
                                    {t.label}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="fade-up fade-up-1 order-1 md:order-2">
                        <div className="rounded-[16px] overflow-hidden border border-[#E8EDFF] shadow-card">
                            <Image
                                src="/blog/pv-kit/pharmacode-services.jpeg"
                                alt="PharmaCode — Career guidance, resume building, interview preparation services for B.Pharm students"
                                width={600}
                                height={400}
                                className="w-full h-auto object-cover"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════ WHAT'S INSIDE ══════════════ */}
            <section className="bg-[#F4F6FF]">
                <div className="mx-auto max-w-[960px] px-5 sm:px-8 py-10 sm:py-14">
                    <div className="text-center mb-8">
                        <span className="inline-block rounded-md bg-white px-3 py-1 text-[11px] font-bold text-secondary mb-3 uppercase tracking-wider border border-[#E8EDFF]">
                            📚 What&apos;s Inside
                        </span>
                        <h2 className="font-display text-[22px] sm:text-[28px] font-black text-primary leading-tight mb-2">
                            15 Chapters — Structured for <span className="text-secondary">Interview Success</span>
                        </h2>
                        <p className="font-sans text-[13px] sm:text-[14px] text-[#6B7FA3] max-w-[560px] mx-auto leading-[1.6]">
                            Every chapter is written in simple, direct English — so you can understand concepts
                            and actually explain them in an interview.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {CHAPTERS.map((ch, i) => (
                            <div
                                key={i}
                                className={`fade-up fade-up-${Math.min(i + 1, 8)} lift rounded-[14px] bg-white border border-[#E8EDFF] p-5 flex gap-3.5`}
                            >
                                <div
                                    className="shrink-0 w-10 h-10 rounded-[10px] flex items-center justify-center"
                                    style={{ background: `${ch.color}12` }}
                                >
                                    <ch.icon size={18} strokeWidth={2} style={{ color: ch.color }} />
                                </div>
                                <div>
                                    <h3 className="font-display text-[13px] sm:text-[14px] font-extrabold text-primary leading-tight mb-1">
                                        {ch.title}
                                    </h3>
                                    <p className="font-sans text-[11px] sm:text-[12px] text-[#6B7FA3] leading-[1.5]">
                                        {ch.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* LinkedIn Demo Preview Box */}
                    <div className="mt-8 rounded-[16px] bg-gradient-to-r from-[#EEF2FF] to-[#E0E7FF] border border-[#C7D2FE] p-5 sm:p-6 text-center max-w-[680px] mx-auto shadow-sm">
                        <h3 className="font-display text-[15px] sm:text-[17px] font-black text-primary mb-1 flex items-center justify-center gap-2">
                            <Sparkles size={18} className="text-secondary" />
                            Want to see how the guide looks inside?
                        </h3>
                        <p className="font-sans text-[12px] sm:text-[13px] text-[#4C6EF5] mb-4">
                            Check out sample pages &amp; demo PDF preview on our official LinkedIn post!
                        </p>
                        <a
                            href={LINKEDIN_POST_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-press inline-flex items-center gap-2 rounded-[10px] bg-secondary px-5 py-2.5 text-[12px] sm:text-[13px] font-bold text-white shadow-sm hover:bg-[#3B5BDB] transition-all duration-200"
                        >
                            <ExternalLink size={14} strokeWidth={2.5} />
                            View Demo PDF on LinkedIn ↗
                        </a>
                    </div>
                </div>
            </section>

            {/* ══════════════ DEMO PDF PREVIEW SHOWCASE ══════════════ */}
            <section id="demo-preview" className="bg-[#F8FAFC] py-10 sm:py-14 border-y border-[#E2E8F0] scroll-mt-[65px]">
                <div className="mx-auto max-w-[960px] px-4 sm:px-6 md:px-8">
                    <div className="text-center mb-8 sm:mb-10">
                        <span className="inline-block rounded-md bg-[#EEF2FF] px-3 py-1 text-[11px] font-bold text-secondary mb-2.5 uppercase tracking-wider border border-[#C7D2FE]">
                            👀 Inside Demo Preview
                        </span>
                        <h2 className="font-display text-[22px] sm:text-[30px] font-black text-primary leading-tight mb-2">
                            Review Demo Pages Before Getting the Kit
                        </h2>
                        <p className="font-sans text-[13px] sm:text-[14px] text-[#64748B] max-w-[580px] mx-auto leading-[1.6]">
                            Below are selected page previews from the actual 44-page Pharmacovigilance Kit. Tap any preview to jump to the download section.
                        </p>
                    </div>

                    <ProtectedDemoGrid pages={DEMO_PAGES} targetHref="#get-guide" />

                    {/* Burger vs Investment Psychology Box */}
                    <div className="mt-10 rounded-[20px] bg-gradient-to-r from-[#FFF1F2] via-[#FFF7ED] to-[#FEF2F2] border border-[#FECDD3] p-6 sm:p-8 text-center max-w-[720px] mx-auto shadow-sm">
                        <div className="w-12 h-12 rounded-full bg-[#FFE4E6] text-[#E11D48] font-display text-[22px] flex items-center justify-center mx-auto mb-3 shadow-sm">
                            🍔
                        </div>
                        <h3 className="font-display text-[18px] sm:text-[22px] font-black text-[#9F1239] mb-2">
                            Think About It This Way 👇
                        </h3>
                        <p className="font-sans text-[13px] sm:text-[14px] text-[#475569] leading-[1.75] mb-3">
                            Sometimes we spend the price of a <strong className="text-[#9F1239]">burger</strong> on a single meal and forget about it the next day.
                            Here, that same small spend unlocks a <strong className="text-primary">15-chapter structured learning resource</strong> that stays with you throughout your interview prep and early career!
                        </p>
                        <p className="font-display text-[13px] sm:text-[14px] font-extrabold text-primary">
                            💡 Invest in something that stays useful long after the meal is over.
                        </p>
                    </div>
                </div>
            </section>

            {/* ══════════════ SMART CROSS-LINKING CALLOUT BANNER ══════════════ */}
            <section className="mx-auto max-w-[960px] px-5 sm:px-8 py-6">
                <div className="rounded-[20px] bg-gradient-to-r from-[#0F1D5C] via-[#1E3A8A] to-[#2563EB] p-5 sm:p-7 text-white shadow-lg relative overflow-hidden">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative z-10">
                        <div className="space-y-2 max-w-[620px]">
                            <div className="inline-flex items-center gap-2 rounded-full bg-[#10B981] px-3 py-1 text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-white">
                                <GraduationCap size={13} /> Free Certification Opportunity
                            </div>
                            <h3 className="font-display text-[18px] sm:text-[22px] font-black text-white leading-tight">
                                Want 100% Free PV Certificates for Your Resume?
                            </h3>
                            <p className="font-sans text-[12px] sm:text-[13px] text-white/80 leading-[1.6]">
                                Check out our guide to <strong className="text-white">10 Free Pharmacovigilance Courses with Certificates</strong> offered by the official <strong className="text-white">Uppsala Monitoring Centre (WHO-UMC)</strong> learning portal!
                            </p>
                        </div>
                        <div className="shrink-0 w-full md:w-auto">
                            <Link
                                href="/blog/free-pharmacovigilance-courses-who-umc/"
                                className="btn-press w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-[12px] bg-[#6EE7B7] px-5 py-3 text-[13px] font-black text-[#064E3B] hover:bg-[#A7F3D0] transition-all duration-200 shadow-md"
                            >
                                <span>Explore Free WHO-UMC Courses</span>
                                <ArrowRight size={16} strokeWidth={2.5} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════ WHY NOT FREE ══════════════ */}
            <section className="mx-auto max-w-[960px] px-5 sm:px-8 py-10 sm:py-14">
                <div className="rounded-[20px] border border-[#E8EDFF] bg-white overflow-hidden shadow-sm">
                    <div className="p-6 sm:p-8">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="shrink-0 w-10 h-10 rounded-[10px] bg-[#FFF7ED] flex items-center justify-center">
                                <Zap size={20} strokeWidth={2} className="text-[#F97316]" />
                            </div>
                            <div>
                                <h2 className="font-display text-[18px] sm:text-[22px] font-black text-primary leading-tight mb-1">
                                    Why is this not just a free PDF?
                                </h2>
                                <p className="font-sans text-[12px] text-[#9CA3AF]">Honest answer 👇</p>
                            </div>
                        </div>

                        <div className="font-sans text-[13px] sm:text-[14px] text-[#4B5563] leading-[1.8] space-y-4">
                            <p>
                                Creating a genuinely structured resource takes time — <strong className="text-primary">researching, organising,
                                simplifying, designing, reviewing</strong> and putting everything into an interview-focused sequence.
                            </p>
                            <p>
                                We believe useful work deserves to have some value attached to it. Instead of distributing
                                it randomly for free, we are keeping it at an <strong className="text-primary">affordable amount</strong> — so students
                                can access it without spending a lot, while the effort behind creating it is also respected.
                            </p>
                            <div className="flex flex-wrap gap-3 pt-2">
                                {[
                                    "Properly researched",
                                    "Interview-focused structure",
                                    "Simple English",
                                    "Not AI-generated dump",
                                    "Reviewed & verified",
                                ].map((t) => (
                                    <span
                                        key={t}
                                        className="inline-flex items-center gap-1.5 rounded-full bg-[#F0FDF4] border border-[#BBF7D0] px-3 py-1 text-[11px] font-bold text-[#15803D]"
                                    >
                                        <CheckCircle2 size={11} strokeWidth={2.5} />
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════ ABOUT PHARMACODE (full image) ══════════════ */}
            <section className="bg-[#F4F6FF]">
                <div className="mx-auto max-w-[960px] px-5 sm:px-8 py-10 sm:py-14">
                    <div className="text-center mb-6">
                        <span className="inline-block rounded-md bg-white px-3 py-1 text-[11px] font-bold text-[#8B5CF6] mb-3 uppercase tracking-wider border border-[#E8EDFF]">
                            🏆 Who We Are
                        </span>
                        <h2 className="font-display text-[20px] sm:text-[26px] font-black text-primary leading-tight mb-2">
                            PharmaCode — <span className="text-secondary">Right Guidance. Real Opportunities.</span>
                        </h2>
                    </div>
                    <div className="rounded-[16px] overflow-hidden border border-[#E8EDFF] shadow-card mx-auto max-w-[720px]">
                        <Image
                            src="/blog/pv-kit/pharmacode-about.jpeg"
                            alt="PharmaCode — Career guidance, preparation guides, knowledge bank, job updates, interview resources and study materials for pharmacy students"
                            width={720}
                            height={900}
                            className="w-full h-auto object-cover"
                            priority
                        />
                    </div>
                </div>
            </section>

            {/* ══════════════ GET THE GUIDE — PAYMENT ══════════════ */}
            <section id="get-guide" className="scroll-mt-[62px]">
                <div
                    className="relative overflow-hidden"
                    style={{
                        background: "linear-gradient(135deg, #0F1D5C 0%, #1A2B6B 40%, #243A8E 70%, #4C6EF5 100%)",
                    }}
                >
                    {/* Decorative */}
                    <div className="absolute top-[-60px] left-[-40px] w-[200px] h-[200px] rounded-full opacity-10" style={{ background: "radial-gradient(circle, #6EE7B7, transparent)" }} />
                    <div className="absolute bottom-[-80px] right-[-60px] w-[260px] h-[260px] rounded-full opacity-10" style={{ background: "radial-gradient(circle, #FF8FAB, transparent)" }} />

                    <div className="mx-auto max-w-[960px] px-5 sm:px-8 py-10 sm:py-14 relative z-10">
                        <div className="text-center mb-8">
                            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-1.5 mb-4">
                                <IndianRupee size={14} strokeWidth={2.5} className="text-[#6EE7B7]" />
                                <span className="text-[12px] sm:text-[13px] font-bold text-white/90">Launch Price — Limited Time Only</span>
                            </span>
                            <h2 className="font-display text-[24px] sm:text-[32px] font-black text-white leading-tight mb-2">
                                Get Your PV Guide Now
                            </h2>
                            <p className="font-sans text-[13px] sm:text-[14px] text-white/60 max-w-[500px] mx-auto">
                                Simple 4-step process. Pay → Send screenshot → Receive PDF on email.
                            </p>
                        </div>

                        {/* Steps */}
                        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                            {STEPS.map((s) => (
                                <div
                                    key={s.num}
                                    className="fade-up rounded-[14px] bg-white/10 backdrop-blur-sm border border-white/15 p-4 text-center"
                                >
                                    <div className="w-8 h-8 rounded-full bg-[#6EE7B7] text-primary font-display text-[14px] font-black flex items-center justify-center mx-auto mb-3">
                                        {s.num}
                                    </div>
                                    <h4 className="font-display text-[13px] font-extrabold text-white mb-1">{s.title}</h4>
                                    <p className="font-sans text-[11px] text-white/60 leading-[1.5]">{s.desc}</p>
                                </div>
                            ))}
                        </div>

                        {/* Payment card */}
                        <div className="mx-auto max-w-[480px]">
                            <div className="rounded-[20px] bg-white shadow-2xl overflow-hidden">
                                {/* Countdown Urgency Banner */}
                                <CountdownTimer variant="card" />

                                {/* Dynamic Price header — auto switches ₹79→₹99 on expiry */}
                                <DynamicPriceHeader />

                                {/* Dynamic LinkedIn Follower Box — auto switches on expiry */}
                                <DynamicLinkedInBox />

                                {/* QR code */}
                                <div className="p-6 text-center">
                                    <p className="font-display text-[14px] font-bold text-primary mb-4">
                                        Scan & Pay Using Any UPI App
                                    </p>
                                    <div className="rounded-[16px] overflow-hidden border-2 border-[#E8EDFF] mx-auto max-w-[340px]">
                                        <Image
                                            src="/blog/pv-kit/qr-payment.jpeg"
                                            alt="PharmaCode UPI Payment QR Code — Scan with GPay, PhonePe, Paytm, BHIM or any UPI app to pay ₹79"
                                            width={340}
                                            height={340}
                                            className="w-full h-auto object-contain"
                                            priority
                                        />
                                    </div>
                                    
                                    <CopyUpiBox />

                                    {/* UPI apps */}
                                    <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
                                        {["GPay", "PhonePe", "Paytm", "BHIM", "Amazon Pay"].map((app) => (
                                            <span
                                                key={app}
                                                className="rounded-full bg-[#F4F6FF] border border-[#E8EDFF] px-2.5 py-1 text-[10px] font-semibold text-[#6B7FA3]"
                                            >
                                                {app}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="h-px bg-[#E8EDFF] mx-6" />

                                {/* Email instructions */}
                                <div className="p-4 sm:p-6 space-y-3.5">
                                    <div className="rounded-[14px] bg-[#FFFBEB] border border-[#FDE68A] p-3.5 sm:p-4">
                                        <div className="flex items-start gap-2.5 sm:gap-3">
                                            <div className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-[8px] bg-[#FEF3C7] flex items-center justify-center mt-0.5">
                                                <Mail size={15} strokeWidth={2} className="text-[#D97706]" />
                                            </div>
                                            <div>
                                                <h4 className="font-display text-[12px] sm:text-[13px] font-extrabold text-[#92400E] mb-0.5">
                                                    After Payment
                                                </h4>
                                                <p className="font-sans text-[11px] sm:text-[12px] text-[#A16207] leading-[1.5]">
                                                    Send your <strong>payment screenshot</strong> or <strong>transaction reference</strong> to
                                                    the email below. Your complete PDF guide will be delivered within a few hours.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Responsive Email Box with Instant Copy Button */}
                                    <CopyEmailBox />

                                    {/* Mobile tip */}
                                    <div className="flex items-center gap-2 rounded-[10px] bg-[#F0FDF4] border border-[#BBF7D0] p-2.5 sm:p-3">
                                        <Smartphone size={14} strokeWidth={2} className="text-[#15803D] shrink-0" />
                                        <p className="font-sans text-[10px] sm:text-[11px] text-[#15803D] leading-[1.4]">
                                            <strong>Mobile users:</strong> Tap &apos;Copy Email&apos; above or long-press to copy the email address instantly.
                                        </p>
                                    </div>
                                </div>

                                {/* What you get */}
                                <div className="bg-[#F9FAFB] px-4 sm:px-6 py-4 sm:py-5 border-t border-[#E8EDFF]">
                                    <p className="font-display text-[11px] sm:text-[12px] font-bold text-[#6B7FA3] uppercase tracking-wider mb-2.5">
                                        What you&apos;ll receive
                                    </p>
                                    <div className="space-y-2">
                                        {[
                                            "Complete 44-page PDF Guide",
                                            "All 15 chapters — fundamentals to interview prep",
                                            "HR + Technical + Scenario-based questions",
                                            "Case studies & revision cheat sheet",
                                            "Resume & mock interview strategy",
                                        ].map((item) => (
                                            <div key={item} className="flex items-start gap-2">
                                                <ChevronRight size={12} strokeWidth={2.5} className="text-[#10B981] shrink-0 mt-0.5" />
                                                <span className="font-sans text-[11px] sm:text-[13px] text-[#374151] leading-[1.4]">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Trust badges */}
                        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
                            {[
                                { icon: Shield, label: "Secure Payment" },
                                { icon: Clock, label: "Instant Delivery" },
                                { icon: CheckCircle2, label: "Verified Content" },
                            ].map((b) => (
                                <div
                                    key={b.label}
                                    className="flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3 py-1.5"
                                >
                                    <b.icon size={12} strokeWidth={2} className="text-[#6EE7B7]" />
                                    <span className="text-[11px] font-semibold text-white/80">{b.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════ FAQ ══════════════ */}
            <section className="mx-auto max-w-[960px] px-5 sm:px-8 py-10 sm:py-14">
                <div className="text-center mb-8">
                    <h2 className="font-display text-[20px] sm:text-[26px] font-black text-primary">
                        Frequently Asked Questions
                    </h2>
                </div>

                <div className="space-y-3 max-w-[680px] mx-auto">
                    {[
                        {
                            q: "Who is this guide for?",
                            a: "B.Pharm & M.Pharm students, freshers and early-career professionals who are preparing for Pharmacovigilance roles in pharma companies, CROs or regulatory bodies.",
                        },
                        {
                            q: "Can I see a sample preview or demo before buying?",
                            a: "Yes! You can view sample pages and demo PDF previews directly on our official LinkedIn post. Click 'View Demo PDF on LinkedIn' above or visit our LinkedIn page.",
                        },
                        {
                            q: "What format is the guide in?",
                            a: "It is a PDF document — 44 pages, formatted for easy reading on both mobile phones and laptops/desktops.",
                        },
                        {
                            q: "How will I receive the guide?",
                            a: "After you make the payment and send the screenshot to our email, we will verify the payment and send the complete PDF to your email address — usually within a few hours.",
                        },
                        {
                            q: "Can I pay from outside India?",
                            a: "Yes! For international payments, please DM us on our LinkedIn page (PharmaCode) and we will share PayPal details. International price is $2 USD.",
                        },
                        {
                            q: "Is there a refund policy?",
                            a: "Since this is a digital PDF product, we do not offer refunds after delivery. However, if you face any issues, reach out to us and we will help.",
                        },
                    ].map((faq, i) => (
                        <div
                            key={i}
                            className="rounded-[14px] border border-[#E8EDFF] bg-white p-5 hover:border-[#C7D2FE] transition-colors duration-200"
                        >
                            <h3 className="font-display text-[13px] sm:text-[14px] font-extrabold text-primary mb-2 flex items-start gap-2">
                                <span className="shrink-0 w-5 h-5 rounded-full bg-[#EEF2FF] text-secondary text-[11px] font-black flex items-center justify-center mt-0.5">
                                    Q
                                </span>
                                {faq.q}
                            </h3>
                            <p className="font-sans text-[12px] sm:text-[13px] text-[#6B7FA3] leading-[1.7] pl-7">
                                {faq.a}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

