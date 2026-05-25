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
    { href: "/syllabus/semester-1/", label: "BP101T Python" },
    { href: "/syllabus/semester-6/", label: "BP604T AI Pharma" },
    { href: "/syllabus/semester-7/", label: "BP705T Pharmacovigilance" },
    { href: "/syllabus/semester-7/", label: "BP707T Reg Affairs" },
    { href: "/syllabus/semester-8/", label: "BP801T AI Ethics" },
];

export function Footer() {
    return (
        <footer className="mt-8 sm:mt-16 bg-[#0F1D5C] px-7 pb-7 pt-11 text-white">
            <div className="mx-auto max-w-[960px]">
                {/* ── Top grid ──────────────────────────────────── */}
                <div className="mb-9 grid gap-7 grid-cols-2 sm:grid-cols-2 md:grid-cols-4">

                    {/* Brand column with logo */}
                    <div className="col-span-2 sm:col-span-2 md:col-span-1">
                        <Link
                            href="/"
                            className="mb-3 flex items-center gap-2.5"
                            aria-label="PharmaCode home"
                        >
                            <Image
                                src="/logo.png"
                                alt="PharmaCode logo"
                                width={38}
                                height={38}
                                className="rounded-[9px] object-contain"
                            />
                            <span className="font-display text-[20px] font-black leading-none">
                                <span className="text-white">Pharma</span>
                                <span className="text-[#93C5FD]">Code</span>
                            </span>
                        </Link>
                        <p className="text-[12px] leading-[1.7] text-[#8B9CC8]">
                            Code • Cure • Care
                            <br />
                            B.Pharm NEP 2020 hub
                            <br />
                            <span className="text-[#6B7FA3]">pharmacode.in</span>
                        </p>
                    </div>

                    {/* Semesters */}
                    <div>
                        <div className="mb-2.5 font-display text-[13px] font-bold text-[#E0E7FF]">
                            Semesters
                        </div>
                        <div className="flex flex-col gap-1.5">
                            {SEMESTERS.map((s) => (
                                <Link
                                    key={s.num}
                                    href={`/syllabus/semester-${s.num}/`}
                                    className="block text-[12px] text-[#8B9CC8] hover:text-[#C7D2FE] transition-colors duration-150"
                                >
                                    Semester {s.num}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Resources */}
                    <div>
                        <div className="mb-2.5 font-display text-[13px] font-bold text-[#E0E7FF]">
                            Resources
                        </div>
                        <div className="flex flex-col gap-1.5">
                            {RESOURCES.map((r) => (
                                <Link
                                    key={r.href}
                                    href={r.href}
                                    className="block text-[12px] text-[#8B9CC8] hover:text-[#C7D2FE] transition-colors duration-150"
                                >
                                    {r.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Key Subjects */}
                    <div>
                        <div className="mb-2.5 font-display text-[13px] font-bold text-[#E0E7FF]">
                            Key Subjects
                        </div>
                        <div className="flex flex-col gap-1.5">
                            {KEY_SUBJECTS.map((k) => (
                                <Link
                                    key={k.label}
                                    href={k.href}
                                    className="block text-[12px] text-[#8B9CC8] hover:text-[#C7D2FE] transition-colors duration-150"
                                >
                                    {k.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Bottom bar ────────────────────────────────── */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#1E3280] pt-5 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row items-center gap-2">
                        <div className="flex items-center gap-2">
                            <Image
                                src="/logo.png"
                                alt=""
                                width={18}
                                height={18}
                                className="rounded-[4px] object-contain opacity-60"
                                aria-hidden
                            />
                            <span className="text-[11px] text-[#8B9CC8]">
                                © 2026 PharmaCode · pharmacode.in
                                <span className="hidden sm:inline"> · PCI NEP 2020 B.Pharm Syllabus</span>
                            </span>
                        </div>
                    </div>
                    <span className="text-[11px] text-[#6B7FA3]">
                        Made with 💊 for pharmacy students across India
                    </span>
                </div>
            </div>
        </footer>
    );
}
