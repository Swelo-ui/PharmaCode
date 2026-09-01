import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, articleSchema } from "@/lib/schema";
import { absUrl } from "@/lib/site";
import {
    FAQAccordion,
    RADemoGrid,
    StickyMobileCTA,
    CopyUpiBox,
    CopyEmailBox,
    BurgerVsLearningCard,
    type DemoImageItem,
} from "./RAGuideClient";
import {
    BookOpen, CheckCircle2, FileText, GraduationCap, Shield,
    Layers, Globe2, Briefcase, Zap, Award, TrendingUp,
    IndianRupee, ArrowRight, Sparkles, ChevronRight,
    Building2, Microscope, FlaskConical, Scale, Users, Target,
    FileCheck, ClipboardCheck, SquareStack, Cpu,
    MapPin, BarChart3, MessageSquare, BookMarked,
    AlertCircle, Lightbulb, Star, Clock, Download,
    Check, HelpCircle, Utensils, ExternalLink, Activity, Eye, Mail, Smartphone
} from "lucide-react";

export const metadata: Metadata = {
    title: "Regulatory Affairs (RA) Complete Guide — From Dossier to Drug Approval | PharmaCode",
    description:
        "Get the complete Regulatory Affairs guide by PharmaCode — 20-section structured PDF covering CDSCO, CTD, eCTD, NDA, MAA, career roadmap and interview preparation. Built for B.Pharm, M.Pharm, Pharm.D students and freshers.",
    alternates: { canonical: absUrl("/blog/regulatory-affairs-complete-guide/") },
    keywords: [
        "regulatory affairs guide PDF",
        "RA interview preparation",
        "CTD eCTD guide India",
        "NDA ANDA BLA explained",
        "CDSCO regulatory affairs",
        "regulatory affairs for freshers",
        "dossier preparation guide",
        "drug approval process India",
        "B.Pharm regulatory affairs",
        "regulatory affairs complete guide",
        "RA career preparation",
        "PharmaCode RA guide",
        "regulatory affairs interview questions",
        "ICH CTD modules",
        "MAA FDA EMA comparison",
    ],
    openGraph: {
        title: "Regulatory Affairs (RA) Complete Guide — PharmaCode",
        description:
            "20-section structured PDF covering CDSCO, CTD, eCTD, NDA, MAA, career roadmap and interview preparation. Built for pharmacy students & freshers.",
        url: absUrl("/blog/regulatory-affairs-complete-guide/"),
        images: [
            {
                url: "https://res.cloudinary.com/dhf7udqhi/image/upload/v1788238873/48909edc-90b9-4e4f-ae81-64c3dd81a507.png",
                width: 1200,
                height: 630,
                alt: "PharmaCode RA Complete Guide",
            },
        ],
    },
};

/* ── 6 Demo images from Cloudinary with uniform formatting ── */
const DEMO_PAGES: DemoImageItem[] = [
    {
        num: "01",
        title: "Official Cover & Introduction",
        subtitle: "PharmaCode learning series & core RA scope",
        src: "https://res.cloudinary.com/dhf7udqhi/image/upload/v1788238873/48909edc-90b9-4e4f-ae81-64c3dd81a507.png",
        alt: "Regulatory Affairs Complete Guide — Cover and Introduction page",
    },
    {
        num: "02",
        title: "Global Regulatory Bodies",
        subtitle: "FDA, EMA, MHRA, PMDA & international agencies",
        src: "https://res.cloudinary.com/dhf7udqhi/image/upload/v1788238888/70da3ac5-beb7-47d2-b2e9-1c8620faeab1.png",
        alt: "RA Guide — Global Regulatory Authorities overview",
    },
    {
        num: "03",
        title: "CTD Structure & Modules",
        subtitle: "ICH M4 triangle & 5 modular dossier breakdown",
        src: "https://res.cloudinary.com/dhf7udqhi/image/upload/v1788239051/df5f1141-d700-4a9e-b96a-05a43b7b51c2.png",
        alt: "RA Guide — Common Technical Document CTD Module Architecture",
    },
    {
        num: "04",
        title: "eCTD Electronic Submissions",
        subtitle: "XML backbone, sequence management & lifecycle",
        src: "https://res.cloudinary.com/dhf7udqhi/image/upload/v1788238979/4dd3e64a-5c50-481e-9fcb-2a97ebd08cb2.png",
        alt: "RA Guide — Electronic Submissions and eCTD flow",
    },
    {
        num: "05",
        title: "NDA, ANDA & BLA Framework",
        subtitle: "Innovator, generic & biologic pathways compared",
        src: "https://res.cloudinary.com/dhf7udqhi/image/upload/v1788239079/3716fc61-19db-4892-9db5-2d7a1a27b1e1.png",
        alt: "RA Guide — NDA, ANDA and BLA application types",
    },
    {
        num: "06",
        title: "Career Ladder & Interview Q&A",
        subtitle: "Role roadmap, hiring domains & model answers",
        src: "https://res.cloudinary.com/dhf7udqhi/image/upload/v1788239152/a98654b1-c24e-4365-b4cc-3c3c58059fb7.png",
        alt: "RA Guide — Career Ladder and Interview Preparation",
    },
];

/* ── 20-section roadmap ── */
const SECTIONS = [
    { num: "01", icon: BookOpen, title: "What Is Regulatory Affairs?", desc: "Clear definition, purpose and scope — why RA exists and what the function actually does.", color: "#4C6EF5" },
    { num: "02", icon: Briefcase, title: "Role of the RA Professional", desc: "What an RA person does day-to-day across submission, review, labelling and lifecycle.", color: "#10B981" },
    { num: "03", icon: Globe2, title: "Regulatory Bodies of the World", desc: "FDA, EMA, MHRA, PMDA, NMPA, ANVISA and all major regulators — mapped and explained.", color: "#F59E0B" },
    { num: "04", icon: MapPin, title: "India Spotlight — CDSCO", desc: "India's central drug regulatory body — structure, DCGI, licensing and enforcement.", color: "#EC4899" },
    { num: "05", icon: Star, title: "India 2026 Update & ICH Status", desc: "Latest regulatory updates, India's ICH membership progress and what it means.", color: "#8B5CF6" },
    { num: "06", icon: FileText, title: "Dossier & Drug Master File (DMF)", desc: "What is a dossier? Types of DMFs, contents and how they feed into applications.", color: "#06B6D4" },
    { num: "07", icon: Layers, title: "Common Technical Document (CTD)", desc: "The globally harmonised dossier format — purpose, structure and ICH M4 guidance.", color: "#F97316" },
    { num: "08", icon: SquareStack, title: "CTD Triangle & Module 1", desc: "Visual CTD triangle explained module-by-module, including the region-specific Module 1.", color: "#BE185D" },
    { num: "09", icon: Cpu, title: "eCTD — Electronic Submissions", desc: "Electronic CTD format, backbone, sequence numbering and regulatory expectations.", color: "#059669" },
    { num: "10", icon: ClipboardCheck, title: "New Drug Application (NDA)", desc: "US NDA process — when to file, what sections are required and the FDA review pathway.", color: "#7C3AED" },
    { num: "11", icon: FileCheck, title: "IND, ANDA & BLA Explained", desc: "Investigational, generic and biologics application types — clearly differentiated.", color: "#0891B2" },
    { num: "12", icon: Scale, title: "Marketing Authorisation Application (MAA)", desc: "EU MAA filing — EMA procedures, CHMP, centralised vs decentralised pathways.", color: "#D97706" },
    { num: "13", icon: BarChart3, title: "US vs EU vs India — Quick Compare", desc: "Side-by-side comparison table for key regulatory requirements, timelines and terminology.", color: "#E11D48" },
    { num: "14", icon: TrendingUp, title: "RA Across the Product Lifecycle", desc: "RA's role from clinical development through approval to post-marketing variations.", color: "#4C6EF5" },
    { num: "15", icon: Award, title: "Skills & Career Ladder", desc: "Skills the industry looks for and the career path from associate to director.", color: "#10B981" },
    { num: "16", icon: Building2, title: "Who Hires RA Professionals?", desc: "Innovator pharma, generics, biotech, CROs, consultancies — the full hiring landscape.", color: "#F59E0B" },
    { num: "17", icon: MessageSquare, title: "Interview Preparation", desc: "10 real RA interview questions with model answers and explanation strategies.", color: "#EC4899" },
    { num: "18", icon: ArrowRight, title: "End-to-End Submission Flow", desc: "Visual flowchart from pre-clinical studies through IND, dossier, review to approval.", color: "#8B5CF6" },
    { num: "19", icon: Lightbulb, title: "Tricky Points & Mix-Ups", desc: "Common confusions cleared — CTD vs eCTD, NDA vs MAA, CDSCO vs DCGI and more.", color: "#06B6D4" },
    { num: "20", icon: BookMarked, title: "Glossary — Quick Reference", desc: "All key terms, abbreviations and acronyms in one clean, scannable glossary.", color: "#F97316" },
];

