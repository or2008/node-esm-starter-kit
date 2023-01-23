import NLPCloudClient from 'nlpcloud';

import { getNlpcloudApiKey } from '../config.js';
import { CustomError } from '../errors.js';

const client = new NLPCloudClient('bart-large-cnn', getNlpcloudApiKey(), false);

export async function summarize(text: string) {
    try {
        const res = await client.summarization(text, 'large');
        if (res.data.summary_text) return res.data.summary_text;
        return '';
    } catch (error: unknown) {
        throw new CustomError('[services/summarize] failed to summarize', error.response.data);
    }
}
