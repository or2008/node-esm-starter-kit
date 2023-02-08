import { type Api } from 'telegram';
import { type TotalList } from 'telegram/Helpers.js';
import { type Prisma } from '@prisma/client';

import { CustomError } from '../../../errors.js';
import { getApi as getChatGptApi } from '../../../services/chatgpt.js';
import { getApi as getOpenAiApi } from '../../../services/open-ai/open-ai.js';
import { getClient } from '../../../services/telegram-core/telegram-core.js';
import { getTotalTokens } from '../../llm/helpers.js';
import { logger } from '../../../services/logger.js';
import { getBot, sendAdminMessage } from '../../../services/telegram-bot/telegram-bot.js';
import { getUserDisplayNameFromApiMessage } from '../../../services/telegram-core/helpers.js';
import { getPrisma } from '../../../services/prisma.js';

function convertToTextConversation(messagesRes: TotalList<Api.Message>) {
    return messagesRes.map(apiMessage => {
        const { message: msg } = apiMessage;
        const displayName = getUserDisplayNameFromApiMessage(apiMessage);
        return `${displayName}: ${msg}`;
    });
}

// return array of messages with username prefixed in each item.
// ie. ['@wev: Im so gever', '@rev: and Im so gay']
async function getChannelConversation(channelId: string) {
    logger.info(`[getChannelConversation] for channel ${channelId}..`);
    const messagesRes = await getClient().getMessages(channelId, { limit: 200 });
    return convertToTextConversation(messagesRes);
}

async function summarizeConversation(conversation: string, channelTitle: string, channelDescription: string) {
    logger.info(`[summarizeConversation] conversation length: ${conversation.length}`);

    const prompt = `
    For the following chat group:
    Group title: ${JSON.stringify(channelTitle)}.
    Group description: ${JSON.stringify(channelDescription)}.

    ------

    Write few detailed bullet points of the most important key points in the following chat discussion, include username handles:

    ${JSON.stringify(conversation)}`;

    logger.debug(`[summarizeConversation] prompt: ${prompt}`);

    try {
        // const res = await getChatGptApi().sendMessage(prompt, { promptPrefix: '' });
        // return res.text;

        const completion = await getOpenAiApi().createCompletion({
            model: 'text-davinci-003',
            prompt,
            max_tokens: 300,
            temperature: 0.7,
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

export async function createTelegramChannelDigest(payload: Prisma.TelegramChannelDigestCreateInput) {
    logger.info(`[digest-channel/createTelegramChannelDigest] Creating telegram channel digest with payload: ${JSON.stringify(payload)}`);
    return getPrisma().telegramChannelDigest.create({
        data: payload
    });
}

export interface DigestChannelPayload {
    userId: string;
    channelId: string;
    channelTitle: string;
    channelDescription: string;
}

export async function digestChannel(payload: DigestChannelPayload) {
    const { channelDescription, channelId, channelTitle, userId } = payload;

    logger.info(`[digestChannel] for channel ${channelId}..`);
    sendAdminMessage(`[digestChannel] for channel https://t.me/${channelId}`);

    const conversation = await getChannelConversation(channelId);
    const limitedConversation = limitMessagesUpToMaxTokens(conversation, 1024); // .slice(0).reverse()
    logger.debug(`[digestChannel] limit conversation from ${conversation.length} to ${limitedConversation.length} messages..`);

    const limitedConversationText = limitedConversation.slice(0).reverse().join('\n');
    const res = await summarizeConversation(limitedConversationText, channelTitle, channelDescription);

    createTelegramChannelDigest({
        channelId,

        createdBy: {
            connect: {
                id: userId
            }
        }
    });

    return res;
}
