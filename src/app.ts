
import { init as initTgDstBot } from './modules/digest-telegram-bot/index.js';
import { initAsUser as initTgCore } from './services/telegram-core/telegram-core.js';
import { logger } from './services/logger.js';

async function init() {
    // await initChatGpt();
    // const res = await getChatGptApi().sendMessage('hello')
    // console.log(res);

    initTgDstBot();
}

async function main() {
    const msg = 'Running.. 🎯🤖';
    logger.info(msg);

    await initTgCore();
    await init();
}


main().catch((error: unknown) => {
    // if (error instanceof CustomError)
    //     logger.debug(error);
    console.log('main().catch');
    logger.error(error);
});
