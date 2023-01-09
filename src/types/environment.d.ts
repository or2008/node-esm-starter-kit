declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'development' | 'production';
            TELEGRAM_BOT_TOKEN: string;
        }
    }
}

export { };
// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.

