import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SITE } from "@/lib/site";
import { organizationSchema, websiteSchema } from "@/lib/schema";

export const metadata: Metadata = {
    metadataBase: new URL(SITE.url),
    title: {
        default: `${SITE.name} — B.Pharm Syllabus NEP 2020 | Free Notes`,
        template: `%s | ${SITE.name}`,
    },
    description: SITE.description,
    applicationName: SITE.name,
    keywords: [
        // Broad intent
        "B.Pharm syllabus",
        "B.Pharm syllabus NEP 2020",
        "B.Pharm 1st year syllabus",
        "B.Pharm 2nd year syllabus",
        "B.Pharm 3rd year syllabus",
        "B.Pharm 4th year syllabus",
        "pharmacy notes PDF download India",
        "B.Pharm notes free download",
        "PCI syllabus 2025 2026",
        "PCI NEP 2020 B.Pharm",
        // Subject codes — high search volume
        "BP101T Python programming pharmacy",
        "BP104T human anatomy physiology",
        "BP106T pharmaceutical inorganic chemistry",
        "BP202T biochemistry B.Pharm",
        "BP301T machine learning pharmacy",
        "BP402T medicinal chemistry",
        "BP503T innovation startup pharmacy",
        "BP604T AI pharmaceutical sciences",
        "BP602T biopharmaceutics pharmacokinetics",
        "BP705T pharmacovigilance",
        "BP801T AI ethics pharmacy",
        // Exam & career
        "GPAT 2027 preparation syllabus",
        "pharmacy student India study material",
        "unit wise pharmacy notes",
        "B.Pharm complete syllabus all semesters",
    ],
    authors: [{ name: "PharmaCode Team" }],
    /* ── Favicon / icons ── */
    icons: {
        icon: [
            { url: "/favicon.png", type: "image/png" },
        ],
        apple: [
            { url: "/favicon.png", sizes: "180x180", type: "image/png" },
        ],
        shortcut: "/favicon.png",
    },
    /* ── Open Graph ── */
    openGraph: {
        type: "website",
        siteName: SITE.name,
        locale: SITE.locale,
        url: SITE.url,
        title: `${SITE.name} — B.Pharm Syllabus NEP 2020`,
        description: SITE.description,
        images: [
            {
                url: "/logo.png",
                width: 1254,
                height: 1254,
                alt: "PharmaCode — B.Pharm NEP 2020 Syllabus",
            },
        ],
    },
    /* ── Twitter / X ── */
    twitter: {
        card: "summary_large_image",
        title: `${SITE.name} — B.Pharm Syllabus NEP 2020`,
        description: SITE.description,
        images: ["/logo.png"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    alternates: {
        canonical: SITE.url,
    },
    verification: {
        google: "xFzbcs5yurwIMxwumKXtPidOA6OoKT9GQtwupO8PDVI",
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
