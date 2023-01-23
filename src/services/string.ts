export function countWords(str: string) {
    const matches = str.match(/[\w'’-]+/gu);
    return matches ? matches.length : 0;
}