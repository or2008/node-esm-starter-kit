import { getBot, sendAdminMessage } from './services/telegram.js';

async function onStopCommand() {
    await sendAdminMessage('process.exit..');
    process.exit();
}

export function init() {
    const bot = getBot();
    bot.start(async ctx => ctx.reply('Welcome! let\'s make some moneyyy'));
    bot.hears('hi', async ctx => ctx.reply('hi there!'));
    bot.hears('stop', onStopCommand);
    bot.launch();

    // Enable graceful stop
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
}