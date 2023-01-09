import { type ExtraReplyMessage } from 'node_modules/telegraf/typings/telegram-types.js';
import { Telegraf } from 'telegraf';

import { getTelegramBotChatId, getTelegramBotToken } from '../config.js';

const bot = new Telegraf(getTelegramBotToken());

// bot.on('text', async ctx => ctx.reply('Hello'));

// Start webhook via launch method (preferred)
// bot.launch({ webhook: { domain: webhookDomain, port } });

export function getBot() {
    return bot;
}

export async function sendMessage(text: string, extra?:  ExtraReplyMessage) {
    const chatId = getTelegramBotChatId();
    return bot.telegram.sendMessage(chatId, text, extra);
}
