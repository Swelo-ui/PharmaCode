// ============================================================
//  PharmaCode — app/robots.ts
//  Native Next.js App Router robots.txt generator
//  Route: GET /robots.txt   (replaces public/robots.txt)
//  Delete public/robots.txt after adding this file.
// ============================================================

import { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
      // Explicitly allow Google AI & LLM Search crawlers for AI Overviews & Citations
      {
        userAgent: ["Google-Extended", "GPTBot", "PerplexityBot", "ClaudeBot", "Applebot-Extended"],
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
