// example client-generator.ts
import fs from 'node:fs';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import manifest from '../../package.json' assert { type: 'json'};

import { OpenAPI } from 'express-zod-api';

import { routing } from './routing.js';
import { config, getApiVersion, getServerUrl } from './config.js';
import { type } from 'node:os';

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
        version: manifest.version,
        title: 'Node API',
        serverUrl: getServerUrl(),
        composition: 'inline', // optional, or "components" for keeping schemas in a separate dedicated section using refs
    }).getSpecAsJson();

    writeToFile(jsonString);
    return jsonString;
}
