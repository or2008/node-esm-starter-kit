import { ChatGPTAPIBrowser } from 'chatgpt';

import { getChatGptEmail, getChatGptPassword } from '../config.js';

const api = new ChatGPTAPIBrowser({
    email: getChatGptEmail(),
    password: getChatGptPassword()
});

export async function init() {
    await api.initSession();
}

export function getApi() {
    return api;
}
