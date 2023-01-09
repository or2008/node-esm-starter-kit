import { sendMessage } from './services/telegram.js';
import { init as initTelegramBotCommands } from './telegram-bot-commands.js';
import { logger } from './services/logger.js';


async function main() {
    const msg = 'Running.. 🎯🤖';
    logger.info(msg);
    sendMessage(msg);

    initTelegramBotCommands();
}

main().catch((error: unknown) => {
    // if (error instanceof CustomError)
    //     logger.debug(error);

    logger.error(error);
});
