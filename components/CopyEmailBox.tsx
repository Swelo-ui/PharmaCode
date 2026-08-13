"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CopyEmailBoxProps {
    email?: string;
    label?: string;
}

export function CopyEmailBox({
    email = "pharmacode.connect@gmail.com",
    label = "OFFICIAL CONTACT EMAIL",
}: CopyEmailBoxProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(email);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            const textArea = document.createElement("textarea");
            textArea.value = email;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="rounded-[16px] bg-white border border-[#E0E8FF] p-4 sm:p-5 mb-4 shadow-sm text-center flex flex-col items-center justify-center gap-2.5">
            {label && (
                <span className="font-[DM_Sans] text-[10px] sm:text-[11px] font-extrabold text-[#9CA3AF] uppercase tracking-wider">
                    {label}
                </span>
            )}

            {/* Email display line - Guaranteed single line on both PC & Mobile */}
            <div className="w-full overflow-hidden px-1">
                <code className="font-mono text-[13px] xs:text-[14px] sm:text-[15px] font-bold text-[#1A2B6B] break-all sm:break-normal select-all leading-tight">
                    {email}
                </code>
            </div>

            {/* Copy Button centered below */}
            <button
                type="button"
                onClick={handleCopy}
                className="w-full xs:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#EEF2FF] border border-[#C7D2FE] px-4 py-2 text-[12px] sm:text-[13px] font-bold text-[#2563EB] hover:bg-[#E0E8FF] hover:text-[#1D4ED8] active:scale-95 transition-all shadow-xs cursor-pointer"
                title="Copy email address"
            >
                {copied ? (
                    <>
                        <Check size={15} className="text-[#10B981] shrink-0" />
                        <span className="text-[#10B981]">Copied to Clipboard!</span>
                    </>
                ) : (
                    <>
                        <Copy size={14} className="shrink-0 text-[#2563EB]" />
                        <span>Copy Email Address</span>
                    </>
                )}
            </button>
        </div>
    );
}
