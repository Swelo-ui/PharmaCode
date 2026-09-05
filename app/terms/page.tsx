import type { Metadata } from "next";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { absUrl } from "@/lib/site";
import { CopyEmailBox } from "@/components/CopyEmailBox";
import { FileText, AlertTriangle, BookOpen, Bot, ShieldAlert, Scale, Mail } from "lucide-react";

export const metadata: Metadata = {
    title: "Terms of Service & Academic Disclaimer — PharmaCode",
    description:
        "Terms of Service, acceptable use policy, and critical medical and academic disclaimers for PharmaCode and the PharmaHelper AI study tutor.",
    alternates: { canonical: absUrl("/terms/") },
    keywords: ["PharmaCode terms of service", "medical disclaimer pharmacy app", "Google Play 2026 compliance", "B.Pharm study terms"],
    openGraph: {
        title: "Terms of Service — PharmaCode",
        description: "PCI B.Pharm NEP 2020 educational study terms and medical disclaimer.",
        url: absUrl("/terms/"),
        images: [{ url: absUrl("/og-image.png"), width: 1200, height: 630, alt: "Terms of Service PharmaCode" }],
    },
};

export default function TermsPage() {
    const breadcrumbs = [
        { name: "Home", href: "/" },
        { name: "Terms of Service", href: "/terms/" },
    ];

    return (
        <div className="mx-auto w-full max-w-[960px] px-3.5 xs:px-5 sm:px-8 py-6 sm:py-10">
            <JsonLd data={breadcrumbSchema(breadcrumbs)} />
            <Breadcrumb items={breadcrumbs} />

            <div className="rounded-[20px] bg-white border border-[#E8EDFF] p-4.5 xs:p-6 sm:p-10 shadow-sm mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-[12px] bg-[#EEF2FF] flex items-center justify-center text-[#4C6EF5] shrink-0">
                        <FileText size={22} />
                    </div>
                    <div>
                        <h1 className="font-display text-[22px] sm:text-[30px] font-black text-[#1A2B6B] leading-tight">
                            Terms of Service &amp; Academic Disclaimer
                        </h1>
                        <p className="font-[DM_Sans] text-[11.5px] sm:text-[12px] text-[#9CA3AF]">
                            Effective Date: September 2026 | Application: PharmaCode (com.pharmacode.bpharm) | Google Play 2026 Compliant
                        </p>
                    </div>
                </div>

                {/* CRITICAL MEDICAL DISCLAIMER BANNER */}
                <div className="rounded-[16px] bg-[#FFFBEB] border border-[#FDE68A] p-4.5 sm:p-6 mb-6">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="text-[#D97706] shrink-0 mt-0.5" size={20} />
                        <div>
                            <h2 className="font-display text-[15px] sm:text-[16px] font-black text-[#92400E] mb-1.5 uppercase tracking-wide">
                                Critical Medical &amp; Clinical Practice Disclaimer
                            </h2>
                            <p className="font-[DM_Sans] text-[12.5px] sm:text-[13px] text-[#78350F] leading-relaxed mb-2">
                                <strong>PharmaCode is strictly an educational learning companion for pharmacy college students and faculty.</strong>
                            </p>
                            <ul className="list-disc pl-5 font-[DM_Sans] text-[12px] sm:text-[12.5px] text-[#78350F] space-y-1">
                                <li><strong>No Clinical Diagnosis or Medical Advice:</strong> All materials—including drug classifications, mechanisms of action, pharmacokinetics, adverse drug reactions, contraindications, and laboratory procedures—are published exclusively for academic preparation under the PCI B.Pharm NEP 2020 curriculum and national competitive exams (GPAT/NIPER).</li>
                                <li><strong>Never for Patient Treatment:</strong> The application does NOT provide clinical diagnosis, medical therapy guidelines, or commercial prescription dispensing instructions. Never use educational content for clinical self-medication or real-world emergency care.</li>
                                <li><strong>Official Reference Mandate:</strong> Licensed practitioners and healthcare professionals must always consult certified medical specialists and authorized national pharmacopoeias (Indian Pharmacopoeia, British Pharmacopoeia, United States Pharmacopeia) for patient care.</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="space-y-6 border-t border-[#F0F4FF] pt-6">
                    {/* Section 1 */}
                    <section className="flex items-start gap-3 sm:gap-4">
                        <div className="p-2 sm:p-2.5 rounded-[10px] bg-[#EFF6FF] text-[#1D4ED8] shrink-0 mt-0.5">
                            <BookOpen size={18} />
                        </div>
                        <div>
                            <h2 className="font-display text-[15px] sm:text-[16px] font-bold text-[#1A2B6B] mb-1">
                                1. Educational Purpose &amp; Academic Scope
                            </h2>
                            <p className="font-[DM_Sans] text-[12.5px] sm:text-[13px] text-[#6B7FA3] leading-relaxed">
                                PharmaCode delivers syllabus outlines, unit-wise notes, and reference materials aligned with the Pharmacy Council of India (PCI) Bachelor of Pharmacy curriculum under the National Education Policy (NEP 2020). Materials are provided to facilitate non-commercial study and collegiate exam revision.
                            </p>
                        </div>
                    </section>

                    {/* Section 2 */}
                    <section className="flex items-start gap-3 sm:gap-4">
                        <div className="p-2 sm:p-2.5 rounded-[10px] bg-[#FAF5FF] text-[#6B21A8] shrink-0 mt-0.5">
                            <Bot size={18} />
                        </div>
                        <div>
                            <h2 className="font-display text-[15px] sm:text-[16px] font-bold text-[#1A2B6B] mb-1">
                                2. PharmaHelper AI Tutor — Terms &amp; Limitations
                            </h2>
                            <p className="font-[DM_Sans] text-[12.5px] sm:text-[13px] text-[#6B7FA3] leading-relaxed mb-2">
                                PharmaHelper utilizes neural inference models (Groq, Google Gemini, NVIDIA NIM) to help students grasp pharmaceutical concepts:
                            </p>
                            <ul className="list-disc pl-5 font-[DM_Sans] text-[12px] sm:text-[12.5px] text-[#6B7FA3] space-y-1">
                                <li><strong>Educational Guidance Only:</strong> AI outputs are synthesized automatically to clarify concepts, offer study summaries, and answer syllabus questions.</li>
                                <li><strong>Student Responsibility to Cross-Verify:</strong> AI models may occasionally generate imperfect outputs or outdated chemical nomenclature. Students must cross-verify all mathematical calculations, drug dosages, and chemical structures with standard textbooks (e.g., K.D. Tripathi, Lachman &amp; Lieberman, Remington) and university guidelines.</li>
                                <li><strong>No Commercial Training:</strong> Chat prompts are confidential and are never used to train public foundation AI models.</li>
                            </ul>
                        </div>
                    </section>

                    {/* Section 3 */}
                    <section className="flex items-start gap-3 sm:gap-4">
                        <div className="p-2 sm:p-2.5 rounded-[10px] bg-[#F0FDF4] text-[#166534] shrink-0 mt-0.5">
                            <Scale size={18} />
                        </div>
                        <div>
                            <h2 className="font-display text-[15px] sm:text-[16px] font-bold text-[#1A2B6B] mb-1">
                                3. Acceptable Fair Use &amp; Intellectual Property
                            </h2>
                            <p className="font-[DM_Sans] text-[12.5px] sm:text-[13px] text-[#6B7FA3] leading-relaxed mb-2">
                                All curriculum structures reflect the open public framework of the Pharmacy Council of India (PCI). User notes and study guides are provided for individual, non-commercial educational study.
                            </p>
                            <p className="font-[DM_Sans] text-[12.5px] sm:text-[13px] text-[#6B7FA3] leading-relaxed">
                                You agree not to reverse-engineer, decompile, extract private API secrets from the application bundle, or employ automated scrapers to harvest study materials.
                            </p>
                        </div>
                    </section>

                    {/* Section 4 */}
                    <section className="flex items-start gap-3 sm:gap-4">
                        <div className="p-2 sm:p-2.5 rounded-[10px] bg-[#FEF2F2] text-[#991B1B] shrink-0 mt-0.5">
                            <ShieldAlert size={18} />
                        </div>
                        <div>
                            <h2 className="font-display text-[15px] sm:text-[16px] font-bold text-[#1A2B6B] mb-1">
                                4. Disclaimer of Warranties &amp; Limitation of Liability
                            </h2>
                            <p className="font-[DM_Sans] text-[12.5px] sm:text-[13px] text-[#6B7FA3] leading-relaxed">
                                PharmaCode is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind. PharmaCode, its developers, and contributors shall not be held liable for any direct, indirect, or consequential damages resulting from academic exam outcomes or clinical misinterpretation of educational study notes.
                            </p>
                        </div>
                    </section>

                    {/* Section 5 */}
                    <section className="flex items-start gap-3 sm:gap-4">
                        <div className="p-2 sm:p-2.5 rounded-[10px] bg-[#FFFBEB] text-[#92400E] shrink-0 mt-0.5">
                            <Mail size={18} />
                        </div>
                        <div className="w-full">
                            <h2 className="font-display text-[15px] sm:text-[16px] font-bold text-[#1A2B6B] mb-1">
                                5. Developer Contact &amp; Legal Inquiries
                            </h2>
                            <p className="font-[DM_Sans] text-[12.5px] sm:text-[13px] text-[#6B7FA3] leading-relaxed mb-3">
                                For any inquiries regarding these Terms of Service or academic licensing, please contact us directly:<br />
                                <strong>Developer:</strong> PharmaCode Team<br />
                                <strong>Email:</strong> <a href="mailto:pharmacode.connect@gmail.com" className="text-[#2563EB] hover:underline font-semibold">pharmacode.connect@gmail.com</a><br />
                                <strong>Website:</strong> <a href="https://pharmacode.vercel.app" className="text-[#2563EB] hover:underline">https://pharmacode.vercel.app</a><br />
                                <strong>Package ID:</strong> <code>com.pharmacode.bpharm</code>
                            </p>
                            <CopyEmailBox email="pharmacode.connect@gmail.com" label="OFFICIAL CONTACT EMAIL" />
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
