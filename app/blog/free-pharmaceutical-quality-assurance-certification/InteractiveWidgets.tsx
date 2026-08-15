"use client";

import { useState } from "react";
import { HelpCircle, ArrowRight, Check, Copy, Sparkles, ExternalLink, MessageSquare, Award, Users, HeartHandshake } from "lucide-react";

const PHARMACODE_LINKEDIN_URL = "https://www.linkedin.com/company/pharmacode-edu";

export function LinkedInMentorshipWidget() {
    const [copied, setCopied] = useState(false);

    const sharePostText = `🎉 Excited to share that I have successfully completed the "Introduction to Pharmaceutical Quality Assurance" professional certification course from Pharma Lesson Masterclass!

Key competencies & industrial learnings:
• cGMP guidelines (21 CFR Part 211), GLP & GDP regulatory framework
• ALCOA+ Data Integrity Standards & US FDA audit readiness
• Line clearance verification & In-Process Quality Control (IPQC) protocols
• Quality Management Systems (QMS), Deviations, Root Cause Analysis (5 Whys / Fishbone) & CAPA lifecycle
• Process Validation stages (Stage 1-3) & Master Batch Record (BMR) review

A big thank you to PharmaCode (@pharmacode-edu) for sharing this valuable free certification resource and study guide! 🚀

#PharmaceuticalQualityAssurance #GMP #QualityAssurance #PharmaCode #BPharm #MPharm #PharmaCareers #DataIntegrity #CAPA #PharmaJobs`;

    const handleCopy = () => {
        navigator.clipboard.writeText(sharePostText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    return (
        <div className="rounded-[20px] sm:rounded-[24px] bg-gradient-to-br from-[#0A192F] via-[#0F2847] to-[#0A192F] text-white p-4 sm:p-6 md:p-8 shadow-xl border border-[#1E3A8A] relative overflow-hidden">
            {/* Ambient lighting effects */}
            <div className="absolute top-[-40px] right-[-40px] w-[180px] h-[180px] rounded-full bg-[#0A66C2]/20 blur-3xl pointer-events-none" />
            <div className="absolute bottom-[-40px] left-[-40px] w-[180px] h-[180px] rounded-full bg-[#10B981]/15 blur-3xl pointer-events-none" />

            <div className="relative z-10">
                {/* Header Badges & Title */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 mb-4">
                    <div className="flex items-center gap-2">
                        <span className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-[#0A66C2] text-white font-bold text-[13px] sm:text-[14px] shadow-md shrink-0">
                            in
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0A66C2]/25 border border-[#0A66C2]/40 px-2.5 sm:px-3 py-0.5 text-[10px] sm:text-[11px] font-extrabold text-[#93C5FD] uppercase tracking-wider">
                            <Sparkles size={11} className="text-[#60A5FA] shrink-0" /> Community Bonus
                        </span>
                    </div>

                    <span className="inline-flex items-center gap-1 rounded-full bg-[#10B981]/20 border border-[#10B981]/40 px-2.5 sm:px-3 py-0.5 text-[10px] sm:text-[11px] font-bold text-[#6EE7B7]">
                        <HeartHandshake size={12} className="shrink-0" /> Free Mentorship Eligible
                    </span>
                </div>

                <h3 className="font-display text-[17px] sm:text-[21px] md:text-[24px] font-black text-white leading-tight mb-2.5">
                    Share Your Certificate on LinkedIn &amp; Tag <span className="text-[#60A5FA]">@PharmaCode</span>
                </h3>

                <p className="font-sans text-[12px] sm:text-[13px] md:text-[14px] text-[#CBD5E1] leading-[1.7] mb-5 max-w-[720px]">
                    When you celebrate your achievement on LinkedIn, remember to tag and mention <strong>PharmaCode (@pharmacode-edu)</strong> in your post! Tagging us automatically qualifies you for <strong>Free Mentorship, Personalized Resume &amp; LinkedIn Reviews, 1-on-1 Career Guidance, and priority updates on upcoming pharma job drives</strong> from our team.
                </p>

                {/* 3 Value Pillars — Mobile Stacked / Desktop 3-Col */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 mb-5">
                    <div className="rounded-xl bg-white/[0.06] border border-white/10 p-3 sm:p-3.5 flex items-start gap-2.5">
                        <Award size={17} className="text-[#34D399] shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-display text-[12px] sm:text-[13px] font-bold text-white">Free Mentorship</h4>
                            <p className="text-[10px] sm:text-[11px] text-[#94A3B8] leading-[1.4] mt-0.5">
                                Direct 1-on-1 career guidance &amp; interview prep support.
                            </p>
                        </div>
                    </div>

                    <div className="rounded-xl bg-white/[0.06] border border-white/10 p-3 sm:p-3.5 flex items-start gap-2.5">
                        <Users size={17} className="text-[#60A5FA] shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-display text-[12px] sm:text-[13px] font-bold text-white">Recruiter Reach</h4>
                            <p className="text-[10px] sm:text-[11px] text-[#94A3B8] leading-[1.4] mt-0.5">
                                Boost post reach &amp; visibility among pharma hiring managers.
                            </p>
                        </div>
                    </div>

                    <div className="rounded-xl bg-white/[0.06] border border-white/10 p-3 sm:p-3.5 flex items-start gap-2.5">
                        <MessageSquare size={17} className="text-[#FBBF24] shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-display text-[12px] sm:text-[13px] font-bold text-white">CV &amp; Resume Review</h4>
                            <p className="text-[10px] sm:text-[11px] text-[#94A3B8] leading-[1.4] mt-0.5">
                                Actionable suggestions to optimize your pharma profile.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Pre-written Post Template with 1-Click Copy */}
                <div className="rounded-xl bg-black/40 border border-white/15 p-3.5 sm:p-4 mb-5">
                    <div className="flex flex-wrap items-center justify-between gap-1.5 mb-2 pb-2 border-b border-white/10">
                        <span className="text-[10px] sm:text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
                            📝 Pre-Formatted LinkedIn Share Post Template
                        </span>
                        <span className="text-[10px] text-[#38BDF8] font-semibold">
                            Includes @PharmaCode Mention
                        </span>
                    </div>
                    <pre className="font-sans text-[11px] sm:text-[12px] text-[#E2E8F0] whitespace-pre-wrap leading-[1.6] max-h-[140px] overflow-y-auto select-all pr-2">
                        {sharePostText}
                    </pre>
                </div>

                {/* Action Buttons — Full Width on Mobile */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
                    <button
                        type="button"
                        onClick={handleCopy}
                        className="btn-press inline-flex items-center justify-center gap-2 rounded-xl bg-[#0A66C2] hover:bg-[#004182] px-4 sm:px-5 py-2.5 text-[12px] sm:text-[13px] font-black text-white shadow-lg transition-all"
                    >
                        {copied ? (
                            <>
                                <Check size={15} className="text-[#34D399]" />
                                <span>Copied Post Template!</span>
                            </>
                        ) : (
                            <>
                                <Copy size={15} />
                                <span>Copy LinkedIn Post Template</span>
                            </>
                        )}
                    </button>

                    <a
                        href={PHARMACODE_LINKEDIN_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-press inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 px-4 sm:px-5 py-2.5 text-[12px] sm:text-[13px] font-bold text-white transition-all text-center"
                    >
                        <span>Follow &amp; Tag PharmaCode on LinkedIn</span>
                        <ExternalLink size={13} />
                    </a>
                </div>
            </div>
        </div>
    );
}

export function MiniQuizCheck() {
    const questions = [
        {
            q: "What is the primary difference between Quality Assurance (QA) and Quality Control (QC)?",
            options: [
                "QA is reactive (testing final products) while QC is proactive (system design).",
                "QA is proactive & process-oriented (preventing defects), while QC is reactive & product-oriented (testing & detecting defects).",
                "QA is only done in hospitals, while QC is done in pharmaceutical manufacturing plants.",
                "There is no difference; both terms are completely interchangeable.",
            ],
            correct: 1,
            explanation: "QA is proactive and focuses on designing processes and systems to prevent defects, whereas QC is reactive and focuses on testing and inspecting samples to detect defects against specifications.",
        },
        {
            q: "In the ALCOA+ Data Integrity framework, what does 'C' stand for?",
            options: [
                "Confidential",
                "Contemporaneous (recorded in real-time as the activity occurs)",
                "Certified",
                "Calibrated",
            ],
            correct: 1,
            explanation: "In ALCOA, 'C' stands for Contemporaneous — meaning all data, logs, and observations must be recorded immediately as the activity happens, without back-dating.",
        },
        {
            q: "What is the mandatory first step before starting a new manufacturing or packaging batch in pharma?",
            options: [
                "Direct product compression",
                "Line Clearance verification (ensuring previous materials and documents are cleared)",
                "Publishing the marketing brochure",
                "Dispatching the finished shipment",
            ],
            correct: 1,
            explanation: "Line Clearance is a mandatory GMP requirement to ensure the previous batch's materials, packaging, and documents are completely removed to prevent mix-ups and cross-contamination.",
        },
    ];

    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
    const [showResults, setShowResults] = useState(false);

    const handleSelect = (qIdx: number, oIdx: number) => {
        setSelectedAnswers((prev) => ({ ...prev, [qIdx]: oIdx }));
    };

    const calculateScore = () => {
        let score = 0;
        questions.forEach((q, idx) => {
            if (selectedAnswers[idx] === q.correct) score += 1;
        });
        return Math.round((score / questions.length) * 100);
    };

    return (
        <div className="rounded-[18px] sm:rounded-[20px] bg-white border border-[#E2E8F0] p-4 sm:p-6 md:p-7 shadow-sm">
            <div className="flex items-center justify-between gap-3 mb-3">
                <div>
                    <span className="inline-flex items-center gap-1 rounded-md bg-[#EEF2FF] border border-[#C7D2FE] px-2.5 py-0.5 text-[10px] font-bold text-secondary uppercase tracking-wider mb-1">
                        <HelpCircle size={11} /> 3-Question Practice Check
                    </span>
                    <h4 className="font-display text-[15px] sm:text-[17px] font-extrabold text-primary">
                        Test Your QA Knowledge Before the Final Test
                    </h4>
                </div>
            </div>

            <p className="text-[12px] sm:text-[13px] text-[#64748B] mb-5 leading-[1.6]">
                The official Pharma Lesson assessment requires an <strong>80% minimum passing score</strong>. Practice with these representative questions:
            </p>

            <div className="space-y-4 sm:space-y-5">
                {questions.map((q, qIdx) => {
                    const isCorrect = selectedAnswers[qIdx] === q.correct;

                    return (
                        <div key={qIdx} className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-3.5 sm:p-4">
                            <h5 className="font-display text-[12px] sm:text-[13px] md:text-[14px] font-bold text-primary mb-3">
                                {qIdx + 1}. {q.q}
                            </h5>

                            <div className="space-y-2">
                                {q.options.map((opt, oIdx) => {
                                    const isChosen = selectedAnswers[qIdx] === oIdx;
                                    let optionClasses = "border-[#CBD5E1] bg-white text-[#334155] hover:bg-[#F1F5F9]";

                                    if (showResults) {
                                        if (oIdx === q.correct) {
                                            optionClasses = "border-[#10B981] bg-[#ECFDF5] text-[#065F46] font-bold";
                                        } else if (isChosen && !isCorrect) {
                                            optionClasses = "border-[#EF4444] bg-[#FEF2F2] text-[#991B1B]";
                                        }
                                    } else if (isChosen) {
                                        optionClasses = "border-[#2563EB] bg-[#EFF6FF] text-[#1E40AF] font-bold";
                                    }

                                    return (
                                        <button
                                            key={oIdx}
                                            type="button"
                                            onClick={() => handleSelect(qIdx, oIdx)}
                                            className={`w-full text-left p-2.5 rounded-lg border text-[11px] sm:text-[12px] transition-all flex items-start gap-2 ${optionClasses}`}
                                        >
                                            <span className="shrink-0 w-4 h-4 rounded-full border flex items-center justify-center text-[10px] mt-0.5">
                                                {String.fromCharCode(65 + oIdx)}
                                            </span>
                                            <span className="flex-1 leading-[1.4]">{opt}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            {showResults && (
                                <div className={`mt-3 p-2.5 rounded-lg text-[11px] leading-[1.5] ${isCorrect ? "bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]" : "bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA]"}`}>
                                    <strong>{isCorrect ? "✓ Correct!" : "✗ Explanation:"}</strong> {q.explanation}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="mt-5 pt-4 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3">
                {!showResults ? (
                    <button
                        type="button"
                        onClick={() => setShowResults(true)}
                        disabled={Object.keys(selectedAnswers).length === 0}
                        className="btn-press w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 px-4 py-2.5 text-[12px] font-black text-white transition-all shadow-sm"
                    >
                        <span>Check Answers &amp; Explanations</span>
                        <ArrowRight size={14} />
                    </button>
                ) : (
                    <div className="flex flex-wrap items-center justify-between w-full gap-2">
                        <span className="font-display text-[13px] sm:text-[14px] font-black text-primary">
                            Your Score: {calculateScore()}% {calculateScore() >= 80 ? "🎉 (Passed 80%+ Criteria!)" : "⚠️ (Keep practicing!)"}
                        </span>
                        <button
                            type="button"
                            onClick={() => {
                                setShowResults(false);
                                setSelectedAnswers({});
                            }}
                            className="text-[11px] text-[#2563EB] font-bold underline hover:no-underline"
                        >
                            Reset Quiz
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
