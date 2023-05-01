import { init as initI18next } from './services/i18n/i18n.js';
import { logger } from './services/logger.js';
import { init as initComfyUi  } from './services/comfy-ui/comfy-ui.js';
import { init as initServer } from './api-server/server.js';

async function main() {
    const msg = 'Running.. 🎯🤖';
    logger.info(msg);

    initServer();
    await initI18next();
    initComfyUi();


    // setTimeout(async () => {
    //     await queuePrompt().catch(console.error);
    // }, 2000);


    // await initDbModule();
    // await initTgCore();
    // await initTgDstBot();
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