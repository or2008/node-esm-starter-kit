import TextWrapper from 'text-wrapper';

import { splitToChunks as splitToChunksUtil } from '../../../../utils/string.js';

const textWrapper = new TextWrapper.default();

// module to split longs texts into smaller chunks.
export interface SplitToChunksOptions {
    chunkSize: number;
}

// export async function splitToChunks(text: string, config: SplitToChunksOptions) {
//     const { maxWordsPerChunk } = config;
//     return textWrapper.wrap(text, {
//         wrapOn: maxWordsPerChunk
//     });
// }

export async function splitToChunks(text: string, config: SplitToChunksOptions) {
    const { chunkSize } = config;
    return splitToChunksUtil(text, chunkSize);
}
