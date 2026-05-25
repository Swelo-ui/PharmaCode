/**
 * Convert any subject string (code + name) into a clean SEO-friendly slug.
 * Format: bp101t-python-programming-pharmaceutical-sciences
 */
export function makeSubjectSlug(code: string, name: string): string {
    const codeSlug = code
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    const nameSlug = name
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        // trim very long names but keep meaningful tokens
        .split("-")
        .filter(Boolean)
        .slice(0, 12)
        .join("-");

    return `${codeSlug}-${nameSlug}`;
}

export function semesterPath(n: number): string {
    return `/syllabus/semester-${n}/`;
}

export function subjectPath(n: number, slug: string): string {
    return `/syllabus/semester-${n}/${slug}/`;
}
