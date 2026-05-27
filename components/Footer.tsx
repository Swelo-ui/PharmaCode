import Link from "next/link";
import Image from "next/image";
import { SEMESTERS } from "@/lib/syllabus";

const RESOURCES = [
    { href: "/notes/", label: "Free Notes" },
    { href: "/blog/", label: "Blog" },
    { href: "/about/", label: "About" },
    { href: "/contribute/", label: "Contribute" },
    { href: "/privacy-policy/", label: "Privacy" },
];

const KEY_SUBJECTS = [
    { href: "/syllabus/semester-1/bp101t-basics-of-python-programming-for-pharmaceutical-sciences/", label: "BP101T · Python Programming" },
    { href: "/syllabus/semester-6/bp604t-ai-applications-in-pharmaceutical-sciences/", label: "BP604T · AI in Pharma" },
    { href: "/syllabus/semester-7/bp705t-pharmacovigilance/", label: "BP705T · Pharmacovigilance" },
    { href: "/syllabus/semester-7/bp707t-regulatory-affairs/", label: "BP707T · Regulatory Affairs" },
    { href: "/syllabus/semester-8/bp801t-ethical-considerations-and-translational-applications-of-ai-in-pharmacy/", label: "BP801T · AI Ethics" },
];

export function Footer() {
    return (
        <footer className="bg-[#0F1D5C] text-white">

            {/* ── Main content ─────────────────────────────── */}
            <div className="mx-auto max-w-[960px] px-5 sm:px-6 pt-10 pb-8">

                {/* ── Brand block — full width on mobile ───────── */}
                <div className="flex items-center gap-3 mb-2">
                    <div className="shrink-0 w-[44px] h-[44px] rounded-[12px] overflow-hidden bg-white flex items-center justify-center shadow-md">
                        <Image
                            src="/logo.png"
                            alt="PharmaCode logo"
                            width={36}
                            height={36}
                            className="object-contain"
                        />
                    </div>
                    <div>
                        <span className="font-[Nunito] text-[22px] font-black leading-none tracking-tight">
                            <span className="text-white">Pharma</span>
                            <span className="text-[#93C5FD]">Code</span>
                        </span>
                        <div className="flex items-center gap-2 mt-[4px]">
                            {(["Code", "Cure", "Care"] as const).map((w, i) => (
                                <span
                                    key={w}
                                    className="font-[DM_Sans] text-[12px] font-extrabold"
                                    style={{ color: ["#93C5FD", "#6EE7B7", "#FCA5A5"][i] }}
                                >
                                    • {w}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <p className="font-[DM_Sans] text-[12px] text-[#6B7FA3] mb-8 leading-[1.6]">
                    India&apos;s first B.Pharm NEP 2020 syllabus platform — unit-wise notes,
                    AI subjects, and free PDF resources for pharmacy students.
                </p>

                {/* ── Links grid ───────────────────────────────── */}
                {/* Mobile: 2 cols | sm: 3 cols | md: 4 cols */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-8 mb-10">

                    {/* Semesters */}
                    <div>
                        <p className="font-[Nunito] text-[12px] font-extrabold text-[#E0E7FF] uppercase tracking-wider mb-3">
                            Semesters
                        </p>
                        <div className="flex flex-col gap-2">
                            {SEMESTERS.map((s) => (
                                <Link
                                    key={s.num}
                                    href={`/syllabus/semester-${s.num}/`}
                                    className="font-[DM_Sans] text-[13px] text-[#8B9CC8] hover:text-white transition-colors duration-150"
                                >
                                    Semester {s.num}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Resources */}
                    <div>
                        <p className="font-[Nunito] text-[12px] font-extrabold text-[#E0E7FF] uppercase tracking-wider mb-3">
                            Resources
                        </p>
                        <div className="flex flex-col gap-2">
                            {RESOURCES.map((r) => (
                                <Link
                                    key={r.href}
                                    href={r.href}
                                    className="font-[DM_Sans] text-[13px] text-[#8B9CC8] hover:text-white transition-colors duration-150"
                                >
                                    {r.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Key Subjects — spans 2 cols on mobile so text doesn't crush */}
                    <div className="col-span-2 sm:col-span-1 md:col-span-2">
                        <p className="font-[Nunito] text-[12px] font-extrabold text-[#E0E7FF] uppercase tracking-wider mb-3">
                            Key Subjects
                        </p>
                        <div className="flex flex-col gap-2">
                            {KEY_SUBJECTS.map((k) => (
                                <Link
                                    key={k.label}
                                    href={k.href}
                                    className="font-[DM_Sans] text-[13px] text-[#8B9CC8] hover:text-white transition-colors duration-150"
                                >
                                    {k.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                </div>

                {/* ── Divider ──────────────────────────────────── */}
                <div className="h-px bg-[#1E3280] mb-5" />

                {/* ── Bottom bar ───────────────────────────────── */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
                    <p className="font-[DM_Sans] text-[11px] text-[#6B7FA3]">
                        © 2026 PharmaCode · pharmacode.in · PCI NEP 2020 B.Pharm Syllabus
                    </p>
                    <p className="font-[DM_Sans] text-[11px] text-[#6B7FA3]">
                        Made for pharmacy students across India
                    </p>
                </div>

            </div>
        </footer>
    );
}
