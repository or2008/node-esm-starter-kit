import { get } from './network.js';

// return posts from public Telegram channels.
export async function getPosts(channelId: string, page = 0, limit = 100): Promise<unknown> {
    const url = `https://tg.i-c-a.su/json/${channelId}?limit=${limit}/${page}`;
    return get(url);
}
