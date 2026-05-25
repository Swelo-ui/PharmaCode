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
        "@type": "Organization",
        name: SITE.name,
        url: SITE.url,
        logo: absUrl("/logo.png"),
        sameAs: [],
    };
}

export function websiteSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: SITE.name,
        url: SITE.url,
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
            "@type": "Organization",
            name: SITE.name,
            sameAs: SITE.url,
        },
        url: absUrl(`/syllabus/semester-${sem.num}/`),
        educationalLevel: "Undergraduate",
        courseCode: `BPHARM-S${sem.num}`,
    };
}

export function subjectCourseSchema(sem: Semester, sub: Subject) {
    return {
        "@context": "https://schema.org",
        "@type": "Course",
        name: `${sub.code}: ${sub.name}`,
        description: `${sub.name} — Semester ${sem.num} B.Pharm NEP 2020. Unit-wise syllabus, key topics and free PDF notes.`,
        provider: {
            "@type": "Organization",
            name: SITE.name,
            sameAs: SITE.url,
        },
        url: absUrl(`/syllabus/semester-${sem.num}/${sub.slug}/`),
        courseCode: sub.code,
    };
}
