
import { z } from 'zod';
import { createHttpError, ez } from 'express-zod-api';

import defaultEndpointsFactory from '../endpoints-factory.js';
import { queueEnhanceTextToSpeechPrompts } from '../../modules/voice/index.js';


const hello = defaultEndpointsFactory.build({
    method: 'get',

    input: z.object({
        // for empty input use z.object({})
        name: z.string().optional(),
    }),

    output: z.object({
        greetings: z.string(),
        createdAt: ez.dateOut(), // Date -> string
    }),

    handler: async ({ input: { name }, options, logger }) => {
        logger.debug('Options:', options); // middlewares provide options
        return { greetings: `Hello, ${name ?? 'World'}. Happy coding!`, createdAt: new Date() };
    },
});


const enhanceTextToSpeechPrompts = defaultEndpointsFactory
    // .addMiddleware(authMiddleware)
    .build({
        method: 'post',

        input:
            z.object({
                prompts: z.object({
                    voiceId: z.string(),
                    text: z.string().max(100000, 'Must be 100,000 or fewer characters long'),
                    elevenlabsTextToSpeechParams: z.any()
                }).array()
            }),

        output: z.object({
            id: z.string()
        }),

        handler: async ({ input: { prompts }, options, logger }) => {
            logger.debug('Options:', options); // middlewares provide options
            try {
                const res = await queueEnhanceTextToSpeechPrompts(prompts);
                return res;
            } catch (error) {
                throw createHttpError(400, 'Failed ' + error.message);
            }
        },
    });


const routes = {
    hello,
    'enhance-text-2-speech-batch': enhanceTextToSpeechPrompts,
};
export default routes;