/* ── Feature cards ── */
const FEATURES = [
    {
        icon: BookOpen,
        color: "#4C6EF5",
        title: "Simplified Learning",
        desc: "Complex RA concepts explained in clearer, easier language — no prior background needed.",
    },
    {
        icon: MapPin,
        color: "#10B981",
        title: "India / CDSCO Focus",
        desc: "Dedicated India content including CDSCO, DCGI, central and state licensing and 2026 updates.",
    },
    {
        icon: Globe2,
        color: "#F59E0B",
        title: "Global Regulatory Understanding",
        desc: "Understand FDA, EMA, MHRA, PMDA, NMPA and other major regulatory bodies worldwide.",
    },
    {
        icon: Layers,
        color: "#EC4899",
        title: "CTD + eCTD Coverage",
        desc: "Dossier structure, modules, electronic submissions and lifecycle submission concepts explained.",
    },
    {
        icon: Briefcase,
        color: "#8B5CF6",
        title: "Career + Interview Prep",
        desc: "Career ladder, who hires RA professionals and practical interview preparation included.",
    },
    {
        icon: Zap,
        color: "#06B6D4",
        title: "Quick Revision Tools",
        desc: "Submission flow, tricky points, common mix-ups and glossary for effective last-minute revision.",
    },
];

/* ── Badge pills for hero ── */
const HERO_BADGES = [
    { icon: MapPin, label: "CDSCO & India Focus", color: "#10B981" },
    { icon: Layers, label: "CTD • eCTD • NDA • MAA", color: "#4C6EF5" },
    { icon: MessageSquare, label: "Career & Interview Prep", color: "#EC4899" },
    { icon: Star, label: "2026 Updated Edition", color: "#F59E0B" },
    { icon: CheckCircle2, label: "Source-Checked", color: "#8B5CF6" },
];

/* ── Drug approval flow steps ── */
const APPROVAL_STEPS = [
    { num: 1, label: "Pre-Clinical & IND", color: "#4C6EF5" },
    { num: 2, label: "Clinical Trials", color: "#10B981" },
    { num: 3, label: "Dossier Compilation", color: "#F59E0B" },
    { num: 4, label: "eCTD Submission", color: "#EC4899" },
    { num: 5, label: "Regulatory Review", color: "#8B5CF6" },
    { num: 6, label: "Approval Decision", color: "#06B6D4" },
    { num: 7, label: "Product Launch", color: "#F97316" },
    { num: 8, label: "Post-Approval RA", color: "#BE185D" },
    { num: 9, label: "Pharmacovigilance Feedback Loop", color: "#059669" },
];

/* ── Career progression ── */
const CAREER_LADDER = [
    { role: "RA Associate / Executive", level: 1 },
    { role: "Senior RA Executive", level: 2 },
    { role: "RA Officer / Specialist", level: 3 },
    { role: "RA Manager", level: 4 },
    { role: "RA Head / Director", level: 5 },
];

const HIRING_SECTORS = [
    { icon: Building2, label: "Innovator Pharma", color: "#4C6EF5" },
    { icon: Layers, label: "Generic Pharma", color: "#10B981" },
    { icon: FlaskConical, label: "Biotech / Biosimilars", color: "#F59E0B" },
    { icon: Microscope, label: "Medical Devices", color: "#EC4899" },
    { icon: Users, label: "CROs", color: "#8B5CF6" },
    { icon: Briefcase, label: "Regulatory Consultancies", color: "#06B6D4" },
    { icon: Scale, label: "Regulatory Bodies", color: "#F97316" },
];

/* ── Who is this for ── */
const TARGET_CARDS = [
    {
        icon: GraduationCap,
        title: "B.Pharm / M.Pharm Students",
        desc: "Learning RA as a subject or exploring it as a career path.",
        color: "#4C6EF5",
    },
    {
        icon: Briefcase,
        title: "Pharmacy Freshers",
        desc: "Entering the job market and preparing for RA roles.",
        color: "#10B981",
    },
    {
        icon: FlaskConical,
        title: "Pharmacy / Life Science Learners",
        desc: "Pharm.D students and science graduates exploring regulatory careers.",
        color: "#F59E0B",
    },
    {
        icon: Target,
        title: "RA Interview Candidates",
        desc: "Preparing for regulatory affairs interview questions and role expectations.",
        color: "#EC4899",
    },
];

/* ── Interview questions ── */
const INTERVIEW_QUESTIONS = [
    "What is Regulatory Affairs?",
    "What is a dossier?",
    "NDA vs MAA — what's the difference?",
    "Explain CTD in 30 seconds.",
    "CTD vs eCTD?",
    "What is a Drug Master File (DMF)?",
    "NDA vs ANDA vs BLA?",
    "Who regulates drugs in India?",
    "Central vs State licensing?",
    "What's changing with eCTD v4.0?",
];

/* ── FAQ data ── */
const FAQS = [
    {
        q: "What is included in the RA Guide?",
        a: "The guide includes 20 structured sections covering What is Regulatory Affairs, global regulatory bodies (FDA, EMA, CDSCO), dossier and CTD structure, eCTD, NDA/ANDA/BLA, MAA, US vs EU vs India comparison, career ladder, interview preparation, end-to-end submission flow, tricky points and a glossary.",
    },
    {
        q: "Who is this guide for?",
        a: "B.Pharm, M.Pharm and Pharm.D students, pharmacy freshers, life science learners and anyone preparing for regulatory affairs interview roles. It is written assuming no prior in-depth RA knowledge.",
    },
    {
        q: "Is this useful for B.Pharm freshers?",
        a: "Yes. The guide is written specifically with students and freshers in mind. Concepts are explained clearly without assuming deep industry experience.",
    },
    {
        q: "Does it cover CDSCO?",
        a: "Yes. There is a dedicated section on CDSCO and DCGI covering India's central regulatory body, its structure, licensing, and the India 2026 regulatory update section.",
    },
    {
        q: "Does it include interview preparation?",
        a: "Yes. Section 17 is dedicated to RA interview preparation with 10 real interview questions and model answer guidance.",
    },
    {
        q: "Does it explain CTD and eCTD?",
        a: "Yes — in detail. Sections 07, 08 and 09 cover the Common Technical Document structure, CTD triangle with all modules, and the eCTD electronic submission format.",
    },
    {
        q: "Does it cover NDA, ANDA and BLA?",
        a: "Yes. Section 10 covers the NDA in depth, and Section 11 explains IND, ANDA and BLA — all differentiated clearly.",
    },
    {
        q: "Is this a physical book?",
        a: "No. This is a digital PDF guide. You receive the file digitally — it can be read on your phone, tablet, laptop or desktop.",
    },
    {
        q: "How will I receive the PDF?",
        a: "After payment, send your payment screenshot to pharmacode.connect@gmail.com. Your PDF will be delivered to your email within a few hours.",
    },
    {
        q: "How much does it cost?",
        a: "The guide is available at the launch offer price of ₹89. The original price is ₹199. This is a one-time purchase — no subscriptions.",
    },
];

