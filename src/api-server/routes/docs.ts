import { readFileSync } from 'fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';
import { jsonEndpointsFactory } from '../endpoints-factory/json.js';

const openApi = jsonEndpointsFactory.build({
    method: 'get',

    input: z.object({}),
    output: z.any(),

    handler: async ({ options, logger }) => {
        const openApiJson = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '../docs/openApi.json'), { encoding: 'utf8' });
        return JSON.parse(openApiJson);
    },
});

const routes = {
    'open-api': openApi
};

export default routes;