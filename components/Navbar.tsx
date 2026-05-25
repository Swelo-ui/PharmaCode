"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { clsx } from "@/lib/format";

const NAV_ITEMS = [
    { href: "/", label: "Home" },
    { href: "/syllabus/", label: "Syllabus" },
    { href: "/notes/", label: "Notes" },
    { href: "/blog/", label: "Blog" },
];

export function Navbar() {
    const pathname = usePathname() || "/";

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/";
        return pathname.startsWith(href);
    };

    return (
        <nav
            className="sticky top-0 z-50 flex h-[62px] items-center justify-between border-b border-[#E0E8FF] bg-white/95 px-5 backdrop-blur sm:px-7"
            style={{ WebkitBackdropFilter: "blur(16px)" }}
        >
            {/* ── Brand / Logo ── */}
            <Link
                href="/"
                className="flex items-center gap-2.5"
                aria-label="PharmaCode — B.Pharm NEP 2020 home"
            >
                <Image
                    src="/logo.png"
                    alt="PharmaCode logo"
                    width={36}
                    height={36}
                    className="rounded-[9px] object-contain"
                    priority
                />
                <span className="font-display text-[19px] font-black leading-none">
                    <span className="text-primary">Pharma</span>
                    <span className="text-secondary">Code</span>
                </span>
            </Link>

            {/* ── Nav links ── */}
            <div className="flex items-center gap-0.5">
                {NAV_ITEMS.map((item) => {
                    const active = isActive(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={clsx(
                                "rounded-[9px] px-[13px] py-2 text-[13px] transition-colors",
                                active
                                    ? "bg-[#EEF2FF] font-bold text-secondary"
                                    : "font-medium text-[#6B7FA3] hover:bg-[#F4F6FF]",
                            )}
                        >
                            {item.label}
                        </Link>
                    );
                })}
                <Link
                    href="/notes/"
                    className="ml-1.5 rounded-[10px] bg-primary px-[16px] py-2 text-[13px] font-bold text-white hover:bg-[#16245A]"
                >
                    📥 Notes
                </Link>
            </div>
        </nav>
    );
}