/* ─────────────────────────────────────────
   PAGE COMPONENT
───────────────────────────────────────── */
export default function RAGuidePage() {
    const breadcrumbs = [
        { name: "Home", href: "/" },
        { name: "Blog", href: "/blog/" },
        { name: "RA Complete Guide", href: "/blog/regulatory-affairs-complete-guide/" },
    ];

    return (
        <div className="w-full">
            <JsonLd data={breadcrumbSchema(breadcrumbs)} />
            <JsonLd
                data={articleSchema({
                    title: "Regulatory Affairs (RA) Complete Guide — From Dossier to Drug Approval",
                    description:
                        "20-section structured PDF covering CDSCO, CTD, eCTD, NDA, MAA, career roadmap and RA interview preparation.",
                    url: "/blog/regulatory-affairs-complete-guide/",
                    imageUrl:
                        "https://res.cloudinary.com/dhf7udqhi/image/upload/v1788238873/48909edc-90b9-4e4f-ae81-64c3dd81a507.png",
                })}
            />

            {/* Sticky mobile CTA (client) */}
            <StickyMobileCTA />

            {/* ══════════════════════════════════════════
                1. HERO SECTION
            ══════════════════════════════════════════ */}
            <section
                className="relative overflow-hidden"
                style={{
                    background: "linear-gradient(135deg, #0F1D5C 0%, #1A2B6B 30%, #243A8E 60%, #4C6EF5 100%)",
                }}
            >
                {/* Decorative background orbs */}
                <div className="absolute top-[-100px] right-[-80px] w-[340px] h-[340px] rounded-full opacity-10 pointer-events-none" style={{ background: "radial-gradient(circle, #7B9BF7, transparent)" }} />
                <div className="absolute bottom-[-120px] left-[-80px] w-[380px] h-[380px] rounded-full opacity-8 pointer-events-none" style={{ background: "radial-gradient(circle, #FF8FAB, transparent)" }} />

                <div className="mx-auto max-w-[1040px] px-5 sm:px-8 pt-6 pb-12 sm:pt-10 sm:pb-16 relative z-10">
                    {/* Breadcrumb */}
                    <div className="mb-4">
                        <Breadcrumb items={breadcrumbs} variant="light" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        {/* Left column — copy + CTA + pricing */}
                        <div>
                            {/* Series badge */}
                            <div className="fade-up mb-4 flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-3.5 py-1 text-[11px] font-extrabold text-white uppercase tracking-wider">
                                    <Sparkles size={12} className="text-[#93C5FD]" />
                                    PharmaCode Learning Series
                                </span>
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EF4444]/25 border border-[#EF4444]/40 px-3.5 py-1 text-[11px] font-extrabold text-[#FCA5A5] uppercase tracking-wider shadow-sm">
                                    <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-ping" />
                                    Launch Offer Active
                                </span>
                            </div>

                            {/* Headline */}
                            <h1 className="fade-up fade-up-1 font-display text-[28px] sm:text-[36px] md:text-[42px] font-black text-white leading-[1.15] mb-2">
                                Regulatory Affairs (RA)
                            </h1>
                            <p className="fade-up fade-up-2 font-display text-[16px] sm:text-[20px] font-extrabold text-[#93C5FD] mb-3 leading-snug">
                                Complete Guide — From Dossier to Drug Approval
                            </p>
                            <p className="fade-up fade-up-2 text-[14px] sm:text-[15px] text-white/80 max-w-[560px] leading-[1.7] mb-5 font-sans">
                                Everything you need to understand RA concepts, prepare for interviews and build a strong foundation — <strong className="text-white">in one practical guide.</strong>
                            </p>

                            {/* Badge pills */}
                            <div className="fade-up fade-up-3 flex flex-wrap gap-2 mb-6">
                                {HERO_BADGES.map((b) => (
                                    <div
                                        key={b.label}
                                        className="flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 px-3 py-1.5"
                                    >
                                        <b.icon size={13} strokeWidth={2.5} style={{ color: b.color }} />
                                        <span className="text-[11px] sm:text-[12px] font-bold text-white/95">{b.label}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Pricing + CTA block */}
                            <div className="fade-up fade-up-4">
                                <div className="flex items-baseline gap-3 mb-1">
                                    <span className="font-display text-[38px] sm:text-[46px] font-black text-[#6EE7B7] leading-none">₹89</span>
                                    <span className="font-display text-[20px] sm:text-[22px] font-bold text-white/40 line-through leading-none">₹199</span>
                                    <span className="rounded-md bg-[#10B981]/25 border border-[#10B981]/40 px-2 py-0.5 text-[10px] font-black text-[#A7F3D0] uppercase tracking-wider">55% Off</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[13px] text-white/80 mb-5 font-sans">
                                    <Utensils size={14} className="text-[#FCD34D] shrink-0" />
                                    <span>₹89 — Less than the price of a burger</span>
                                </div>

                                <div className="flex flex-wrap gap-3 items-center mb-3">
                                    <a
                                        href="#get-guide"
                                        className="btn-press inline-flex items-center gap-2 rounded-[14px] bg-white px-6 py-3.5 text-[15px] sm:text-[16px] font-black text-primary shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-[1.02] min-h-[50px]"
                                    >
                                        <Download size={18} strokeWidth={2.5} className="text-secondary" />
                                        Get the RA Guide — ₹89
                                        <ArrowRight size={16} strokeWidth={2.5} />
                                    </a>
                                    <a
                                        href="#demo-preview"
                                        className="btn-press inline-flex items-center gap-2 rounded-[14px] bg-white/10 backdrop-blur-sm border border-white/25 px-5 py-3.5 text-[14px] font-bold text-white hover:bg-white/20 transition-all duration-200 min-h-[50px]"
                                    >
                                        <Eye size={15} strokeWidth={2} />
                                        Preview the Guide
                                    </a>
                                </div>
                                <p className="font-sans text-[12px] text-white/60">
                                    Instant digital access • One-time purchase
                                </p>
                            </div>

                            <p className="fade-up fade-up-5 mt-5 font-sans text-[13px] text-white/70 max-w-[480px] leading-[1.6] border-l-2 border-[#6EE7B7]/50 pl-3">
                                Built for students and freshers who want to understand RA — not just memorize definitions.
                            </p>
                        </div>

                        {/* Right column — PDF preview card */}
                        <div className="fade-up fade-up-3 hidden lg:block">
                            <div className="relative max-w-[420px] mx-auto">
                                {/* Premium PDF mockup card */}
                                <div className="rounded-[20px] overflow-hidden border-2 border-white/25 shadow-2xl bg-white/5 backdrop-blur-sm aspect-[3/4] relative">
                                    <Image
                                        src={DEMO_PAGES[0].src}
                                        alt="Regulatory Affairs Complete Guide — PharmaCode PDF preview"
                                        width={420}
                                        height={560}
                                        className="w-full h-full object-cover object-top"
                                        priority
                                    />
                                    {/* Overlay badge */}
                                    <div className="absolute top-3.5 right-3.5 bg-primary/85 backdrop-blur-md rounded-[10px] px-3 py-1.5 shadow-lg border border-white/20">
                                        <span className="font-display text-[11px] font-black text-white">20 SECTIONS</span>
                                    </div>
                                </div>
                                {/* Floating price badge */}
                                <div className="absolute -bottom-4 -left-4 bg-white rounded-[14px] shadow-xl px-4 py-3 border border-[#E8EDFF]">
                                    <p className="font-sans text-[10px] text-[#9CA3AF] mb-0.5">Offer Price</p>
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="font-display text-[24px] font-black text-primary">₹89</span>
                                        <span className="text-[13px] text-[#9CA3AF] line-through">₹199</span>
                                    </div>
                                </div>
                                {/* Floating 2026 Edition badge */}
                                <div className="absolute -top-3 -right-3 bg-[#10B981] rounded-full w-14 h-14 flex flex-col items-center justify-center shadow-lg border-2 border-white">
                                    <span className="font-display text-[9px] font-black text-white uppercase leading-none">2026</span>
                                    <span className="font-display text-[9px] font-black text-white uppercase leading-none">Edition</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                2. PRODUCT PREVIEW / IMAGE GALLERY
            ══════════════════════════════════════════ */}
            <section id="demo-preview" className="py-12 sm:py-16 bg-[#F8FAFC] border-b border-[#E2E8F0] scroll-mt-[65px]">
                <div className="mx-auto max-w-[1040px] px-5 sm:px-8">
                    <div className="text-center mb-8 sm:mb-10">
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-[#EEF2FF] px-3 py-1 text-[11px] font-bold text-secondary mb-2.5 uppercase tracking-wider border border-[#C7D2FE]">
                            <Eye size={13} strokeWidth={2.5} />
                            Inside Demo Preview
                        </span>
                        <h2 className="font-display text-[24px] sm:text-[32px] font-black text-primary leading-tight mb-2">
                            See What You&apos;ll Get Inside
                        </h2>
                        <p className="font-sans text-[13px] sm:text-[15px] text-[#64748B] max-w-[620px] mx-auto leading-[1.6]">
                            This isn&apos;t a random collection of notes. It&apos;s a structured RA preparation guide designed to help you understand concepts and explain them confidently.
                        </p>
                    </div>

                    {/* Uniform 6-card protected grid */}
                    <RADemoGrid pages={DEMO_PAGES} />

                    <div className="text-center mt-6">
                        <span className="inline-flex items-center gap-1.5 text-xs text-[#94A3B8] font-sans">
                            <Shield size={12} strokeWidth={2} className="text-[#10B981]" />
                            Inside the actual guide — tap any sample page above to expand full screen
                        </span>
                    </div>

                    {/* Interactive Burger vs Career Investment Comparison */}
                    <BurgerVsLearningCard />
                </div>
            </section>

            {/* ══════════════════════════════════════════
                3. PAIN POINT SECTION
            ══════════════════════════════════════════ */}
            <section className="bg-white py-12 sm:py-16 border-b border-[#E8EDFF]">
                <div className="mx-auto max-w-[960px] px-5 sm:px-8">
                    <div className="text-center mb-8">
                        <h2 className="font-display text-[22px] sm:text-[28px] font-black text-primary leading-tight mb-3">
                            Preparing for RA Interviews Shouldn&apos;t Feel{" "}
                            <span className="text-[#E11D48]">This Confusing.</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
                        {[
                            { q: "CTD vs eCTD?", color: "#4C6EF5" },
                            { q: "NDA vs ANDA vs BLA?", color: "#10B981" },
                            { q: "CDSCO vs DCGI?", color: "#F59E0B" },
                            { q: "US vs EU vs India?", color: "#EC4899" },
                            { q: "What happens after approval?", color: "#8B5CF6" },
                        ].map((item) => (
                            <div
                                key={item.q}
                                className="lift rounded-[14px] bg-[#FAFBFF] border border-[#E8EDFF] p-4 text-center shadow-xs"
                            >
                                <HelpCircle size={20} strokeWidth={2} className="mx-auto mb-2" style={{ color: item.color }} />
                                <p className="font-display text-[12px] sm:text-[13px] font-extrabold text-primary leading-tight">{item.q}</p>
                            </div>
                        ))}
                    </div>

                    <div className="rounded-[20px] bg-gradient-to-r from-[#EEF2FF] via-[#F4F6FF] to-[#EEF2FF] border border-[#C7D2FE] p-6 sm:p-8 text-center max-w-[740px] mx-auto">
                        <p className="font-sans text-[14px] sm:text-[15px] text-[#475569] leading-[1.75] mb-2">
                            Stop jumping between <strong className="text-[#9F1239]">scattered PDFs, outdated notes</strong> and random interview questions.
                        </p>
                        <p className="font-display text-[15px] sm:text-[18px] font-black text-primary">
                            Get the concepts + career context + interview preparation in one place.
                        </p>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                4. WHAT'S INSIDE THE GUIDE (20 SECTIONS)
            ══════════════════════════════════════════ */}
            <section className="py-12 sm:py-16 bg-[#F4F6FF]">
                <div className="mx-auto max-w-[1040px] px-5 sm:px-8">
                    <div className="text-center mb-10">
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-1 text-[11px] font-bold text-secondary mb-3 uppercase tracking-wider border border-[#E8EDFF]">
                            <BookOpen size={13} strokeWidth={2.5} />
                            Complete Curriculum
                        </span>
                        <h2 className="font-display text-[24px] sm:text-[32px] font-black text-primary leading-tight mb-2">
                            20 Sections.{" "}
                            <span className="text-secondary">One Complete RA Roadmap.</span>
                        </h2>
                        <p className="font-sans text-[13px] sm:text-[14px] text-[#6B7FA3] max-w-[580px] mx-auto leading-[1.6]">
                            Each section is designed with clear explanatory descriptions — easy to digest, remember and speak about in interviews.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3.5">
                        {SECTIONS.map((s, i) => (
                            <div
                                key={i}
                                className={`fade-up fade-up-${Math.min((i % 8) + 1, 8)} lift rounded-[14px] bg-white border border-[#E8EDFF] p-4 flex gap-4 hover:border-[#C7D2FE] transition-all duration-200 shadow-xs`}
                            >
                                <div className="shrink-0 flex flex-col items-center gap-2">
                                    <span
                                        className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-md"
                                        style={{ background: `${s.color}18`, color: s.color }}
                                    >
                                        {s.num}
                                    </span>
                                    <div
                                        className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0"
                                        style={{ background: `${s.color}12` }}
                                    >
                                        <s.icon size={17} strokeWidth={2} style={{ color: s.color }} />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-display text-[13px] sm:text-[14px] font-extrabold text-primary leading-tight mb-1">
                                        {s.title}
                                    </h3>
                                    <p className="font-sans text-[11px] sm:text-[12px] text-[#6B7FA3] leading-[1.5]">
                                        {s.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                5. BIG VALUE SECTION (WHY DIFFERENT)
            ══════════════════════════════════════════ */}
            <section className="py-12 sm:py-16 bg-white border-y border-[#E8EDFF]">
                <div className="mx-auto max-w-[960px] px-5 sm:px-8">
                    <div className="text-center mb-8">
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-[#EEF2FF] px-3 py-1 text-[11px] font-bold text-secondary mb-3 uppercase tracking-wider border border-[#C7D2FE]">
                            <Sparkles size={13} strokeWidth={2.5} />
                            Core Advantage
                        </span>
                        <h2 className="font-display text-[24px] sm:text-[30px] font-black text-primary leading-tight mb-2">
                            Why This Guide Is <span className="text-secondary">Different</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {FEATURES.map((f, i) => (
                            <div
                                key={i}
                                className={`fade-up fade-up-${i + 1} lift rounded-[16px] bg-[#FAFBFF] border border-[#E8EDFF] p-5 shadow-xs`}
                            >
                                <div
                                    className="w-11 h-11 rounded-[12px] flex items-center justify-center mb-4"
                                    style={{ background: `${f.color}14` }}
                                >
                                    <f.icon size={20} strokeWidth={2} style={{ color: f.color }} />
                                </div>
                                <h3 className="font-display text-[14px] sm:text-[15px] font-extrabold text-primary mb-2">{f.title}</h3>
                                <p className="font-sans text-[12px] sm:text-[13px] text-[#6B7FA3] leading-[1.6]">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                6. "THIS IS NOT JUST NOTES" COMPARISON
            ══════════════════════════════════════════ */}
            <section className="py-12 sm:py-16 bg-[#FAFBFF]">
                <div className="mx-auto max-w-[880px] px-5 sm:px-8">
                    <div className="text-center mb-8">
                        <h2 className="font-display text-[22px] sm:text-[28px] font-black text-primary leading-tight">
                            This Is Not Just Notes.
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {/* Random notes — Left */}
                        <div className="rounded-[18px] border-2 border-[#FCA5A5] bg-[#FFF1F2] p-5 sm:p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="w-7 h-7 rounded-full bg-[#FCA5A5] flex items-center justify-center text-white text-[13px] font-black">
                                    ✕
                                </span>
                                <span className="font-display text-[15px] font-black text-[#9F1239]">Random Notes</span>
                            </div>
                            <ul className="space-y-2.5">
                                {[
                                    "Scattered topics with no sequence",
                                    "Outdated terminology & old regulator names",
                                    "Little interview context or practical examples",
                                    "Hard to revise in limited time",
                                    "No career roadmap or hiring insight",
                                ].map((item) => (
                                    <li key={item} className="flex items-start gap-2.5">
                                        <span className="shrink-0 w-4 h-4 rounded-full bg-[#FCA5A5] flex items-center justify-center mt-0.5 text-white text-[10px] font-black">✕</span>
                                        <span className="font-sans text-[12px] sm:text-[13px] text-[#6B7FA3] leading-[1.5]">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* This guide — Right */}
                        <div className="rounded-[18px] border-2 border-[#6EE7B7] bg-[#F0FDF4] p-5 sm:p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="w-7 h-7 rounded-full bg-[#10B981] flex items-center justify-center">
                                    <Check size={14} strokeWidth={3} className="text-white" />
                                </span>
                                <span className="font-display text-[15px] font-black text-[#065F46]">Structured RA Preparation</span>
                            </div>
                            <ul className="space-y-2.5">
                                {[
                                    "Structured 20-section complete roadmap",
                                    "Updated 2026 terminology & standards",
                                    "Interview-focused questions and explanations",
                                    "Quick revision tools & tricky points glossary",
                                    "Practical career guidance & hiring landscape",
                                    "Dedicated India (CDSCO) + Global perspective",
                                ].map((item) => (
                                    <li key={item} className="flex items-start gap-2.5">
                                        <CheckCircle2 size={15} strokeWidth={2.5} className="shrink-0 text-[#10B981] mt-0.5" />
                                        <span className="font-sans text-[12px] sm:text-[13px] text-[#374151] leading-[1.5] font-medium">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <p className="text-center font-display text-[15px] sm:text-[18px] font-black text-primary mt-8">
                        Study less randomly. Prepare more intentionally.
                    </p>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                7. HIGH-VALUE INTERVIEW SECTION
            ══════════════════════════════════════════ */}
            <section className="py-12 sm:py-16 bg-white border-y border-[#E8EDFF]">
                <div className="mx-auto max-w-[960px] px-5 sm:px-8">
                    <div className="text-center mb-8">
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-[#EEF2FF] px-3 py-1 text-[11px] font-bold text-secondary mb-3 uppercase tracking-wider border border-[#C7D2FE]">
                            <MessageSquare size={13} strokeWidth={2.5} />
                            Interview Focused
                        </span>
                        <h2 className="font-display text-[22px] sm:text-[28px] font-black text-primary leading-tight mb-2">
                            Don&apos;t Just Know RA.{" "}
                            <span className="text-secondary">Learn How to TALK About RA.</span>
                        </h2>
                        <p className="font-sans text-[13px] sm:text-[14px] text-[#6B7FA3] max-w-[520px] mx-auto">
                            The guide includes <strong className="text-primary font-bold">10 Real RA Interview Questions</strong> with conceptual explanations.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                        {INTERVIEW_QUESTIONS.map((q, i) => (
                            <div
                                key={i}
                                className="lift rounded-[12px] bg-[#FAFBFF] border border-[#E8EDFF] px-4 py-3.5 flex items-center gap-3 shadow-xs"
                            >
                                <span className="shrink-0 w-6 h-6 rounded-full bg-[#EEF2FF] text-secondary text-[11px] font-black flex items-center justify-center">
                                    Q
                                </span>
                                <span className="font-sans text-[12px] sm:text-[13px] font-semibold text-primary leading-tight">{q}</span>
                            </div>
                        ))}
                    </div>

                    {/* Insight card */}
                    <div className="rounded-[18px] bg-gradient-to-r from-[#EEF2FF] to-[#E0E7FF] border border-[#C7D2FE] p-5 sm:p-6 max-w-[700px] mx-auto shadow-xs">
                        <div className="flex items-start gap-3">
                            <div className="shrink-0 w-10 h-10 rounded-[10px] bg-secondary/15 flex items-center justify-center mt-0.5">
                                <Lightbulb size={20} strokeWidth={2} className="text-secondary" />
                            </div>
                            <div>
                                <h3 className="font-display text-[14px] sm:text-[15px] font-extrabold text-primary mb-1">
                                    Interviewers don&apos;t only test memory.
                                </h3>
                                <p className="font-sans text-[12px] sm:text-[13px] text-[#4C6EF5] leading-[1.6]">
                                    They test whether you understand how the concepts connect — from drug dossier compilation to regulatory review, approval, and post-approval compliance.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                8. 2026 / UPDATED CONTENT SECTION
            ══════════════════════════════════════════ */}
            <section className="py-12 sm:py-16 bg-[#FAFBFF]">
                <div className="mx-auto max-w-[960px] px-5 sm:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div>
                            <span className="inline-flex items-center gap-1.5 rounded-md bg-[#EEF2FF] px-3 py-1 text-[11px] font-bold text-secondary mb-4 uppercase tracking-wider border border-[#C7D2FE]">
                                <Star size={13} strokeWidth={2.5} />
                                Updated Curriculum
                            </span>
                            <h2 className="font-display text-[22px] sm:text-[28px] font-black text-primary leading-tight mb-4">
                                Updated for the{" "}
                                <span className="text-secondary">2026 RA Landscape</span>
                            </h2>
                            <div className="flex flex-wrap gap-2 mb-5">
                                {["2026 Edition", "Current Regulatory Names", "India Update", "eCTD v4.0 Awareness"].map((b) => (
                                    <span
                                        key={b}
                                        className="inline-flex items-center gap-1.5 rounded-full bg-white border border-[#C7D2FE] px-3 py-1 text-[11px] sm:text-[12px] font-bold text-secondary shadow-xs"
                                    >
                                        <CheckCircle2 size={12} strokeWidth={2.5} className="text-[#10B981]" />
                                        {b}
                                    </span>
                                ))}
                            </div>
                            <ul className="space-y-3">
                                {[
                                    { icon: CheckCircle2, color: "#10B981", text: "Updated regulator names and agency mandates" },
                                    { icon: MapPin, color: "#EC4899", text: "India / CDSCO and DCGI deep dive structure" },
                                    { icon: Star, color: "#F59E0B", text: "2026 regulatory updates and ICH status" },
                                    { icon: Cpu, color: "#4C6EF5", text: "eCTD v4.0 rollout awareness and electronic flow" },
                                    { icon: MessageSquare, color: "#8B5CF6", text: "Current interview-focused guidance and tricky points" },
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <item.icon size={16} strokeWidth={2.5} style={{ color: item.color }} className="shrink-0" />
                                        <span className="font-sans text-[13px] sm:text-[14px] text-[#374151] font-medium">{item.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="rounded-[18px] overflow-hidden border border-[#E8EDFF] shadow-card bg-white p-2">
                            <Image
                                src={DEMO_PAGES[4].src}
                                alt="RA Guide 2026 updated content — India CDSCO and eCTD sections"
                                width={520}
                                height={380}
                                className="w-full h-auto object-cover rounded-[14px]"
                                loading="lazy"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                9. CAREER SECTION
            ══════════════════════════════════════════ */}
            <section className="py-12 sm:py-16 bg-white border-y border-[#E8EDFF]">
                <div className="mx-auto max-w-[960px] px-5 sm:px-8">
                    <div className="text-center mb-8">
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-[#EEF2FF] px-3 py-1 text-[11px] font-bold text-secondary mb-3 uppercase tracking-wider border border-[#C7D2FE]">
                            <Briefcase size={13} strokeWidth={2.5} />
                            Career Growth
                        </span>
                        <h2 className="font-display text-[22px] sm:text-[28px] font-black text-primary leading-tight mb-2">
                            Where Can RA <span className="text-secondary">Take You?</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Career ladder */}
                        <div>
                            <p className="font-display text-[13px] font-bold text-[#6B7FA3] uppercase tracking-wider mb-4">Career Progression Ladder</p>
                            <div className="space-y-2">
                                {CAREER_LADDER.map((c, i) => (
                                    <div key={i}>
                                        <div
                                            className="lift rounded-[12px] bg-[#FAFBFF] border border-[#E8EDFF] px-4 py-3.5 flex items-center gap-3 shadow-xs"
                                            style={{ borderLeftColor: `hsl(${220 + i * 20}, 80%, 55%)`, borderLeftWidth: "3px" }}
                                        >
                                            <span
                                                className="shrink-0 w-6 h-6 rounded-full text-white text-[11px] font-black flex items-center justify-center"
                                                style={{ background: `hsl(${220 + i * 20}, 80%, 55%)` }}
                                            >
                                                {c.level}
                                            </span>
                                            <span className="font-display text-[13px] sm:text-[14px] font-extrabold text-primary">{c.role}</span>
                                        </div>
                                        {i < CAREER_LADDER.length - 1 && (
                                            <div className="flex justify-start ml-[22px] my-1">
                                                <ChevronRight size={16} strokeWidth={2.5} className="text-[#C7D2FE] rotate-90" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Hiring sectors */}
                        <div>
                            <p className="font-display text-[13px] font-bold text-[#6B7FA3] uppercase tracking-wider mb-4">Who Hires RA Professionals?</p>
                            <div className="grid grid-cols-2 gap-2.5">
                                {HIRING_SECTORS.map((s, i) => (
                                    <div
                                        key={i}
                                        className="lift rounded-[12px] bg-[#FAFBFF] border border-[#E8EDFF] p-3.5 flex items-center gap-2.5 shadow-xs"
                                    >
                                        <div
                                            className="w-8 h-8 rounded-[8px] flex items-center justify-center shrink-0"
                                            style={{ background: `${s.color}12` }}
                                        >
                                            <s.icon size={16} strokeWidth={2} style={{ color: s.color }} />
                                        </div>
                                        <span className="font-sans text-[11px] sm:text-[12px] font-semibold text-primary leading-tight">{s.label}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 rounded-[12px] bg-gradient-to-r from-[#EEF2FF] to-[#E0E7FF] border border-[#C7D2FE] p-4 text-center">
                                <p className="font-display text-[13px] font-bold text-primary">
                                    Built especially for students and freshers trying to enter the regulatory field.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                10. END-TO-END FLOW SECTION
            ══════════════════════════════════════════ */}
            <section className="py-12 sm:py-16 bg-[#FAFBFF] overflow-hidden">
                <div className="mx-auto max-w-[1040px] px-5 sm:px-8">
                    <div className="text-center mb-8">
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-1 text-[11px] font-bold text-secondary mb-3 uppercase tracking-wider border border-[#E8EDFF]">
                            <TrendingUp size={13} strokeWidth={2.5} />
                            Complete Lifecycle
                        </span>
                        <h2 className="font-display text-[22px] sm:text-[28px] font-black text-primary leading-tight mb-2">
                            Understand the Entire{" "}
                            <span className="text-secondary">Drug Approval Journey</span>
                        </h2>
                        <p className="font-sans text-[13px] sm:text-[14px] text-[#6B7FA3] max-w-[500px] mx-auto">
                            One flowchart. The whole journey.
                        </p>
                    </div>

                    {/* Desktop horizontal flow */}
                    <div className="hidden md:flex items-stretch gap-0 overflow-x-auto pb-4 no-scrollbar">
                        {APPROVAL_STEPS.map((step, i) => (
                            <div key={i} className="flex items-center shrink-0">
                                <div className="flex flex-col items-center text-center w-[100px] lg:w-[108px]">
                                    <div
                                        className="w-10 h-10 rounded-full flex items-center justify-center font-display text-[13px] font-black text-white shadow-md mb-2"
                                        style={{ background: step.color }}
                                    >
                                        {step.num}
                                    </div>
                                    <p className="font-sans text-[10px] sm:text-[11px] font-semibold text-primary leading-tight">{step.label}</p>
                                </div>
                                {i < APPROVAL_STEPS.length - 1 && (
                                    <div className="flex items-center px-1 shrink-0">
                                        <div className="h-0.5 w-5 bg-[#DDE6FF]" />
                                        <ChevronRight size={12} strokeWidth={2.5} className="text-[#C7D2FE] -ml-1" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Mobile vertical flow */}
                    <div className="md:hidden space-y-2">
                        {APPROVAL_STEPS.map((step, i) => (
                            <div key={i}>
                                <div
                                    className="rounded-[12px] border border-[#E8EDFF] bg-white px-4 py-3 flex items-center gap-3 shadow-xs"
                                    style={{ borderLeftColor: step.color, borderLeftWidth: "3px" }}
                                >
                                    <div
                                        className="w-8 h-8 rounded-full flex items-center justify-center font-display text-[12px] font-black text-white shrink-0"
                                        style={{ background: step.color }}
                                    >
                                        {step.num}
                                    </div>
                                    <p className="font-sans text-[13px] font-semibold text-primary">{step.label}</p>
                                </div>
                                {i < APPROVAL_STEPS.length - 1 && (
                                    <div className="flex justify-start ml-[18px] my-0.5">
                                        <ChevronRight size={16} strokeWidth={2.5} className="text-[#C7D2FE] rotate-90" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                11. "WHO IS THIS FOR?" SECTION
            ══════════════════════════════════════════ */}
            <section className="py-12 sm:py-16 bg-white border-y border-[#E8EDFF]">
                <div className="mx-auto max-w-[960px] px-5 sm:px-8">
                    <div className="text-center mb-8">
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-[#EEF2FF] px-3 py-1 text-[11px] font-bold text-secondary mb-3 uppercase tracking-wider border border-[#C7D2FE]">
                            <Users size={13} strokeWidth={2.5} />
                            Target Audience
                        </span>
                        <h2 className="font-display text-[22px] sm:text-[28px] font-black text-primary leading-tight mb-2">
                            Who Is This For?
                        </h2>
                        <p className="font-sans text-[13px] sm:text-[14px] text-[#6B7FA3] max-w-[520px] mx-auto">
                            Whether you&apos;re learning RA for the first time or preparing for your next interview, this guide gives you a structured path.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {TARGET_CARDS.map((card, i) => (
                            <div
                                key={i}
                                className={`fade-up fade-up-${i + 1} lift rounded-[16px] bg-[#FAFBFF] border border-[#E8EDFF] p-5 text-center shadow-xs`}
                            >
                                <div
                                    className="w-12 h-12 rounded-[14px] flex items-center justify-center mx-auto mb-3"
                                    style={{ background: `${card.color}14` }}
                                >
                                    <card.icon size={22} strokeWidth={2} style={{ color: card.color }} />
                                </div>
                                <h3 className="font-display text-[13px] sm:text-[14px] font-extrabold text-primary mb-1.5 leading-tight">{card.title}</h3>
                                <p className="font-sans text-[11px] sm:text-[12px] text-[#6B7FA3] leading-[1.5]">{card.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                12 & 13. PRICE / OFFER + QR PAYMENT SECTION
            ══════════════════════════════════════════ */}
            <section
                id="get-guide"
                className="scroll-mt-[62px] relative overflow-hidden py-12 sm:py-16"
                style={{ background: "linear-gradient(135deg, #0F1D5C 0%, #1A2B6B 40%, #243A8E 70%, #4C6EF5 100%)" }}
            >
                {/* Decorative orbs */}
                <div className="absolute top-[-60px] left-[-40px] w-[200px] h-[200px] rounded-full opacity-10 pointer-events-none" style={{ background: "radial-gradient(circle, #6EE7B7, transparent)" }} />
                <div className="absolute bottom-[-80px] right-[-60px] w-[260px] h-[260px] rounded-full opacity-10 pointer-events-none" style={{ background: "radial-gradient(circle, #FF8FAB, transparent)" }} />

                <div className="mx-auto max-w-[960px] px-5 sm:px-8 relative z-10">
                    <div className="text-center mb-8">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-1.5 mb-3">
                            <IndianRupee size={14} strokeWidth={2.5} className="text-[#6EE7B7]" />
                            <span className="text-[12px] sm:text-[13px] font-bold text-white/95">Limited-Time Launch Offer</span>
                        </span>
                        <h2 className="font-display text-[26px] sm:text-[34px] font-black text-white leading-tight mb-2">
                            Get Your RA Guide Now
                        </h2>
                        <p className="font-sans text-[13px] sm:text-[14px] text-white/70 max-w-[460px] mx-auto">
                            One-time purchase • Digital PDF • Instant access
                        </p>
                    </div>

                    {/* Main payment card + QR payment block */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[820px] mx-auto">

                        {/* Price Card */}
                        <div className="rounded-[20px] bg-white shadow-2xl overflow-hidden flex flex-col justify-between">
                            <div>
                                {/* Banner */}
                                <div className="bg-[#EF4444] px-4 py-2.5 text-center">
                                    <p className="font-display text-[11px] sm:text-[12px] font-black text-white uppercase tracking-widest flex items-center justify-center gap-1.5">
                                        <Zap size={13} strokeWidth={2.5} />
                                        Limited-Time Launch Offer
                                    </p>
                                </div>

                                {/* Price display */}
                                <div className="px-6 py-6 text-center border-b border-[#F0F4FF]">
                                    <div className="flex items-baseline justify-center gap-3 mb-1">
                                        <span className="font-display text-[48px] sm:text-[54px] font-black text-primary leading-none">₹89</span>
                                        <span className="font-display text-[22px] font-bold text-[#9CA3AF] line-through leading-none">₹199</span>
                                    </div>
                                    <p className="font-sans text-[13px] text-[#6B7FA3] mb-4">
                                        Just ₹89 — Less than the price of a burger
                                    </p>

                                    <a
                                        href="#payment-qr"
                                        className="btn-press w-full flex items-center justify-center gap-2 rounded-[12px] bg-secondary px-6 py-4 text-[15px] font-black text-white shadow-lg hover:bg-[#3B5BDB] transition-all duration-200 min-h-[52px]"
                                    >
                                        <Download size={18} strokeWidth={2.5} />
                                        GET THE RA GUIDE FOR ₹89
                                    </a>
                                    <p className="font-sans text-[11px] text-[#9CA3AF] mt-2">
                                        Secure checkout • Digital product
                                    </p>
                                </div>

                                {/* What you get list */}
                                <div className="px-6 py-5">
                                    <p className="font-display text-[11px] font-bold text-[#6B7FA3] uppercase tracking-wider mb-3">
                                        What you&apos;ll receive
                                    </p>
                                    <ul className="space-y-2">
                                        {[
                                            "Complete 20-section RA Guide (PDF)",
                                            "CDSCO & India regulatory deep dive",
                                            "CTD, eCTD, NDA, ANDA, BLA & MAA",
                                            "Career ladder & hiring landscape",
                                            "10 real interview questions with guidance",
                                            "Submission flow, glossary & tricky points",
                                        ].map((item) => (
                                            <li key={item} className="flex items-start gap-2">
                                                <ChevronRight size={12} strokeWidth={2.5} className="text-[#10B981] shrink-0 mt-0.5" />
                                                <span className="font-sans text-[12px] sm:text-[13px] text-[#374151] leading-[1.4] font-medium">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Trust badges */}
                            <div className="bg-[#F9FAFB] px-6 py-4 border-t border-[#E8EDFF] flex flex-wrap gap-3 justify-center">
                                {[
                                    { icon: Shield, label: "Secure Checkout" },
                                    { icon: Clock, label: "Email Delivery" },
                                    { icon: CheckCircle2, label: "Verified Content" },
                                ].map((b) => (
                                    <div key={b.label} className="flex items-center gap-1.5">
                                        <b.icon size={12} strokeWidth={2.5} className="text-[#10B981]" />
                                        <span className="font-sans text-[11px] font-semibold text-[#6B7FA3]">{b.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* QR Payment Card */}
                        <div id="payment-qr" className="rounded-[20px] bg-white shadow-2xl overflow-hidden scroll-mt-[70px]">
                            <div className="bg-[#1A2B6B] px-4 py-3 text-center">
                                <p className="font-display text-[12px] font-black text-white uppercase tracking-wider">
                                    Prefer UPI?
                                </p>
                            </div>

                            <div className="p-6 text-center">
                                <p className="font-display text-[16px] font-bold text-primary mb-0.5">Scan &amp; Pay ₹89</p>
                                <p className="font-sans text-[12px] text-[#6B7FA3] mb-4">
                                    Use GPay, PhonePe, Paytm, BHIM or any UPI app
                                </p>

                                {/* QR Image */}
                                <div className="rounded-[16px] overflow-hidden border-2 border-[#E8EDFF] mx-auto max-w-[280px] mb-3">
                                    <Image
                                        src="/blog/pv-kit/qr-payment.jpeg"
                                        alt="PharmaCode UPI Payment QR Code — Scan to pay ₹89 for the RA Complete Guide"
                                        width={280}
                                        height={280}
                                        className="w-full h-auto object-contain"
                                        priority
                                    />
                                </div>

                                <p className="font-sans text-[11px] text-[#9CA3AF] mb-1">
                                    Amount to Pay: <strong className="text-primary font-bold">₹89</strong>
                                </p>

                                {/* Copy UPI ID Box */}
                                <CopyUpiBox />

                                {/* UPI App Pills */}
                                <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
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

                            {/* Email Instructions Box with Copy Button */}
                            <div className="border-t border-[#E8EDFF] p-4 sm:p-5 space-y-3 bg-[#F8FAFC]">
                                <div className="rounded-[14px] bg-[#FFFBEB] border border-[#FDE68A] p-3.5">
                                    <div className="flex items-start gap-2.5">
                                        <div className="shrink-0 w-7 h-7 rounded-[8px] bg-[#FEF3C7] flex items-center justify-center mt-0.5">
                                            <Mail size={15} strokeWidth={2} className="text-[#D97706]" />
                                        </div>
                                        <div>
                                            <h4 className="font-display text-[12px] sm:text-[13px] font-extrabold text-[#92400E] mb-0.5">
                                                After Payment
                                            </h4>
                                            <p className="font-sans text-[11px] text-[#A16207] leading-[1.5]">
                                                Send your <strong>payment screenshot</strong> to the email below. Your complete PDF guide will be delivered within a few hours.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Responsive Copy Email Box */}
                                <CopyEmailBox />

                                {/* Mobile tip */}
                                <div className="flex items-center gap-2 rounded-[10px] bg-[#F0FDF4] border border-[#BBF7D0] p-2.5">
                                    <Smartphone size={14} strokeWidth={2} className="text-[#15803D] shrink-0" />
                                    <p className="font-sans text-[10px] sm:text-[11px] text-[#15803D] leading-[1.4]">
                                        <strong>Tip:</strong> Tap &apos;Copy Email Address&apos; above to copy instantly.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                14. CTA / CONVERSION STRIP
            ══════════════════════════════════════════ */}
            <section
                className="relative overflow-hidden py-10 sm:py-14"
                style={{ background: "linear-gradient(135deg, #1A2B6B 0%, #243A8E 50%, #4C6EF5 100%)" }}
            >
                <div className="mx-auto max-w-[780px] px-5 sm:px-8 text-center relative z-10">
                    <h2 className="font-display text-[24px] sm:text-[32px] font-black text-white leading-tight mb-3">
                        Your RA preparation can start today.
                    </h2>
                    <p className="font-sans text-[14px] sm:text-[15px] text-white/80 mb-6 max-w-[520px] mx-auto">
                        Learn the concepts. Understand the process. Prepare for the interview.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4 mb-4">
                        <a
                            href="#get-guide"
                            className="btn-press inline-flex items-center gap-2 rounded-[14px] bg-white px-8 py-4 text-[15px] sm:text-[16px] font-black text-primary shadow-xl hover:scale-[1.03] transition-all duration-200 min-h-[52px]"
                        >
                            <Download size={18} strokeWidth={2.5} className="text-secondary" />
                            Get Complete RA Guide — ₹89
                            <ArrowRight size={18} strokeWidth={2.5} />
                        </a>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                        <span className="font-display text-[18px] font-black text-white/40 line-through">₹199</span>
                        <span className="font-sans text-[14px] text-white/50">→</span>
                        <span className="font-display text-[24px] font-black text-[#6EE7B7]">₹89</span>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                CROSS-PROMOTION: PV INTERVIEW KIT
            ══════════════════════════════════════════ */}
            <section className="py-12 sm:py-16 bg-white border-b border-[#E8EDFF]">
                <div className="mx-auto max-w-[960px] px-5 sm:px-8">
                    <div className="rounded-[24px] bg-gradient-to-r from-[#0F1D5C] via-[#1A2B6B] to-[#243A8E] p-6 sm:p-10 text-white relative overflow-hidden shadow-xl">
                        {/* Decorative */}
                        <div className="absolute top-[-60px] right-[-60px] w-[220px] h-[220px] rounded-full opacity-10" style={{ background: "radial-gradient(circle, #6EE7B7, transparent)" }} />

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
                            <div className="md:col-span-8">
                                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/20 px-3 py-1 text-[11px] font-bold text-[#93C5FD] uppercase tracking-wider mb-3">
                                    <Activity size={12} strokeWidth={2.5} />
                                    PharmaCode Learning Series
                                </div>
                                <h3 className="font-display text-[22px] sm:text-[28px] font-black leading-tight mb-2">
                                    Also Preparing for Pharmacovigilance (PV) Roles?
                                </h3>
                                <p className="font-sans text-[13px] sm:text-[14px] text-white/80 leading-[1.6] mb-4 max-w-[560px]">
                                    Check out our bestselling <strong className="text-white">44-Page Pharmacovigilance Complete Guide &amp; Interview Kit</strong> covering PV fundamentals, ICSR case processing, MedDRA coding, causality assessment, signal detection, and 15+ interview Q&amp;A.
                                </p>
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {["44 Pages PDF", "15 Chapters", "ICSR & MedDRA", "HR & Technical Q&A"].map((tag) => (
                                        <span key={tag} className="inline-flex items-center gap-1 rounded-md bg-white/10 px-2.5 py-1 text-[11px] font-bold text-white/90">
                                            <CheckCircle2 size={11} className="text-[#6EE7B7]" />
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <Link
                                    href="/blog/pharmacovigilance-interview-preparation-kit/"
                                    className="btn-press inline-flex items-center gap-2 rounded-[12px] bg-[#6EE7B7] text-primary px-6 py-3 text-[13px] sm:text-[14px] font-extrabold shadow-lg hover:bg-[#A7F3D0] transition-all"
                                >
                                    <span>Explore PV Interview Kit</span>
                                    <ArrowRight size={15} strokeWidth={2.5} />
                                </Link>
                            </div>

                            <div className="md:col-span-4 hidden md:block">
                                <div className="rounded-[16px] overflow-hidden border-2 border-white/20 shadow-2xl bg-white/5">
                                    <Image
                                        src="/blog/pv-kit/pharmacode-services.jpeg"
                                        alt="PharmaCode Pharmacovigilance Complete Guide & Interview Kit preview"
                                        width={320}
                                        height={220}
                                        className="w-full h-auto object-cover"
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                15. TRUST SECTION
            ══════════════════════════════════════════ */}
            <section className="py-10 sm:py-14 bg-[#F4F6FF]">
                <div className="mx-auto max-w-[960px] px-5 sm:px-8">
                    <div className="text-center mb-6">
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-1 text-[11px] font-bold text-secondary mb-2 uppercase tracking-wider border border-[#E8EDFF]">
                            <Shield size={13} strokeWidth={2.5} />
                            Verified Quality
                        </span>
                        <h2 className="font-display text-[20px] sm:text-[24px] font-black text-primary">
                            Built on Real Content
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-[760px] mx-auto mb-6">
                        {[
                            { num: "20", label: "Structured Sections" },
                            { num: "10", label: "Interview Q&A" },
                            { num: "7", label: "Global Regulators" },
                            { num: "1", label: "Clear Roadmap" },
                        ].map((s) => (
                            <div key={s.label} className="rounded-[14px] bg-white border border-[#E8EDFF] p-4 text-center shadow-xs">
                                <p className="font-display text-[30px] sm:text-[36px] font-black text-secondary leading-none mb-1">{s.num}</p>
                                <p className="font-sans text-[11px] sm:text-[12px] text-[#6B7FA3] leading-tight font-medium">{s.label}</p>
                            </div>
                        ))}
                    </div>

                    <div className="max-w-[700px] mx-auto text-center">
                        <p className="font-sans text-[11px] sm:text-[12px] text-[#9CA3AF] leading-[1.7]">
                            Educational resource for learning and career preparation. Regulatory information may change over time; always verify current regulatory requirements from official authorities when making professional decisions.
                        </p>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                16. FAQ SECTION
            ══════════════════════════════════════════ */}
            <section className="py-12 sm:py-16 bg-white border-y border-[#E8EDFF]">
                <div className="mx-auto max-w-[960px] px-5 sm:px-8">
                    <div className="text-center mb-8">
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-[#EEF2FF] px-3 py-1 text-[11px] font-bold text-secondary mb-3 uppercase tracking-wider border border-[#C7D2FE]">
                            <HelpCircle size={13} strokeWidth={2.5} />
                            Got Questions?
                        </span>
                        <h2 className="font-display text-[22px] sm:text-[28px] font-black text-primary">
                            Frequently Asked Questions
                        </h2>
                    </div>

                    <FAQAccordion items={FAQS} />
                </div>
            </section>

            {/* ══════════════════════════════════════════
                17. FINAL CTA
            ══════════════════════════════════════════ */}
            <section
                className="relative overflow-hidden py-14 sm:py-20"
                style={{ background: "linear-gradient(135deg, #0F1D5C 0%, #1A2B6B 35%, #243A8E 65%, #4C6EF5 100%)" }}
            >
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-60px] right-[10%] w-[240px] h-[240px] rounded-full opacity-10" style={{ background: "radial-gradient(circle, #7B9BF7, transparent)" }} />
                    <div className="absolute bottom-[-80px] left-[5%] w-[280px] h-[280px] rounded-full opacity-8" style={{ background: "radial-gradient(circle, #FF8FAB, transparent)" }} />
                </div>

                <div className="mx-auto max-w-[680px] px-5 sm:px-8 text-center relative z-10">
                    <p className="font-display text-[18px] sm:text-[22px] font-black text-white/75 mb-1">
                        Stop collecting random notes.
                    </p>
                    <p className="font-display text-[22px] sm:text-[28px] font-black text-white mb-6">
                        Start preparing with a roadmap.
                    </p>

                    <div className="rounded-[18px] bg-white/10 border border-white/20 p-5 mb-6 inline-block backdrop-blur-sm">
                        <p className="font-display text-[16px] sm:text-[18px] font-black text-white mb-2">
                            Regulatory Affairs (RA) — Complete Guide
                        </p>
                        <div className="flex items-baseline justify-center gap-3">
                            <span className="font-display text-[42px] sm:text-[52px] font-black text-[#6EE7B7] leading-none">₹89</span>
                            <span className="font-display text-[22px] font-bold text-white/40 line-through leading-none">₹199</span>
                        </div>
                    </div>

                    <div>
                        <a
                            href="#get-guide"
                            className="btn-press inline-flex items-center gap-2 rounded-[14px] bg-white px-8 py-4 text-[15px] sm:text-[16px] font-black text-primary shadow-2xl hover:scale-[1.03] transition-all duration-200 min-h-[54px] mb-3"
                        >
                            <Sparkles size={18} className="text-secondary" />
                            GET INSTANT ACCESS — ₹89
                            <ArrowRight size={18} strokeWidth={2.5} />
                        </a>
                        <p className="font-sans text-[12px] text-white/60 mt-3">
                            Digital PDF • One-time payment
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
