import { EndpointsFactory, createResultHandler } from 'express-zod-api';
import { z } from 'zod';

export const proxyEndpointsFactory = new EndpointsFactory(
    createResultHandler({
        getPositiveResponse: () => ({
            schema: z.any()
        }),

        getNegativeResponse: () => ({
            schema: z.any()
        }),

        handler: ({ response, error, output }) => output,
    })
);
