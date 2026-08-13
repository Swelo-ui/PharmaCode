import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { absUrl } from "@/lib/site";
import { CopyEmailBox } from "@/components/CopyEmailBox";
import { FileUp, HeartHandshake, CheckCircle2, ArrowRight, Mail } from "lucide-react";

export const metadata: Metadata = {
    title: "Contribute Study Material & Notes — PharmaCode",
    description:
        "Help pharmacy students across India by contributing B.Pharm notes, unit summaries, and syllabus updates on PharmaCode.",
    alternates: { canonical: absUrl("/contribute/") },
    keywords: [
        "Contribute B.Pharm notes",
        "pharmacy notes submission",
        "PharmaCode open source",
        "share pharmacy study material",
    ],
    openGraph: {
        title: "Contribute to PharmaCode",
        description: "Help build India's largest free resource for B.Pharm NEP 2020 students.",
        url: absUrl("/contribute/"),
        images: [{ url: absUrl("/og-image.png"), width: 1200, height: 630, alt: "Contribute to PharmaCode" }],
    },
};

export default function ContributePage() {
    const breadcrumbs = [
        { name: "Home", href: "/" },
        { name: "Contribute", href: "/contribute/" },
    ];

    return (
        <div className="mx-auto w-full max-w-[960px] px-3.5 xs:px-5 sm:px-8 py-6 sm:py-10">
            <JsonLd data={breadcrumbSchema(breadcrumbs)} />
            <Breadcrumb items={breadcrumbs} />

            {/* ── HERO BANNER ── */}
            <div className="rounded-[20px] bg-gradient-to-r from-[#0F1D5C] to-[#2E4BAD] p-5 sm:p-8 md:p-10 text-white mb-6 sm:mb-8 shadow-sm">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] sm:text-[11px] font-semibold text-[#93C5FD] mb-3 flex-wrap">
                    <HeartHandshake size={13} className="shrink-0" /> Open Community Platform
                </div>
                <h1 className="font-display text-[24px] xs:text-[28px] sm:text-[36px] font-black leading-tight mb-2.5">
                    Contribute to PharmaCode
                </h1>
                <p className="font-[DM_Sans] text-[13px] sm:text-[15px] md:text-[16px] text-[#C7D2FE] max-w-[620px] leading-relaxed">
                    Join educators, GPAT rankers, and senior pharmacy students in creating free, high-quality study resources for B.Pharm students nationwide.
                </p>
            </div>

            {/* ── CONTENT GRID ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
                {/* Left Card */}
                <div className="rounded-[16px] border border-[#E8EDFF] bg-white p-4.5 sm:p-6 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="w-10 h-10 rounded-[12px] bg-[#EEF2FF] flex items-center justify-center text-[#4C6EF5] mb-3.5">
                            <FileUp size={20} />
                        </div>
                        <h2 className="font-display text-[17px] sm:text-[19px] font-bold text-[#1A2B6B] mb-2 leading-tight">
                            Share Notes &amp; Unit PDF Summaries
                        </h2>
                        <p className="font-[DM_Sans] text-[12.5px] sm:text-[13.5px] text-[#6B7FA3] leading-relaxed mb-4">
                            Have well-structured unit notes, handwritten revision charts, or GPAT study formulas? Share them with thousands of pharmacy peers.
                        </p>
                        <ul className="space-y-2 mb-6">
                            {[
                                "Unit-wise PDF study notes",
                                "GPAT short revision summaries",
                                "Lab practical manuals & GPAT tricks",
                                "Syllabus correction suggestions",
                            ].map((item) => (
                                <li key={item} className="flex items-start gap-2 text-[12px] sm:text-[13px] text-[#4B5563]">
                                    <CheckCircle2 size={15} className="text-[#10B981] shrink-0 mt-0.5" />
                                    <span className="leading-snug">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <Link
                        href="/notes/"
                        className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[12px] bg-[#1A2B6B] text-white font-[DM_Sans] font-bold text-[13px] hover:bg-[#0F1D5C] transition-colors"
                    >
                        Browse Existing Notes <ArrowRight size={14} />
                    </Link>
                </div>

                {/* Right Card - Submission Details */}
                <div className="rounded-[16px] border border-[#E8EDFF] bg-[#F8FAFF] p-4.5 sm:p-6 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="w-10 h-10 rounded-[12px] bg-[#EEF2FF] flex items-center justify-center text-[#4C6EF5] mb-3.5">
                            <Mail size={20} />
                        </div>
                        <h2 className="font-display text-[17px] sm:text-[19px] font-bold text-[#1A2B6B] mb-2 leading-tight">
                            How to submit your notes
                        </h2>
                        <p className="font-[DM_Sans] text-[12.5px] sm:text-[13.5px] text-[#6B7FA3] leading-relaxed mb-4">
                            You can reach out directly via email or our community channel to submit notes or report typos in syllabus listings.
                        </p>

                        {/* Copyable Email Box with Copy Button */}
                        <CopyEmailBox email="pharmacode.connect@gmail.com" label="OFFICIAL CONTACT EMAIL" />

                        <p className="font-[DM_Sans] text-[11.5px] sm:text-[12px] text-[#9CA3AF] leading-normal">
                            All submissions are reviewed for PCI NEP 2020 syllabus alignment before publishing. Credit will be given to contributors.
                        </p>
                    </div>

                    <Link
                        href="/syllabus/"
                        className="mt-6 w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[12px] border border-[#4C6EF5] text-[#4C6EF5] font-[DM_Sans] font-bold text-[13px] hover:bg-[#EEF2FF] transition-colors bg-white"
                    >
                        Explore Syllabus Hub
                    </Link>
                </div>
            </div>
        </div>
    );
}
