import fs from 'node:fs';

import { runCommand } from './helpers.js';

const logger = console;

const preCommitFileContent = `#!/bin/sh
. "$(dirname "$0")/_/husky.sh"
cd ./bot && npx lint-staged`;


async function run() {
    logger.info('Setting up pre commit hook.. 🚀🚀🚀');
    fs.writeFileSync('.husky/pre-commit', preCommitFileContent);

    await runCommand('chmod +x .husky/pre-commit');
}

run().catch((error) => logger.error(error) );
