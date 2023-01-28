import { get } from './network.js';
import { type TelegramGetPostsResponse } from './telegram/core/types/post/root-object.js';

// return posts from public Telegram channels.
export async function getPosts(channelId: string, page = 0, limit = 100) {
    const url = `https://tg.i-c-a.su/json/${channelId}?limit=${limit}/${page}`;
    return get<TelegramGetPostsResponse>(url);
}
