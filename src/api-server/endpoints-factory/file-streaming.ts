import { createReadStream } from 'node:fs';

import { EndpointsFactory, createResultHandler, ez } from 'express-zod-api';
import { z } from 'zod';

export const fileStreamingEndpointsFactory = new EndpointsFactory(
    createResultHandler({
        getPositiveResponse: () => ({
            schema: ez.file().binary(),
            mimeType: 'image/*',
        }),

        getNegativeResponse: () => ({ schema: z.string(), mimeType: 'text/plain' }),

        handler: ({ response, error, output }) => {
            if (error) {
                response.status(400).send(error.message);
                return;
            }
            if ('filename' in output) {
                console.log(output.path, output.filename);

                createReadStream(output.path).pipe(response.type(output.filename));
            } else {
                response.status(404).send('File is missing');
                // response.status(404).end();
            }
        },
    })
);
