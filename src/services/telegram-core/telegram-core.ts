import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions/StringSession.js';

import { getTelegramAppHash, getTelegramAppId, getTelegramClientStringSession } from '../../config.js';

// import { CustomError } from '../../errors.js';
// import { logger } from '../logger.js';

const client = new TelegramClient(
    new StringSession(getTelegramClientStringSession()),
    getTelegramAppId(),
    getTelegramAppHash(),
    { connectionRetries: 5 }
);

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
// export async function getMessages(channelId: string, minId = 0, limit = 2) {
//     return client.invoke(new Api.channels.GetMessages({ channel: channelId, id: [] }));
// }

export async function getMessages(channelId: string, minId = 0, limit = 2) {
    return client.getMessages(channelId, { limit, minId });
}

export async function getMessagesByOffsetDate(channelId: string, offsetDate: number) {
    return await client.getMessages(channelId, { offsetDate });
}

export async function getParticipants(channelId: string, ids: number[]) {
    return await client.getMessages(channelId, { ids });
}