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
            className="lift mb-2.5 overflow-hidden rounded-[14px] border bg-white"
            style={{
                borderColor: open ? `${semColor}55` : "#E8EDFF",
                borderWidth: 1.5,
            }}
        >
            <button
                type="button"
                onClick={() => canExpand && setOpen((o) => !o)}
                className={clsx(
                    "flex w-full items-center gap-2.5 px-[18px] py-3.5 text-left",
                    canExpand ? "cursor-pointer" : "cursor-default",
                    open ? "bg-[#F8FAFF]" : "bg-white",
                )}
                aria-expanded={open}
            >
                <span
                    className="flex-shrink-0 whitespace-nowrap rounded-md px-2.5 py-[3px] font-mono text-[11px] font-bold"
                    style={{ background: tm.bg, color: tm.color }}
                >
                    {sub.code}
                </span>
                <span className="flex-1 text-[14px] font-semibold leading-tight text-primary">
                    {sub.name}
                </span>
                <span className="flex flex-shrink-0 items-center gap-1.5">
                    {sub.highlight && (
                        <span className="rounded-md bg-[#FEF3C7] px-2 py-0.5 text-[11px] font-bold text-[#92400E]">
                            ★ KEY
                        </span>
                    )}
                    <span className="rounded-lg bg-[#F0F4FF] px-2.5 py-[3px] text-[12px] font-bold text-secondary">
                        {sub.credits}cr
                    </span>
                    {canExpand && (
                        <span
                            className={clsx(
                                "chev inline-block text-[14px] text-[#9CA3AF]",
                                open && "open",
                            )}
                            aria-hidden
                        >
                            ▾
                        </span>
                    )}
                </span>
            </button>

            {open && (
                <div className="border-t border-[#EEF2FF] px-[18px] pb-4 pt-3">
                    <ul className="flex flex-col gap-[7px]">
                        {sub.units.map((u, i) => (
                            <li key={i} className="flex items-start gap-2.5">
                                <span
                                    className="mt-[3px] flex-shrink-0 rounded-[5px] px-1.5 py-px text-[10px] font-extrabold text-white"
                                    style={{ background: semColor }}
                                >
                                    {sub.type === "T" ? `U${i + 1}` : "•"}
                                </span>
                                <span className="text-[13px] leading-[1.55] text-[#374151]">
                                    {u}
                                </span>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-3.5 flex flex-wrap gap-2">
                        <button
                            type="button"
                            className="min-w-[140px] flex-1 rounded-[10px] px-3.5 py-2.5 text-[13px] font-bold text-white"
                            style={{ background: semColor }}
                        >
                            📥 Download Notes PDF
                        </button>
                        <Link
                            href={`/syllabus/semester-${semNum}/${sub.slug}/`}
                            className="rounded-[10px] border-[1.5px] bg-transparent px-3.5 py-2.5 text-[13px] font-semibold"
                            style={{ borderColor: semColor, color: semColor }}
                        >
                            📌 View Full Page
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
