// ============================================================
//  PharmaCode — app/sitemap.ts
//  Native Next.js App Router Sitemap (NO external packages)
//  Route: GET /sitemap.xml   →  application/xml (guaranteed)
//  Replace the old next-sitemap static approach entirely.
// ============================================================

import { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { SEMESTERS } from "@/lib/syllabus";

const BASE_URL = SITE.url;

const buildDate = new Date();

// ─── 1. STATIC / CORE PAGES ──────────────────────────────────
const staticRoutes: MetadataRoute.Sitemap = [
  {
    url: `${BASE_URL}/`,
    lastModified: buildDate,
    changeFrequency: "weekly",
    priority: 1.0,
  },
  {
    url: `${BASE_URL}/syllabus/`,
    lastModified: buildDate,
    changeFrequency: "monthly",
    priority: 0.9,
  },
  {
    url: `${BASE_URL}/notes/`,
    lastModified: buildDate,
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    url: `${BASE_URL}/blog/`,
    lastModified: buildDate,
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    url: `${BASE_URL}/about/`,
    lastModified: buildDate,
    changeFrequency: "yearly",
    priority: 0.6,
  },
  {
    url: `${BASE_URL}/career/`,
    lastModified: buildDate,
    changeFrequency: "weekly",
    priority: 0.85,
  },
  {
    url: `${BASE_URL}/contribute/`,
    lastModified: buildDate,
    changeFrequency: "yearly",
    priority: 0.5,
  },
  {
    url: `${BASE_URL}/privacy-policy/`,
    lastModified: buildDate,
    changeFrequency: "yearly",
    priority: 0.4,
  },
  {
    url: `${BASE_URL}/terms/`,
    lastModified: buildDate,
    changeFrequency: "yearly",
    priority: 0.4,
  },
  {
    url: `${BASE_URL}/blog/regulatory-affairs-complete-guide/`,
    lastModified: new Date("2026-09-01"),
    changeFrequency: "weekly",
    priority: 0.95,
  },
  {
    url: `${BASE_URL}/blog/pharmacovigilance-interview-preparation-kit/`,
    lastModified: new Date("2026-08-10"),
    changeFrequency: "monthly",
    priority: 0.85,
  },
  {
    url: `${BASE_URL}/blog/free-pharmacovigilance-courses-who-umc/`,
    lastModified: new Date("2026-08-12"),
    changeFrequency: "monthly",
    priority: 0.85,
  },
  {
    url: `${BASE_URL}/blog/free-pharmaceutical-quality-assurance-certification/`,
    lastModified: new Date("2026-08-15"),
    changeFrequency: "monthly",
    priority: 0.85,
  },
];

// ─── 2. SEMESTER LANDING PAGES ───────────────────────────────
const semesterRoutes: MetadataRoute.Sitemap = SEMESTERS.map((sem) => ({
  url: `${BASE_URL}/syllabus/semester-${sem.num}/`,
  lastModified: buildDate,
  changeFrequency: "monthly" as const,
  priority: 0.85,
}));

// ─── 3. SUBJECT PAGES (Dynamic from SEMESTERS) ───────────────
const subjectRoutes: MetadataRoute.Sitemap = SEMESTERS.flatMap((sem) =>
  sem.subjects
    .filter((s) => s.type === "T" || s.units.length > 0)
    .map((sub) => ({
      url: `${BASE_URL}/syllabus/semester-${sem.num}/${sub.slug}/`,
      lastModified: buildDate,
      changeFrequency: "monthly" as const,
      priority: 0.80,
    }))
);

// ─── 4. EXPORT: merge all routes ─────────────────────────────
export default function sitemap(): MetadataRoute.Sitemap {
  return [...staticRoutes, ...semesterRoutes, ...subjectRoutes];
}
