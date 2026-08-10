"use client";

import { useState, useEffect } from "react";
import { Clock, Flame, TrendingUp } from "lucide-react";

export function CountdownTimer({ variant = "card" }: { variant?: "card" | "hero" }) {
    const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 42, seconds: 18 });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Calculate target time: midnight or 6 hours from now
        const getNextMidnight = () => {
            const now = new Date();
            const tomorrow = new Date(now);
            tomorrow.setHours(23, 59, 59, 999);
            return tomorrow.getTime();
        };

        const target = getNextMidnight();

        const updateTimer = () => {
            const now = new Date().getTime();
            const diff = target - now;

            if (diff <= 0) {
                setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft({ hours, minutes, seconds });
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatNum = (num: number) => String(num).padStart(2, "0");

    if (variant === "hero") {
        return (
            <div className="fade-up inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-1.5 mb-5 flex-wrap">
                <span className="pulse-dot w-2 h-2 rounded-full bg-[#EF4444]" />
                <span className="text-[12px] sm:text-[13px] font-semibold text-white/90">
                    🔥 Launch Price ₹79 Ends In:
                </span>
                {mounted ? (
                    <div className="flex items-center gap-1 font-mono font-bold text-[#FCA5A5] text-[12px] sm:text-[13px] bg-black/20 px-2 py-0.5 rounded-md">
                        <span>{formatNum(timeLeft.hours)}h</span>:
                        <span>{formatNum(timeLeft.minutes)}m</span>:
                        <span>{formatNum(timeLeft.seconds)}s</span>
                    </div>
                ) : (
                    <span className="font-mono text-[#FCA5A5] text-[12px]">05h:42m:18s</span>
                )}
            </div>
        );
    }

    return (
        <div className="bg-[#FFF1F2] border-b border-[#FECDD3] px-4 py-3 text-center">
            <div className="flex items-center justify-center gap-1.5 text-[#9F1239] font-display text-[12px] sm:text-[13px] font-black mb-1">
                <Flame size={15} className="text-[#E11D48] animate-bounce shrink-0" />
                <span>LIMITED TIME OFFER — LAUNCH PRICE ₹79</span>
            </div>

            {/* Timer boxes */}
            <div className="flex items-center justify-center gap-1.5 my-1.5">
                <div className="flex flex-col items-center">
                    <span className="bg-[#E11D48] text-white font-mono text-[14px] sm:text-[16px] font-extrabold px-2 py-1 rounded-[6px] shadow-sm min-w-[34px] text-center">
                        {mounted ? formatNum(timeLeft.hours) : "05"}
                    </span>
                    <span className="text-[9px] font-bold text-[#9F1239] uppercase mt-0.5">Hours</span>
                </div>
                <span className="font-bold text-[#E11D48] text-[16px] -mt-3.5">:</span>
                <div className="flex flex-col items-center">
                    <span className="bg-[#E11D48] text-white font-mono text-[14px] sm:text-[16px] font-extrabold px-2 py-1 rounded-[6px] shadow-sm min-w-[34px] text-center">
                        {mounted ? formatNum(timeLeft.minutes) : "42"}
                    </span>
                    <span className="text-[9px] font-bold text-[#9F1239] uppercase mt-0.5">Mins</span>
                </div>
                <span className="font-bold text-[#E11D48] text-[16px] -mt-3.5">:</span>
                <div className="flex flex-col items-center">
                    <span className="bg-[#E11D48] text-white font-mono text-[14px] sm:text-[16px] font-extrabold px-2 py-1 rounded-[6px] shadow-sm min-w-[34px] text-center">
                        {mounted ? formatNum(timeLeft.seconds) : "18"}
                    </span>
                    <span className="text-[9px] font-bold text-[#9F1239] uppercase mt-0.5">Secs</span>
                </div>
            </div>

            <p className="font-sans text-[11px] sm:text-[12px] text-[#BE123C] font-semibold flex items-center justify-center gap-1 mt-1 flex-wrap">
                <TrendingUp size={13} className="shrink-0" />
                <span>Special ₹79 price is <strong className="underline">exclusive for LinkedIn Followers</strong> (₹99 for non-followers)</span>
            </p>
        </div>
    );
}
