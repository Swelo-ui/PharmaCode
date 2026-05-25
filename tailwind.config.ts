import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            /* ── Add xs breakpoint (320px–479px range) ── */
            screens: {
                xs: "480px",
            },
            colors: {
                // Keep existing brand keys for complete backward compatibility
                primary: "#1A2B6B",
                secondary: "#4C6EF5",
                "accent-blue": "#7B9BF7",
                "accent-pink": "#FF8FAB",
                "accent-green": "#4CAF82",
                "accent-coral": "#FF6B6B",
                surface: "#F0F4FF",
                card: "#FFFFFF",
                "text-muted": "#6B7FA3",
                "border-soft": "#DDE6FF",
                
                // Add new extended keys from the user proposal
                brand: {
                    navy:      "#1A2B6B",
                    blue:      "#4C6EF5",
                    "blue-lt": "#7B9BF7",
                    pink:      "#FF8FAB",
                    green:     "#4CAF82",
                    surface:   "#F0F4FF",
                    border:    "#DDE6FF",
                    "text-muted": "#6B7FA3",
                },
                sem: {
                    1: "#4C6EF5",
                    2: "#10B981",
                    3: "#F59E0B",
                    4: "#EC4899",
                    5: "#8B5CF6",
                    6: "#06B6D4",
                    7: "#F97316",
                    8: "#BE185D",
                },
            },
            fontFamily: {
                display: ["Nunito", "ui-sans-serif", "system-ui", "sans-serif"],
                sans: ["DM Sans", "ui-sans-serif", "system-ui", "sans-serif"],
                mono: ["JetBrains Mono", "ui-monospace", "monospace"],
                
                // Add new display aliases if any files explicitly reference them
                nunito:      ["Nunito",        "sans-serif"],
                "dm-sans":   ["DM Sans",       "sans-serif"],
            },
            boxShadow: {
                card: "0 8px 24px rgba(76, 110, 245, 0.13)",
                "card-hover": "0 8px 24px rgba(76, 110, 245, 0.18)",
            },
            borderRadius: {
                "2xl": "16px",
                "3xl": "20px",
            },
        },
    },
    plugins: [],
};

export default config;
