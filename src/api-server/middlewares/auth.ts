import { createMiddleware } from 'express-zod-api';
import { z } from 'zod';

export const authMiddleware = createMiddleware({
    security: {
        // this information is optional and used for the generated documentation (OpenAPI)
        and: [
            { type: 'input', name: 'key' },
            { type: 'header', name: 'token' },
        ],
    },

    input: z.object({
        key: z.string().min(1),
    }),

    middleware: async ({ input: { key }, request, logger }) => {
        logger.debug('[authMiddleware] Checking the key and token');

        // const user = await db.Users.findOne({ key });
        // if (!user) {
        //     throw createHttpError(401, "Invalid key");
        // }
        // if (request.headers.token !== user.token) {
        //     throw createHttpError(401, "Invalid token");
        // }
        return { user: null }; // provides endpoints with options.user
    },
});
