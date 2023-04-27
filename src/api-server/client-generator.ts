// example client-generator.ts
import fs from 'node:fs';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { Client } from 'express-zod-api';

import { routing } from './routing.js';

export function init() {
    fs.writeFileSync(
        path.resolve(dirname(fileURLToPath(import.meta.url)), './frontend/client.ts'),
        new Client({
            routing,

            // optionalPropStyle: { withQuestionMark: true, withUndefined: true }, // optional
        }).print(),
        'utf8'
    );
}
