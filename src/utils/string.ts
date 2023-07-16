export function ensureStartsWithSlash(str: string): string {
    if (!str.startsWith('/'))
        return `/${str}`;

    return str;
}