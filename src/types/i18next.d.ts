import { resources } from '../services/i18n/i18n.js';

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: typeof resources['en'];
  }
}