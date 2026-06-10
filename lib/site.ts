export const SITE = {
    name: "PharmaCode",
    shortName: "PharmaCode — B.Pharm NEP 2020",
    // Priority: custom domain > Vercel deploy URL > hardcoded fallback
    url: process.env.NEXT_PUBLIC_SITE_URL
        ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")
        : "https://pharmacode.vercel.app",
    tagline: "Code • Cure • Care",
    description:
        "Complete B.Pharm syllabus as per PCI NEP 2020 — all 8 semesters, unit-wise notes, Python & AI integration. Free study material for pharmacy students in India.",
    twitter: "@pharmacode",
    ogImage: "/logo.png",
    locale: "en_IN",
} as const;

export function absUrl(path: string): string {
    const base = SITE.url.replace(/\/$/, "");
    const p = path.startsWith("/") ? path : `/${path}`;
    return `${base}${p}`;
}
