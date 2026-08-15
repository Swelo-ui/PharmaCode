import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, faqSchema, articleSchema } from "@/lib/schema";
import { absUrl } from "@/lib/site";
import { MiniQuizCheck, LinkedInMentorshipWidget } from "./InteractiveWidgets";
import {
    BookOpen, CheckCircle2, GraduationCap, Shield,
    Clock, Globe, Award, Sparkles, ArrowRight, ArrowDown, ExternalLink,
    AlertTriangle, Layers, FileCheck, Stethoscope, BarChart3,
    Check, Users, HelpCircle, Lightbulb, Bookmark, CheckCheck,
    FileSpreadsheet, ClipboardCheck, Briefcase, ChevronRight, FileBadge2
} from "lucide-react";

export const metadata: Metadata = {
    title: "Free Pharmaceutical Quality Assurance (QA) Course with Certificate — Pharma Lesson Guide",
    description:
        "Enroll in the 100% Free Pharmaceutical Quality Assurance (QA) certification course by Pharma Lesson. Master GMP, ALCOA+, IPQC, CAPA, and Audits. Pass the 80% test and claim your verified certificate for CV & LinkedIn.",
    alternates: { canonical: absUrl("/blog/free-pharmaceutical-quality-assurance-certification/") },
    keywords: [
        "free pharmaceutical quality assurance course",
        "pharmaceutical QA certification free",
        "Pharma Lesson QA course certificate",
        "GMP free certificate online",
        "pharmaceutical quality assurance certificate",
        "ALCOA plus data integrity course",
        "IPQC and line clearance training",
        "CAPA pharmaceutical quality assurance",
        "B.Pharm QA notes and certification",
        "M.Pharm quality assurance jobs",
        "QA freshers interview preparation",
        "PharmaCode free courses",
    ],
    openGraph: {
        title: "Free Pharmaceutical Quality Assurance (QA) Certification Course — Pharma Lesson",
        description: "Master Pharmaceutical QA fundamentals (GMP, ALCOA+, IPQC, CAPA, Audits), score 80%+ on the final assessment, and download your free verified certificate.",
        url: absUrl("/blog/free-pharmaceutical-quality-assurance-certification/"),
        images: [{ url: absUrl("/blog/free-qa-course/pharma-lesson-masterclass.png"), width: 1200, height: 630, alt: "Pharma Lesson Masterclass Pharmaceutical QA" }],
    },
};

const PHARMA_LESSON_QA_URL = "https://courses.pharmalesson.com/courses/introduction-to-pharmaceutical-quality-assurance/";
const PV_INTERVIEW_KIT_URL = "/blog/pharmacovigilance-interview-preparation-kit/";
const WHO_UMC_COURSES_URL = "/blog/free-pharmacovigilance-courses-who-umc/";
const QA_SYLLABUS_URL = "/syllabus/semester-5/bp505t-pharmaceutical-quality-assurance/";

/* ── Course Modules Breakdown ── */
const QA_MODULES = [
    {
        num: "01",
        title: "Introduction to QA, Philosophy & ALCOA+ Principles",
        duration: "Core Foundation",
        badge: "Essential",
        color: "#059669",
        icon: BookOpen,
        description: "Covers the fundamental definitions, evolution, and core philosophy of Quality Assurance. Deep-dives into data integrity standards governed by the ALCOA+ framework (Attributable, Legible, Contemporaneous, Original, Accurate + Complete, Consistent, Enduring, Available).",
        topics: [
            "What is QA & Why Quality Cannot Be Tested Into a Finished Product",
            "Core Responsibilities: QA vs QC vs Production",
            "ALCOA+ Data Integrity Principles & FDA 483 Warning Letter Triggers",
        ],
    },
    {
        num: "02",
        title: "Good Practices (GxP Spectrum): GMP, GLP & GDP",
        duration: "Regulatory Framework",
        badge: "Compliance",
        color: "#2563EB",
        icon: Shield,
        description: "Explores the international GxP landscape governing pharmaceutical manufacturing operations. Outlines current Good Manufacturing Practices (cGMP 21 CFR Part 211 / EU GMP), Good Laboratory Practices (GLP), and Good Distribution Practices (GDP).",
        topics: [
            "Good Manufacturing Practices (cGMP) Core Tenets & Facility Layout",
            "Good Laboratory Practice (GLP) in QC Analytical Testing",
            "Good Distribution Practice (GDP) & Cold-Chain Integrity",
        ],
    },
    {
        num: "03",
        title: "In-Process Quality Control (IPQC) & Line Clearance",
        duration: "Plant Operations",
        badge: "Practical",
        color: "#D97706",
        icon: ClipboardCheck,
        description: "Practical operational QA on the manufacturing plant floor. Focuses on line clearance verification checklists before starting batches, in-process testing during granulation/compression/coating, and cleanroom air handling (Grade A/B/C/D).",
        topics: [
            "Line Clearance Checklists & Preventing Batch Mix-ups / Cross-Contamination",
            "IPQC Physical & Chemical Tests for Tablets, Capsules, Liquids & Injectables",
            "Cleanroom Gowning Protocols & Environmental Monitoring (EM)",
        ],
    },
    {
        num: "04",
        title: "Quality Management Systems (QMS): Deviations & CAPA",
        duration: "QMS & Root Cause",
        badge: "High Weightage",
        color: "#DC2626",
        icon: Layers,
        description: "Mastering modern pharmaceutical QMS workflows. Covers deviation classification (Minor, Major, Critical), structured Root Cause Analysis (5 Whys and Fishbone Ishikawa diagram), and Corrective & Preventive Action (CAPA) tracking.",
        topics: [
            "Deviation Logging, Investigation & Risk Impact Assessment",
            "Root Cause Analysis (RCA) Methodology (Ishikawa Fishbone & 5 Whys)",
            "CAPA Formulation, Execution & Effectiveness Verification",
        ],
    },
    {
        num: "05",
        title: "Audits, Regulatory Inspections & FDA 483 Responses",
        duration: "Inspection Readiness",
        badge: "Strategic",
        color: "#7C3AED",
        icon: FileSpreadsheet,
        description: "Understanding internal self-inspections, vendor/supplier audits, and official inspections hosted for regulatory authorities including US FDA, EMA, MHRA, WHO GMP, and India's CDSCO.",
        topics: [
            "Self-Inspection (Internal Audit) Planning, Checklists & Reporting",
            "Managing Regulatory Audits & Understanding Form FDA 483 Observations",
            "Warning Letters, Import Alerts & Remediation Action Plans",
        ],
    },
    {
        num: "06",
        title: "Process Validation, Batch Release & Product Recalls",
        duration: "Product Lifecycle",
        badge: "Lifecycle QA",
        color: "#0891B2",
        icon: BarChart3,
        description: "Examines process validation stages (Process Design, Process Qualification, Continued Process Verification), Master Batch Record (BMR/BPR) review, Qualified Person (QP) market release, and product recall classifications (Class I, II, III).",
        topics: [
            "3 Stages of Process Validation (FDA Lifecycle Guidance)",
            "Batch Manufacturing Record (BMR) Review & Final Release Protocol",
            "Product Complaints, Out-of-Specification (OOS) & Recall Management",
        ],
    },
];

