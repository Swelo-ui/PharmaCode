import type { Metadata } from "next";
import Link from "next/link";
import { SEMESTERS } from "@/lib/syllabus";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { absUrl } from "@/lib/site";

export const metadata: Metadata = {
    title: "B.Pharm Notes PDF Free Download — All Semesters",
    description:
        "Download free B.Pharm notes as per PCI NEP 2020 syllabus. All 8 semesters, 50+ subjects, no login required. Unit-wise PDF notes for every theory subject.",
    alternates: { canonical: absUrl("/notes/") },
    openGraph: {
        title: "B.Pharm Notes PDF Free Download | PharmaCode",
        description:
            "Free B.Pharm PDF notes for all 8 semesters. PCI NEP 2020 syllabus. No login.",
        url: absUrl("/notes/"),
    },
};

export default function NotesPage() {
    const breadcrumbs = [
        { name: "Home", href: "/" },
        { name: "Notes", href: "/notes/" },
    ];

    return (
        <div className="mx-auto max-w-[960px] px-5 py-9">
            <JsonLd data={breadcrumbSchema(breadcrumbs)} />
            <Breadcrumb items={breadcrumbs} />

            <h1 className="mb-2 font-display text-[32px] font-black text-primary">
                📥 B.Pharm Notes — Free Download
            </h1>
            <p className="mb-7 text-[14px] text-[#6B7FA3]">
                PCI NEP 2020 · All 8 Semesters · PDF format · No login required
            </p>

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 md:grid-cols-3">
                {SEMESTERS.flatMap((sem) =>
                    sem.subjects
                        .filter((s) => s.type === "T" && s.units.length > 0)
                        .slice(0, 2)
                        .map((s) => (
                            <article
                                key={sem.num + s.code}
                                className="flex flex-col gap-2.5 rounded-[14px] border border-[#E8EDFF] bg-white p-[18px]"
                            >
                                <div className="flex justify-between">
                                    <span
                                        className="rounded-md px-2.5 py-[3px] text-[11px] font-bold"
                                        style={{ background: sem.badge, color: sem.color }}
                                    >
                                        Sem {sem.num}
                                    </span>
                                    {s.highlight && (
                                        <span className="rounded-md bg-[#FEF9C3] px-2 py-[3px] text-[10px] font-bold text-[#854D0E]">
                                            ★ KEY SUBJECT
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <div
                                        className="mb-1 font-mono text-[11px]"
                                        style={{ color: sem.color }}
                                    >
                                        {s.code}
                                    </div>
                                    <Link
                                        href={`/syllabus/semester-${sem.num}/${s.slug}/`}
                                        className="block text-[13px] font-semibold leading-tight text-primary hover:underline"
                                    >
                                        {s.name}
                                    </Link>
                                </div>
                                <div className="flex justify-between text-[11px] text-[#9CA3AF]">
                                    <span>📄 PDF · ~2.4 MB · {s.units.length} Units</span>
                                    <span>↓ 1.4k</span>
                                </div>
                                <button
                                    type="button"
                                    className="w-full rounded-[10px] py-2.5 text-[12px] font-bold text-white"
                                    style={{ background: sem.color }}
                                >
                                    📥 Download Free
                                </button>
                            </article>
                        )),
                )}
            </div>
        </div>
    );
}
