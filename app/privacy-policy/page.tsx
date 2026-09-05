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
                            Effective Date: September 2026 | Application: PharmaCode (com.pharmacode.bpharm) | 2026 Play Store Policy Compliant
                        </p>
                    </div>
                </div>

                <p className="font-[DM_Sans] text-[13px] sm:text-[14px] text-[#4B5563] leading-relaxed mb-6">
                    PharmaCode (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) provides educational pharmaceutical reference materials, PCI B.Pharm curriculum guides, free downloadable unit notes, and the PharmaHelper AI study tutor. This Privacy Policy details our privacy practices for both the <strong>PharmaCode Website</strong> (https://pharmacode.vercel.app) and the <strong>PharmaCode Android Mobile Application</strong> (Package ID: <code>com.pharmacode.bpharm</code>).
                </p>

                <div className="space-y-6 border-t border-[#F0F4FF] pt-6">
                    {/* Section 1 */}
                    <section className="flex items-start gap-3 sm:gap-4">
                        <div className="p-2 sm:p-2.5 rounded-[10px] bg-[#F0FDF4] text-[#166534] shrink-0 mt-0.5">
                            <Lock size={18} />
                        </div>
                        <div>
                            <h2 className="font-display text-[15px] sm:text-[16px] font-bold text-[#1A2B6B] mb-1">
                                1. Zero Mandatory Accounts &amp; Anonymous Access
                            </h2>
                            <p className="font-[DM_Sans] text-[12.5px] sm:text-[13px] text-[#6B7FA3] leading-relaxed">
                                We believe in open, accessible pharmacy education. You do not need to register, provide your real name, phone number, physical address, or payment details to browse the PCI syllabus, read unit notes, or download study PDFs. Core educational features are completely accessible anonymously.
                            </p>
                        </div>
                    </section>

                    {/* Section 2 */}
                    <section className="flex items-start gap-3 sm:gap-4">
                        <div className="p-2 sm:p-2.5 rounded-[10px] bg-[#EFF6FF] text-[#1D4ED8] shrink-0 mt-0.5">
                            <Smartphone size={18} />
                        </div>
                        <div className="w-full">
                            <h2 className="font-display text-[15px] sm:text-[16px] font-bold text-[#1A2B6B] mb-1">
                                2. Android App Permissions &amp; Data Safety Justifications
                            </h2>
                            <p className="font-[DM_Sans] text-[12.5px] sm:text-[13px] text-[#6B7FA3] leading-relaxed mb-3">
                                In strict accordance with Google Play&apos;s Principle of Least Privilege, PharmaCode uses only minimal permissions strictly required to serve students:
                            </p>
                            <div className="overflow-x-auto rounded-[12px] border border-[#E0E8FF] mb-2">
                                <table className="w-full text-left font-[DM_Sans] text-[12px] text-[#4B5563]">
                                    <thead className="bg-[#F8FAFC] text-[#1E293B] font-bold border-b border-[#E0E8FF]">
                                        <tr>
                                            <th className="p-2.5 sm:p-3">Permission</th>
                                            <th className="p-2.5 sm:p-3">Identifier</th>
                                            <th className="p-2.5 sm:p-3">Purpose</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#E0E8FF]">
                                        <tr>
                                            <td className="p-2.5 sm:p-3 font-semibold text-[#1A2B6B]">Internet</td>
                                            <td className="p-2.5 sm:p-3 font-mono text-[11px]">android.permission.INTERNET</td>
                                            <td className="p-2.5 sm:p-3">Fetches syllabus updates, notes PDFs, and communicates with PharmaHelper AI.</td>
                                        </tr>
                                        <tr>
                                            <td className="p-2.5 sm:p-3 font-semibold text-[#1A2B6B]">Network State</td>
                                            <td className="p-2.5 sm:p-3 font-mono text-[11px]">android.permission.ACCESS_NETWORK_STATE</td>
                                            <td className="p-2.5 sm:p-3">Checks internet status to provide offline notes seamlessly.</td>
                                        </tr>
                                        <tr>
                                            <td className="p-2.5 sm:p-3 font-semibold text-[#1A2B6B]">Notifications</td>
                                            <td className="p-2.5 sm:p-3 font-mono text-[11px]">android.permission.POST_NOTIFICATIONS</td>
                                            <td className="p-2.5 sm:p-3">Optional: Sends daily PCI revision tips and exam alerts (user revocable).</td>
                                        </tr>
                                        <tr>
                                            <td className="p-2.5 sm:p-3 font-semibold text-[#1A2B6B]">Exact Alarms</td>
                                            <td className="p-2.5 sm:p-3 font-mono text-[11px]">android.permission.SCHEDULE_EXACT_ALARM</td>
                                            <td className="p-2.5 sm:p-3">Fires timely on-device study session reminders configured by the student.</td>
                                        </tr>
                                        <tr>
                                            <td className="p-2.5 sm:p-3 font-semibold text-[#1A2B6B]">Scoped Storage</td>
                                            <td className="p-2.5 sm:p-3 font-mono text-[11px]">Android Scoped Storage</td>
                                            <td className="p-2.5 sm:p-3">Saves downloaded study PDFs directly to Downloads. No broad storage access requested.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>

                    {/* Section 3 */}
                    <section className="flex items-start gap-3 sm:gap-4">
                        <div className="p-2 sm:p-2.5 rounded-[10px] bg-[#FAF5FF] text-[#6B21A8] shrink-0 mt-0.5">
                            <EyeOff size={18} />
                        </div>
                        <div>
                            <h2 className="font-display text-[15px] sm:text-[16px] font-bold text-[#1A2B6B] mb-1">
                                3. PharmaHelper AI Tutor &amp; Prompt Data Handling
                            </h2>
                            <p className="font-[DM_Sans] text-[12.5px] sm:text-[13px] text-[#6B7FA3] leading-relaxed mb-2">
                                Chat queries sent to PharmaHelper are transmitted via TLS 1.3 encryption directly to enterprise inference providers (Groq, Google Gemini, NVIDIA NIM) solely to synthesize academic explanations.
                            </p>
                            <ul className="list-disc pl-5 font-[DM_Sans] text-[12px] sm:text-[12.5px] text-[#6B7FA3] space-y-1">
                                <li><strong>No Model Training:</strong> Your academic chat prompts are never used to train or fine-tune public foundation AI models.</li>
                                <li><strong>Local Sandbox Storage:</strong> All chat histories are stored strictly on your device inside the app sandbox.</li>
                                <li><strong>Instant Wipe:</strong> You can wipe your entire conversation log at any time using the &quot;Clear Chat&quot; feature in the app.</li>
                            </ul>
                        </div>
                    </section>

                    {/* Section 4 */}
                    <section className="flex items-start gap-3 sm:gap-4">
                        <div className="p-2 sm:p-2.5 rounded-[10px] bg-[#FEF2F2] text-[#991B1B] shrink-0 mt-0.5">
                            <Trash2 size={18} />
                        </div>
                        <div className="w-full">
                            <h2 className="font-display text-[15px] sm:text-[16px] font-bold text-[#1A2B6B] mb-1">
                                4. Google Play Data Retention &amp; Deletion Policy
                            </h2>
                            <p className="font-[DM_Sans] text-[12.5px] sm:text-[13px] text-[#6B7FA3] leading-relaxed mb-3">
                                In strict compliance with Google Play&apos;s 2026 User Data Deletion mandate:
                            </p>
                            <div className="rounded-[12px] bg-[#FEF2F2] border border-[#FECACA] p-3.5 text-[12px] sm:text-[12.5px] text-[#991B1B] font-[DM_Sans] space-y-2">
                                <p><strong>On-Device Local Deletion:</strong> Clear chat messages directly via the trash icon in PharmaHelper, or wipe all app preferences and cached files through Android: <em>Settings &gt; Apps &gt; PharmaCode &gt; Storage &amp; Cache &gt; Clear Storage</em>.</p>
                                <p><strong>Cloud Account &amp; Server Data Deletion:</strong> If you created an optional synced account, you can request full permanent deletion inside the app Profile screen or by emailing <a href="mailto:pharmacode.connect@gmail.com" className="underline font-bold">pharmacode.connect@gmail.com</a> with the subject <em>&quot;Data Deletion Request&quot;</em>. All account records and correspondence are permanently purged within 30 days.</p>
                            </div>
                        </div>
                    </section>

                    {/* Section 5 */}
                    <section className="flex items-start gap-3 sm:gap-4">
                        <div className="p-2 sm:p-2.5 rounded-[10px] bg-[#F3F4F6] text-[#374151] shrink-0 mt-0.5">
                            <FileText size={18} />
                        </div>
                        <div>
                            <h2 className="font-display text-[15px] sm:text-[16px] font-bold text-[#1A2B6B] mb-1">
                                5. Children&apos;s Privacy &amp; Families Policy
                            </h2>
                            <p className="font-[DM_Sans] text-[12.5px] sm:text-[13px] text-[#6B7FA3] leading-relaxed">
                                PharmaCode is designed for collegiate students enrolled in B.Pharm, D.Pharm, M.Pharm, and GPAT aspirants (ages 17+). We do not knowingly target or collect personal information from children under 13 years of age.
                            </p>
                        </div>
                    </section>

                    {/* Section 6 */}
                    <section className="flex items-start gap-3 sm:gap-4">
                        <div className="p-2 sm:p-2.5 rounded-[10px] bg-[#FFFBEB] text-[#92400E] shrink-0 mt-0.5">
                            <Mail size={18} />
                        </div>
                        <div className="w-full">
                            <h2 className="font-display text-[15px] sm:text-[16px] font-bold text-[#1A2B6B] mb-1">
                                6. Developer Contact &amp; Grievance Officer
                            </h2>
                            <p className="font-[DM_Sans] text-[12.5px] sm:text-[13px] text-[#6B7FA3] leading-relaxed mb-3">
                                For any questions regarding this Privacy Policy or Google Play compliance, reach out directly:<br />
                                <strong>Developer:</strong> PharmaCode Team<br />
                                <strong>Email:</strong> <a href="mailto:pharmacode.connect@gmail.com" className="text-[#2563EB] hover:underline font-semibold">pharmacode.connect@gmail.com</a><br />
                                <strong>Website:</strong> <a href="https://pharmacode.vercel.app" className="text-[#2563EB] hover:underline">https://pharmacode.vercel.app</a><br />
                                <strong>Package ID:</strong> <code>com.pharmacode.bpharm</code>
                            </p>
                            <CopyEmailBox email="pharmacode.connect@gmail.com" label="OFFICIAL DEVELOPER EMAIL" />
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
