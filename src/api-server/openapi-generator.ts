// example client-generator.ts
import fs from 'node:fs';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { OpenAPI } from 'express-zod-api';

import { routing } from './routing.js';
import { config } from './config.js';

function writeToFile(jsonString: string) {
    fs.writeFileSync(
        path.resolve(dirname(fileURLToPath(import.meta.url)), './docs/openApi.json'),
        jsonString,
        'utf8'
    );
}

export function init() {
    const jsonString = new OpenAPI({
        routing,
        config,
        version: '1.0.0',
        title: 'Example API',
        serverUrl: 'https://example.com',
        composition: 'inline', // optional, or "components" for keeping schemas in a separate dedicated section using refs
    }).getSpecAsJson();

    writeToFile(jsonString);
    return jsonString;
}
