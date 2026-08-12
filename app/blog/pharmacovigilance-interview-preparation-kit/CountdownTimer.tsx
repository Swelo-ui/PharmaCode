"use client";

import { useState, useEffect } from "react";
import { Clock, Flame, TrendingUp, Sparkles, ExternalLink, AlertCircle } from "lucide-react";

const LINKEDIN_POST_URL = "https://www.linkedin.com/posts/pharmacode-edu_pharmacovigilance-pharmajobs-pharmacareers-activity-7491846601469173760-IEc3?utm_source=share&utm_medium=member_android&rcm=ACoAAFJJusgB3neGi-tKhJzWlgrA6W4nkyJxXH4";

// Fixed Expiry: August 11, 2026 at 01:00:00 AM IST
const OFFER_EXPIRY_TIMESTAMP = new Date("2026-08-11T01:00:00+05:30").getTime();

function useCountdown() {
    const [timeLeft, setTimeLeft] = useState({ hours: 13, minutes: 36, seconds: 0 });
    const [isExpired, setIsExpired] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        const updateTimer = () => {
            const now = Date.now();
            const diff = OFFER_EXPIRY_TIMESTAMP - now;

            if (diff <= 0) {
                setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
                setIsExpired(true);
                return;
            }

            setIsExpired(false);
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            setTimeLeft({ hours, minutes, seconds });
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, []);

    return { timeLeft, isExpired, mounted };
}

/* ═══════════════════════════════════════════════
   HERO BADGE — shows in the hero section
   ═══════════════════════════════════════════════ */
export function CountdownTimer({ variant = "card" }: { variant?: "card" | "hero" }) {
    const { timeLeft, isExpired, mounted } = useCountdown();
    const formatNum = (num: number) => String(num).padStart(2, "0");

    if (variant === "hero") {
        if (isExpired) {
            return (
                <div className="fade-up flex flex-wrap items-center gap-2 mb-5">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F59E0B]/25 border border-[#F59E0B]/40 px-3.5 py-1 text-[11px] font-extrabold text-[#FCD34D] uppercase tracking-wider shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" />
                        ⚡ Standard Price Active
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-3.5 py-1 text-[11px] font-extrabold text-white/90 uppercase tracking-wider">
                        Complete Guide — ₹99
                    </span>
                </div>
            );
        }
        return (
            <div className="fade-up flex flex-wrap items-center gap-2 mb-5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EF4444]/25 border border-[#EF4444]/40 px-3.5 py-1 text-[11px] font-extrabold text-[#FCA5A5] uppercase tracking-wider shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-ping" />
                    🔥 ₹79 Launch Price Active
                </span>
                {mounted ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-3.5 py-1 text-[11px] font-extrabold text-white uppercase tracking-wider font-mono">
                        <Clock size={12} className="text-[#FCA5A5]" />
                        {formatNum(timeLeft.hours)}h {formatNum(timeLeft.minutes)}m {formatNum(timeLeft.seconds)}s
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-3.5 py-1 text-[11px] font-extrabold text-white uppercase tracking-wider">
                        Limited Time Offer
                    </span>
                )}
            </div>
        );
    }

    /* ═══════════════════════════════════════════════
       CARD VARIANT — timer banner above the price header
       ═══════════════════════════════════════════════ */
    if (isExpired) {
        return (
            <div className="bg-[#FEF3C7] border-b border-[#FDE68A] px-4 py-3 text-center">
                <div className="flex items-center justify-center gap-1.5 text-[#92400E] font-display text-[12px] sm:text-[13px] font-black mb-0.5">
                    <AlertCircle size={15} className="text-[#D97706] shrink-0" />
                    <span>LAUNCH OFFER HAS ENDED — CURRENT PRICE IS ₹99</span>
                </div>
                <p className="font-sans text-[11px] sm:text-[12px] text-[#A16207] font-semibold">
                    Follow PharmaCode on LinkedIn to get notified about future exclusive discounts!
                </p>
            </div>
        );
    }

    return (
        <div className="bg-[#FFF1F2] border-b border-[#FECDD3] px-4 py-3 text-center">
            <div className="flex items-center justify-center gap-1.5 text-[#9F1239] font-display text-[12px] sm:text-[13px] font-black mb-1">
                <Flame size={15} className="text-[#E11D48] animate-bounce shrink-0" />
                <span>LIMITED TIME LAUNCH OFFER — ₹79 ONLY (ENDS AT 1 AM TONIGHT)</span>
            </div>

            {/* Timer boxes */}
            <div className="flex items-center justify-center gap-1.5 my-1.5">
                <div className="flex flex-col items-center">
                    <span className="bg-[#E11D48] text-white font-mono text-[14px] sm:text-[16px] font-extrabold px-2 py-1 rounded-[6px] shadow-sm min-w-[34px] text-center">
                        {mounted ? formatNum(timeLeft.hours) : "13"}
                    </span>
                    <span className="text-[9px] font-bold text-[#9F1239] uppercase mt-0.5">Hours</span>
                </div>
                <span className="font-bold text-[#E11D48] text-[16px] -mt-3.5">:</span>
                <div className="flex flex-col items-center">
                    <span className="bg-[#E11D48] text-white font-mono text-[14px] sm:text-[16px] font-extrabold px-2 py-1 rounded-[6px] shadow-sm min-w-[34px] text-center">
                        {mounted ? formatNum(timeLeft.minutes) : "36"}
                    </span>
                    <span className="text-[9px] font-bold text-[#9F1239] uppercase mt-0.5">Mins</span>
                </div>
                <span className="font-bold text-[#E11D48] text-[16px] -mt-3.5">:</span>
                <div className="flex flex-col items-center">
                    <span className="bg-[#E11D48] text-white font-mono text-[14px] sm:text-[16px] font-extrabold px-2 py-1 rounded-[6px] shadow-sm min-w-[34px] text-center">
                        {mounted ? formatNum(timeLeft.seconds) : "00"}
                    </span>
                    <span className="text-[9px] font-bold text-[#9F1239] uppercase mt-0.5">Secs</span>
                </div>
            </div>

            <p className="font-sans text-[11px] sm:text-[12px] text-[#BE123C] font-semibold flex items-center justify-center gap-1 mt-1 flex-wrap">
                <TrendingUp size={13} className="shrink-0" />
                <span>₹79 launch price valid till 1 AM tonight for LinkedIn Followers (₹99 afterwards)</span>
            </p>
        </div>
    );
}

