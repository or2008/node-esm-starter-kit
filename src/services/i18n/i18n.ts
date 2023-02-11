import { init as initI18next } from 'i18next';

import { getNodeEnv } from '../../config.js';
import { en } from '../../lang/en.js';

export const resources = { en: { translation: en } } as const;

export async function init() {
    return initI18next({
        debug: getNodeEnv() === 'development',
        fallbackLng: 'en',
        resources
    });
}