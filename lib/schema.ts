import type { Semester, Subject } from "./types";
import { SITE, absUrl } from "./site";

export interface BreadcrumbItem {
    name: string;
    href: string;
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: item.name,
            item: absUrl(item.href),
        })),
    };
}

export function organizationSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        name: "PharmaCode",
        legalName: "PharmaCode",
        alternateName: ["PharmaCode", "Pharma Code", "PharmaCode India", "PharmaCode — B.Pharm NEP 2020"],
        url: SITE.url,
        logo: absUrl("/logo.png"),
        description: "Free B.Pharm study material, NEP 2020 syllabus, unit-wise notes and PDF downloads for pharmacy students in India.",
        sameAs: [],
        knowsAbout: [
            "B.Pharm NEP 2020 Syllabus",
            "Pharmacy Education India",
            "PCI Approved Curriculum",
            "B.Pharm Notes PDF",
            "BP101T Basics of Python Programming for Pharmaceutical Sciences",
            "BP301T Introduction to Machine Learning in Pharmaceutical Sciences",
            "BP604T AI Applications in Pharmaceutical Sciences",
            "BP705T Pharmacovigilance",
            "BP707T Regulatory Affairs",
            "BP801T Ethical Considerations and Translational Applications of AI in Pharmacy",
            "GPAT 2027 Syllabus & Preparation",
            "B.Pharm Semester 1 to 8 Free Notes PDF",
        ],
    };
}

export function websiteSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "PharmaCode",
        alternateName: ["PharmaCode", "Pharma Code", "PharmaCode India", "PharmaCode B.Pharm"],
        url: SITE.url,
        publisher: {
            "@type": "EducationalOrganization",
            name: "PharmaCode",
            logo: absUrl("/logo.png"),
        },
        potentialAction: {
            "@type": "SearchAction",
            target: `${SITE.url}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string",
        },
    };
}

export function semesterCourseSchema(sem: Semester) {
    return {
        "@context": "https://schema.org",
        "@type": "Course",
        name: `B.Pharm Semester ${sem.num} — NEP 2020 Syllabus`,
        description: `${sem.label}. Complete subject and unit breakdown for B.Pharm Semester ${sem.num} as per PCI NEP 2020 (${sem.credits} credits).`,
        provider: {
            "@type": "EducationalOrganization",
            name: SITE.name,
            sameAs: SITE.url,
        },
        url: absUrl(`/syllabus/semester-${sem.num}/`),
        educationalLevel: "Undergraduate",
        courseCode: `BPHARM-S${sem.num}`,
        inLanguage: "en-IN",
        isAccessibleForFree: true,
        teaches: sem.subjects.map(s => s.name),
    };
}

export function subjectCourseSchema(sem: Semester, sub: Subject) {
    return {
        "@context": "https://schema.org",
        "@type": "Course",
        name: `${sub.code}: ${sub.name}`,
        description: `${sub.name} — Semester ${sem.num} B.Pharm NEP 2020. Unit-wise syllabus, key topics and free PDF notes.`,
        provider: {
            "@type": "EducationalOrganization",
            name: SITE.name,
            sameAs: SITE.url,
        },
        url: absUrl(`/syllabus/semester-${sem.num}/${sub.slug}/`),
        courseCode: sub.code,
        educationalLevel: "Undergraduate — B.Pharm",
        inLanguage: "en-IN",
        isAccessibleForFree: true,
        numberOfCredits: sub.credits,
    };
}

/* ── FAQ Schema — Rich Snippets ke liye ── */
export function faqSchema(faqs: { q: string; a: string }[]) {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map(({ q, a }) => ({
            "@type": "Question",
            name: q,
            acceptedAnswer: {
                "@type": "Answer",
                text: a,
            },
        })),
    };
}

/* ── ItemList Schema — Notes page ke liye ── */
export function itemListSchema(
    items: { name: string; url: string; position: number }[]
) {
    return {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "B.Pharm Notes PDF — All Semesters (PCI NEP 2020)",
        description: "Free B.Pharm unit-wise notes PDF for all 8 semesters as per PCI NEP 2020 syllabus.",
        numberOfItems: items.length,
        itemListElement: items.map(({ name, url, position }) => ({
            "@type": "ListItem",
            position,
            name,
            url: absUrl(url),
        })),
    };
}

