import type { Metadata } from "next";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { absUrl } from "@/lib/site";
import { CopyEmailBox } from "@/components/CopyEmailBox";
import { ShieldCheck, Lock, EyeOff, FileText, Smartphone, Trash2, Mail } from "lucide-react";

export const metadata: Metadata = {
    title: "Privacy Policy — PharmaCode",
    description:
        "PharmaCode Privacy Policy — transparent information on data protection, zero registration policy, Google Play Data Safety, and analytics.",
    alternates: { canonical: absUrl("/privacy-policy/") },
    keywords: ["PharmaCode privacy policy", "data protection B.Pharm platform", "Google Play Data Safety"],
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
                            Privacy Policy &amp; Google Play Data Safety
                        </h1>
                        <p className="font-[DM_Sans] text-[11.5px] sm:text-[12px] text-[#9CA3AF]">
                            Effective Date: September 2026 | Application: PharmaCode (com.pharmacode.bpharm)
                        </p>
                    </div>
                </div>

                <p className="font-[DM_Sans] text-[13px] sm:text-[14px] text-[#4B5563] leading-relaxed mb-6">
                    PharmaCode (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) provides educational pharmaceutical reference materials, PCI B.Pharm curriculum guides, and the PharmaHelper AI study tutor. This Privacy Policy details our privacy practices for both the <strong>PharmaCode Website</strong> (https://pharmacode.vercel.app) and the <strong>PharmaCode Android Mobile Application</strong>.
                </p>

                <div className="space-y-5 sm:space-y-6 border-t border-[#F0F4FF] pt-5 sm:pt-6">
                    <section className="flex items-start gap-3 sm:gap-4">
                        <div className="p-2 sm:p-2.5 rounded-[10px] bg-[#F0FDF4] text-[#166534] shrink-0 mt-0.5">
                            <Lock size={18} />
                        </div>
                        <div>
                            <h2 className="font-display text-[15px] sm:text-[16px] font-bold text-[#1A2B6B] mb-1">
                                1. Information Collection &amp; Zero Mandatory Accounts
                            </h2>
                            <p className="font-[DM_Sans] text-[12.5px] sm:text-[13px] text-[#6B7FA3] leading-relaxed">
                                We do not require students to create accounts, provide passwords, or submit phone numbers to access syllabus guides, view subject notes, or download PDF study materials. You can use all core features completely anonymously.
                            </p>
                        </div>
                    </section>

                    <section className="flex items-start gap-3 sm:gap-4">
                        <div className="p-2 sm:p-2.5 rounded-[10px] bg-[#EFF6FF] text-[#1D4ED8] shrink-0 mt-0.5">
                            <Smartphone size={18} />
                        </div>
                        <div>
                            <h2 className="font-display text-[15px] sm:text-[16px] font-bold text-[#1A2B6B] mb-1">
                                2. Mobile App Permissions &amp; Third-Party Services
                            </h2>
                            <p className="font-[DM_Sans] text-[12.5px] sm:text-[13px] text-[#6B7FA3] leading-relaxed mb-2">
                                The PharmaCode Android application uses standard permissions strictly required for educational delivery:
                            </p>
                            <ul className="list-disc pl-5 font-[DM_Sans] text-[12px] sm:text-[12.5px] text-[#6B7FA3] space-y-1">
                                <li><strong>INTERNET &amp; ACCESS_NETWORK_STATE</strong>: Used to fetch live curriculum notes, syllabus updates, and query the PharmaHelper AI API.</li>
                                <li><strong>POST_NOTIFICATIONS</strong>: Used optionally to send daily pharmaceutical revision reminders and exam alerts.</li>
                                <li><strong>Google Mobile Ads (AdMob)</strong>: May display non-personalized or contextual ads to keep notes completely free. AdMob may process advertising IDs in compliance with Google Play Developer Program Policies.</li>
                                <li><strong>Firebase Cloud Messaging &amp; Analytics</strong>: Used to deliver syllabus notifications and track aggregated app stability and crashes.</li>
                            </ul>
                        </div>
                    </section>

                    <section className="flex items-start gap-3 sm:gap-4">
                        <div className="p-2 sm:p-2.5 rounded-[10px] bg-[#FAF5FF] text-[#6B21A8] shrink-0 mt-0.5">
                            <EyeOff size={18} />
                        </div>
                        <div>
                            <h2 className="font-display text-[15px] sm:text-[16px] font-bold text-[#1A2B6B] mb-1">
                                3. PharmaHelper AI Tutor Interactions
                            </h2>
                            <p className="font-[DM_Sans] text-[12.5px] sm:text-[13px] text-[#6B7FA3] leading-relaxed">
                                Chat prompts sent to PharmaHelper are transmitted securely via TLS encryption to state-of-the-art inference engines (Groq, Google Gemini, NVIDIA NIM) solely to synthesize academic answers. We do not sell your academic prompts, and chat histories are stored locally on your device in secure sandbox storage.
                            </p>
                        </div>
                    </section>

                    <section className="flex items-start gap-3 sm:gap-4">
                        <div className="p-2 sm:p-2.5 rounded-[10px] bg-[#FEF2F2] text-[#991B1B] shrink-0 mt-0.5">
                            <Trash2 size={18} />
                        </div>
                        <div>
                            <h2 className="font-display text-[15px] sm:text-[16px] font-bold text-[#1A2B6B] mb-1">
                                4. Data Retention &amp; Data Deletion Policy
                            </h2>
                            <p className="font-[DM_Sans] text-[12.5px] sm:text-[13px] text-[#6B7FA3] leading-relaxed mb-2">
                                In compliance with Google Play User Data policies:
                            </p>
                            <p className="font-[DM_Sans] text-[12.5px] sm:text-[13px] text-[#6B7FA3] leading-relaxed">
                                All local chat history, bookmarks, and saved API keys can be deleted immediately by clearing app storage in your Android device settings or by uninstalling the application. To request deletion of any support correspondence or analytics logs, please contact us at the developer address below.
                            </p>
                        </div>
                    </section>

                    <section className="flex items-start gap-3 sm:gap-4">
                        <div className="p-2 sm:p-2.5 rounded-[10px] bg-[#FFFBEB] text-[#92400E] shrink-0 mt-0.5">
                            <Mail size={18} />
                        </div>
                        <div className="w-full">
                            <h2 className="font-display text-[15px] sm:text-[16px] font-bold text-[#1A2B6B] mb-1">
                                5. Developer Contact &amp; Grievances
                            </h2>
                            <p className="font-[DM_Sans] text-[12.5px] sm:text-[13px] text-[#6B7FA3] leading-relaxed mb-3">
                                For any questions regarding this Privacy Policy or Google Play compliance, reach out directly:<br />
                                <strong>Email:</strong> <a href="mailto:pharmacode.connect@gmail.com" className="text-[#2563EB] hover:underline font-semibold">pharmacode.connect@gmail.com</a><br />
                                <strong>Website:</strong> <a href="https://pharmacode.vercel.app" className="text-[#2563EB] hover:underline">https://pharmacode.vercel.app</a><br />
                                <strong>Developer:</strong> PharmaCode Team
                            </p>
                            <CopyEmailBox email="pharmacode.connect@gmail.com" label="OFFICIAL DEVELOPER EMAIL" />
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
