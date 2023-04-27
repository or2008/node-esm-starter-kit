import { Telegraf } from 'telegraf';
import rateLimit from 'telegraf-ratelimit';
import { t } from 'i18next';

import { getTelegramBotToken } from '../../config.js';
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

// Set a global limit of 10 messages per 60 seconds
bot.use(rateLimit({ window: 60 * 1000, limit: 10, onLimitExceeded: async ctx => ctx.reply(t('errors.rateLimit')) }));

export async function sendMessage(chatId: number, text: string) {
    return bot.telegram.sendMessage(chatId, text);
}

export async function sendAdminMessage(text: string) {
    // const chatId = getTelegramAdminChatId();
    // return bot.telegram.sendMessage(chatId, text);
}

// Append ... with animation to each message
export async function sendLoadingMessage(chatId: number, text: string) {
    const loadingMessage = await sendMessage(chatId, text);

    const suffix = '.'; // 🤖
    const loops = 3;
    let loop = 0;
    const intervalId = setInterval(async () => {
        await bot.telegram.editMessageText(chatId, loadingMessage.message_id, '', `${text}${suffix.repeat(loop + 1)}`).catch(() => {
            // swallow error
        });
        loop += 1;
        if (loop === loops) loop = 0;
    }, 1000);

    return {
        stopLoading: async () => {
            clearInterval(intervalId);
            return bot.telegram.deleteMessage(chatId, loadingMessage.message_id);
        },

        deleteLoadingMessage: async () => bot.telegram.deleteMessage(chatId, loadingMessage.message_id)
    };
}

bot.catch(error => {
    logger.error('bot.catch1');
    logger.error(error);

});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));