const FAQS = [
    {
        q: "Is this Pharmaceutical Quality Assurance course and certificate completely 100% free?",
        a: "Yes! The 'Introduction to Pharmaceutical Quality Assurance' course offered on the Pharma Lesson Masterclass portal is 100% free of cost. There are no registration fees, hidden subscriptions, or certificate download charges.",
    },
    {
        q: "What is the minimum score required to obtain the certificate?",
        a: "To earn your certificate of achievement, you must complete all video modules and score a minimum of 80% on the final assessment quiz. Once you pass with 80% or higher, the 'View Certificate' button unlocks automatically.",
    },
    {
        q: "Can I retake the final assessment if I score below 80%?",
        a: "Yes! If you do not pass on your first attempt, you can review the study lessons and retake the final test until you achieve the required 80% score.",
    },
    {
        q: "Does the certificate include a verifiable Credential ID for LinkedIn and CV?",
        a: "Yes! Every downloaded certificate (available in high-resolution image and PDF formats) features a unique Credential Verification ID, date of completion, and QR code that employers can cross-verify.",
    },
    {
        q: "How does this certification help B.Pharm and M.Pharm students?",
        a: "Pharmaceutical Quality Assurance is a mandatory subject in B.Pharm Semester 5 (BP505T) and M.Pharm QA curricula. Adding this verified certificate demonstrates proactive industry knowledge to recruiters for roles like QA Officer, IPQC Chemist, and QMS Specialist.",
    },
    {
        q: "What is the fundamental difference between QA and QC in pharmaceutical plants?",
        a: "Quality Assurance (QA) is a proactive, process-oriented function focused on designing systems and standard operating procedures to prevent defects. Quality Control (QC) is a reactive, product-oriented laboratory function that conducts physical and chemical tests on samples to detect defects against pharmacopoeial standards.",
    },
];

