
import type { LoggerOptions} from 'pino';
import { pino } from 'pino';

const transport = pino.transport({
    targets: [
        {
            target: 'pino-pretty',

            level: 'trace',

            options: {
                // colorize: true,
                ignore: 'pid,hostname'
            }
        },
        {
            target: 'pino-loki',

            level: 'info',

            options: {
                batching: true,
                interval: 5,
                host: 'https://logs-prod-eu-west-0.grafana.net',

                basicAuth: {
                    username: '304642',
                    password: 'eyJrIjoiMmFiNjYyNTZlZjJmYzU1NzQ2NjBkZmRmMjhmNjQyNWE0MjlhYTlhMiIsIm4iOiJzbmlwZXItYm90IiwiaWQiOjcyNzA0OX0',
                },
            }
        }
    ]
}) as unknown as LoggerOptions; // https://github.com/pinojs/thread-stream/issues/24

export const logger = pino(transport);

logger.level = 'trace';
logger.info('Using pinojs/pino: 🌲 super fast, all natural json logger.');