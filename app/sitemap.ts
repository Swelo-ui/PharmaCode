// ============================================================
//  PharmaCode — app/sitemap.ts
//  Native Next.js App Router Sitemap (NO external packages)
//  Route: GET /sitemap.xml   →  application/xml (guaranteed)
//  Replace the old next-sitemap static approach entirely.
// ============================================================

import { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

const BASE_URL = SITE.url;

// ─── 1. STATIC / CORE PAGES ──────────────────────────────────
const staticRoutes: MetadataRoute.Sitemap = [
  {
    url: `${BASE_URL}/`,
    lastModified: new Date("2026-08-13"),
    changeFrequency: "weekly",
    priority: 1.0,
  },
  {
    url: `${BASE_URL}/syllabus/`,
    lastModified: new Date("2026-08-13"),
    changeFrequency: "monthly",
    priority: 0.9,
  },
  {
    url: `${BASE_URL}/notes/`,
    lastModified: new Date("2026-08-13"),
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    url: `${BASE_URL}/blog/`,
    lastModified: new Date("2026-08-13"),
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    url: `${BASE_URL}/about/`,
    lastModified: new Date("2026-08-13"),
    changeFrequency: "yearly",
    priority: 0.6,
  },
  {
    url: `${BASE_URL}/career/`,
    lastModified: new Date("2026-08-13"),
    changeFrequency: "weekly",
    priority: 0.85,
  },
  {
    url: `${BASE_URL}/contribute/`,
    lastModified: new Date("2026-08-13"),
    changeFrequency: "yearly",
    priority: 0.5,
  },
  {
    url: `${BASE_URL}/privacy-policy/`,
    lastModified: new Date("2026-08-13"),
    changeFrequency: "yearly",
    priority: 0.4,
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
];

// ─── 2. SEMESTER LANDING PAGES ───────────────────────────────
const semesterRoutes: MetadataRoute.Sitemap = Array.from(
  { length: 8 },
  (_, i) => ({
    url: `${BASE_URL}/syllabus/semester-${i + 1}/`,
    lastModified: new Date("2026-08-13"),
    changeFrequency: "monthly" as const,
    priority: 0.85,
  })
);

// ─── 3. SUBJECT PAGES (theory subjects only — indexed pages) ─
//  Slug convention: bp[code]t-[subject-name-in-kebab-case]
const subjects: { semester: number; slug: string }[] = [
  // ── Semester 1 ──────────────────────────────────────────────
  {
    semester: 1,
    slug: "bp101t-basics-of-python-programming-for-pharmaceutical-sciences",
  },
  { semester: 1, slug: "bp102t-general-pharmacy" },
  {
    semester: 1,
    slug: "bp103t-healthcare-psychology-and-communication-skills",
  },
  {
    semester: 1,
    slug: "bp104t-human-anatomy-physiology-and-pathophysiology-i",
  },
  { semester: 1, slug: "bp105t-introduction-to-pharmacognosy" },
  {
    semester: 1,
    slug: "bp106t-pharmaceutical-inorganic-and-analytical-chemistry",
  },

  // ── Semester 2 ──────────────────────────────────────────────
  {
    semester: 2,
    slug: "bp201t-applied-biostatistics-and-data-analytics-for-pharmaceutical-sciences",
  },
  { semester: 2, slug: "bp202t-biochemistry" },
  {
    semester: 2,
    slug: "bp203t-human-anatomy-physiology-and-pathophysiology-ii",
  },
  { semester: 2, slug: "bp204t-pharmaceutical-organic-chemistry" },
  { semester: 2, slug: "bp205t-pharmacognosy-and-phytochemistry" },
  { semester: 2, slug: "bp206t-physical-pharmaceutics" },

  // ── Semester 3 ──────────────────────────────────────────────
  {
    semester: 3,
    slug: "bp301t-introduction-to-machine-learning-in-pharmaceutical-sciences",
  },
  { semester: 3, slug: "bp302t-environmental-sciences" },
  { semester: 3, slug: "bp303t-ethics-and-universal-human-values" },
  { semester: 3, slug: "bp304t-general-pharmacology" },
  {
    semester: 3,
    slug: "bp305t-heterocyclic-compounds-and-stereochemistry",
  },
  { semester: 3, slug: "bp306t-pharmaceutical-dosage-forms-i" },
  { semester: 3, slug: "bp307t-pharmaceutical-engineering" },
  { semester: 3, slug: "bp308t-pharmaceutical-microbiology" },

  // ── Semester 4 ──────────────────────────────────────────────
  { semester: 4, slug: "bp401t-herbal-drug-technology" },
  { semester: 4, slug: "bp402t-medicinal-chemistry" },
  { semester: 4, slug: "bp403t-pharmaceutical-biotechnology" },
  { semester: 4, slug: "bp404t-social-pharmacy-and-public-health" },
  { semester: 4, slug: "bp405t-systemic-pharmacology-i" },

  // ── Semester 5 ──────────────────────────────────────────────
  { semester: 5, slug: "bp501t-biomedicinal-chemistry" },
  { semester: 5, slug: "bp502t-industrial-pharmacognosy" },
  { semester: 5, slug: "bp503t-innovation-and-startup-ecosystem" },
  { semester: 5, slug: "bp504t-pharmaceutical-dosage-form-ii" },
  { semester: 5, slug: "bp505t-pharmaceutical-quality-assurance" },
  { semester: 5, slug: "bp506t-systemic-pharmacology-ii" },

  // ── Semester 6 ──────────────────────────────────────────────
  { semester: 6, slug: "bp601t-advanced-pharmacognosy" },
  {
    semester: 6,
    slug: "bp602t-biopharmaceutics-and-pharmacokinetics",
  },
  { semester: 6, slug: "bp603t-intellectual-property-rights" },
  {
    semester: 6,
    slug: "bp604t-ai-applications-in-pharmaceutical-sciences",
  },
  { semester: 6, slug: "bp605t-pharmaceutical-analysis" },
  { semester: 6, slug: "bp606t-pharmaceutical-jurisprudence" },

  // ── Semester 7 ──────────────────────────────────────────────
  { semester: 7, slug: "bp701t-biostatistics-research-methodology" },
  { semester: 7, slug: "bp702t-cosmetics-and-cosmeceuticals" },
  { semester: 7, slug: "bp703t-ai-in-clinical-applications" },
  { semester: 7, slug: "bp704t-modern-analytical-techniques" },
  { semester: 7, slug: "bp705t-pharmacovigilance" },
  { semester: 7, slug: "bp706t-pharmacy-practice" },
  { semester: 7, slug: "bp707t-regulatory-affairs" },

  // ── Semester 8 ──────────────────────────────────────────────
  {
    semester: 8,
    slug: "bp801t-ethical-considerations-and-translational-applications-of-ai-in-pharmacy",
  },
  { semester: 8, slug: "bp802t-clinical-pharmacotherapeutics" },
  {
    semester: 8,
    slug: "bp803t-industrial-pharmacy-and-facility-design",
  },
  { semester: 8, slug: "bp804t-pharmaceutical-management" },
  {
    semester: 8,
    slug: "bp805t-sterile-dosage-forms-and-novel-drug-delivery-system",
  },
];

const subjectRoutes: MetadataRoute.Sitemap = subjects.map(
  ({ semester, slug }) => ({
    url: `${BASE_URL}/syllabus/semester-${semester}/${slug}/`,
    lastModified: new Date("2026-08-13"),
    changeFrequency: "monthly" as const,
    priority: 0.80,
  })
);

// ─── 4. EXPORT: merge all routes ─────────────────────────────
export default function sitemap(): MetadataRoute.Sitemap {
  return [...staticRoutes, ...semesterRoutes, ...subjectRoutes];
}
