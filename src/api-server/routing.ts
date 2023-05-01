import type { Routing } from 'express-zod-api';

import image from './routes/image.js';
import docs from './routes/docs.js';

export const routing: Routing = {
    docs,
    image
};
