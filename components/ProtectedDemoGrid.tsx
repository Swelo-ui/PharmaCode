"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export interface DemoPageItem {
    num: string;
    title: string;
    url: string;
    subtitle?: string;
}

interface ProtectedDemoGridProps {
    pages: DemoPageItem[];
    variant?: "grid" | "promo";
    targetHref?: string;
}

export function ProtectedDemoGrid({
    pages,
    variant = "grid",
    targetHref = "#get-guide",
}: ProtectedDemoGridProps) {
    const isPromo = variant === "promo";

    return (
        <div className={isPromo ? "grid grid-cols-2 sm:grid-cols-4 gap-3.5" : "grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4"}>
            {pages.map((page) => {
                const href = isPromo ? `${targetHref}#demo-preview` : targetHref;
                return (
                    <Link
                        key={page.num}
                        href={href}
                        className="group relative rounded-[16px] bg-white border border-[#E2E8F0] overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 block select-none"
                    >
                        {/* Protected image container with transparent overlay preventing download/right click */}
                        <div
                            onContextMenu={(e) => e.preventDefault()}
                            className="relative aspect-[3/4] w-full bg-[#F1F5F9] overflow-hidden select-none"
                        >
                            <Image
                                src={page.url}
                                alt={`PharmaCode PV Guide Demo Page ${page.num} — ${page.title}`}
                                width={340}
                                height={450}
                                draggable={false}
                                className="w-full h-full object-cover pointer-events-none select-none transition-transform duration-300 group-hover:scale-105"
                            />
                            {/* Overlay protection div */}
                            <div className="absolute inset-0 z-10 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
                            
                            {/* Demo Watermark Tag */}
                            <div className="absolute top-2.5 left-2.5 z-20 rounded-md bg-black/65 backdrop-blur-sm px-2 py-0.5 text-[10px] font-extrabold text-white uppercase tracking-wider shadow-sm">
                                Demo {page.num}
                            </div>
                        </div>

                        <div className="p-3.5 bg-white border-t border-[#F1F5F9]">
                            <h3 className="font-display text-[12px] sm:text-[13px] font-extrabold text-primary mb-0.5 line-clamp-1 flex items-center justify-between">
                                <span>{page.num} · {page.title}</span>
                                {isPromo && <ArrowRight size={12} className="text-[#3B82F6] shrink-0" />}
                            </h3>
                            {page.subtitle && (
                                <p className="font-sans text-[10px] sm:text-[11px] text-[#64748B] line-clamp-1">
                                    {page.subtitle}
                                </p>
                            )}
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
