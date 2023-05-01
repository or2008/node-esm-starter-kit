import { createConfig } from 'express-zod-api';


export function getGeneratedImageBucketBaseUrl() {
    return process.env.GENERATED_IMAGE_BUCKET_BASE_URL;
}

export function getPort() {
    return process.env.PORT;
}

export function getEnv() {
    return process.env.NODE_ENV;
}

export function getBaseUrl() {
    return process.env.BASE_URL;
}

export function getApiVersion() {
    return process.env.API_VERSION;
}

export function getServerUrl() {
    const env = getEnv();
    if (env === 'development') return `${getBaseUrl()}:${getPort()}`;

    return getBaseUrl().toString();
}

export const config = createConfig({
    server: {
        listen: getPort(), // port or socket

    },

    // server: {
    //     listen: 80,
    //   },
    //   https: {
    //     options: {
    //       cert: fs.readFileSync("fullchain.pem", "utf-8"),
    //       key: fs.readFileSync("privkey.pem", "utf-8"),
    //     },
    //     listen: 443, // port or socket
    //   },

    cors: true,

    logger: {
        level: 'debug',
        color: true
    },
});