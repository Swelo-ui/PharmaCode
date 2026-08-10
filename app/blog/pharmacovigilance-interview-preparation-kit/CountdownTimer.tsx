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
                <div className="fade-up inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-1.5 mb-5 flex-wrap">
                    <span className="pulse-dot w-2 h-2 rounded-full bg-[#F59E0B]" />
                    <span className="text-[12px] sm:text-[13px] font-semibold text-white/90">
                        ⚡ Launch Offer Expired — Standard Price ₹99 Active
                    </span>
                </div>
            );
        }
        return (
            <div className="fade-up inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-1.5 mb-5 flex-wrap">
                <span className="pulse-dot w-2 h-2 rounded-full bg-[#EF4444]" />
                <span className="text-[12px] sm:text-[13px] font-semibold text-white/90">
                    🔥 ₹79 Launch Price Ends Tonight (1 AM):
                </span>
                {mounted ? (
                    <div className="flex items-center gap-1 font-mono font-bold text-[#FCA5A5] text-[12px] sm:text-[13px] bg-black/20 px-2 py-0.5 rounded-md">
                        <span>{formatNum(timeLeft.hours)}h</span>:
                        <span>{formatNum(timeLeft.minutes)}m</span>:
                        <span>{formatNum(timeLeft.seconds)}s</span>
                    </div>
                ) : (
                    <span className="font-mono text-[#FCA5A5] text-[12px]">13h:36m:00s</span>
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
   DYNAMIC CTA BUTTON — ₹79 or ₹99
   ═══════════════════════════════════════════════ */
export function DynamicCTAButton({ variant = "hero" }: { variant?: "hero" | "inline" }) {
    const { isExpired } = useCountdown();
    const price = isExpired ? "99" : "79";

    if (variant === "hero") {
        return (
            <a
                href="#get-guide"
                className="btn-press inline-flex items-center gap-2 rounded-[12px] bg-white px-6 py-3 text-[14px] sm:text-[15px] font-bold text-primary shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]"
            >
                <Sparkles size={18} strokeWidth={2} className="text-secondary" />
                Get the Guide — ₹{price}
                <span className="ml-0.5">→</span>
            </a>
        );
    }

    return null;
}
