/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://pharmacode.vercel.app",
    generateRobotsTxt: false,   // Manual robots.txt in /public — do NOT overwrite
    trailingSlash: true,
    changefreq: "weekly",
    priority: 0.7,           // default fallback
    sitemapSize: 5000,
    exclude: ["/admin/*", "/api/*", "/icon.svg/"],

    // Per-path priority overrides
    // /                          → 1.0  (homepage)
    // /syllabus/                 → 0.9  (syllabus index)
    // /syllabus/semester-*/      → 0.8  (semester pages)
    // /syllabus/semester-*/**/   → 0.9  (subject pages — deepest, most valuable)
    // /blog/, /notes/            → 0.7  (supporting pages)
    transform: async (config, path) => {
        let priority = 0.7;
        let changefreq = "weekly";

        if (path === "/") {
            priority = 1.0;
            changefreq = "daily";
        } else if (path === "/syllabus/") {
            priority = 0.9;
            changefreq = "weekly";
        } else if (/^\/syllabus\/semester-\d+\/$/.test(path)) {
            // e.g. /syllabus/semester-1/
            priority = 0.8;
            changefreq = "weekly";
        } else if (/^\/syllabus\/semester-\d+\/.+\/$/.test(path)) {
            // e.g. /syllabus/semester-1/bp101t-python-programming/
            priority = 0.9;
            changefreq = "monthly";
        } else if (path === "/blog/" || path === "/notes/") {
            priority = 0.7;
            changefreq = "weekly";
        }

        return {
            loc: path,
            changefreq,
            priority,
            lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
        };
    },

};
