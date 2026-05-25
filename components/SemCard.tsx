import Link from "next/link";
import type { Semester } from "@/lib/types";

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
            className="lift block rounded-[18px] border-2 border-[#E8EDFF] bg-white p-[18px] hover:bg-[var(--sem-bg)] hover:border-[var(--sem-color)]"
            style={
                {
                    ["--sem-bg" as string]: sem.bg,
                    ["--sem-color" as string]: sem.color,
                } as React.CSSProperties
            }
            aria-label={`Open Semester ${sem.num} — ${sem.label}`}
        >
            <div className="mb-3.5 flex items-center justify-between">
                <span
                    className="flex h-[42px] w-[42px] items-center justify-center rounded-[12px] font-display text-[18px] font-extrabold text-white"
                    style={{ background: sem.color }}
                >
                    {sem.num}
                </span>
                <span
                    className="rounded-full px-3 py-1 font-display text-[12px] font-extrabold"
                    style={{ background: sem.badge, color: sem.color }}
                >
                    {sem.credits} Cr
                </span>
            </div>
            <div className="mb-1 font-display text-[16px] font-extrabold text-primary">
                Semester {sem.num}
            </div>
            <div
                className="mb-2.5 text-[12px] font-semibold"
                style={{ color: sem.color }}
            >
                {sem.label}
            </div>
            <div className="flex flex-wrap gap-1.5">
                <span className="rounded-md bg-[#EEF2FF] px-2 py-0.5 text-[11px] font-semibold text-[#4338CA]">
                    {tCount}T
                </span>
                {pCount > 0 && (
                    <span className="rounded-md bg-[#ECFDF5] px-2 py-0.5 text-[11px] font-semibold text-[#065F46]">
                        {pCount}P
                    </span>
                )}
                {hasI && (
                    <span className="rounded-md bg-[#FFF7ED] px-2 py-0.5 text-[11px] font-semibold text-[#92400E]">
                        Internship
                    </span>
                )}
                {hasRP && (
                    <span className="rounded-md bg-[#FAF5FF] px-2 py-0.5 text-[11px] font-semibold text-[#581C87]">
                        Research
                    </span>
                )}
            </div>
            {highlights.length > 0 && (
                <div className="mt-2.5 border-t border-[#E8EDFF] pt-2.5">
                    {highlights.map((s) => (
                        <div key={s.code} className="mb-0.5 text-[11px] text-[#6B7FA3]">
                            ★ {s.code}
                        </div>
                    ))}
                </div>
            )}
        </Link>
    );
}
