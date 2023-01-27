import 'dotenv/config';

export function getTelegramBotToken() {
    return process.env.TELEGRAM_BOT_TOKEN;
}

export function getTelegramAdminChatId() {
    return process.env.TELEGRAM_ADMIN_CHAT_ID;
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

export function getChatGptEmail() {
    return process.env.OPENAI_EMAIL;
}

export function getChatGptPassword() {
    return process.env.OPENAI_PASSWORD;
}

