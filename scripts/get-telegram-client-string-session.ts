import { text } from 'input';
import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions/StringSession.js';

import { getTelegramAppHash, getTelegramAppId } from '../src/config.js';
import { logger } from '../src/services/logger.js';

async function init() {
    logger.info('Initalzing Telegram client as user...');

    const client = new TelegramClient(new StringSession(''), getTelegramAppId(), getTelegramAppHash(), {
        connectionRetries: 5,
    });

    await client.start({
        phoneNumber: async () => await text('Please enter your number: '),
        password: async () => await text('Please enter your password: '),
        phoneCode: async () => await text('Please enter the code you received: '),
        onError: err => logger.error(err),
    });

    logger.info('You should now be connected.');
    const string = client.session.save(); // Save this string to avoid logging in again
    logger.info(string);
}

init();
