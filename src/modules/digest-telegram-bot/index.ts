import { type Context, type NarrowedContext } from 'telegraf';
import { message } from 'telegraf/filters';
import { type User, type Message, type Update } from 'telegraf/types';

import { CustomError } from '../../errors.js';
import { logger } from '../../services/logger.js';
import { getIdFromUrl } from '../../services/telegram-bot/helpers.js';
import { getBot, sendAdminMessage, sendLoadingMessage } from '../../services/telegram-bot/telegram-bot.js';
import { createUser, getUserByTelegramId } from '../telegram-user/index.js';

import { digestChannel } from './digest-channel/index.js';
import { texts } from './texts.js';

async function mapDigestChannelError(error: unknown, ctx: NarrowedContext<Context, Update.MessageUpdate<Message.TextMessage>>) {
    logger.error(error);

    return ctx.reply(texts.errors.general);
}

async function onDigestChannelSuccess(summary: string, ctx: NarrowedContext<Context, Update.MessageUpdate<Message.TextMessage>>) {
    await ctx.reply(summary, { disable_web_page_preview: true });
    sendAdminMessage(summary);
}

async function getChannelData(channelId: string, ctx: NarrowedContext<Context, Update.MessageUpdate<Message.TextMessage>>) {
    try {
        const channelData = await getBot().telegram.getChat(`@${channelId}`);
        if (channelData.type === 'private') throw new CustomError('Invalid channel');
        return channelData;
    } catch {
        ctx.reply(texts.errors.nonPublicChannel);
    }
}

async function getOrCreateUser(fromUser: User) {
    const { id, first_name = '', last_name = '', username = '' } = fromUser;
    const user = await getUserByTelegramId(id.toString());
    if (user) return user;

    return createUser({ firstName: first_name, lastName: last_name, telegramId: id.toString(), username });
}

async function onTextMessage(ctx: NarrowedContext<Context, Update.MessageUpdate<Message.TextMessage>>) {
    const { text = '' } = ctx.message;
    const channelId = getIdFromUrl(text);
    if (!channelId) return;

    logger.debug(`[onTextMessage] from ${ctx.from.username ?? ctx.from.id}: ${text}`);

    const channelData = await getChannelData(channelId, ctx);
    if (!channelData) return;

    const { title = '', description = '' } = channelData;
    const { stopLoading } = await sendLoadingMessage(ctx.chat.id, texts.digestingChannel);

    try {
        const internalUser = await getOrCreateUser(ctx.from);
        const summary = await digestChannel({
            channelId,
            channelTitle: title,
            channelDescription: description,
            userId: internalUser.id
        });
        await stopLoading();
        onDigestChannelSuccess(summary, ctx);
    } catch (error) {
        mapDigestChannelError(error, ctx);
        stopLoading();
    }
}

function subscribeToCommands() {
    const bot = getBot();

    bot.start(async ctx => ctx.replyWithHTML(texts.welcomeMessage, { disable_web_page_preview: true }));
    bot.help(async ctx => ctx.replyWithHTML(texts.welcomeMessage, { disable_web_page_preview: true }));
    bot.command('support', async ctx => ctx.reply(texts.supportMessage));
    bot.command('feedback', async ctx => ctx.reply(texts.feedbackMessage));
    bot.on(message('text'), async ctx => onTextMessage(ctx));
}

async function setCommands() {
    const bot = getBot();

    await bot.telegram.setMyCommands([
        {
            command: '/help',
            description: texts.commands.helpDescription,
        },
        {
            command: '/support',
            description: texts.commands.supportDescription,
        },
        {
            command: '/feedback',
            description: texts.commands.feedbackDescription
        }
    ]);
}

export async function init() {
    const bot = getBot();

    // bot.use(session());
    setCommands();
    subscribeToCommands();
    return bot.launch();
}
