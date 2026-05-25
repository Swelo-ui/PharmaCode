import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { SEMESTERS, TOTAL_CREDITS, TOTAL_SUBJECTS } from "@/lib/syllabus";
import { SemCard } from "@/components/SemCard";
import { SITE, absUrl } from "@/lib/site";

export const metadata: Metadata = {
    title: "B.Pharm Syllabus PCI NEP 2020 | Free Notes & Study Material",
    description:
        "Complete B.Pharm syllabus as per PCI NEP 2020 — all 8 semesters, unit-wise notes, Python & AIML for pharmacy. Free study material for pharmacy students across India.",
    alternates: { canonical: absUrl("/") },
    openGraph: {
        title: "B.Pharm Syllabus NEP 2020 | PharmaCode",
        description:
            "Unit-wise B.Pharm syllabus with Python & AI integration. Free PDF notes for all 8 semesters.",
        url: absUrl("/"),
    },
};

const FEATURES: [string, string, string][] = [
    [
        "💻",
        "Python & AI Built-In",
        "Dedicated pages for BP101T, BP301T, BP604T, BP703T, BP801T — the new-age subjects",
    ],
    [
        "📖",
        "Unit-wise Breakdown",
        "Every subject split into 5 units with topic lists — perfect for exam and class prep",
    ],
    [
        "📥",
        "100% Free Notes",
        "PDF notes for all 8 semesters — no login, no paywall, always free",
    ],
    [
        "🔍",
        "SEO Optimized",
        "Every subject has its own Google-indexed URL — find anything instantly",
    ],
    [
        "🏭",
        "Internship Guides",
        "Dedicated pages for Semester 4 & 6 mandatory internships with report templates",
    ],
    [
        "🎯",
        "GPAT Ready",
        "High-weightage topics marked — aligned with GPAT 2027 preparation strategy",
    ],
];

