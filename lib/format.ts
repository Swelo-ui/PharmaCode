/** Helpers used across UI components. */

export function pluralize(n: number, singular: string, plural?: string): string {
    return `${n} ${n === 1 ? singular : plural ?? singular + "s"}`;
}

export function clsx(...parts: Array<string | false | null | undefined>): string {
    return parts.filter(Boolean).join(" ");
}
