import { Telegraf } from 'telegraf';

import { getTelegramAdminChatId, getTelegramBotToken } from '../../config.js';
import { logger } from '../logger.js';

import { getUsernameFromContext } from './helpers.js';

const bot = new Telegraf(getTelegramBotToken());

export function getBot() {
    return bot;
}

bot.use(async (ctx, next) => {
    logger.debug(`[TelegramService] Processing ${ctx.updateType} update: ${ctx.update.update_id}. from ${getUsernameFromContext(ctx)}.`);
    await next(); // runs next middleware
    logger.debug(`[TelegramService] Processing ${ctx.updateType} update: ${ctx.update.update_id} End.`);
});

export async function sendMessage(chatId: string, text: string) {
    return bot.telegram.sendMessage(chatId, text);
}

export async function sendAdminMessage(text: string) {
    const chatId = getTelegramAdminChatId();
    return bot.telegram.sendMessage(chatId, text,);
}

bot.catch(error => {
    logger.error(error);
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));