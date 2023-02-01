import { Api, TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions/StringSession.js';
import input from 'input';

import { getTelegramAppHash, getTelegramAppId, getTelegramBotToken, getTelegramClientStringSession } from '../../config.js';
import { CustomError } from '../../errors.js';
import { logger } from '../logger.js';

const client = new TelegramClient(
    new StringSession(getTelegramClientStringSession()),
    getTelegramAppId(),
    getTelegramAppHash(),
    { connectionRetries: 5 }
);

export async function initAsBot() {
    logger.info('Initalzing Telegram client as bot...');

    await client.start({
        botAuthToken: getTelegramBotToken(),
    });
    await client.connect();

    logger.info('You should now be connected.');
    logger.info(client.session.save()); // Save this string to avoid logging in again
}

export async function initAsUser() {
    logger.info('Initalzing Telegram client as user...');

    await client.start({
        phoneNumber: async () => await input.text('phone number?'),
        password: async () => await input.text('password?'),
        phoneCode: async () => await input.text('Code?'),
        onError: err => console.log(err),
    });
    logger.info('You should now be connected.');
    logger.info(client.session.save()); // Save this string to avoid logging in again
}

export function getClient() {
    return client;
}

// return posts from public Telegram channels.
// export async function getPosts(channelId: string, page = 0, limit = 100) {
//     const url = `https://tg.i-c-a.su/json/${channelId}?limit=${limit}/${page}`;
//     logger.debug(`[telegram-core/getPosts] for url ${url}..`);
//     return await get<TelegramGetPostsResponse>(url).catch((error: unknown) => {
//         throw new CustomError('[getPosts] failed', error);
//     });
// }

// return posts from public Telegram channels.
export async function getMessages(channelId: string, minId = 0, limit = 2) {
    return client.getMessages(channelId, { limit, minId });
}

export async function getMessagesByOffsetDate(channelId: string, offsetDate: number) {
    return await client.getMessages(channelId, { offsetDate });
}

export async function getParticipants(channelId: string, ids: number[]) {
    return await client.getMessages(channelId, { ids });
}