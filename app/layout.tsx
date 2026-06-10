import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SITE, absUrl } from "@/lib/site";
import { organizationSchema, websiteSchema } from "@/lib/schema";

export const metadata: Metadata = {
    metadataBase: new URL(SITE.url),
    title: {
        // Google SERP mein ye dikhega — "PharmaCode" clearly branding ke saath
        default: "PharmaCode — B.Pharm Notes & NEP 2020 Syllabus | Free PDF",
        template: `%s | PharmaCode`,
    },
    description: SITE.description,
    applicationName: "PharmaCode",
    keywords: [
        // Primary high-volume keywords
        "B.Pharm notes",
        "B.Pharm notes free download",
        "B.Pharm syllabus NEP 2020",
        "B.Pharm syllabus PCI",
        "pharmacy notes PDF",
        "B.Pharm 1st year notes",
        "B.Pharm 2nd year notes",
        "B.Pharm 3rd year notes",
        "B.Pharm 4th year notes",
        "PharmaCode notes",
        // NEP/PCI specific
        "PCI NEP 2020 syllabus",
        "B.Pharm latest syllabus 2024 2025 2026",
        "B.Pharm all semester syllabus",
        "pharmacy student India free notes",
        // Subject codes
        "BP101T Python programming pharmacy",
        "BP104T human anatomy physiology",
        "BP202T biochemistry B.Pharm",
        "BP301T machine learning pharmacy",
        "BP402T medicinal chemistry",
        "BP503T innovation startup pharmacy",
        "BP604T AI pharmaceutical sciences",
        "BP602T biopharmaceutics pharmacokinetics",
        "BP705T pharmacovigilance",
        "BP801T AI ethics pharmacy",
        // Exam & career
        "GPAT preparation notes",
        "unit wise pharmacy notes India",
        "free pharmacy study material",
    ],
    authors: [{ name: "PharmaCode Team" }],
    creator: "PharmaCode",
    publisher: "PharmaCode",
    /* ── Favicon — feviicon 2 (cute pill character) ── */
    icons: {
        icon: [
            { url: "/favicon.png", type: "image/png", sizes: "32x32" },
            { url: "/favicon.png", type: "image/png", sizes: "16x16" },
            { url: "/favicon.png", type: "image/png", sizes: "192x192" },
            { url: "/favicon.svg", type: "image/svg+xml" },
        ],
        apple: [
            { url: "/favicon.png", sizes: "180x180", type: "image/png" },
        ],
        shortcut: "/favicon.png",
        other: [
            { rel: "mask-icon", url: "/favicon.svg" },
        ],
    },
    /* ── Open Graph — og-image.png (PharmaCode logo with text) Google Images mein dikhega ── */
    openGraph: {
        type: "website",
        siteName: "PharmaCode",
        locale: "en_IN",
        url: SITE.url,
        title: "PharmaCode — Free B.Pharm Notes & NEP 2020 Syllabus",
        description: SITE.description,
        images: [
            {
                // og-image.png = PharmaCode full logo (text + mascot) — Google Images mein dikhega
                url: absUrl("/og-image.png"),
                width: 1200,
                height: 630,
                alt: "PharmaCode — B.Pharm NEP 2020 Syllabus Free Notes India",
                type: "image/png",
            },
        ],
    },
    /* ── Twitter / X ── */
    twitter: {
        card: "summary_large_image",
        site: "@pharmacode",
        title: "PharmaCode — Free B.Pharm Notes & NEP 2020 Syllabus",
        description: SITE.description,
        images: [absUrl("/og-image.png")],
    },
    robots: {
        index: true,
        follow: true,
        nocache: false,
        googleBot: {
            index: true,
            follow: true,
            noimageindex: false,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    alternates: {
        canonical: SITE.url,
        languages: {
            "en-IN": SITE.url,
        },
    },
    verification: {
        google: [
            "xFzbcs5yurwIMxwumKXtPidOA6OoKT9GQtwupO8PDVI",
            "aZ5x_9YWedBpduYAm0wydHsPkkgDT7iOXcB4pN5T_So"
        ],
    },
};

export const viewport: Viewport = {
    themeColor: "#1A2B6B",
    width: "device-width",
    initialScale: 1,
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en-IN">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap"
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(organizationSchema()),
                    }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(websiteSchema()),
                    }}
                />
            </head>
            <body className="font-sans min-h-screen bg-[#FAFBFF]">
                <Navbar />
                <main className="w-full mx-auto">{children}</main>
                <Footer />
            </body>
        </html>
    );
}
