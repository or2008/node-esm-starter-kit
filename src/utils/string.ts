export function splitToChunks(text: string, chunkSize: number) {
    return text.match(new RegExp(String.raw`\S.{1,${chunkSize - 2}}\S(?= |$)`, 'g'));
}
