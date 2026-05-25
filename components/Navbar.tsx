"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { clsx } from "@/lib/format";
import { Home, BookOpen, FileText, PenLine, Download } from "lucide-react";

const NAV_ITEMS = [
    { href: "/", label: "Home", icon: Home },
    { href: "/syllabus/", label: "Syllabus", icon: BookOpen },
    { href: "/notes/", label: "Notes", icon: FileText },
    { href: "/blog/", label: "Blog", icon: PenLine },
];

export function Navbar() {
    const pathname = usePathname() || "/";
    const [menuOpen, setMenuOpen] = useState(false);

    /* Close drawer on route change */
    useEffect(() => {
        setMenuOpen(false);
    }, [pathname]);

    /* Close drawer on Escape key */
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") setMenuOpen(false);
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);

    /* Prevent body scroll when drawer is open */
    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [menuOpen]);

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/";
        return pathname.startsWith(href);
    };

    return (
        <>
            {/* ── NAVBAR BAR ─────────────────────────────────────── */}
            <nav
                className="sticky top-0 z-50 flex h-[62px] items-center justify-between border-b border-[#E0E8FF] bg-white/95 px-5 backdrop-blur sm:px-7"
                style={{ WebkitBackdropFilter: "blur(16px)" }}
            >
                {/* ── Brand / Logo ── */}
                <Link
                    href="/"
                    className="flex items-center gap-1.5 shrink-0"
                    aria-label="PharmaCode — B.Pharm NEP 2020 home"
                >
                    <Image
                        src="/nav-icon.png"
                        alt="PharmaCode logo"
                        width={46}
                        height={46}
                        className="rounded-[10px] object-contain"
                        style={{ width: "46px", height: "46px" }}
                        priority
                    />
                    <span className="font-display text-[19px] font-black leading-none">
                        <span className="text-primary">Pharma</span>
                        <span className="text-secondary">Code</span>
                    </span>
                </Link>

                {/* ── Desktop nav links (hidden on mobile) ── */}
                <div className="hidden md:flex items-center gap-0.5">
                    {NAV_ITEMS.map((item) => {
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={clsx(
                                    "rounded-[9px] px-[13px] py-2 text-[13px] transition-colors duration-200",
                                    active
                                        ? "bg-[#EEF2FF] font-bold text-secondary"
                                        : "font-medium text-[#6B7FA3] hover:bg-[#F4F6FF] hover:text-primary",
                                )}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                    <Link
                        href="/notes/"
                        className="ml-1.5 flex items-center gap-1.5 rounded-[10px] bg-primary px-[16px] py-2 text-[13px] font-bold text-white hover:bg-[#16245A] hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
                    >
                        <Download size={14} strokeWidth={2.5} />
                        Notes
                    </Link>
                </div>

                {/* ── Hamburger button (visible on mobile only) ── */}
                <button
                    onClick={() => setMenuOpen((v) => !v)}
                    aria-label={menuOpen ? "Close menu" : "Open menu"}
                    aria-expanded={menuOpen}
                    className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-[10px] gap-[5px] transition-colors duration-200 hover:bg-[#EEF2FF] focus:outline-none"
                >
                    {/* Animated hamburger bars */}
                    <span
                        className={`block w-5 h-[2px] bg-primary rounded-full transition-all duration-300 origin-center
                            ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`}
                    />
                    <span
                        className={`block w-5 h-[2px] bg-primary rounded-full transition-all duration-200
                            ${menuOpen ? "opacity-0 scale-x-0" : ""}`}
                    />
                    <span
                        className={`block w-5 h-[2px] bg-primary rounded-full transition-all duration-300 origin-center
                            ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`}
                    />
                </button>
            </nav>

            {/* ── MOBILE DRAWER ─────────────────────────────────── */}
            {menuOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40 bg-black/30 md:hidden"
                        onClick={() => setMenuOpen(false)}
                        aria-hidden="true"
                    />

                    {/* Drawer panel */}
                    <div className="fixed top-[62px] left-0 right-0 z-40 md:hidden bg-white border-b border-[#E0E8FF] shadow-xl drawer-enter">
                        <div className="max-w-[480px] mx-auto px-5 py-4 flex flex-col gap-1">
                            {NAV_ITEMS.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={clsx(
                                            "flex items-center gap-3 px-4 py-3 rounded-[12px] text-[15px] font-sans transition-all duration-150",
                                            isActive(item.href)
                                                ? "font-bold bg-[#EEF2FF] text-secondary"
                                                : "font-medium text-primary hover:bg-[#F4F6FF]",
                                        )}
                                    >
                                        <Icon size={18} strokeWidth={2} />
                                        {item.label}
                                        {isActive(item.href) && (
                                            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-secondary" />
                                        )}
                                    </Link>
                                );
                            })}

                            {/* Mobile CTA */}
                            <Link
                                href="/notes/"
                                onClick={() => setMenuOpen(false)}
                                className="mt-2 flex items-center justify-center gap-2 px-4 py-3 rounded-[12px] bg-primary text-white text-[14px] font-bold font-sans"
                            >
                                <Download size={16} strokeWidth={2.5} />
                                Download Free Notes
                            </Link>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
