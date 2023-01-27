import { type Context } from 'telegraf';

export function getUsernameFromContext(ctx: Context) {
    if (!ctx.from) return '';

    return ctx.from.username ?? ctx.from.id;
}