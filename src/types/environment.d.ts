declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'development' | 'production';
            TELEGRAM_BOT_TOKEN: string;
            TELEGRAM_ADMIN_CHAT_ID: string;
            GOOGLE_API_KEY: string;
            NLPCLOUD_API_KEY: string;
            OPENAI_API_KEY: string;
            OPENAI_EMAIL: string;
            OPENAI_PASSWORD: string;
        }
    }
}

export { };
// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.

