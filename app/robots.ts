// ============================================================
//  PharmaCode — app/robots.ts
//  Native Next.js App Router robots.txt generator
//  Route: GET /robots.txt   (replaces public/robots.txt)
//  Delete public/robots.txt after adding this file.
// ============================================================

import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Block internal Next.js paths from indexing
        disallow: [
          "/api/",
          "/_next/",
          "/404",
          "/500",
        ],
      },
    ],
    sitemap: "https://pharmacode.vercel.app/sitemap.xml",
    host: "https://pharmacode.vercel.app",
  };
}