export default function FreeQACoursePage() {
    const breadcrumbs = [
        { name: "Home", href: "/" },
        { name: "Blog", href: "/blog/" },
        { name: "Free QA Certification", href: "/blog/free-pharmaceutical-quality-assurance-certification/" },
    ];

    return (
        <div className="w-full overflow-x-hidden">
            <JsonLd data={breadcrumbSchema(breadcrumbs)} />
            <JsonLd data={faqSchema(FAQS)} />
            <JsonLd
                data={articleSchema({
                    title: "Free Pharmaceutical Quality Assurance (QA) Certification Course with Certificate — Pharma Lesson",
                    description: "Enroll in the 100% Free Pharmaceutical Quality Assurance (QA) certification course by Pharma Lesson. Master GMP, ALCOA+, IPQC, CAPA, and Audits. Pass the 80% test and claim your certificate.",
                    url: "/blog/free-pharmaceutical-quality-assurance-certification/",
                    imageUrl: "/blog/free-qa-course/pharma-lesson-masterclass.png",
                })}
            />

            {/* ══════════════ HERO SECTION ══════════════ */}
            <section
                className="relative overflow-hidden"
                style={{
                    background: "linear-gradient(135deg, #041B18 0%, #062E2B 35%, #0B4A45 70%, #0D9488 100%)",
                }}
            >
                {/* Background ambient lighting */}
                <div className="absolute top-[-100px] right-[-60px] w-[320px] h-[320px] rounded-full opacity-20 pointer-events-none" style={{ background: "radial-gradient(circle, #2DD4BF, transparent)" }} />
                <div className="absolute bottom-[-100px] left-[-80px] w-[340px] h-[340px] rounded-full opacity-15 pointer-events-none" style={{ background: "radial-gradient(circle, #10B981, transparent)" }} />

                <div className="mx-auto max-w-[960px] px-4 sm:px-6 md:px-8 pt-6 pb-10 sm:pt-10 sm:pb-14 relative z-10">
                    <div className="mb-4">
                        <Breadcrumb items={breadcrumbs} variant="light" />
                    </div>

                    {/* Verified Badges */}
                    <div className="fade-up flex flex-wrap items-center gap-2 mb-4 sm:mb-5">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#10B981]/25 border border-[#10B981]/40 px-3 py-1 text-[10px] sm:text-[11px] font-extrabold text-[#6EE7B7] uppercase tracking-wider shadow-sm">
                            <Sparkles size={12} className="shrink-0 animate-pulse text-[#34D399]" /> 100% Free Course
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F59E0B]/25 border border-[#F59E0B]/40 px-3 py-1 text-[10px] sm:text-[11px] font-extrabold text-[#FCD34D] uppercase tracking-wider">
                            <CheckCheck size={12} className="text-[#FBBF24] shrink-0" /> 80% Passing Score Required
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 text-[10px] sm:text-[11px] font-extrabold text-white/90 uppercase tracking-wider">
                            <Award size={12} className="text-[#6EE7B7] shrink-0" /> Verified Certificate ID 🏆
                        </span>
                    </div>

                    <h1 className="fade-up fade-up-1 font-display text-[22px] sm:text-[30px] md:text-[38px] font-black text-white leading-[1.2] mb-3 sm:mb-4">
                        Free Pharmaceutical Quality Assurance (QA) Course
                        <br />
                        <span className="text-[#5EEAD4]">With Free Certificate</span> — Pharma Lesson Masterclass
                    </h1>

                    <p className="fade-up fade-up-2 text-[13px] sm:text-[15px] md:text-[16px] text-white/85 max-w-[680px] leading-[1.7] mb-6 font-sans">
                        Master essential industrial competencies in <strong className="text-white">Quality Assurance (QA), cGMP, ALCOA+ Data Integrity, In-Process Quality Control (IPQC), Line Clearance, and CAPA</strong>. Complete all modules, clear the 80% final assessment, and download your verified certificate of achievement.
                    </p>

                    {/* Highlight Stats Pills */}
                    <div className="fade-up fade-up-3 flex flex-wrap gap-2 sm:gap-2.5 mb-7 sm:mb-8">
                        {[
                            { icon: Award, label: "Free Certificate Included", color: "#34D399" },
                            { icon: CheckCircle2, label: "80% Minimum Test Score", color: "#FBBF24" },
                            { icon: Clock, label: "Self-Paced Online Learning", color: "#60A5FA" },
                            { icon: GraduationCap, label: "For B.Pharm, M.Pharm & Freshers", color: "#F472B6" },
                        ].map((item) => (
                            <div
                                key={item.label}
                                className="flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 px-2.5 sm:px-3 py-1 sm:py-1.5"
                            >
                                <item.icon size={12} strokeWidth={2.5} style={{ color: item.color }} className="shrink-0" />
                                <span className="text-[10px] sm:text-[11px] md:text-[12px] font-bold text-white/90">{item.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* In-Page Navigation Buttons (Encourages User to Read Through Guide) */}
                    <div className="fade-up fade-up-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <a
                            href="#enrollment-guide"
                            className="btn-press inline-flex items-center justify-center gap-2 rounded-[12px] bg-[#2DD4BF] px-5 py-3 text-[12px] sm:text-[13px] md:text-[14px] font-black text-[#042F2E] shadow-lg hover:bg-[#5EEAD4] transition-all duration-200 text-center"
                        >
                            <ArrowDown size={15} strokeWidth={2.5} />
                            Step-by-Step Enrollment Guide ↓
                        </a>
                        <a
                            href="#certificate-preview"
                            className="btn-press inline-flex items-center justify-center gap-2 rounded-[12px] bg-white/10 backdrop-blur-md border border-white/25 px-5 py-3 text-[12px] sm:text-[13px] md:text-[14px] font-bold text-white hover:bg-white/20 transition-all duration-200 text-center"
                        >
                            <Award size={15} strokeWidth={2} />
                            View Certificate Preview &amp; Link ↓
                        </a>
                    </div>
                </div>
            </section>

            {/* ══════════════ OVERVIEW & LOGO SECTION ══════════════ */}
            <section className="mx-auto max-w-[960px] px-4 sm:px-6 md:px-8 py-8 sm:py-12">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    <div className="md:col-span-6 order-2 md:order-1 space-y-3.5 sm:space-y-4">
                        <span className="inline-block rounded-md bg-[#ECFDF5] border border-[#A7F3D0] px-2.5 sm:px-3 py-1 text-[10px] sm:text-[11px] font-bold text-[#059669] uppercase tracking-wider">
                            Why QA is Critical in Pharma
                        </span>
                        <h2 className="font-display text-[20px] sm:text-[24px] md:text-[26px] font-black text-primary leading-tight">
                            Build Core Competencies in <span className="text-[#0D9488]">Pharmaceutical QA &amp; Compliance</span>
                        </h2>
                        <p className="font-sans text-[12px] sm:text-[13px] md:text-[14px] text-[#4B5563] leading-[1.7]">
                            In the pharmaceutical industry, <strong className="text-primary">&ldquo;Quality cannot be tested into a finished product; it must be built in by design.&rdquo;</strong> Quality Assurance (QA) is the central operational pillar ensuring every pharmaceutical batch manufactured is consistently safe, effective, pure, and fully compliant with global regulatory bodies like the <strong className="text-primary">US FDA, EMA, MHRA, and CDSCO</strong>.
                        </p>
                        <ul className="space-y-2 pt-1">
                            {[
                                "Master ALCOA+ data integrity to prevent critical FDA 483 audit citations",
                                "Understand on-floor plant QA: Line clearance checklists & IPQC testing",
                                "Explore modern QMS workflows: Deviation investigations & CAPA implementation",
                                "Earn a verified Certificate of Achievement with Credential ID for LinkedIn & CV",
                            ].map((point) => (
                                <li key={point} className="flex items-start gap-2 text-[11px] sm:text-[12px] md:text-[13px] text-[#374151] leading-[1.5]">
                                    <CheckCircle2 size={15} strokeWidth={2.5} className="text-[#10B981] shrink-0 mt-0.5" />
                                    <span>{point}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="md:col-span-6 order-1 md:order-2">
                        <div className="rounded-[18px] overflow-hidden border border-[#E8EDFF] shadow-card bg-white p-5 sm:p-7 md:p-8 flex items-center justify-center min-h-[180px] sm:min-h-[220px]">
                            <Image
                                src="/blog/free-qa-course/pharma-lesson-masterclass.png"
                                alt="Pharma Lesson Masterclass - Introduction to Pharmaceutical Quality Assurance"
                                width={500}
                                height={150}
                                className="w-full max-w-[340px] sm:max-w-[380px] h-auto object-contain"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════ QA VS QC COMPARISON MATRIX ══════════════ */}
            <section className="mx-auto max-w-[960px] px-4 sm:px-6 md:px-8 pb-8 sm:pb-10">
                <div className="rounded-[20px] bg-white border border-[#E2E8F0] p-4 sm:p-6 md:p-7 shadow-sm">
                    <div className="text-center mb-5 sm:mb-6">
                        <span className="inline-block rounded-md bg-[#EFF6FF] px-2.5 sm:px-3 py-1 text-[10px] sm:text-[11px] font-bold text-[#2563EB] mb-2 uppercase tracking-wider border border-[#BFDBFE]">
                            Core Concept Comparison
                        </span>
                        <h3 className="font-display text-[18px] sm:text-[22px] md:text-[24px] font-black text-primary">
                            Quality Assurance (QA) vs Quality Control (QC)
                        </h3>
                        <p className="text-[12px] sm:text-[13px] text-[#64748B] max-w-[580px] mx-auto mt-1 leading-[1.5]">
                            A classic technical interview question for freshers! Here is how the two critical quality departments function across pharma operations:
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
                        <div className="rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] p-4 sm:p-5">
                            <div className="flex items-center gap-2 mb-2.5 sm:mb-3">
                                <span className="p-1.5 rounded-lg bg-[#16A34A] text-white shrink-0">
                                    <Shield size={15} />
                                </span>
                                <h4 className="font-display text-[14px] sm:text-[15px] md:text-[16px] font-extrabold text-[#14532D]">
                                    Quality Assurance (QA)
                                </h4>
                            </div>
                            <ul className="space-y-2 text-[11px] sm:text-[12px] md:text-[13px] text-[#166534] leading-[1.6]">
                                <li className="flex items-start gap-2">
                                    <span className="font-bold text-[#16A34A]">•</span>
                                    <span><strong>Proactive &amp; Process-Oriented:</strong> Focuses on building, monitoring, and standardizing systems to prevent defects before they happen.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="font-bold text-[#16A34A]">•</span>
                                    <span><strong>Core Functions:</strong> SOP development, Line clearance oversight, Deviation handling, CAPA, Batch release, Quality Audits &amp; Compliance training.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="font-bold text-[#16A34A]">•</span>
                                    <span><strong>Guiding Philosophy:</strong> &ldquo;Right first time, every time&rdquo; across the entire product development and manufacturing lifecycle.</span>
                                </li>
                            </ul>
                        </div>

                        <div className="rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] p-4 sm:p-5">
                            <div className="flex items-center gap-2 mb-2.5 sm:mb-3">
                                <span className="p-1.5 rounded-lg bg-[#2563EB] text-white shrink-0">
                                    <BarChart3 size={15} />
                                </span>
                                <h4 className="font-display text-[14px] sm:text-[15px] md:text-[16px] font-extrabold text-[#1E3A8A]">
                                    Quality Control (QC)
                                </h4>
                            </div>
                            <ul className="space-y-2 text-[11px] sm:text-[12px] md:text-[13px] text-[#1E40AF] leading-[1.6]">
                                <li className="flex items-start gap-2">
                                    <span className="font-bold text-[#2563EB]">•</span>
                                    <span><strong>Reactive &amp; Product-Oriented:</strong> Focuses on testing, inspecting, and analyzing physical laboratory samples to detect defects against standards.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="font-bold text-[#2563EB]">•</span>
                                    <span><strong>Core Functions:</strong> Raw material analysis, HPLC/GC chromatography, dissolution testing, stability testing, and microbial limit testing.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="font-bold text-[#2563EB]">•</span>
                                    <span><strong>Guiding Philosophy:</strong> Verifying batch conformity against Pharmacopoeial monographs (IP, USP, BP, EP).</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════ SMART CROSS-LINKING CALLOUT BANNER ══════════════ */}
            <section className="mx-auto max-w-[960px] px-4 sm:px-6 md:px-8 pb-8 sm:pb-10">
                <div className="rounded-[20px] bg-gradient-to-r from-[#064E3B] via-[#0F766E] to-[#0284C7] p-4 sm:p-6 md:p-7 text-white shadow-xl relative overflow-hidden">
                    <div className="absolute top-[-30px] right-[-20px] w-[140px] h-[140px] rounded-full bg-white/10 blur-2xl pointer-events-none" />
                    
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-5 relative z-10">
                        <div className="space-y-2 max-w-[600px]">
                            <div className="inline-flex items-center gap-2 rounded-full bg-[#10B981] px-2.5 sm:px-3 py-1 text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-[#064E3B]">
                                <Sparkles size={11} /> B.Pharm NEP 2020 Syllabus Alignment
                            </div>
                            <h3 className="font-display text-[17px] sm:text-[20px] md:text-[22px] font-black text-white leading-tight">
                                Studying B.Pharm Semester 5 Quality Assurance?
                            </h3>
                            <p className="font-sans text-[12px] sm:text-[13px] text-white/85 leading-[1.6]">
                                This course aligns directly with your <strong className="text-white">BP505T Pharmaceutical Quality Assurance</strong> university syllabus! Pair this certification with our unit-wise notes, chapter breakdowns, and question banks.
                            </p>
                        </div>

                        <div className="shrink-0 w-full md:w-auto flex flex-col sm:flex-row gap-2 sm:gap-2.5">
                            <Link
                                href={QA_SYLLABUS_URL}
                                className="btn-press inline-flex items-center justify-center gap-2 rounded-[12px] bg-[#6EE7B7] px-4 py-2.5 text-[12px] font-black text-[#064E3B] hover:bg-[#A7F3D0] transition-all shadow-md text-center"
                            >
                                <span>BP505T Syllabus Notes</span>
                                <ArrowRight size={13} strokeWidth={2.5} />
                            </Link>
                            <Link
                                href={PV_INTERVIEW_KIT_URL}
                                className="btn-press inline-flex items-center justify-center gap-2 rounded-[12px] bg-white/15 backdrop-blur-md border border-white/25 px-4 py-2.5 text-[12px] font-bold text-white hover:bg-white/25 transition-all text-center"
                            >
                                <Bookmark size={13} />
                                <span>PV Interview Kit (44P)</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════ COMPREHENSIVE CURRICULUM BREAKDOWN ══════════════ */}
            <section id="curriculum" className="bg-[#F8FAFC] py-8 sm:py-12 md:py-14 border-y border-[#E2E8F0] scroll-mt-[65px]">
                <div className="mx-auto max-w-[960px] px-4 sm:px-6 md:px-8">
                    <div className="text-center mb-6 sm:mb-9">
                        <span className="inline-block rounded-md bg-white px-2.5 sm:px-3 py-1 text-[10px] sm:text-[11px] font-bold text-[#0D9488] mb-2 uppercase tracking-wider border border-[#E2E8F0]">
                            📚 Detailed Curriculum Breakdown
                        </span>
                        <h2 className="font-display text-[20px] sm:text-[26px] md:text-[30px] font-black text-primary leading-tight mb-2">
                            What You Will Learn in This Course
                        </h2>
                        <p className="font-sans text-[12px] sm:text-[13px] md:text-[14px] text-[#64748B] max-w-[620px] mx-auto leading-[1.6]">
                            The Pharma Lesson Quality Assurance curriculum is structured into 6 focused modules covering core industrial compliance and operational standards:
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                        {QA_MODULES.map((m) => (
                            <div
                                key={m.num}
                                className="fade-up rounded-[16px] bg-white border border-[#E2E8F0] p-4 sm:p-5 md:p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-center justify-between gap-2 mb-3">
                                        <span
                                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-[10px] font-display text-[11px] sm:text-[12px] font-black flex items-center justify-center shrink-0"
                                            style={{ background: `${m.color}15`, color: m.color }}
                                        >
                                            {m.num}
                                        </span>
                                        <div className="flex items-center gap-1.5 sm:gap-2">
                                            <span className="rounded-full bg-[#F1F5F9] px-2 sm:px-2.5 py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-bold text-[#475569]">
                                                {m.duration}
                                            </span>
                                            <span
                                                className="rounded-full px-2 sm:px-2.5 py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-bold"
                                                style={{ background: `${m.color}15`, color: m.color }}
                                            >
                                                {m.badge}
                                            </span>
                                        </div>
                                    </div>

                                    <h3 className="font-display text-[14px] sm:text-[15px] md:text-[16px] font-extrabold text-primary mb-2 flex items-start gap-2 leading-snug">
                                        <m.icon size={17} className="shrink-0 mt-0.5" style={{ color: m.color }} />
                                        <span>{m.title}</span>
                                    </h3>

                                    <p className="font-sans text-[11px] sm:text-[12px] md:text-[13px] text-[#475569] leading-[1.6] mb-3.5">
                                        {m.description}
                                    </p>

                                    <div className="space-y-1.5 bg-[#F8FAFC] p-3 rounded-[10px] border border-[#F1F5F9]">
                                        <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-[#94A3B8]">Key Concepts Covered:</span>
                                        {m.topics.map((t) => (
                                            <div key={t} className="flex items-start gap-1.5 text-[10px] sm:text-[11px] font-medium text-[#334155] leading-[1.4]">
                                                <Check size={11} className="text-[#10B981] shrink-0 mt-0.5" />
                                                <span>{t}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════ ASSESSMENT CRITERIA & 80% SCORE DETAILS ══════════════ */}
            <section className="mx-auto max-w-[960px] px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-14">
                <div className="rounded-[20px] bg-gradient-to-br from-[#FEF2F2] via-[#FFF1F2] to-[#EEF2FF] border border-[#FECACA] p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-5">
                        <div className="space-y-2 max-w-[620px]">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EF4444] px-2.5 sm:px-3 py-1 text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-white">
                                <AlertTriangle size={12} /> Assessment Requirement (80% Pass Mark)
                            </span>
                            <h3 className="font-display text-[18px] sm:text-[22px] md:text-[24px] font-black text-[#991B1B] leading-tight">
                                How to Clear the Final Test &amp; Qualify for the Certificate
                            </h3>
                            <p className="font-sans text-[12px] sm:text-[13px] md:text-[14px] text-[#7F1D1D] leading-[1.6]">
                                To maintain credential quality and professional validity, Pharma Lesson requires all enrolled candidates to complete all video modules and achieve a <strong>minimum passing score of 80% on the final assessment quiz</strong>.
                            </p>
                            <ul className="space-y-1.5 pt-1.5 text-[11px] sm:text-[12px] md:text-[13px] text-[#991B1B]">
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 size={14} className="text-[#DC2626] shrink-0" />
                                    <span><strong>Assessment Format:</strong> Multiple Choice Questions (MCQs) covering real-world QA scenarios.</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 size={14} className="text-[#DC2626] shrink-0" />
                                    <span><strong>Passing Threshold:</strong> 80% or higher. Free re-attempts are permitted if required.</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 size={14} className="text-[#DC2626] shrink-0" />
                                    <span><strong>Instant Credential Release:</strong> The &lsquo;View Certificate&rsquo; button unlocks automatically upon passing.</span>
                                </li>
                            </ul>
                        </div>

                        <div className="shrink-0 w-full md:w-auto text-center bg-white p-4 sm:p-5 rounded-2xl border border-[#FCA5A5] shadow-sm">
                            <span className="block text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-[#991B1B] mb-1">
                                Minimum Score
                            </span>
                            <span className="font-display text-[38px] sm:text-[44px] font-black text-[#DC2626] leading-none">
                                80%
                            </span>
                            <span className="block text-[10px] sm:text-[11px] font-bold text-[#64748B] mt-1">
                                Required to Unlock Certificate
                            </span>
                        </div>
                    </div>
                </div>

                {/* Interactive Practice Quiz */}
                <MiniQuizCheck />
            </section>

            {/* ══════════════ STEP-BY-STEP ENROLLMENT GUIDE ══════════════ */}
            <section id="enrollment-guide" className="bg-[#F8FAFC] py-8 sm:py-12 md:py-14 border-t border-[#E2E8F0] scroll-mt-[65px]">
                <div className="mx-auto max-w-[960px] px-4 sm:px-6 md:px-8">
                    <div className="text-center mb-6 sm:mb-9">
                        <span className="inline-block rounded-md bg-[#ECFDF5] px-2.5 sm:px-3 py-1 text-[10px] sm:text-[11px] font-bold text-[#059669] mb-2 uppercase tracking-wider border border-[#A7F3D0]">
                            ⚡ Step-by-Step Roadmap
                        </span>
                        <h2 className="font-display text-[20px] sm:text-[26px] md:text-[30px] font-black text-primary">
                            How to Complete the Course &amp; Claim Your Certificate
                        </h2>
                        <p className="font-sans text-[12px] sm:text-[13px] md:text-[14px] text-[#64748B] max-w-[580px] mx-auto mt-1">
                            Follow these 5 simple steps on the official Pharma Lesson platform to get certified:
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
                        {[
                            {
                                step: "01",
                                title: "Open Official Portal",
                                desc: "Visit the Pharma Lesson Masterclass course page using the direct link provided below.",
                            },
                            {
                                step: "02",
                                title: "Create Free Account",
                                desc: "Register a free student profile using your active email address and name.",
                            },
                            {
                                step: "03",
                                title: "Click 'Enroll'",
                                desc: "Click the Enroll button to immediately unlock all video lessons and learning material.",
                            },
                            {
                                step: "04",
                                title: "Pass Final Test (≥ 80%)",
                                desc: "Complete all video modules and score 80% or higher on the end-of-course assessment.",
                            },
                            {
                                step: "05",
                                title: "Download Certificate",
                                desc: "Click 'View Certificate' to download your verified certificate in PDF or Image format!",
                            },
                        ].map((s) => (
                            <div
                                key={s.step}
                                className="rounded-[16px] bg-white border border-[#E2E8F0] p-4 sm:p-5 text-center shadow-sm flex flex-col justify-between"
                            >
                                <div>
                                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#0D9488] text-white font-display text-[12px] sm:text-[13px] font-black flex items-center justify-center mx-auto mb-2.5 sm:mb-3 shadow-md">
                                        {s.step}
                                    </div>
                                    <h3 className="font-display text-[13px] sm:text-[14px] font-extrabold text-primary mb-1">{s.title}</h3>
                                    <p className="font-sans text-[11px] sm:text-[12px] text-[#64748B] leading-[1.5]">{s.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════ LINKEDIN SHARE & PHARMACODE FREE MENTORSHIP CALLOUT ══════════════ */}
            <section className="mx-auto max-w-[960px] px-4 sm:px-6 md:px-8 py-8 sm:py-10">
                <LinkedInMentorshipWidget />
            </section>

            {/* ══════════════ OFFICIAL CERTIFICATE PREVIEW SHOWCASE ══════════════ */}
            <section id="certificate-preview" className="mx-auto max-w-[960px] px-4 sm:px-6 md:px-8 py-8 sm:py-12 scroll-mt-[65px]">
                <div className="rounded-[22px] bg-white border border-[#E2E8F0] p-4 sm:p-6 md:p-8 shadow-card">
                    <div className="text-center mb-6">
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-[#ECFDF5] border border-[#A7F3D0] px-3 py-1 text-[10px] sm:text-[11px] font-bold text-[#059669] uppercase tracking-wider mb-2">
                            <Award size={13} className="text-[#059669]" /> Official Certificate Preview
                        </span>
                        <h2 className="font-display text-[20px] sm:text-[26px] md:text-[28px] font-black text-primary leading-tight">
                            Sample Certificate of Achievement
                        </h2>
                        <p className="font-sans text-[12px] sm:text-[13px] md:text-[14px] text-[#64748B] max-w-[620px] mx-auto mt-1 leading-[1.6]">
                            Here is an official sample preview of the verified certificate you will receive upon completing all course modules and passing the 80%+ final assessment:
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-center">
                        {/* Certificate Image Frame */}
                        <div className="md:col-span-8">
                            <div className="rounded-[16px] overflow-hidden border-2 border-[#F1F5F9] shadow-lg bg-[#FAFAFA] p-2 sm:p-3 relative group">
                                <div className="rounded-[12px] overflow-hidden border border-[#E2E8F0] bg-white">
                                    <Image
                                        src="/blog/free-qa-course/pharma-lesson-sample-certificate.jpg"
                                        alt="Official Sample Certificate of Achievement - Pharma Lesson Masterclass QA Course"
                                        width={800}
                                        height={600}
                                        className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-[1.01]"
                                        priority
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Certificate Highlights & Primary Action Button */}
                        <div className="md:col-span-4 space-y-3 sm:space-y-3.5">
                            <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-4">
                                <h4 className="font-display text-[13px] sm:text-[14px] font-extrabold text-primary mb-2 flex items-center gap-2">
                                    <Sparkles size={15} className="text-[#0D9488]" /> Certificate Features
                                </h4>
                                <ul className="space-y-2 text-[11px] sm:text-[12px] text-[#475569] leading-[1.5]">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 size={14} className="text-[#10B981] shrink-0 mt-0.5" />
                                        <span><strong>Student Name &amp; Title:</strong> Personalized with your registered full name and course title.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 size={14} className="text-[#10B981] shrink-0 mt-0.5" />
                                        <span><strong>Credential ID &amp; QR Code:</strong> Verifiable credential ID for LinkedIn and your professional CV.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 size={14} className="text-[#10B981] shrink-0 mt-0.5" />
                                        <span><strong>Dual Format Download:</strong> High-resolution Image (.PNG) and Print-ready PDF.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 size={14} className="text-[#10B981] shrink-0 mt-0.5" />
                                        <span><strong>100% Free:</strong> No charges for course enrollment or certificate generation.</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Main Course Action Link */}
                            <a
                                href={PHARMA_LESSON_QA_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-press w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] px-4 py-3 text-[12px] sm:text-[13px] font-black text-white shadow-md transition-all text-center"
                            >
                                <span>Go to Official Course &amp; Enroll Free</span>
                                <ExternalLink size={14} />
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════ QA CAREER PATHWAYS & SALARY SCOPE ══════════════ */}
            <section className="bg-gradient-to-b from-[#F8FAFC] to-[#EEF2FF] py-8 sm:py-12 md:py-14 border-y border-[#E2E8F0]">
                <div className="mx-auto max-w-[960px] px-4 sm:px-6 md:px-8">
                    <div className="text-center mb-6 sm:mb-9">
                        <span className="inline-block rounded-md bg-[#ECFDF5] px-2.5 sm:px-3 py-1 text-[10px] sm:text-[11px] font-bold text-[#059669] mb-2 uppercase tracking-wider border border-[#A7F3D0]">
                            📈 Industry Career Scope
                        </span>
                        <h2 className="font-display text-[20px] sm:text-[26px] md:text-[30px] font-black text-primary">
                            Pharmaceutical QA Career Roles &amp; Salary in India
                        </h2>
                        <p className="font-sans text-[12px] sm:text-[13px] md:text-[14px] text-[#64748B] max-w-[600px] mx-auto mt-1">
                            Quality Assurance offers stable, highly respected career ladders with extensive exposure to global regulatory compliance:
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
                        <div className="rounded-[16px] bg-white border border-[#E2E8F0] p-4 sm:p-5 shadow-sm">
                            <div className="w-8 h-8 rounded-lg bg-[#ECFDF5] text-[#059669] flex items-center justify-center mb-2.5 sm:mb-3">
                                <Briefcase size={16} />
                            </div>
                            <h4 className="font-display text-[14px] sm:text-[15px] font-black text-primary mb-1">
                                IPQC / QA Officer (Fresher)
                            </h4>
                            <span className="inline-block text-[10px] sm:text-[11px] font-bold text-[#059669] mb-2">
                                0 - 2 Years Exp | ₹2.8L - ₹4.5L LPA
                            </span>
                            <p className="text-[11px] sm:text-[12px] text-[#64748B] leading-[1.5]">
                                Responsible for on-floor line clearance verification, in-process sampling, environmental monitoring, and BMR record auditing.
                            </p>
                        </div>

                        <div className="rounded-[16px] bg-white border border-[#E2E8F0] p-4 sm:p-5 shadow-sm">
                            <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-2.5 sm:mb-3">
                                <Layers size={16} />
                            </div>
                            <h4 className="font-display text-[14px] sm:text-[15px] font-black text-primary mb-1">
                                QMS / CAPA Specialist
                            </h4>
                            <span className="inline-block text-[10px] sm:text-[11px] font-bold text-[#2563EB] mb-2">
                                3 - 6 Years Exp | ₹5.5L - ₹9.0L LPA
                            </span>
                            <p className="text-[11px] sm:text-[12px] text-[#64748B] leading-[1.5]">
                                Manages deviations, conducts structured Root Cause Analysis (RCA), executes CAPAs, and manages facility change controls.
                            </p>
                        </div>

                        <div className="rounded-[16px] bg-white border border-[#E2E8F0] p-4 sm:p-5 shadow-sm">
                            <div className="w-8 h-8 rounded-lg bg-[#FAF5FF] text-[#7C3AED] flex items-center justify-center mb-2.5 sm:mb-3">
                                <Award size={16} />
                            </div>
                            <h4 className="font-display text-[14px] sm:text-[15px] font-black text-primary mb-1">
                                QA Manager / Head of Quality
                            </h4>
                            <span className="inline-block text-[10px] sm:text-[11px] font-bold text-[#7C3AED] mb-2">
                                8+ Years Exp | ₹12L - ₹25L+ LPA
                            </span>
                            <p className="text-[11px] sm:text-[12px] text-[#64748B] leading-[1.5]">
                                Oversees total plant compliance, leads US FDA / EMA audit hosting, authorizes market batch releases, and oversees validation.
                            </p>
                        </div>
                    </div>

                    <div className="mt-5 sm:mt-6 rounded-xl bg-white border border-[#E2E8F0] p-3.5 sm:p-4 text-center text-[11px] sm:text-[12px] text-[#64748B] leading-[1.5]">
                        <strong className="text-primary">Top Hiring Companies:</strong> Sun Pharma, Cipla, Dr. Reddy&apos;s, Lupin, Torrent Pharma, Abbott, Pfizer, Novartis, Zydus, Alkem, Glenmark, and Aurobindo.
                    </div>
                </div>
            </section>

            {/* ══════════════ FAQ SECTION ══════════════ */}
            <section className="mx-auto max-w-[960px] px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-14">
                <div className="text-center mb-6 sm:mb-8">
                    <h2 className="font-display text-[19px] sm:text-[24px] md:text-[26px] font-black text-primary">
                        Frequently Asked Questions
                    </h2>
                </div>

                <div className="space-y-3 max-w-[720px] mx-auto">
                    {FAQS.map((faq, i) => (
                        <div
                            key={i}
                            className="rounded-[14px] border border-[#E2E8F0] bg-white p-4 sm:p-5 hover:border-[#CBD5E1] transition-colors duration-200"
                        >
                            <h3 className="font-display text-[12px] sm:text-[13px] md:text-[14px] font-extrabold text-primary mb-1.5 sm:mb-2 flex items-start gap-2">
                                <span className="shrink-0 w-5 h-5 rounded-full bg-[#ECFDF5] text-[#059669] text-[10px] sm:text-[11px] font-black flex items-center justify-center mt-0.5">
                                    Q
                                </span>
                                <span>{faq.q}</span>
                            </h3>
                            <p className="font-sans text-[11px] sm:text-[12px] md:text-[13px] text-[#64748B] leading-[1.7] pl-7">
                                {faq.a}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
