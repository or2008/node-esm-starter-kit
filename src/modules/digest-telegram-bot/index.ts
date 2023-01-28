import { isAxiosError } from 'axios';
import { type Context, type NarrowedContext } from 'telegraf';
import { message } from 'telegraf/filters';
import { type Message, type Update } from 'telegraf/types';

import { CustomError } from '../../errors.js';
import { logger } from '../../services/logger.js';
import { getIdFromUrl } from '../../services/telegram-bot/helpers.js';
import { getBot, sendAdminMessage } from '../../services/telegram-bot/telegram-bot.js';
import { getPosts } from '../../services/telegram-core.js';
import { type TelegramPostMessage, type TelegramGetPostsResponse } from '../../services/telegram/core/types/post/root-object.js';
import { type TelegramPostUser } from '../../services/telegram/core/types/post/user.js';

import { texts } from './texts.js';

function getUserById(users: TelegramPostUser[], userId: number) {
    return users.find(user => userId === user.id);
}

function getUserDisplayName(user: TelegramPostUser) {
    const { username = '' } = user;

    // let displayName = ``;
    // if (first_name)displayName = `${first_name}`;
    // if (last_name) displayName = `${displayName} ${last_name}`;
    // if (displayName) return `${displayName} (${username})`;

    return `@${username}`;
}

function getUserDisplayNameFromPostsRes(postMessage: TelegramPostMessage, users: TelegramPostUser[] ) {
    const { from_id, peer_id } = postMessage;
    if (from_id) {
        const user = getUserById(users, from_id.user_id);
        if (!user) return from_id.user_id;
        return getUserDisplayName(user);
    };

    if (peer_id) return 'Channel_Bot';

    return 'unkown_user';
}

function convertToTextConversation(postsRes: TelegramGetPostsResponse) {
    const { messages, users } = postsRes;

    return messages.slice(0).reverse().map(postMessage => {
        const { message: msg } = postMessage;
        return `${getUserDisplayNameFromPostsRes(postMessage, users)}: ${msg}`;
    });
}

async function getChannelData(channelId: string) {
    const channelData = await getBot().telegram.getChat(`@${channelId}`);
    if (channelData.type === 'private') throw new CustomError('Invalid channel');
    return channelData;
}

// return array of messages with username prefixed in each item.
// ie. ['@wev: Im so gever', '@rev: and Im so gay']
async function getChannelConversation(channelId: string) {
    try {
        const postsRes = await getPosts(channelId, 0, 10);
        return convertToTextConversation(postsRes);
    } catch (error) {
        if (isAxiosError<Record<'errors', string>>(error)) {
            const errorMessage = error.response?.data.errors[0] ?? '';
            if (errorMessage.includes('Time to unlock access'))
                throw new CustomError('couldn\'t get channel conversation due to ban', errorMessage);
        }

        throw new CustomError('couldn\'t get channel conversation', error);
    }
}

async function digestChannel(channelId: string, ctx: Context) {
    const channelData = await getChannelData(channelId);

    // API can Temporary ban us any error, for example: invalid channel name or private channel. so call it after channelData ready
    const conversation = await getChannelConversation(channelId);

    const { title = '', description = '' } = channelData;

    const prompt = `
    For the following chat group:
    Group title: ${JSON.stringify(title)}.
    Group description: ${JSON.stringify(description)}.

    ------

    Write a recap of the discussed topics in the following array of messages, break to bullet points, and include usernames if needed:
    ${JSON.stringify(conversation)}
    `;

    await ctx.reply(prompt);
}

async function mapDigestChannelError(error: unknown, ctx: NarrowedContext<Context, Update.MessageUpdate<Message.TextMessage>>) {
    logger.error(`[digestChannel] ${JSON.stringify(error)}`);

    if (error instanceof CustomError) {
        if (error.message.includes('chat not found'))
            return ctx.reply(texts.errors.nonPublicChannel);
        if (error.message.includes('Invalid channel'))
            return ctx.reply(texts.errors.nonPublicChannel);

        // TODO In case of ban need to stop bot?
        if (error.message.includes('couldn\'t get channel conversation due to ban'))
            sendAdminMessage(`User recevied ban from tg.i-c-a.su api.\n\n ${JSON.stringify(error.payload)}`);
    }

    return ctx.reply(texts.errors.general);
}

async function onTextMessage(ctx: NarrowedContext<Context, Update.MessageUpdate<Message.TextMessage>>) {
    const { text = '' } = ctx.message;
    const channelId = getIdFromUrl(text);
    if (!channelId) return '';

    await digestChannel(channelId, ctx).catch(async (error: unknown) => mapDigestChannelError(error, ctx));
}

function subscribeToCommands() {
    const bot = getBot();

    bot.start(async ctx => ctx.replyWithHTML(texts.welcomeMessage, { disable_web_page_preview: true }));
    bot.help(async ctx => ctx.replyWithHTML(texts.welcomeMessage, { disable_web_page_preview: true }));
    bot.command('support', async ctx => ctx.reply(texts.supportMessage));
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
        }
    ]);
}

export function init() {
    const bot = getBot();

    setCommands();
    subscribeToCommands();
    bot.launch();
}