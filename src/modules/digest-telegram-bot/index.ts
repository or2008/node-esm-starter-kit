import { t } from 'i18next';
import { Markup, type Context, type NarrowedContext } from 'telegraf';
import { message } from 'telegraf/filters';
import { type User, type Message, type Update } from 'telegraf/types';

import { CustomError } from '../../errors.js';
import { logger } from '../../services/logger.js';
import { getIdFromUrl } from '../../services/telegram-bot/helpers.js';
import { getBot, sendAdminMessage, sendLoadingMessage } from '../../services/telegram-bot/telegram-bot.js';
import { type TgGroupChat, type TextMessageCtx, type CallbackQueryCtx } from '../../types/custom.js';
import { createUser, getUserByTelegramId } from '../telegram-user/index.js';

import { digestChannel } from './digest-channel/index.js';

async function mapDigestChannelError(error: unknown, ctx: TextMessageCtx) {
    logger.error(error);

    return ctx.reply(t('errors.general'));
}

async function onDigestChannelSuccess(summary: string, ctx: TextMessageCtx) {
    await ctx.reply(summary, { disable_web_page_preview: true });
    sendAdminMessage(summary);
}

async function getChannelData(channelId: string, ctx: TextMessageCtx) {
    try {
        const channelData = await getBot().telegram.getChat(`@${channelId}`);
        if (channelData.type === 'private') throw new CustomError('Invalid channel');
        return channelData;
    } catch {
        ctx.reply(t('errors.nonPublicChannel'));
    }
}

async function getOrCreateUser(fromUser: User) {
    const { id, first_name = '', last_name = '', username = '' } = fromUser;
    const user = await getUserByTelegramId(id.toString());
    if (user) return user;

    return createUser({ firstName: first_name, lastName: last_name, telegramId: id.toString(), username });
}

async function digestRecentChannelMessages(ctx: TextMessageCtx, channelData: TgGroupChat) {
    const { title = '', description = '', id } = channelData;
    const { stopLoading } = await sendLoadingMessage(ctx.chat.id, t('digestChannel.digestingChannel'));

    try {
        const internalUser = await getOrCreateUser(ctx.from);
        const summary = await digestChannel({
            channelId: id.toString(),
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

async function digestScheduleChannelMessages(ctx: TextMessageCtx, channelData: TgGroupChat) {
    await ctx.reply(t('digestChannel.comingSoonMessage'));
}

async function onTextMessage(ctx: TextMessageCtx) {
    const bot = getBot();

    const { text = '' } = ctx.message;
    const channelId = getIdFromUrl(text);
    if (!channelId) return;

    logger.debug(`[onTextMessage] from ${ctx.from.username ?? ctx.from.id}: ${text}`);

    const channelData = await getChannelData(channelId, ctx);
    if (!channelData) return;

    bot.action('btn-recent-messages-summary', async () => digestRecentChannelMessages(ctx, channelData));
    bot.action('btn-daily-schedule-summary', async () => digestScheduleChannelMessages(ctx, channelData));

    await ctx.reply(t('shareChannelSuccess', { channeTitle: channelData.title }),
        {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Latest messages summary 🔍', callback_data: 'btn-recent-messages-summary' }],
                    [{ text: 'Daily summary schedule 🗓️ (coming soon..)', callback_data: 'btn-daily-schedule-summary' }]
                ],
            }
        });
}

function subscribeToCommands() {
    const bot = getBot();

    bot.start(async ctx => ctx.replyWithHTML(t('welcomeMessage'), { disable_web_page_preview: true }));
    bot.help(async ctx => ctx.replyWithHTML(t('welcomeMessage'), { disable_web_page_preview: true }));
    bot.command('support', async ctx => ctx.reply(t('supportMessage')));
    bot.command('feedback', async ctx => ctx.reply(t('feedbackMessage')));

    bot.on(message('text'), async ctx => onTextMessage(ctx));
}

async function setCommands() {
    const bot = getBot();

    await bot.telegram.setMyCommands([
        {
            command: '/help',
            description: t('commands.helpDescription'),
        },
        {
            command: '/support',
            description: t('commands.supportDescription'),
        },
        {
            command: '/feedback',
            description: t('commands.feedbackDescription')
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
