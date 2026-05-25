export const SITE = {
    name: "PharmaCode",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://pharmacode.in",
    tagline: "Code • Cure • Care",
    description:
        "Complete B.Pharm syllabus as per PCI NEP 2020 — all 8 semesters, unit-wise notes, Python & AI integration. Free study material for pharmacy students.",
    twitter: "@pharmacode",
    ogImage: "/og-default.png",
    locale: "en_IN",
} as const;

export function absUrl(path: string): string {
    const base = SITE.url.replace(/\/$/, "");
    const p = path.startsWith("/") ? path : `/${path}`;
    return `${base}${p}`;
}
