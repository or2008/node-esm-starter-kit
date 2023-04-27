import type { Context } from 'telegraf';

export function getUsernameFromContext(ctx: Context) {
    if (!ctx.from) return '';

    return ctx.from.username ?? ctx.from.id;
}

// convert https://t.me/lobsters_chat to lobsters_chat - https://regex101.com/r/wbWNpu/1
export function getIdFromUrl(url: string) {
    const res = /(?:@|(?:https?:\/\/)?t(?:elegram)?\.me\/)(?<id>\w{3,32})$/mu.exec(url);
    if (!res || !res.groups || !res.groups.id) return '';

    return res.groups.id;
}