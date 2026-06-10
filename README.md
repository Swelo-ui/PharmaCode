# PharmaCode — pharmacode.vercel.app

> **Code • Cure • Care** — B.Pharm NEP 2020 syllabus, free unit-wise notes, Python & AI guides for pharmacy students across India.

A Next.js 14 (App Router) site implementing the PharmaCode PRD. SEO-first, fully static, mobile-friendly.

## Stack

- **Next.js 14** — App Router, static export-friendly
- **TypeScript** — type-safe data layer
- **Tailwind CSS** — utility styling with custom brand tokens
- **next-sitemap** — auto-generated `sitemap.xml` and `robots.txt`
- **Schema.org JSON-LD** — Course, BreadcrumbList, Organization, WebSite

## Project structure

```
app/
  layout.tsx              # Root layout (navbar, footer, metadata, JSON-LD)
  page.tsx                # Home (/)
  syllabus/
    page.tsx              # /syllabus/
    [semSlug]/
      page.tsx            # /syllabus/semester-N/
      [subjectSlug]/
        page.tsx          # /syllabus/semester-N/<subject-slug>/
  notes/page.tsx          # /notes/
  blog/page.tsx           # /blog/
  not-found.tsx
components/
  Navbar.tsx
  Footer.tsx
  SemCard.tsx
  SubjectRow.tsx
  Breadcrumb.tsx
  JsonLd.tsx
lib/
  syllabus.ts             # All 8 semesters of PCI NEP 2020 data + helpers
  types.ts
  slug.ts                 # SEO-friendly slug generation
  site.ts                 # Site-wide constants
  schema.ts               # JSON-LD builders
  format.ts
public/
  favicon.svg
```

## URL structure (canonical)

```
/                                                       → Home
/syllabus/                                              → Syllabus index
/syllabus/semester-1/ … /syllabus/semester-8/           → Semester hubs
/syllabus/semester-1/bp101t-basics-of-python-.../       → Subject pages (auto)
/notes/                                                 → Notes hub
/blog/                                                  → Blog index
```

Each subject slug is auto-generated from its course code + name (lowercase, hyphenated, max 8 tokens) for clean SEO URLs.

## Getting started

```bash
npm install
npm run dev
```

Visit http://localhost:3000 — navbar + all 8 semesters work end-to-end.

## Build for production

```bash
npm run build       # builds + runs next-sitemap (postbuild)
npm start           # serves the production build locally
```

`postbuild` runs `next-sitemap` which writes `public/sitemap.xml` and `public/robots.txt` based on `next-sitemap.config.js`.

## Configuration

| File | Purpose |
|---|---|
| `next.config.mjs` | `trailingSlash: true` for stable canonical URLs |
| `tailwind.config.ts` | Brand colors and fonts (Nunito, DM Sans, JetBrains Mono) |
| `next-sitemap.config.js` | Sitemap and robots.txt generation |
| `lib/site.ts` | Site URL, name, description (override via `NEXT_PUBLIC_SITE_URL`) |

Set production URL:

```bash
# .env.local
NEXT_PUBLIC_SITE_URL=https://pharmacode.vercel.app
SITE_URL=https://pharmacode.vercel.app
```

## Adding / editing syllabus content

The single source of truth is `lib/syllabus.ts` — it exports `SEMESTERS` typed against `lib/types.ts`. Adding a subject automatically generates:

- A subject page at `/syllabus/semester-N/<slug>/`
- Sitemap entry
- Breadcrumb + Course JSON-LD
- Sibling links from other subject pages

## Notes & PDFs (next phase)

Currently the **Download Notes PDF** buttons are placeholders. To wire them up, recommended approach is Supabase Storage:

1. Create a `notes` bucket (public read).
2. Upload PDFs as `semester-N/<subject-slug>.pdf`.
3. Replace placeholder buttons with `<a href={publicUrl} download>` in `SubjectRow.tsx` and the subject detail page.

## SEO checklist

- ✅ Per-page `title`, `description`, `canonical`, OG tags
- ✅ JSON-LD: `WebSite`, `Organization`, `Course`, `BreadcrumbList`
- ✅ Auto-generated sitemap + robots.txt (via `next-sitemap`)
- ✅ Trailing slash URLs (consistent canonicalization)
- ✅ Mobile-first responsive layout
- ⏳ OG image generation (add `app/opengraph-image.tsx` for dynamic per-route OG)
- ⏳ Analytics (Google Analytics 4 / Search Console verification)

## License

Content based on PCI B.Pharm NEP 2020 syllabus. Code is for educational use.
