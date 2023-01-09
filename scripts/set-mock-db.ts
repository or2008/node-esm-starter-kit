import type { TestEntry } from '../src/modules/db/model.js';
import { logger } from '../src/services/logger.js';
import { addEntry, getTable, init } from '../src/modules/db/index.js';

async function run() {
    logger.info('Setting up mock DB.. 🚀🚀🚀');
    await init();

    const data: TestEntry[] = [
        {
            id: '0xf609bedf6752aca5073d3643db12f0ed1b9f5e89',
            tokenName: 'Hyworld',
        },
        {
            id: '0x84a0fdfcaea03f57fb7e7aa511db3da76bbefd0f',
            tokenName: 'JumpX',
        },
        {
            id: '0xca07f2cadb981c7886a83357b4540002c1f41020',
            tokenName: 'Laeeb',
        }
    ];

    data.forEach(entry => {
        addEntry('entries', entry);
    });

    logger.info(getTable('entries'));

    // const upcomingListings = getTable('upcomingListings');
}

run().catch((error: unknown) => logger.error(error));
