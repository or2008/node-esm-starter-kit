import { createConfig } from 'express-zod-api';

export const config = createConfig({
    server: {
        listen: 8090, // port or socket
    },

    cors: true,

    logger: {
        level: 'debug',
        color: true
    },
});