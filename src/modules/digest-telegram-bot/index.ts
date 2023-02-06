import { isAxiosError } from 'axios';
import { type Context, type NarrowedContext } from 'telegraf';
import { message } from 'telegraf/filters';
import { type Message, type Update } from 'telegraf/types';
import { type Api } from 'telegram';
import { type TotalList } from 'telegram/Helpers.js';

import { CustomError } from '../../errors.js';
import { getApi as getChatGptApi } from '../../services/chatgpt.js';
import { logger } from '../../services/logger.js';
import { getApi as getOpenAiApi } from '../../services/open-ai/open-ai.js';
import { getIdFromUrl } from '../../services/telegram-bot/helpers.js';
import { getBot, sendAdminMessage, sendLoadingMessage } from '../../services/telegram-bot/telegram-bot.js';
import { getUserDisplayNameFromApiMessage } from '../../services/telegram-core/helpers.js';
import { getClient } from '../../services/telegram-core/telegram-core.js';
import { getTotalTokens } from '../llm/helpers.js';

import { texts } from './texts.js';

function convertToTextConversation(messagesRes: TotalList<Api.Message>) {
    return messagesRes.map(apiMessage => {
        const { message: msg } = apiMessage;
        const displayName = getUserDisplayNameFromApiMessage(apiMessage);
        return `${displayName}: ${msg}`;
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
    logger.info(`[getChannelConversation] for channel ${channelId}..`);
    try {
        const messagesRes = await getClient().getMessages(channelId, { limit: 200 });

        return convertToTextConversation(messagesRes);
    } catch (error) {
        if (isAxiosError<Record<'errors', string> | Record<string, string>>(error)) {
            const errorMessage = error.response?.data.errors?.at(0) ?? '';
            if (errorMessage.includes('Time to unlock access'))
                throw new CustomError('couldn\'t get channel conversation due to ban', errorMessage);
        }

        throw new CustomError('couldn\'t get channel conversation', error);
    }
}

async function summarizeConversation(conversation: string, channelTitle: string, channelDescription: string) {
    logger.info(`[summarizeConversation] conversation length: ${conversation.length}`);

    const prompt = `
    For the following chat group:
    Group title: ${JSON.stringify(channelTitle)}.
    Group description: ${JSON.stringify(channelDescription)}.

    ------

    Write a detailed summary of the following chat as a bullet point list of the most important points, include username handles:

    ${JSON.stringify(conversation)}`;

    logger.debug(`[summarizeConversation] prompt: ${prompt}`);

    try {
        // const res = await getChatGptApi().sendMessage(prompt, { promptPrefix: '' });
        // return res.text;

        const completion = await getOpenAiApi().createCompletion({
            model: 'text-davinci-003',
            prompt,
            max_tokens: 250,
            temperature: 1,
            top_p: 1,
            frequency_penalty: 0,
            best_of: 1
        });
        const res = completion.data.choices[0].text;
        if (!res) throw new CustomError('returned empty res');

        return res;
    } catch (error: unknown) {
        throw new CustomError('couldn\'t summarize conversation', error);
    }
}

// Get array of messages, and cut them when reaching max tokens
function limitMessagesUpToMaxTokens(messages: string[], maxTokens: number) {
    const limitedMessages: string[] = [];
    for (const msg of messages) {
        const tokens = getTotalTokens(limitedMessages.join('\n'));
        if (tokens > maxTokens) break;
        limitedMessages.push(msg);
    }

    return limitedMessages;
}

async function digestChannel(channelId: string) {
    logger.info(`[digestChannel] for channel ${channelId}..`);
    sendAdminMessage(`[digestChannel] for channel https://t.me/${channelId}`);

    const channelData = await getChannelData(channelId);
    const { title = '', description = '' } = channelData;

    // API can Temporary ban us any error, for example: invalid channel name or private channel. so call it after channelData ready
    const conversation = await getChannelConversation(channelId);
    const limitedConversation = limitMessagesUpToMaxTokens(conversation, 2048); // .slice(0).reverse()
    logger.debug(`[digestChannel] limit conversation from ${conversation.length} to ${limitedConversation.length} messages..`);

    const limitedConversationText = limitedConversation.slice(0).reverse().join('\n');
    return summarizeConversation(limitedConversationText, title, description);
}

async function mapDigestChannelError(error: unknown, ctx: NarrowedContext<Context, Update.MessageUpdate<Message.TextMessage>>) {
    logger.error(error);

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
    logger.debug(`[onTextMessage] from ${ctx.from.username ?? ctx.from.id}: ${text}`);

    if (!channelId) return '';

    const stopLoading = await sendLoadingMessage(ctx.chat.id, texts.digestingChannel);
    const summary = await digestChannel(channelId).catch(async (error: unknown) => mapDigestChannelError(error, ctx));
    stopLoading();

    if (!summary) return '';
    await ctx.reply(summary, { disable_web_page_preview: true });
    sendAdminMessage(summary);
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

export async function init() {
    const bot = getBot();

    setCommands();
    subscribeToCommands();
    return bot.launch();
}
