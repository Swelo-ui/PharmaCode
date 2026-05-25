import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Brand
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
            },
            fontFamily: {
                display: ["Nunito", "ui-sans-serif", "system-ui", "sans-serif"],
                sans: ["DM Sans", "ui-sans-serif", "system-ui", "sans-serif"],
                mono: ["JetBrains Mono", "ui-monospace", "monospace"],
            },
            boxShadow: {
                card: "0 8px 24px rgba(76, 110, 245, 0.13)",
            },
        },
    },
    plugins: [],
};

export default config;
