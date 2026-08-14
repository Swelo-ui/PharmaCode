import type { Metadata } from "next";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { absUrl } from "@/lib/site";
import { ShieldCheck, Lock, EyeOff, FileText } from "lucide-react";

export const metadata: Metadata = {
    title: "Privacy Policy — PharmaCode",
    description:
        "PharmaCode Privacy Policy — transparent information on data protection, zero registration policy, and analytics.",
    alternates: { canonical: absUrl("/privacy-policy/") },
    keywords: ["PharmaCode privacy policy", "data protection B.Pharm platform"],
    openGraph: {
        title: "Privacy Policy — PharmaCode",
        description: "Zero registration required. Completely free access to B.Pharm notes.",
        url: absUrl("/privacy-policy/"),
        images: [{ url: absUrl("/og-image.png"), width: 1200, height: 630, alt: "Privacy Policy PharmaCode" }],
    },
};

export default function PrivacyPolicyPage() {
    const breadcrumbs = [
        { name: "Home", href: "/" },
        { name: "Privacy Policy", href: "/privacy-policy/" },
    ];

    return (
        <div className="mx-auto w-full max-w-[960px] px-3.5 xs:px-5 sm:px-8 py-6 sm:py-10">
            <JsonLd data={breadcrumbSchema(breadcrumbs)} />
            <Breadcrumb items={breadcrumbs} />

            <div className="rounded-[20px] bg-white border border-[#E8EDFF] p-4.5 xs:p-6 sm:p-10 shadow-sm mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-[12px] bg-[#EEF2FF] flex items-center justify-center text-[#4C6EF5] shrink-0">
                        <ShieldCheck size={22} />
                    </div>
                    <div>
                        <h1 className="font-display text-[22px] sm:text-[30px] font-black text-[#1A2B6B] leading-tight">
                            Privacy Policy
                        </h1>
                        <p className="font-[DM_Sans] text-[11.5px] sm:text-[12px] text-[#9CA3AF]">
                            Last updated: August 2026
                        </p>
                    </div>
                </div>

                <p className="font-[DM_Sans] text-[13px] sm:text-[14px] text-[#4B5563] leading-relaxed mb-6">
                    At PharmaCode, we believe that educational resources should be openly accessible without harvesting personal data. This Privacy Policy outlines how we treat information on our website.
                </p>

                <div className="space-y-5 sm:space-y-6 border-t border-[#F0F4FF] pt-5 sm:pt-6">
                    <section className="flex items-start gap-3 sm:gap-4">
                        <div className="p-2 sm:p-2.5 rounded-[10px] bg-[#F0FDF4] text-[#166534] shrink-0 mt-0.5">
                            <Lock size={18} />
                        </div>
                        <div>
                            <h2 className="font-display text-[15px] sm:text-[16px] font-bold text-[#1A2B6B] mb-1">
                                1. Zero Account Registration &amp; No Paywalls
                            </h2>
                            <p className="font-[DM_Sans] text-[12.5px] sm:text-[13px] text-[#6B7FA3] leading-relaxed">
                                We do not require users to register, log in, or provide personal details such as names, phone numbers, or passwords to view syllabus guides or download PDF notes.
                            </p>
                        </div>
                    </section>

                    <section className="flex items-start gap-3 sm:gap-4">
                        <div className="p-2 sm:p-2.5 rounded-[10px] bg-[#EFF6FF] text-[#1D4ED8] shrink-0 mt-0.5">
                            <EyeOff size={18} />
                        </div>
                        <div>
                            <h2 className="font-display text-[15px] sm:text-[16px] font-bold text-[#1A2B6B] mb-1">
                                2. Anonymized Analytics
                            </h2>
                            <p className="font-[DM_Sans] text-[12.5px] sm:text-[13px] text-[#6B7FA3] leading-relaxed">
                                We use privacy-friendly site analytics to understand total page views and popular subjects across semesters. This data is fully aggregated and anonymized, without personal identifier tracking or invasive advertising cookies.
                            </p>
                        </div>
                    </section>

                    <section className="flex items-start gap-3 sm:gap-4">
                        <div className="p-2 sm:p-2.5 rounded-[10px] bg-[#FAF5FF] text-[#6B21A8] shrink-0 mt-0.5">
                            <FileText size={18} />
                        </div>
                        <div>
                            <h2 className="font-display text-[15px] sm:text-[16px] font-bold text-[#1A2B6B] mb-1">
                                3. Direct PDF Downloads
                            </h2>
                            <p className="font-[DM_Sans] text-[12.5px] sm:text-[13px] text-[#6B7FA3] leading-relaxed">
                                All PDF downloads are delivered directly through fast content delivery networks (CDNs). We do not install third-party trackers inside PDF files or inject unwanted popups.
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
