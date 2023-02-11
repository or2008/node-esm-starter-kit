import { init as initI18next } from 'i18next';

import { en } from '../../lang/en.js';

export const resources = { en: { translation: en } } as const;

export async function init() {
    return initI18next({
        debug: true,
        fallbackLng: 'en',
        resources
    });
}