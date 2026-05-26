"use client";
// components/SubjectRow.tsx
import { useState } from "react";
import Link from "next/link";
import { Download, ExternalLink, Star, ChevronDown } from "lucide-react";
import type { Subject } from "@/lib/syllabus";

interface Props {
    subject: Subject;
    semColor: string;
    semNum: number;
}

const TYPE_META: Record<string, { label: string; bg: string; color: string }> = {
    T: { label: "Theory", bg: "#EEF2FF", color: "#3730A3" },
    P: { label: "Practical", bg: "#F0FDF4", color: "#14532D" },
    I: { label: "Internship", bg: "#FFF7ED", color: "#92400E" },
    RP: { label: "Research Project", bg: "#FAF5FF", color: "#581C87" },
};

export default function SubjectRow({ subject, semColor, semNum }: Props) {
    const [open, setOpen] = useState(false);
    const tm = TYPE_META[subject.type] ?? TYPE_META.T;
    const hasUnits = subject.units.length > 0;

    return (
        <div
            className="rounded-[14px] overflow-hidden mb-2.5 bg-white transition-all duration-200"
            style={{
                border: `1.5px solid ${open ? semColor + "66" : "#E8EDFF"}`,
                boxShadow: open ? `0 4px 16px ${semColor}18` : "none",
            }}
        >
            {/* ── Row Header (tap to expand) ──────────────── */}
            <button
                onClick={() => hasUnits && setOpen((v) => !v)}
                disabled={!hasUnits}
                aria-expanded={open}
                className="w-full text-left transition-colors duration-150"
                style={{ background: open ? "#F8FAFF" : "white" }}
            >
                <div className="px-3 sm:px-4 py-3 sm:py-3.5 flex items-start sm:items-center gap-2 sm:gap-3">
                    {/* Left: badge + name (stacked on mobile, inline on sm+) */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2.5 flex-1 min-w-0">
                        <span
                            className="self-start shrink-0 font-mono text-[9px] sm:text-[10px] font-bold px-2 py-[3px] rounded-[6px] whitespace-nowrap"
                            style={{ background: tm.bg, color: tm.color }}
                        >
                            {subject.code}
                        </span>
                        <span
                            className="font-[DM_Sans] font-semibold text-[13px] sm:text-[14px] text-[#1A2B6B] leading-[1.4] min-w-0"
                            style={{ wordBreak: "break-word" }}
                        >
                            {subject.name}
                        </span>
                    </div>
                    {/* Right: badges + chevron */}
                    <div className="flex items-center gap-1.5 shrink-0">
                        {subject.highlight && (
                            <span className="hidden xs:inline-flex items-center gap-0.5 font-[DM_Sans] text-[9px] sm:text-[10px] font-bold px-2 py-[3px] rounded-[5px] bg-[#FEF3C7] text-[#92400E] whitespace-nowrap leading-none">
                                <Star size={9} fill="currentColor" className="shrink-0" />
                                KEY
                            </span>
                        )}
                        <span className="font-[DM_Sans] text-[11px] font-bold px-2 py-[3px] rounded-[7px] bg-[#F0F4FF] text-[#4C6EF5] whitespace-nowrap">
                            {subject.credits}cr
                        </span>
                        {hasUnits && (
                            <ChevronDown
                                size={15}
                                className="text-[#9CA3AF] transition-transform duration-200"
                                style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
                            />
                        )}
                    </div>
                </div>
            </button>

            {/* ── Expanded Accordion Content ─────────────── */}
            {open && hasUnits && (
                <div
                    className="border-t border-[#EEF2FF] pb-4 accordion-enter"
                >
                    {/* Unit list — full PDF content */}
                    <div className="flex flex-col gap-0">
                        {subject.units.map((unit, i) => (
                            <div
                                key={unit.num}
                                className={`px-3 sm:px-4 py-3 ${i < subject.units.length - 1 ? "border-b border-[#F0F4FF]" : ""}`}
                            >
                                {/* Unit header — title + hours only */}
                                <div className="flex items-center gap-2.5">
                                    <span
                                        className="shrink-0 font-[DM_Sans] text-[9px] sm:text-[10px] font-black px-[7px] py-[3px] rounded-[5px] text-white"
                                        style={{ background: semColor }}
                                    >
                                        {subject.type === "T" ? `U${i + 1}` : "•"}
                                    </span>
                                    <span className="font-[DM_Sans] font-semibold text-[12px] sm:text-[13px] text-[#1A2B6B] leading-[1.45] flex-1">
                                        {unit.title}
                                    </span>
                                    {unit.hours && (
                                        <span className="shrink-0 font-[DM_Sans] text-[10px] text-[#9CA3AF] whitespace-nowrap">
                                            {unit.hours}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Action buttons */}
                    <div className="px-3 sm:px-4 pt-3 flex flex-col sm:flex-row gap-2">
                        <button
                            className="w-full sm:flex-1 py-2.5 px-4 rounded-[10px] border-none text-white text-[12px] sm:text-[13px] font-bold font-[DM_Sans] transition-all duration-150 hover:opacity-90 hover:shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
                            style={{ background: semColor }}
                        >
                            <Download size={14} />
                            Download Notes PDF
                        </button>
                        {subject.type === "T" && (
                            <Link
                                href={`/syllabus/semester-${semNum}/${subject.slug}`}
                                className="w-full sm:w-auto flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-[10px] text-[12px] sm:text-[13px] font-semibold font-[DM_Sans] bg-transparent transition-all duration-150 hover:opacity-80"
                                style={{ border: `1.5px solid ${semColor}`, color: semColor }}
                            >
                                <ExternalLink size={13} />
                                View Full Syllabus Page
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
