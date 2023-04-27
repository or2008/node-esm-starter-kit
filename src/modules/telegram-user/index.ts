import type { Prisma } from '@prisma/client';

import { logger } from '../../services/logger.js';
import { getPrisma } from '../../services/prisma.js';

// export async function createOrUpdate(tgUser: Partial<TelegramUser>) {
//     const prisma = getPrisma();
//     const upsertUser = await prisma.telegramUser.upsert({
//         where: {
//             chatId: tgUser.chatId,
//         },

//         update: {
//             name: 'Viola the Magnificent',
//         },

//         create: {
//             email: 'viola@prisma.io',
//             name: 'Viola the Magnificent',
//         },
//     });
// }

export async function createUser(payload: Prisma.TelegramUserCreateInput) {
    logger.info(`[telegram-user/create] Creating telegram user with payload: ${JSON.stringify(payload)}`);
    return getPrisma().telegramUser.create({
        data: payload
    });
}

export async function getUserByTelegramId(telegramId: string) {
    logger.info(`[telegram-user/getUserByTelegramId] ${telegramId}`);
    return getPrisma().telegramUser.findUnique({
        where: {
            telegramId
        }
    });
}