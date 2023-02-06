import { ChatGPTAPI } from 'chatgpt';

import { getOpenAiApiKey } from '../config.js';

import { logger } from './logger.js';

const api = new ChatGPTAPI({
    debug: true,
    apiKey: getOpenAiApiKey()
});

export async function init() {
    logger.info('Initializing ChatGPT api..');
}

export function getApi() {
    return api;
}
