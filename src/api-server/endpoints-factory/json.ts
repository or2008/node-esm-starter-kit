import { EndpointsFactory, createResultHandler } from 'express-zod-api';
import { z } from 'zod';

export const jsonEndpointsFactory = new EndpointsFactory(
    createResultHandler({
        getPositiveResponse: () => ({
            schema: z.any()
        }),

        getNegativeResponse: () => ({
            schema: z.string()
        }),

        handler: ({ response, error, output }) => {
            if (error) {
                response.status(400).json(error.message);
                return;
            }

            return response.json(output);
        },
    })
);
