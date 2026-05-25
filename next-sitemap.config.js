/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.SITE_URL || "https://pharmacode.in",
    generateRobotsTxt: true,
    trailingSlash: true,
    changefreq: "weekly",
    priority: 0.7,
    sitemapSize: 5000,
    exclude: ["/admin/*", "/api/*", "/icon.svg/"],
    robotsTxtOptions: {
        policies: [
            { userAgent: "*", allow: "/" },
            { userAgent: "*", disallow: ["/admin/", "/api/"] },
        ],
    },
};
