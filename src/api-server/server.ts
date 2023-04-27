import { createServer  } from 'express-zod-api';

import { config } from './config.js';
import { routing } from './routing.js';
import { init as initClientGenerator } from './client-generator.js';
import { init as initOpenapiGenerator } from './openapi-generator.js';

export const port = config.server.listen;

// export const app = express();

// app.use(express.json());
// app.use('/image', imageRouter);

export function init() {
    createServer(config, routing);
    initClientGenerator();
    initOpenapiGenerator();
}
