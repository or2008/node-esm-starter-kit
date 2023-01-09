import 'dotenv/config';

export function getTelegramBotToken() {
    return process.env.TELEGRAM_BOT_TOKEN;
}

