export type SubjectType = "T" | "P" | "I" | "RP";

export interface SubjectUnit {
    num: "I" | "II" | "III" | "IV" | "V";
    title: string;
    topics: string[];
    hours: string;
}

export interface Subject {
    code: string;
    name: string;
    credits: number;
    type: SubjectType;
    highlight?: boolean;
    units: SubjectUnit[];
    /** SEO slug used in /syllabus/semester-N/[slug]/ */
    slug: string;
    objectives?: string[];
    references?: string[];
}

export interface Semester {
    num: number;
    credits: number;
    /** primary brand color for the semester */
    color: string;
    /** soft background tint */
    bg: string;
    /** badge background */
    badge: string;
    /** short descriptive label */
    label: string;
    subjects: Subject[];
}

export interface TypeMeta {
    label: string;
    bg: string;
    color: string;
}
