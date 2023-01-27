import { ChatGPTAPIBrowser } from 'chatgpt';

import { getChatGptEmail, getChatGptPassword } from '../config.js';

import { logger } from './logger.js';

const api = new ChatGPTAPIBrowser({
    email: getChatGptEmail(),
    password: getChatGptPassword()
});

export async function init() {
    logger.info('Initializing ChatGPT api..');
    await api.initSession();
}

export function getApi() {
    return api;
}
