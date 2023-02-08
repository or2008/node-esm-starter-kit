import { init as initPrisma } from '../../services/prisma.js';

export async function init() {
    // Connect the client
    return initPrisma();
}