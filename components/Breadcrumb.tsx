import Link from "next/link";
import type { BreadcrumbItem } from "@/lib/schema";

interface BreadcrumbProps {
    items: BreadcrumbItem[];
    variant?: "default" | "light";
}

export function Breadcrumb({ items, variant = "default" }: BreadcrumbProps) {
    const isLight = variant === "light";
    return (
        <nav
            aria-label="Breadcrumb"
            className={`mb-4 flex flex-wrap items-center gap-1.5 text-[12px] ${isLight ? "text-white/60" : "text-[#9CA3AF]"}`}
        >
            {items.map((item, i) => {
                const isLast = i === items.length - 1;
                return (
                    <span key={item.href} className="flex items-center gap-1.5">
                        {isLast ? (
                            <span className={`font-semibold ${isLight ? "text-white" : "text-primary"}`} aria-current="page">
                                {item.name}
                            </span>
                        ) : (
                            <Link href={item.href} className={`${isLight ? "text-[#93C5FD] hover:text-white" : "text-secondary hover:underline"}`}>
                                {item.name}
                            </Link>
                        )}
                        {!isLast && <span aria-hidden className={isLight ? "text-white/40" : ""}>/</span>}
                    </span>
                );
            })}
        </nav>
    );
}
