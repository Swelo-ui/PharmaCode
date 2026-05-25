import Link from "next/link";
import type { BreadcrumbItem } from "@/lib/schema";

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
    return (
        <nav
            aria-label="Breadcrumb"
            className="mb-5 flex flex-wrap items-center gap-1.5 text-[12px] text-[#9CA3AF]"
        >
            {items.map((item, i) => {
                const isLast = i === items.length - 1;
                return (
                    <span key={item.href} className="flex items-center gap-1.5">
                        {isLast ? (
                            <span className="font-semibold text-primary" aria-current="page">
                                {item.name}
                            </span>
                        ) : (
                            <Link href={item.href} className="text-secondary hover:underline">
                                {item.name}
                            </Link>
                        )}
                        {!isLast && <span aria-hidden>/</span>}
                    </span>
                );
            })}
        </nav>
    );
}
