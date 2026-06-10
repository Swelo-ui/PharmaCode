"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FaqItem {
    q: string;
    a: string;
}

interface HomepageFaqsProps {
    faqs: FaqItem[];
}

export function HomepageFaqs({ faqs }: HomepageFaqsProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="mx-auto w-full max-w-[760px] px-4 sm:px-6 py-12 sm:py-16">
            {/* Heading Section */}
            <div className="mb-8 text-center">
                <div className="inline-flex items-center gap-2 mb-3 bg-[#EEF2FF] text-[#4C6EF5] rounded-full px-4 py-1.5 text-[12px] font-extrabold uppercase tracking-wider">
                    <HelpCircle size={14} className="shrink-0" />
                    Help & Support
                </div>
                <h2 className="mb-2 font-display text-[26px] sm:text-[34px] font-black text-primary tracking-tight">
                    Frequently Asked Questions
                </h2>
                <p className="font-[DM_Sans] text-[13px] sm:text-[14px] text-[#6B7FA3]">
                    Everything you need to know about B.Pharm NEP 2020 and PharmaCode resources
                </p>
            </div>

            {/* Accordion List */}
            <div className="flex flex-col gap-3">
                {faqs.map((faq, i) => {
                    const isOpen = openIndex === i;
                    return (
                        <div
                            key={i}
                            className="rounded-[16px] border bg-white transition-all duration-200"
                            style={{
                                borderColor: isOpen ? "#4C6EF5" : "#E8EDFF",
                                boxShadow: isOpen ? "0 4px 20px rgba(76, 110, 245, 0.08)" : "none",
                            }}
                        >
                            {/* Accordion Header */}
                            <button
                                onClick={() => toggleFaq(i)}
                                className="w-full flex items-center justify-between gap-4 text-left px-5 py-4 focus:outline-none select-none"
                                aria-expanded={isOpen}
                            >
                                <span className="font-display text-[14px] sm:text-[16px] font-extrabold text-primary leading-snug">
                                    {faq.q}
                                </span>
                                <div
                                    className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200"
                                    style={{
                                        background: isOpen ? "#EEF2FF" : "#F3F4F6",
                                        color: isOpen ? "#4C6EF5" : "#9CA3AF",
                                    }}
                                >
                                    <ChevronDown
                                        size={16}
                                        className="transition-transform duration-200"
                                        style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                                    />
                                </div>
                            </button>

                            {/* Accordion Content */}
                            <div
                                className="overflow-hidden transition-all duration-300 ease-in-out"
                                style={{
                                    maxHeight: isOpen ? "160px" : "0px",
                                    opacity: isOpen ? 1 : 0,
                                }}
                            >
                                <div className="px-5 pb-5 pt-1">
                                    <p className="font-[DM_Sans] text-[13px] sm:text-[14px] leading-[1.65] text-[#6B7FA3]">
                                        {faq.a}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
