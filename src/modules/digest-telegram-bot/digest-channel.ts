import { type Api } from 'telegram';
import { type TotalList } from 'telegram/Helpers.js';

import { CustomError} from '../../errors.js';
import { getApi as getChatGptApi } from '../../services/chatgpt.js';
import { getApi as getOpenAiApi } from '../../services/open-ai/open-ai.js';
import { getClient } from '../../services/telegram-core/telegram-core.js';
import { getTotalTokens } from '../llm/helpers.js';
import { logger } from '../../services/logger.js';
import { getBot, sendAdminMessage } from '../../services/telegram-bot/telegram-bot.js';
import { getUserDisplayNameFromApiMessage } from '../../services/telegram-core/helpers.js';

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


export async function digestChannel(channelId: string) {
    logger.info(`[digestChannel] for channel ${channelId}..`);
    sendAdminMessage(`[digestChannel] for channel https://t.me/${channelId}`);

    const channelData = await getChannelData(channelId);
    const { title = '', description = '' } = channelData;

    const conversation = await getChannelConversation(channelId);
    const limitedConversation = limitMessagesUpToMaxTokens(conversation, 1024); // .slice(0).reverse()
    logger.debug(`[digestChannel] limit conversation from ${conversation.length} to ${limitedConversation.length} messages..`);

    const limitedConversationText = limitedConversation.slice(0).reverse().join('\n');
    return summarizeConversation(limitedConversationText, title, description);
}
