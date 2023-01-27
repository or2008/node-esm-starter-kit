import { message } from 'telegraf/filters';

import { getBot } from '../../services/telegram-bot/telegram-bot.js';

function subscribeToCommands() {
    const bot = getBot();

    bot.start(async ctx => ctx.reply('Welcome'));

    bot.help(async ctx => ctx.reply('Send me a sticker'));

    bot.on(message('sticker'), async ctx => ctx.reply('👍'));

    bot.hears('hi', async ctx => ctx.reply('Hey there'));
}

export function init() {
    const bot = getBot();

    subscribeToCommands();
    bot.launch();
}