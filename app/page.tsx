import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { SEMESTERS, TOTAL_CREDITS, TOTAL_SUBJECTS } from "@/lib/syllabus";
import { SemCard } from "@/components/SemCard";
import { SITE, absUrl } from "@/lib/site";
import {
    Monitor, BookOpen, Download, Search, Building2, Target,
    BookMarked, FileDown,
} from "lucide-react";

export const metadata: Metadata = {
    title: "B.Pharm Syllabus PCI NEP 2020 | Free Notes & Study Material",
    description:
        "Complete B.Pharm syllabus as per PCI NEP 2020 — all 8 semesters, unit-wise notes, Python & AIML for pharmacy. Free study material for pharmacy students across India.",
    alternates: { canonical: absUrl("/") },
    openGraph: {
        title: "B.Pharm Syllabus NEP 2020 | PharmaCode",
        description: "Unit-wise B.Pharm syllabus with Python & AI integration. Free PDF notes for all 8 semesters.",
        url: absUrl("/"),
    },
};

const FEATURES: [React.ElementType, string, string][] = [
    [Monitor, "Python & AI Built-In", "Dedicated pages for BP101T, BP301T, BP604T, BP703T, BP801T — the new-age subjects"],
    [BookOpen, "Unit-wise Breakdown", "Every subject split into 5 units with topic lists — perfect for exam and class prep"],
    [Download, "100% Free Notes", "PDF notes for all 8 semesters — no login, no paywall, always free"],
    [Search, "SEO Optimized", "Every subject has its own Google-indexed URL — find anything instantly"],
    [Building2, "Internship Guides", "Dedicated pages for Semester 4 & 6 mandatory internships with report templates"],
    [Target, "GPAT Ready", "High-weightage topics marked — aligned with GPAT 2027 preparation strategy"],
];

const STATS = [
    ["8", "Semesters"],
    [String(TOTAL_CREDITS), "Total Credits"],
    [`${TOTAL_SUBJECTS}+`, "Subjects"],
    ["100%", "Free"],
];

