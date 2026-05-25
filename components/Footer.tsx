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
        <footer className="mt-16 bg-[#0F1D5C] px-7 pb-7 pt-11 text-white">
            <div className="mx-auto max-w-[960px]">
                <div className="mb-9 grid gap-7 sm:grid-cols-2 md:grid-cols-4">

                    {/* ── Brand column with logo ── */}
                    <div>
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
                        <p className="text-[12px] leading-[1.7] text-[#6B7FA3]">
                            Code • Cure • Care
                            <br />
                            B.Pharm NEP 2020 hub
                            <br />
                            pharmacode.in
                        </p>
                    </div>

                    {/* ── Semesters ── */}
                    <div>
                        <div className="mb-2.5 font-display text-[13px] font-bold text-[#E0E7FF]">
                            Semesters
                        </div>
                        {SEMESTERS.map((s) => (
                            <Link
                                key={s.num}
                                href={`/syllabus/semester-${s.num}/`}
                                className="mb-1.5 block text-[12px] text-[#6B7FA3] hover:text-white"
                            >
                                Semester {s.num}
                            </Link>
                        ))}
                    </div>

                    {/* ── Resources ── */}
                    <div>
                        <div className="mb-2.5 font-display text-[13px] font-bold text-[#E0E7FF]">
                            Resources
                        </div>
                        {RESOURCES.map((r) => (
                            <Link
                                key={r.href}
                                href={r.href}
                                className="mb-1.5 block text-[12px] text-[#6B7FA3] hover:text-white"
                            >
                                {r.label}
                            </Link>
                        ))}
                    </div>

                    {/* ── Key Subjects ── */}
                    <div>
                        <div className="mb-2.5 font-display text-[13px] font-bold text-[#E0E7FF]">
                            Key Subjects
                        </div>
                        {KEY_SUBJECTS.map((k) => (
                            <Link
                                key={k.label}
                                href={k.href}
                                className="mb-1.5 block text-[12px] text-[#6B7FA3] hover:text-white"
                            >
                                {k.label}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* ── Bottom bar ── */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 border-t border-[#1A2B6B] pt-5">
                    <div className="flex items-center gap-2">
                        <Image
                            src="/logo.png"
                            alt=""
                            width={18}
                            height={18}
                            className="rounded-[4px] object-contain opacity-60"
                            aria-hidden
                        />
                        <span className="text-[11px] text-[#374151]">
                            © 2026 PharmaCode · pharmacode.in · PCI NEP 2020 B.Pharm Syllabus
                        </span>
                    </div>
                    <span className="text-[11px] text-[#374151]">
                        Made with 💊 for pharmacy students across India
                    </span>
                </div>
            </div>
        </footer>
    );
}
