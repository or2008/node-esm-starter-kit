import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function init() {
    // Connect the client
    await prisma.$connect();
    prisma.telegramUser.findFirst();
}

export function getPrisma() {
    return prisma;
}