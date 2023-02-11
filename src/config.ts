import 'dotenv/config';

export function getTelegramBotToken() {
    return process.env.TELEGRAM_BOT_TOKEN;
}

export function getTelegramAdminChatId() {
    return process.env.TELEGRAM_ADMIN_CHAT_ID;
}

export function getTelegramAppId() {
    return Number(process.env.TELEGRAM_APP_ID);
}

export function getTelegramAppHash() {
    return process.env.TELEGRAM_APP_HASH;
}

export function getTelegramClientStringSession() {
    return process.env.TELEGRAM_CLIENT_STRING_SESSION;
}

export function getGoogleApiKey() {
    return process.env.GOOGLE_API_KEY;
}

export function getNlpcloudApiKey() {
    return process.env.NLPCLOUD_API_KEY;
}

export function getOpenAiApiKey() {
    return process.env.OPENAI_API_KEY;
}

export function getNodeEnv(): 'development' | 'production' {
    return process.env.NODE_ENV;
}