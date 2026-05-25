"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { clsx } from "@/lib/format";
import { Home, BookOpen, FileText, PenLine, Download, X, Menu } from "lucide-react";

const NAV_ITEMS = [
    { href: "/", label: "Home", icon: Home },
    { href: "/syllabus/", label: "Syllabus", icon: BookOpen },
    { href: "/notes/", label: "Notes", icon: FileText },
    { href: "/blog/", label: "Blog", icon: PenLine },
];

export function Navbar() {
    const pathname = usePathname() || "/";
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    /* Scroll shadow */
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 4);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    /* Close drawer on route change */
    useEffect(() => { setMenuOpen(false); }, [pathname]);

    /* Escape key */
    useEffect(() => {
        const h = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
        window.addEventListener("keydown", h);
        return () => window.removeEventListener("keydown", h);
    }, []);

    /* Lock body scroll */
    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [menuOpen]);

    const isActive = (href: string) =>
        href === "/" ? pathname === "/" : pathname.startsWith(href);

    return (
        <>
            {/* ── NAV BAR ──────────────────────────────────────── */}
            <nav
                className={clsx(
                    "sticky top-0 z-50 flex h-[62px] items-center justify-between px-5 sm:px-7 transition-all duration-300",
                    scrolled
                        ? "bg-white/98 border-b border-[#E0E8FF] shadow-sm"
                        : "bg-white/95 border-b border-[#E0E8FF]",
                )}
                style={{ backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}
            >
                {/* Brand */}
                <Link
                    href="/"
                    className="btn-press flex items-center gap-1.5 shrink-0"
                    aria-label="PharmaCode home"
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

                {/* Desktop links */}
                <div className="hidden md:flex items-center gap-0.5">
                    {NAV_ITEMS.map(({ href, label }) => {
                        const active = isActive(href);
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={clsx(
                                    "rounded-[9px] px-[13px] py-2 text-[13px] transition-all duration-200",
                                    active
                                        ? "bg-[#EEF2FF] font-bold text-secondary"
                                        : "font-medium text-[#6B7FA3] hover:bg-[#F4F6FF] hover:text-primary",
                                )}
                            >
                                {label}
                            </Link>
                        );
                    })}
                    <Link
                        href="/notes/"
                        className="btn-press ml-2 flex items-center gap-1.5 rounded-[10px] bg-primary px-4 py-2 text-[13px] font-bold text-white transition-all duration-200 hover:bg-[#16245A] hover:shadow-md active:scale-95"
                    >
                        <Download size={14} strokeWidth={2.5} />
                        Notes
                    </Link>
                </div>

                {/* Hamburger — animated X ↔ Menu */}
                <button
                    onClick={() => setMenuOpen((v) => !v)}
                    aria-label={menuOpen ? "Close menu" : "Open menu"}
                    aria-expanded={menuOpen}
                    className="btn-press md:hidden flex items-center justify-center w-10 h-10 rounded-[10px] transition-colors duration-200 hover:bg-[#EEF2FF] active:bg-[#E0E8FF] focus:outline-none"
                >
                    <span className={clsx("transition-all duration-200", menuOpen ? "rotate-90 opacity-0 absolute" : "rotate-0 opacity-100")}>
                        <Menu size={20} strokeWidth={2} className="text-primary" />
                    </span>
                    <span className={clsx("transition-all duration-200", menuOpen ? "rotate-0 opacity-100" : "-rotate-90 opacity-0 absolute")}>
                        <X size={20} strokeWidth={2} className="text-primary" />
                    </span>
                </button>
            </nav>

            {/* ── MOBILE DRAWER ────────────────────────────────── */}
            {/* Backdrop */}
            <div
                className={clsx(
                    "fixed inset-0 z-40 md:hidden transition-all duration-300",
                    menuOpen ? "bg-black/30 pointer-events-auto" : "bg-transparent pointer-events-none",
                )}
                onClick={() => setMenuOpen(false)}
                aria-hidden="true"
            />

            {/* Drawer panel — always rendered, slides in/out */}
            <div
                className={clsx(
                    "fixed top-[62px] left-0 right-0 z-40 md:hidden bg-white border-b border-[#E0E8FF] shadow-xl transition-all duration-300",
                    menuOpen
                        ? "opacity-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 -translate-y-3 pointer-events-none",
                )}
            >
                <div className="max-w-[480px] mx-auto px-4 py-3 flex flex-col gap-1">
                    {NAV_ITEMS.map(({ href, label, icon: Icon }, i) => (
                        <Link
                            key={href}
                            href={href}
                            className={clsx(
                                "flex items-center gap-3 px-4 py-3.5 rounded-[12px] text-[15px] font-sans transition-all duration-150 active:scale-[0.98]",
                                isActive(href)
                                    ? "font-bold bg-[#EEF2FF] text-secondary"
                                    : "font-medium text-primary active:bg-[#F4F6FF]",
                            )}
                            style={{ transitionDelay: menuOpen ? `${i * 40}ms` : "0ms" }}
                        >
                            <span
                                className="flex h-8 w-8 items-center justify-center rounded-[8px]"
                                style={{ background: isActive(href) ? "#DDE8FF" : "#F4F6FF" }}
                            >
                                <Icon size={16} strokeWidth={2} />
                            </span>
                            {label}
                            {isActive(href) && (
                                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-secondary" />
                            )}
                        </Link>
                    ))}

                    {/* Mobile CTA */}
                    <Link
                        href="/notes/"
                        onClick={() => setMenuOpen(false)}
                        className="btn-press mt-1.5 flex items-center justify-center gap-2 px-4 py-3.5 rounded-[12px] bg-primary text-white text-[14px] font-bold font-sans shadow-md active:scale-[0.97] transition-transform duration-150"
                    >
                        <Download size={16} strokeWidth={2.5} />
                        Download Free Notes
                    </Link>
                </div>
            </div>
        </>
    );
}