export default function HomePage() {
    return (
        <>
            {/* ── HERO ─────────────────────────────────────────── */}
            <section
                className="relative overflow-hidden text-center"
                style={{
                    background: "linear-gradient(160deg, #0F1D5C 0%, #1A2B6B 40%, #2E4BAD 70%, #4C6EF5 100%)",
                    padding: "clamp(56px, 10vw, 88px) clamp(20px, 5vw, 40px) clamp(48px, 8vw, 72px)",
                }}
            >
                {/* Ambient glow blobs */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle at 20% 50%, rgba(76,110,245,0.18) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(147,197,253,0.12) 0%, transparent 50%)",
                    }}
                    aria-hidden
                />

                <div className="relative mx-auto max-w-[680px]">
                    {/* Live badge */}
                    <div className="fade-up mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-[5px] backdrop-blur-sm">
                        <span className="pulse-dot inline-block h-[7px] w-[7px] rounded-full bg-[#4ADE80]" />
                        <span className="font-[DM_Sans] text-[11px] sm:text-[12px] font-medium text-[#C7D2FE]">
                            PCI NEP 2020 · Batch 2026–27 Onwards
                        </span>
                    </div>

                    {/* Logo */}
                    <div className="fade-up fade-up-1 mb-5 flex justify-center">
                        <div className="relative">
                            <div
                                className="absolute inset-0 rounded-[28px] blur-xl pointer-events-none"
                                style={{ background: "rgba(147,197,253,0.3)" }}
                                aria-hidden
                            />
                            <Image
                                src="/logo.png"
                                alt="PharmaCode — B.Pharm NEP 2020"
                                width={96}
                                height={96}
                                className="relative rounded-[24px] object-contain shadow-2xl sm:w-[110px] sm:h-[110px]"
                                priority
                            />
                        </div>
                    </div>

                    {/* H1 */}
                    <h1 className="fade-up fade-up-2 mb-3.5 font-display text-[28px] sm:text-[42px] md:text-[52px] font-black leading-[1.1] text-white">
                        B.Pharm Syllabus
                        <br />
                        <span className="text-[#93C5FD]">NEP 2020</span>
                    </h1>

                    <p className="fade-up fade-up-3 mb-2.5 font-[DM_Sans] text-[14px] sm:text-[17px] text-[#C7D2FE]">
                        Complete unit-wise syllabus · Free notes · Python &amp; AI integrated
                    </p>

                    {/* Code · Cure · Care */}
                    <div className="fade-up fade-up-3 mb-6 sm:mb-9 mt-2.5 flex flex-wrap justify-center gap-2 sm:gap-3">
                        {(["Code", "Cure", "Care"] as const).map((w, i) => (
                            <span
                                key={w}
                                className="font-display text-[13px] sm:text-[15px] font-extrabold"
                                style={{ color: ["#93C5FD", "#6EE7B7", "#FCA5A5"][i] }}
                            >
                                • {w}
                            </span>
                        ))}
                    </div>

                    {/* CTA Buttons */}
                    <div className="fade-up fade-up-4 flex flex-col xs:flex-row justify-center gap-3 mb-10 sm:mb-12 px-4 xs:px-0">
                        <Link
                            href="/syllabus/"
                            className="btn-press ripple-container flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 rounded-[14px] bg-white text-primary text-[14px] sm:text-[15px] font-bold font-[DM_Sans] shadow-lg transition-all duration-200 active:scale-95"
                        >
                            <BookMarked size={17} strokeWidth={2.5} />
                            Explore Syllabus
                        </Link>
                        <Link
                            href="/notes/"
                            className="btn-press ripple-container flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 rounded-[14px] bg-white/10 text-white text-[14px] sm:text-[15px] font-semibold font-[DM_Sans] border border-white/30 backdrop-blur-sm transition-all duration-200 active:scale-95"
                        >
                            <FileDown size={17} strokeWidth={2} />
                            Free Notes
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="fade-up fade-up-5 mt-8 flex justify-center flex-wrap gap-5 sm:gap-9">
                        {STATS.map(([n, l], i) => (
                            <div key={l} className={`text-center scale-in`} style={{ animationDelay: `${0.5 + i * 0.07}s` }}>
                                <div className="font-display text-[24px] sm:text-[30px] font-black text-white">
                                    {n}
                                </div>
                                <div className="font-[DM_Sans] text-[11px] sm:text-[12px] text-[#93C5FD]">{l}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── SEMESTER GRID ────────────────────────────────── */}
            <section className="mx-auto w-full max-w-[1080px] px-5 sm:px-8 py-12 sm:py-14">
                <div className="mb-8 sm:mb-10 text-center fade-up">
                    <h2 className="mb-2 font-display text-[26px] sm:text-[34px] font-black text-primary">
                        All 8 Semesters
                    </h2>
                    <p className="font-[DM_Sans] text-[14px] sm:text-[15px] text-[#6B7FA3]">
                        Tap any semester to see full subjects, units and download notes
                    </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                    {SEMESTERS.map((s, i) => (
                        <div key={s.num} className={`fade-up fade-up-${Math.min(i + 1, 8)}`}>
                            <SemCard sem={s} />
                        </div>
                    ))}
                </div>
            </section>

            {/* ── FEATURES ─────────────────────────────────────── */}
            <section className="bg-[#F0F4FF] px-5 sm:px-8 py-12 sm:py-14">
                <div className="mx-auto w-full max-w-[900px]">
                    <h2 className="fade-up mb-8 text-center font-display text-[24px] sm:text-[28px] font-black text-primary">
                        Why PharmaCode?
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {FEATURES.map(([Icon, t, d], i) => (
                            <div
                                key={t}
                                className={`fade-up fade-up-${i + 1} lift rounded-[16px] border border-[#DDE8FF] bg-white p-5 sm:p-[22px]`}
                            >
                                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#EEF2FF] transition-colors duration-200 group-hover:bg-[#E0E8FF]">
                                    <Icon size={18} strokeWidth={2} className="text-secondary" />
                                </div>
                                <div className="mb-1.5 font-display text-[14px] sm:text-[15px] font-extrabold text-primary">
                                    {t}
                                </div>
                                <div className="font-[DM_Sans] text-[12px] sm:text-[13px] leading-[1.6] text-[#6B7FA3]">
                                    {d}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA STRIP ────────────────────────────────────── */}
            <section
                className="px-5 py-12 text-center"
                style={{ background: "linear-gradient(135deg, #1A2B6B, #4C6EF5)" }}
            >
                <h2 className="fade-up mb-2 font-display text-[22px] sm:text-[28px] font-black text-white">
                    Jump to your Semester
                </h2>
                <p className="fade-up fade-up-1 mb-6 font-[DM_Sans] text-[13px] sm:text-[15px] text-[#C7D2FE]">
                    Tap any semester for units, notes and syllabus PDF
                </p>
                <div className="flex flex-wrap justify-center gap-2 sm:gap-2.5">
                    {SEMESTERS.map((s, i) => (
                        <Link
                            key={s.num}
                            href={`/syllabus/semester-${s.num}/`}
                            className={`btn-press fade-up fade-up-${i + 1} rounded-[10px] border border-white/25 bg-white/10 px-4 sm:px-[18px] py-2.5 font-display text-[13px] font-bold text-white transition-all duration-150 active:scale-95 active:bg-white/20`}
                        >
                            Sem {s.num}
                        </Link>
                    ))}
                </div>
            </section>
        </>
    );
}
