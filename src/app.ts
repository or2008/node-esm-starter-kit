
import { init as initTgDstBot } from './modules/digest-telegram-bot/index.js';
import { logger } from './services/logger.js';

async function main() {
    const msg = 'Running.. 🎯🤖';
    logger.info(msg);

    await initTgDstBot();
}

main().catch((error: unknown) => {
    // if (error instanceof CustomError)
    //     logger.debug(error);
    logger.error('main().catch');
    logger.error(error);
});

// if the Promise is rejected this will catch it
process.on('unhandledRejection', (error: unknown) => {
    logger.error('unhandledRejection..');
    logger.error(error);
    if (error instanceof Error)
        throw error;
});

process.on('uncaughtException', error => {
    logger.error('uncaughtException..');
    logger.error(error);

});