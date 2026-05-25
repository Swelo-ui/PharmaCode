"use client";

import Link from "next/link";
import { useState } from "react";
import type { Subject } from "@/lib/types";
import { TYPE_META } from "@/lib/syllabus";
import { clsx } from "@/lib/format";

interface SubjectRowProps {
    sub: Subject;
    semNum: number;
    semColor: string;
}

export function SubjectRow({ sub, semNum, semColor }: SubjectRowProps) {
    const [open, setOpen] = useState(false);
    const tm = TYPE_META[sub.type] || TYPE_META.T;
    const canExpand = sub.units.length > 0;

    return (
        <div
            className="lift mb-2.5 overflow-hidden rounded-[14px] border bg-white transition-all duration-200"
            style={{
                borderColor: open ? `${semColor}55` : "#E8EDFF",
                borderWidth: 1.5,
            }}
        >
            <button
                type="button"
                onClick={() => canExpand && setOpen((o) => !o)}
                disabled={!canExpand}
                className={clsx(
                    "flex w-full items-start sm:items-center gap-2 sm:gap-2.5 px-3 sm:px-[18px] py-3.5 text-left",
                    canExpand ? "cursor-pointer" : "cursor-default",
                    open ? "bg-[#F8FAFF]" : "bg-white",
                )}
                aria-expanded={open}
            >
                {/* Left: Code badge + Name (stacked on mobile, row on sm+) */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2.5 flex-1 min-w-0">
                    <span
                        className="self-start sm:self-auto flex-shrink-0 whitespace-nowrap rounded-md px-2 py-[3px] font-mono text-[10px] sm:text-[11px] font-bold"
                        style={{ background: tm.bg, color: tm.color }}
                    >
                        {sub.code}
                    </span>
                    <span 
                        className="font-[DM_Sans] font-semibold text-[13px] sm:text-[14px] leading-tight text-primary"
                        style={{ wordBreak: "break-word", minWidth: 0 }}
                    >
                        {sub.name}
                    </span>
                </div>

                {/* Right: Badges + Chevron — always shrink-0 */}
                <span className="flex flex-shrink-0 items-center gap-1.5 sm:gap-2 ml-1">
                    {sub.highlight && (
                        <span className="hidden xs:inline-flex rounded-md bg-[#FEF3C7] px-2 py-0.5 text-[10px] font-bold text-[#92400E]">
                            ★ KEY
                        </span>
                    )}
                    <span className="rounded-lg bg-[#F0F4FF] px-2.5 py-[3px] text-[11px] sm:text-[12px] font-bold text-secondary">
                        {sub.credits}cr
                    </span>
                    {canExpand && (
                        <span
                            className={clsx(
                                "chev inline-block text-[13px] sm:text-[14px] text-[#9CA3AF]",
                                open && "open",
                            )}
                            aria-hidden
                        >
                            ▾
                        </span>
                    )}
                </span>
            </button>

            {open && canExpand && (
                <div className="border-t border-[#EEF2FF] px-3 sm:px-[18px] pb-4 pt-3 accordion-enter">
                    {/* ★ KEY badge on mobile (hidden above in header on xs) */}
                    {sub.highlight && (
                        <span className="xs:hidden inline-flex mb-2 rounded-md bg-[#FEF3C7] px-2 py-0.5 text-[10px] font-bold text-[#92400E]">
                            ★ KEY SUBJECT
                        </span>
                    )}

                    {/* Units list */}
                    <ul className="flex flex-col gap-[7px]">
                        {sub.units.map((u, i) => (
                            <li key={i} className="flex items-start gap-2 sm:gap-2.5">
                                <span
                                    className="mt-[3px] flex-shrink-0 rounded-[5px] px-1.5 py-px text-[9px] sm:text-[10px] font-extrabold text-white"
                                    style={{ background: semColor }}
                                >
                                    {sub.type === "T" ? `U${i + 1}` : "•"}
                                </span>
                                <span 
                                    className="font-[DM_Sans] text-[12px] sm:text-[13px] leading-[1.55] text-[#374151]"
                                    style={{ wordBreak: "break-word" }}
                                >
                                    {u}
                                </span>
                            </li>
                        ))}
                    </ul>

                    {/* Action buttons — stacked on mobile, row on sm+ */}
                    <div className="mt-4 flex flex-col sm:flex-row gap-2">
                        <button
                          type="button"
                          className="w-full sm:flex-1 py-2.5 px-4 rounded-[10px] border-none text-white text-[13px] font-bold font-[DM_Sans] transition-all duration-150 hover:opacity-90 hover:shadow-md active:scale-[0.98]"
                          style={{ background: semColor }}
                        >
                            📥 Download Notes PDF
                        </button>
                        <Link
                            href={`/syllabus/semester-${semNum}/${sub.slug}/`}
                            className="w-full sm:w-auto text-center py-2.5 px-4 rounded-[10px] text-[13px] font-semibold font-[DM_Sans] bg-transparent transition-all duration-150 hover:bg-[#F0F4FF]"
                            style={{
                                border: `1.5px solid ${semColor}`,
                                color: semColor,
                            }}
                        >
                            📌 View Full Page
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