export default function HomePage() {
    return (
        <>
            {/* HERO */}
            <section
                className="relative overflow-hidden px-4 text-center"
                style={{
                    background:
                        "linear-gradient(160deg, #0F1D5C 0%, #1A2B6B 40%, #2E4BAD 70%, #4C6EF5 100%)",
                    padding: "clamp(56px, 10vw, 88px) 20px clamp(48px, 8vw, 72px)",
                }}
            >
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle at 20% 50%, rgba(76,110,245,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(147,197,253,0.1) 0%, transparent 50%)",
                    }}
                    aria-hidden
                />
                <div className="relative mx-auto max-w-[680px]">
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-[5px]">
                        <span className="inline-block h-[7px] w-[7px] rounded-full bg-[#4ADE80]" />
                        <span className="font-[DM_Sans] text-[11px] sm:text-[12px] font-medium text-[#C7D2FE]">
                            PCI NEP 2020 · Batch 2026–27 Onwards
                        </span>
                    </div>

                    {/* Logo in hero */}
                    <div className="mb-5 flex justify-center">
                        <div className="relative">
                            {/* Glow ring behind logo */}
                            <div
                                className="absolute inset-0 rounded-[28px] blur-xl pointer-events-none"
                                style={{ background: "rgba(147,197,253,0.25)" }}
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
                    
                    {/* H1 — Responsive text sizing */}
                    <h1 className="mb-3.5 font-display text-[28px] sm:text-[42px] md:text-[52px] font-black leading-[1.1] text-white">
                        B.Pharm Syllabus
                        <br />
                        <span className="text-[#93C5FD]">NEP 2020</span>
                    </h1>
                    <p className="mb-2.5 font-[DM_Sans] text-[14px] sm:text-[17px] text-[#C7D2FE]">
                        Complete unit-wise syllabus · Free notes · Python &amp; AI integrated
                    </p>
                    
                    <div className="mb-6 sm:mb-9 mt-2.5 flex flex-wrap justify-center gap-2 sm:gap-3">
                        {(["Code", "Cure", "Care"] as const).map((w, i) => (
                            <span
                                key={w}
                                className="font-display text-[13px] sm:text-[15px] font-extrabold"
                                style={{
                                    color: ["#93C5FD", "#6EE7B7", "#FCA5A5"][i],
                                }}
                            >
                                • {w}
                            </span>
                        ))}
                    </div>

                    {/* Responsive CTA Buttons */}
                    <div className="flex flex-col xs:flex-row justify-center gap-3 mb-10 sm:mb-12 px-4 xs:px-0">
                        <Link
                            href="/syllabus/"
                            className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 rounded-[12px] bg-white text-primary text-[14px] sm:text-[15px] font-bold font-[DM_Sans] transition-all duration-200 hover:shadow-lg hover:scale-[1.02]"
                        >
                            📚 Explore Syllabus
                        </Link>
                        <Link
                            href="/notes/"
                            className="flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 rounded-[12px] bg-transparent text-white text-[14px] sm:text-[15px] font-semibold font-[DM_Sans] border-2 border-white/35 transition-all duration-200 hover:bg-white/10"
                        >
                            📥 Free Notes
                        </Link>
                    </div>

                    {/* Stats — responsive row with proper scaling gaps and text sizing */}
                    <div className="mt-8 flex justify-center flex-wrap gap-5 sm:gap-9">
                        {[
                            ["8", "Semesters"],
                            [String(TOTAL_CREDITS), "Total Credits"],
                            [`${TOTAL_SUBJECTS}+`, "Subjects"],
                            ["100%", "Free"],
                        ].map(([n, l]) => (
                            <div key={l} className="text-center">
                                <div className="font-display text-[24px] sm:text-[30px] font-black text-white">
                                    {n}
                                </div>
                                <div className="font-[DM_Sans] text-[11px] sm:text-[12px] text-[#93C5FD]">{l}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SEMESTER GRID */}
            <section className="mx-auto max-w-[1080px] px-4 sm:px-6 py-12 sm:py-14">
                <div className="mb-8 sm:mb-10 text-center">
                    <h2 className="mb-2.5 font-display text-[26px] sm:text-[34px] font-black text-primary">
                        All 8 Semesters
                    </h2>
                    <p className="font-[DM_Sans] text-[14px] sm:text-[15px] text-[#6B7FA3]">
                        Click any semester to see full subjects, units and download notes
                    </p>
                </div>
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                    {SEMESTERS.map((s) => (
                        <SemCard key={s.num} sem={s} />
                    ))}
                </div>
            </section>

            {/* FEATURES */}
            <section className="bg-[#F0F4FF] px-4 sm:px-6 py-12 sm:py-14">
                <div className="mx-auto max-w-[900px]">
                    <h2 className="mb-8 text-center font-display text-[24px] sm:text-[28px] font-black text-primary">
                        Why PharmaCode?
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {FEATURES.map(([ic, t, d]) => (
                            <div
                                key={t}
                                className="rounded-[16px] border border-[#DDE8FF] bg-white p-5 sm:p-[22px] transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                            >
                                <div className="mb-2.5 text-[24px] sm:text-[26px]">{ic}</div>
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

            {/* CTA */}
            <section
                className="px-4 py-12 text-center"
                style={{ background: "linear-gradient(135deg, #1A2B6B, #4C6EF5)" }}
            >
                <h2 className="mb-2.5 font-display text-[22px] sm:text-[28px] font-black text-white">
                    Start with your Semester
                </h2>
                <p className="mb-6 font-[DM_Sans] text-[13px] sm:text-[15px] text-[#C7D2FE]">
                    Jump directly to any semester page for units, notes and syllabus PDF
                </p>
                <div className="flex flex-wrap justify-center gap-2 sm:gap-2.5">
                    {SEMESTERS.map((s) => (
                        <Link
                            key={s.num}
                            href={`/syllabus/semester-${s.num}/`}
                            className="rounded-[10px] border-2 border-white/30 bg-white/10 px-4 sm:px-[18px] py-2.5 font-display text-[13px] font-bold text-white transition-all duration-150 hover:bg-white/20"
                        >
                            Sem {s.num}
                        </Link>
                    ))}
                </div>
            </section>
        </>
    );
}
