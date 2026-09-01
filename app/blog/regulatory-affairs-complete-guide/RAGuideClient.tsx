"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
    ChevronDown, X, ChevronLeft, ChevronRight, Copy, Check,
    ShoppingCart, Mail, Clock, Shield, Smartphone, Eye, ExternalLink,
    Lock, Sparkles, ArrowRight, BookOpen, GraduationCap, TrendingUp,
    CheckCircle2, XCircle, Zap, Award
} from "lucide-react";

/* ─────────────────────────────────────────
   FAQ ACCORDION
───────────────────────────────────────── */
export interface FAQItem {
    q: string;
    a: string;
}

export function FAQAccordion({ items }: { items: FAQItem[] }) {
    const [open, setOpen] = useState<number | null>(null);

    return (
        <div className="space-y-3 max-w-[760px] mx-auto">
            {items.map((item, i) => (
                <div
                    key={i}
                    className="rounded-[14px] border border-[#E8EDFF] bg-white overflow-hidden transition-all duration-200 hover:border-[#C7D2FE]"
                >
                    <button
                        type="button"
                        onClick={() => setOpen(open === i ? null : i)}
                        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-1 cursor-pointer"
                        aria-expanded={open === i}
                    >
                        <span className="flex items-center gap-3 flex-1 min-w-0">
                            <span className="shrink-0 w-6 h-6 rounded-full bg-[#EEF2FF] text-secondary text-[11px] font-black flex items-center justify-center">
                                Q
                            </span>
                            <span className="font-display text-[13px] sm:text-[14px] font-extrabold text-primary leading-tight">
                                {item.q}
                            </span>
                        </span>
                        <ChevronDown
                            size={16}
                            strokeWidth={2.5}
                            className={`shrink-0 text-secondary transition-transform duration-200 ${open === i ? "rotate-180" : ""}`}
                        />
                    </button>
                    {open === i && (
                        <div className="accordion-enter px-5 pb-4 pl-14 border-t border-[#F1F5F9] pt-3">
                            <p className="font-sans text-[12px] sm:text-[13px] text-[#6B7FA3] leading-[1.7]">
                                {item.a}
                            </p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

/* ─────────────────────────────────────────
   UNIFORM PROTECTED DEMO GRID + LIGHTBOX
───────────────────────────────────────── */
export interface DemoImageItem {
    num: string;
    title: string;
    subtitle: string;
    src: string;
    alt: string;
}

export function RADemoGrid({ pages }: { pages: DemoImageItem[] }) {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const openLightbox = (index: number) => {
        setActiveIndex(index);
        setLightboxOpen(true);
    };

    const closeLightbox = useCallback(() => setLightboxOpen(false), []);

    const prev = useCallback(() => {
        setActiveIndex((i) => (i === 0 ? pages.length - 1 : i - 1));
    }, [pages.length]);

    const next = useCallback(() => {
        setActiveIndex((i) => (i === pages.length - 1 ? 0 : i + 1));
    }, [pages.length]);

    useEffect(() => {
        if (!lightboxOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeLightbox();
            if (e.key === "ArrowLeft") prev();
            if (e.key === "ArrowRight") next();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [lightboxOpen, closeLightbox, prev, next]);

    useEffect(() => {
        if (lightboxOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [lightboxOpen]);

    return (
        <>
            {/* Grid of 6 uniform preview cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-[960px] mx-auto">
                {pages.map((page, i) => (
                    <div
                        key={page.num}
                        onClick={() => openLightbox(i)}
                        onContextMenu={(e) => e.preventDefault()}
                        className="group relative rounded-[16px] bg-white border border-[#E2E8F0] overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer block select-none"
                    >
                        {/* Protected image container with uniform aspect ratio */}
                        <div className="relative aspect-[3/4] w-full bg-[#F8FAFC] overflow-hidden">
                            <Image
                                src={page.src}
                                alt={page.alt}
                                width={400}
                                height={533}
                                draggable={false}
                                className="w-full h-full object-cover object-top pointer-events-none select-none transition-transform duration-300 group-hover:scale-105"
                                loading="lazy"
                            />

                            {/* Hover overlay with preview icon */}
                            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-all duration-200 flex items-center justify-center">
                                <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 rounded-full bg-white/95 px-3.5 py-1.5 shadow-lg flex items-center gap-1.5 text-primary text-[11px] font-display font-extrabold">
                                    <Eye size={13} strokeWidth={2.5} className="text-secondary" />
                                    <span>Preview Page</span>
                                </div>
                            </div>

                            {/* Demo number badge */}
                            <div className="absolute top-2.5 left-2.5 z-10 rounded-md bg-black/70 backdrop-blur-sm px-2.5 py-1 text-[10px] font-extrabold text-white uppercase tracking-wider shadow-sm flex items-center gap-1">
                                <span>Demo {page.num}</span>
                            </div>

                            {/* Lock badge */}
                            <div className="absolute top-2.5 right-2.5 z-10 rounded-md bg-white/90 backdrop-blur-sm px-2 py-0.5 text-[9px] font-bold text-primary shadow-sm flex items-center gap-1">
                                <Lock size={10} strokeWidth={2.5} className="text-secondary" />
                                <span>Sample Page</span>
                            </div>
                        </div>

                        {/* Text info footer */}
                        <div className="p-3.5 bg-white border-t border-[#F1F5F9]">
                            <h3 className="font-display text-[13px] font-extrabold text-primary mb-0.5 line-clamp-1 flex items-center justify-between">
                                <span>{page.num} · {page.title}</span>
                                <ArrowRight size={13} strokeWidth={2.5} className="text-secondary opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-1" />
                            </h3>
                            <p className="font-sans text-[11px] text-[#64748B] line-clamp-1">
                                {page.subtitle}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Fullscreen Lightbox Modal */}
            {lightboxOpen && (
                <div
                    className="fixed inset-0 z-[999] bg-black/90 flex items-center justify-center p-3 sm:p-6"
                    onClick={closeLightbox}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Document Page Preview"
                >
                    <button
                        type="button"
                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/15 flex items-center justify-center text-white hover:bg-white/25 transition-colors z-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
                        onClick={closeLightbox}
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>

                    <button
                        type="button"
                        className="absolute left-2 sm:left-6 w-10 h-10 rounded-full bg-white/15 flex items-center justify-center text-white hover:bg-white/25 transition-colors z-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            prev();
                        }}
                        aria-label="Previous Page"
                    >
                        <ChevronLeft size={22} />
                    </button>

                    <div
                        className="relative max-w-[92vw] max-h-[88vh] flex flex-col items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative rounded-[14px] overflow-hidden shadow-2xl border border-white/20 max-h-[75vh]">
                            <Image
                                src={pages[activeIndex].src}
                                alt={pages[activeIndex].alt}
                                width={800}
                                height={1067}
                                className="object-contain max-h-[75vh] w-auto bg-[#F8FAFC]"
                                priority
                            />
                        </div>

                        <div className="text-center mt-3">
                            <p className="text-white font-display text-[13px] font-bold">
                                {pages[activeIndex].num} · {pages[activeIndex].title}
                            </p>
                            <p className="text-white/60 font-sans text-[11px] mt-0.5">
                                {pages[activeIndex].subtitle}
                            </p>
                            <div className="flex items-center justify-center gap-1.5 mt-2">
                                {pages.map((_, dotIdx) => (
                                    <button
                                        key={dotIdx}
                                        type="button"
                                        onClick={() => setActiveIndex(dotIdx)}
                                        className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                                            dotIdx === activeIndex ? "bg-[#6EE7B7] w-5" : "bg-white/40 hover:bg-white/70"
                                        }`}
                                        aria-label={`Go to slide ${dotIdx + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="absolute right-2 sm:right-6 w-10 h-10 rounded-full bg-white/15 flex items-center justify-center text-white hover:bg-white/25 transition-colors z-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            setActiveIndex((i) => (i === imagesLength - 1 ? 0 : i + 1));
                        }}
                        aria-label="Next Page"
                    >
                        <ChevronRight size={22} />
                    </button>
                </div>
            )}
        </>
    );
}

/* ─────────────────────────────────────────
   INTERACTIVE BURGER VS CAREER ASSET CARD
───────────────────────────────────────── */
export function BurgerVsLearningCard() {
    const [activeTab, setActiveTab] = useState<"both" | "burger" | "guide">("both");
    const [burgerBounced, setBurgerBounced] = useState(false);

    const triggerBurgerWiggle = () => {
        setBurgerBounced(true);
        setTimeout(() => setBurgerBounced(false), 800);
    };

    return (
        <div className="mt-12 rounded-[24px] bg-gradient-to-br from-[#FFF5F5] via-[#FFF9F2] to-[#F0FDF4] border-2 border-[#FED7AA] p-5 sm:p-8 max-w-[840px] mx-auto shadow-md relative overflow-hidden">
            {/* Header / Intro */}
            <div className="text-center max-w-[620px] mx-auto mb-6">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white border border-[#FDBA74] px-3.5 py-1 text-[11px] font-extrabold text-[#C2410C] uppercase tracking-wider mb-2 shadow-xs">
                    <Sparkles size={12} className="text-[#EA580C]" />
                    <span>The ₹89 Value Perspective</span>
                </div>
                <h3 className="font-display text-[20px] sm:text-[26px] font-black text-primary leading-tight mb-2">
                    Think About It This Way
                </h3>
                <p className="font-sans text-[13px] sm:text-[14px] text-[#475569] leading-[1.6]">
                    Compare what ₹89 buys you today vs. what it gives you for your pharmacy career.
                </p>
            </div>

            {/* Interactive Side-by-Side Comparison Container */}
            <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
                {/* ── BURGER CARD (Left) ── */}
                <div
                    onClick={triggerBurgerWiggle}
                    className={`md:col-span-5 rounded-[20px] bg-white border-2 transition-all duration-300 p-5 shadow-sm text-center relative cursor-pointer group hover:shadow-md ${
                        burgerBounced ? "border-[#EF4444] scale-[1.02]" : "border-[#FED7AA] hover:border-[#FB923C]"
                    }`}
                >
                    {/* Tag */}
                    <div className="inline-flex items-center gap-1 rounded-full bg-[#FFF1F2] border border-[#FECDD3] px-2.5 py-0.5 text-[10px] font-black text-[#BE123C] mb-3">
                        <Clock size={11} />
                        <span>Lasts ~10 Minutes</span>
                    </div>

                    {/* Stylized Illustrated Vector Burger */}
                    <div className="w-24 h-24 mx-auto mb-3 relative flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                        <svg
                            viewBox="0 0 100 100"
                            className={`w-full h-full drop-shadow-md transition-transform duration-300 ${
                                burgerBounced ? "animate-bounce" : ""
                            }`}
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            {/* Top Bun */}
                            <path
                                d="M15 42C15 22 30 14 50 14C70 14 85 22 85 42C85 43 15 43 15 42Z"
                                fill="#F59E0B"
                            />
                            <ellipse cx="50" cy="42" rx="35" ry="3" fill="#D97706" />
                            {/* Sesame Seeds */}
                            <ellipse cx="38" cy="24" rx="2" ry="1.2" fill="#FEF3C7" transform="rotate(-15 38 24)" />
                            <ellipse cx="52" cy="20" rx="2" ry="1.2" fill="#FEF3C7" />
                            <ellipse cx="64" cy="25" rx="2" ry="1.2" fill="#FEF3C7" transform="rotate(15 64 25)" />
                            <ellipse cx="45" cy="30" rx="2" ry="1.2" fill="#FEF3C7" transform="rotate(-5 45 30)" />
                            <ellipse cx="58" cy="31" rx="2" ry="1.2" fill="#FEF3C7" transform="rotate(10 58 31)" />
                            {/* Tomato Slices */}
                            <rect x="18" y="44" width="64" height="6" rx="3" fill="#EF4444" />
                            {/* Wavy Green Lettuce */}
                            <path
                                d="M12 51C17 48 21 54 26 51C31 48 35 54 40 51C45 48 49 54 54 51C59 48 63 54 68 51C73 48 77 54 82 51C85 49 88 52 88 52C88 54 12 54 12 51Z"
                                fill="#22C55E"
                            />
                            {/* Melting Yellow Cheese */}
                            <polygon points="16,54 84,54 75,63 55,60 45,64 30,59 22,63" fill="#FBBF24" />
                            {/* Brown Patty */}
                            <rect x="16" y="58" width="68" height="13" rx="6" fill="#78350F" />
                            {/* Bottom Bun */}
                            <path
                                d="M18 73C18 73 18 84 50 84C82 84 82 73 82 73H18Z"
                                fill="#F59E0B"
                            />
                            <ellipse cx="50" cy="73" rx="32" ry="2" fill="#D97706" />
                        </svg>
                    </div>

                    <h4 className="font-display text-[16px] font-black text-primary mb-1">
                        Fast Food Meal
                    </h4>
                    <p className="font-sans text-[12px] text-[#64748B] mb-3">
                        Single snack on the go
                    </p>

                    <div className="rounded-[12px] bg-[#FFF5F5] border border-[#FEE2E2] p-2.5 text-left space-y-1.5 text-[11px] font-sans">
                        <div className="flex items-center gap-1.5 text-[#991B1B]">
                            <XCircle size={13} className="shrink-0 text-[#EF4444]" />
                            <span>Gone &amp; forgotten by tomorrow</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[#991B1B]">
                            <XCircle size={13} className="shrink-0 text-[#EF4444]" />
                            <span>Zero impact on interviews or exams</span>
                        </div>
                    </div>
                </div>

                {/* ── VS BADGE (Center) ── */}
                <div className="md:col-span-1 flex flex-col items-center justify-center my-1 md:my-0">
                    <div className="w-10 h-10 rounded-full bg-primary text-[#6EE7B7] font-display text-[12px] font-black flex items-center justify-center shadow-lg border-2 border-white ring-4 ring-[#FED7AA]/50">
                        VS
                    </div>
                </div>

                {/* ── RA GUIDE ASSET (Right) ── */}
                <div className="md:col-span-5 rounded-[20px] bg-white border-2 border-[#86EFAC] p-5 shadow-sm text-center relative group hover:border-[#22C55E] hover:shadow-md transition-all duration-300">
                    {/* Tag */}
                    <div className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] px-2.5 py-0.5 text-[10px] font-black text-[#047857] mb-3">
                        <Sparkles size={11} />
                        <span>Permanent Career Asset</span>
                    </div>

                    {/* Stylized Guide Book Illustration */}
                    <div className="w-24 h-24 mx-auto mb-3 relative flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                        <div className="w-20 h-22 rounded-[12px] bg-gradient-to-br from-[#1A2B6B] to-[#4C6EF5] p-2.5 text-white flex flex-col justify-between shadow-xl border border-white/20 transform -rotate-3 group-hover:rotate-0 transition-transform">
                            <div className="flex justify-between items-start">
                                <span className="text-[8px] font-mono font-black text-[#6EE7B7] uppercase">PDF</span>
                                <GraduationCap size={14} className="text-[#93C5FD]" />
                            </div>
                            <div>
                                <p className="font-display text-[9px] font-black text-left leading-tight text-white">
                                    RA GUIDE
                                </p>
                                <p className="text-[7px] text-[#A7F3D0] font-sans text-left">20 Modules</p>
                            </div>
                            <div className="w-full h-1 bg-[#6EE7B7] rounded-full" />
                        </div>
                    </div>

                    <h4 className="font-display text-[16px] font-black text-primary mb-1">
                        RA Complete Guide
                    </h4>
                    <p className="font-sans text-[12px] text-secondary font-bold mb-3">
                        20-Section Structured Resource
                    </p>

                    <div className="rounded-[12px] bg-[#F0FDF4] border border-[#DCFCE7] p-2.5 text-left space-y-1.5 text-[11px] font-sans">
                        <div className="flex items-center gap-1.5 text-[#14532D]">
                            <CheckCircle2 size={13} className="shrink-0 text-[#10B981]" />
                            <span>Stays with you for interviews &amp; jobs</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[#14532D]">
                            <CheckCircle2 size={13} className="shrink-0 text-[#10B981]" />
                            <span>CDSCO, CTD/eCTD, NDA + 10 Q&amp;A</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Final Value Takeaway & Direct CTA */}
            <div className="mt-6 pt-5 border-t border-[#FED7AA]/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2.5 text-left">
                    <div className="w-8 h-8 rounded-full bg-[#10B981]/15 text-[#10B981] flex items-center justify-center shrink-0">
                        <TrendingUp size={16} strokeWidth={2.5} />
                    </div>
                    <p className="font-sans text-[12px] sm:text-[13px] text-[#374151] leading-[1.4]">
                        Invest in knowledge that stays useful long after the meal is over.
                    </p>
                </div>

                <a
                    href="#get-guide"
                    className="btn-press shrink-0 inline-flex items-center gap-2 rounded-[12px] bg-primary text-white px-5 py-2.5 text-[12px] sm:text-[13px] font-extrabold shadow-md hover:bg-[#1A2B6B] transition-all cursor-pointer"
                >
                    <span>Get Guide for ₹89</span>
                    <ArrowRight size={14} strokeWidth={2.5} />
                </a>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────
   STICKY MOBILE CTA
───────────────────────────────────────── */
export function StickyMobileCTA() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            setVisible(window.scrollY > 400);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <div
            className={`fixed bottom-0 left-0 right-0 z-50 md:hidden transition-transform duration-300 ${
                visible ? "translate-y-0" : "translate-y-full"
            }`}
        >
            <div className="bg-white border-t border-[#E8EDFF] px-4 py-3 shadow-2xl safe-area-inset">
                <div className="flex items-center gap-3 max-w-[480px] mx-auto">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-1.5">
                            <span className="font-display text-[20px] font-black text-primary">₹89</span>
                            <span className="text-[13px] text-[#9CA3AF] line-through font-sans">₹199</span>
                        </div>
                        <p className="text-[10px] text-[#6B7FA3] font-sans">Instant digital PDF access</p>
                    </div>
                    <a
                        href="#get-guide"
                        className="btn-press shrink-0 inline-flex items-center gap-2 rounded-[12px] bg-secondary px-5 py-3 text-[14px] font-bold text-white shadow-lg min-h-[44px] active:scale-95 transition-transform"
                    >
                        <ShoppingCart size={16} strokeWidth={2.5} />
                        Get Guide — ₹89
                    </a>
                </div>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────
   COPY UPI ID BUTTON (pharmacode@ybl)
───────────────────────────────────────── */
const UPI_ID = "pharmacode@ybl";

export function CopyUpiBox() {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(UPI_ID);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="mt-3.5 rounded-[14px] bg-[#F8FAFC] border border-[#E2E8F0] p-2.5 sm:p-3 max-w-[340px] mx-auto text-center shadow-xs">
            <div className="flex items-center justify-between gap-2 bg-white border border-[#CBD5E1] rounded-[10px] px-3 py-2">
                <div className="text-left overflow-hidden">
                    <span className="block text-[9px] font-bold text-[#64748B] uppercase tracking-wider">
                        UPI ID / VPA
                    </span>
                    <span className="font-mono text-[13px] sm:text-[14px] font-extrabold text-[#0F172A] select-all">
                        {UPI_ID}
                    </span>
                </div>
                <button
                    type="button"
                    onClick={handleCopy}
                    className="shrink-0 inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-[11px] font-bold text-white shadow-xs hover:bg-[#1A2B6B] active:scale-95 transition-all cursor-pointer"
                >
                    {copied ? (
                        <>
                            <Check size={12} strokeWidth={2.5} />
                            <span>Copied!</span>
                        </>
                    ) : (
                        <>
                            <Copy size={12} strokeWidth={2.5} />
                            <span>Copy UPI</span>
                        </>
                    )}
                </button>
            </div>
            <p className="text-[10px] text-[#64748B] mt-1.5 font-medium">
                Tap button to copy UPI ID &amp; pay directly via GPay / PhonePe / Paytm
            </p>
        </div>
    );
}

/* ─────────────────────────────────────────
   COPY EMAIL BOX (pharmacode.connect@gmail.com)
───────────────────────────────────────── */
const EMAIL_ADDRESS = "pharmacode.connect@gmail.com";

export function CopyEmailBox() {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(EMAIL_ADDRESS);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="rounded-[14px] bg-[#F0F4FF] border border-[#DDE6FF] p-4 text-center flex flex-col items-center justify-center gap-2">
            <div className="flex items-center justify-center gap-1.5 mb-0.5">
                <Clock size={14} className="text-secondary shrink-0" />
                <span className="font-display text-[11px] sm:text-[12px] font-bold text-[#6B7FA3] uppercase tracking-wider">
                    Send Payment Screenshot To
                </span>
            </div>
            <p className="font-display text-[14px] xs:text-[15px] sm:text-[16px] font-black text-primary select-all leading-tight">
                {EMAIL_ADDRESS}
            </p>
            <button
                type="button"
                onClick={handleCopy}
                className="shrink-0 inline-flex items-center justify-center gap-1.5 rounded-lg bg-white border border-[#C7D2FE] px-3.5 py-1.5 text-[12px] font-bold text-[#4C6EF5] hover:bg-[#EEF2FF] active:scale-95 transition-all shadow-xs cursor-pointer"
            >
                {copied ? (
                    <>
                        <Check size={13} strokeWidth={2.5} />
                        <span>Copied to Clipboard!</span>
                    </>
                ) : (
                    <>
                        <Copy size={13} strokeWidth={2.5} />
                        <span>Copy Email Address</span>
                    </>
                )}
            </button>
        </div>
    );
}
