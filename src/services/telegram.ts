import { type ExtraReplyMessage } from 'node_modules/telegraf/typings/telegram-types.js';
import { Telegraf } from 'telegraf';

import { getTelegramAdminChatId, getTelegramBotToken } from '../config.js';

const bot = new Telegraf(getTelegramBotToken());

export function getBot() {
    return bot;
}

export async function sendMessage(chatId: string, text: string, extra?:  ExtraReplyMessage) {
    return bot.telegram.sendMessage(chatId, text, extra);
}

export async function sendAdminMessage(text: string, extra?: ExtraReplyMessage) {
    const chatId = getTelegramAdminChatId();
    return bot.telegram.sendMessage(chatId, text, extra);
}