/* ═══════════════════════════════════════════════
   DYNAMIC PRICING HEADER — price changes on expiry
   ═══════════════════════════════════════════════ */
export function DynamicPriceHeader() {
    const { isExpired } = useCountdown();

    if (isExpired) {
        return (
            <div className="bg-gradient-to-r from-[#B45309] to-[#D97706] px-6 py-5 text-center">
                <div className="flex items-center justify-center gap-2 mb-1 flex-wrap">
                    <span className="text-[13px] text-white/60 line-through font-sans">₹199 Regular</span>
                    <span className="text-[13px] text-white/80 line-through font-sans">₹79 Expired</span>
                    <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-black text-white">REGULAR DISCOUNT PRICE</span>
                </div>
                <div className="font-display text-[38px] sm:text-[44px] font-black text-white leading-none my-1">
                    ₹99
                </div>
                <p className="text-[12px] text-white/80 font-sans">One-time payment · Complete 44-page PDF guide</p>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-r from-[#4C6EF5] to-[#7B9BF7] px-6 py-5 text-center">
            <div className="flex items-center justify-center gap-2 mb-1 flex-wrap">
                <span className="text-[13px] text-white/60 line-through font-sans">₹199 Regular</span>
                <span className="text-[13px] text-white/80 line-through font-sans">₹99 Standard</span>
                <span className="rounded-full bg-[#EF4444] px-2.5 py-0.5 text-[11px] font-black text-white animate-pulse">FOLLOWERS LAUNCH PRICE</span>
            </div>
            <div className="font-display text-[38px] sm:text-[44px] font-black text-white leading-none my-1">
                ₹79
            </div>
            <p className="text-[12px] text-white/80 font-sans">One-time payment · Complete 44-page PDF guide</p>
        </div>
    );
}

/* ═══════════════════════════════════════════════
   DYNAMIC LINKEDIN BOX — changes text on expiry
   ═══════════════════════════════════════════════ */
export function DynamicLinkedInBox() {
    const { isExpired } = useCountdown();

    if (isExpired) {
        return (
            <div className="bg-[#FEF3C7] border-b border-[#FDE68A] px-5 py-3.5 text-center">
                <div className="flex items-center justify-center gap-1.5 text-[#92400E] font-display text-[12px] sm:text-[13px] font-extrabold mb-1">
                    <AlertCircle size={14} className="text-[#D97706] shrink-0" />
                    <span>Launch offer ₹79 has expired. Current price is ₹99.</span>
                </div>
                <p className="font-sans text-[11px] sm:text-[12px] text-[#A16207] leading-[1.5]">
                    Follow PharmaCode on LinkedIn to get notified about future special discounts.
                </p>
                <a
                    href={LINKEDIN_POST_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-press inline-flex items-center gap-1.5 mt-2 rounded-full bg-[#0A66C2] px-3.5 py-1 text-[11px] font-bold text-white shadow-sm hover:bg-[#084e96] transition-colors"
                >
                    <ExternalLink size={12} />
                    Follow PharmaCode on LinkedIn ↗
                </a>
            </div>
        );
    }

    return (
        <div className="bg-[#EFF6FF] border-b border-[#BFDBFE] px-5 py-3.5 text-center">
            <div className="flex items-center justify-center gap-1.5 text-[#1E40AF] font-display text-[12px] sm:text-[13px] font-extrabold mb-1">
                <Sparkles size={14} className="text-[#2563EB] shrink-0" />
                <span>₹79 Special Price is Exclusive for LinkedIn Followers!</span>
            </div>
            <p className="font-sans text-[11px] sm:text-[12px] text-[#1E3A8A] leading-[1.5]">
                Please note: The discounted ₹79 rate applies to PharmaCode LinkedIn followers <em>(follower status is cross-checked upon email verification)</em>. Non-followers pay ₹99. Offer valid till 1 AM tonight.
            </p>
            <a
                href={LINKEDIN_POST_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-press inline-flex items-center gap-1.5 mt-2 rounded-full bg-[#0A66C2] px-3.5 py-1 text-[11px] font-bold text-white shadow-sm hover:bg-[#084e96] transition-colors"
            >
                <ExternalLink size={12} />
                Follow PharmaCode on LinkedIn ↗
            </a>
        </div>
    );
}

/* ═══════════════════════════════════════════════
   DYNAMIC CTA BUTTON — Shows ₹99 (standard price)
   ═══════════════════════════════════════════════ */
export function DynamicCTAButton({ variant = "hero" }: { variant?: "hero" | "inline" }) {
    if (variant === "hero") {
        return (
            <a
                href="#get-guide"
                className="btn-press inline-flex items-center gap-2 rounded-[12px] bg-white px-6 py-3 text-[14px] sm:text-[15px] font-bold text-primary shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]"
            >
                <Sparkles size={18} strokeWidth={2} className="text-secondary" />
                Get the Guide — ₹99
                <span className="ml-0.5">→</span>
            </a>
        );
    }

    return null;
}

/* ═══════════════════════════════════════════════
   COPY EMAIL BOX — Responsive & Mobile Friendly
   ═══════════════════════════════════════════════ */
export function CopyEmailBox() {
    const [copied, setCopied] = useState(false);
    const email = "pharmacode.connect@gmail.com";

    const handleCopy = () => {
        navigator.clipboard.writeText(email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="rounded-[12px] bg-[#F0F4FF] border border-[#DDE6FF] p-3.5 sm:p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1.5">
                <Clock size={14} className="text-secondary shrink-0" />
                <span className="font-display text-[11px] sm:text-[12px] font-bold text-[#6B7FA3] uppercase tracking-wider">
                    Send Payment Screenshot To
                </span>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mt-1">
                <p className="font-display text-[13px] xs:text-[15px] sm:text-[17px] font-black text-primary break-all select-all leading-tight">
                    {email}
                </p>
                <button
                    type="button"
                    onClick={handleCopy}
                    className="shrink-0 inline-flex items-center gap-1 rounded-md bg-white border border-[#C7D2FE] px-2.5 py-1 text-[11px] font-bold text-[#4C6EF5] hover:bg-[#EEF2FF] transition-all shadow-xs"
                >
                    {copied ? "Copied! ✓" : "Copy Email"}
                </button>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════
   COPY UPI BOX — Designed for Android & Mobile
   ═══════════════════════════════════════════════ */
export function CopyUpiBox() {
    const [copied, setCopied] = useState(false);
    const upiId = "pharmacode@ybl";

    const handleCopy = () => {
        navigator.clipboard.writeText(upiId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="mt-3.5 rounded-[14px] bg-[#F8FAFC] border border-[#E2E8F0] p-2.5 sm:p-3 max-w-[340px] mx-auto text-center shadow-xs">
            <div className="flex items-center justify-between gap-2 bg-white border border-[#CBD5E1] rounded-[10px] px-3 py-2">
                <div className="text-left overflow-hidden">
                    <span className="block text-[9px] font-bold text-[#64748B] uppercase tracking-wider">
                        UPI ID / VPA
                    </span>
                    <span className="font-mono text-[13px] sm:text-[14px] font-extrabold text-[#0F172A] select-all">
                        {upiId}
                    </span>
                </div>
                <button
                    type="button"
                    onClick={handleCopy}
                    className="shrink-0 inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-[11px] font-bold text-white shadow-xs hover:bg-[#1A2B6B] active:scale-95 transition-all"
                >
                    {copied ? "Copied! ✓" : "Copy UPI"}
                </button>
            </div>
            <p className="text-[10px] text-[#64748B] mt-1.5 font-medium">
                Tap button to copy UPI ID &amp; pay directly via GPay / PhonePe / Paytm
            </p>
        </div>
    );
}


