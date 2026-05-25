import Link from "next/link";
import type { Semester } from "@/lib/types";
import { Star } from "lucide-react";

interface SemCardProps {
    sem: Semester;
}

export function SemCard({ sem }: SemCardProps) {
    const tCount = sem.subjects.filter((s) => s.type === "T").length;
    const pCount = sem.subjects.filter((s) => s.type === "P").length;
    const hasI = sem.subjects.some((s) => s.type === "I");
    const hasRP = sem.subjects.some((s) => s.type === "RP");
    const highlights = sem.subjects.filter((s) => s.highlight).slice(0, 2);

    return (
        <Link
            href={`/syllabus/semester-${sem.num}/`}
            className="lift ripple-container block rounded-[18px] border-[1.5px] border-[#E8EDFF] bg-white p-[16px] active:scale-[0.97]"
            style={
                {
                    ["--sem-bg" as string]: sem.bg,
                    ["--sem-color" as string]: sem.color,
                } as React.CSSProperties
            }
            aria-label={`Open Semester ${sem.num} — ${sem.label}`}
        >
            {/* Top row: number badge + credits */}
            <div className="mb-3 flex items-center justify-between">
                <span
                    className="flex h-[40px] w-[40px] items-center justify-center rounded-[12px] font-display text-[17px] font-extrabold text-white shadow-sm"
                    style={{ background: sem.color }}
                >
                    {sem.num}
                </span>
                <span
                    className="rounded-full px-2.5 py-[3px] font-display text-[11px] font-extrabold"
                    style={{ background: sem.badge, color: sem.color }}
                >
                    {sem.credits} Cr
                </span>
            </div>

            {/* Title + label */}
            <div className="mb-1 font-display text-[15px] font-extrabold text-primary leading-tight">
                Semester {sem.num}
            </div>
            <div
                className="mb-3 text-[11px] font-semibold leading-snug"
                style={{ color: sem.color }}
            >
                {sem.label}
            </div>

            {/* Subject type badges */}
            <div className="flex flex-wrap gap-1.5">
                <span className="rounded-md bg-[#EEF2FF] px-2 py-0.5 text-[10px] font-semibold text-[#4338CA]">
                    {tCount}T
                </span>
                {pCount > 0 && (
                    <span className="rounded-md bg-[#ECFDF5] px-2 py-0.5 text-[10px] font-semibold text-[#065F46]">
                        {pCount}P
                    </span>
                )}
                {hasI && (
                    <span className="rounded-md bg-[#FFF7ED] px-2 py-0.5 text-[10px] font-semibold text-[#92400E]">
                        Intern
                    </span>
                )}
                {hasRP && (
                    <span className="rounded-md bg-[#FAF5FF] px-2 py-0.5 text-[10px] font-semibold text-[#581C87]">
                        Research
                    </span>
                )}
            </div>

            {/* Highlight subjects */}
            {highlights.length > 0 && (
                <div className="mt-2.5 border-t border-[#E8EDFF] pt-2.5">
                    {highlights.map((s) => (
                        <div key={s.code} className="mb-0.5 flex items-center gap-1 text-[10px] text-[#6B7FA3]">
                            <Star size={9} strokeWidth={2.5} className="fill-[#6B7FA3] shrink-0" />
                            {s.code}
                        </div>
                    ))}
                </div>
            )}
        </Link>
    );
}
