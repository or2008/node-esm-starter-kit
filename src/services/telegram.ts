import { Telegraf } from 'telegraf';

import { getTelegramAdminChatId, getTelegramBotToken } from '../config.js';

const bot = new Telegraf(getTelegramBotToken());

export function getBot() {
    return bot;
}

export async function sendMessage(chatId: string, text: string) {
    return bot.telegram.sendMessage(chatId, text);
}

export async function sendAdminMessage(text: string) {
    const chatId = getTelegramAdminChatId();
    return bot.telegram.sendMessage(chatId, text,);
}
