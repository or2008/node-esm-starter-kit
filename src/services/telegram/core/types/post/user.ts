// import { type TelegramPostPhoto4 } from './media.js';

// interface TelegramPostEmojiStatus {
//     _: string;
//     document_id: number;
// }

export interface TelegramPostUser {
    _: string;
    self: boolean;
    contact: boolean;
    mutual_contact: boolean;
    deleted: boolean;
    bot: boolean;

    bot_chat_history: boolean;
    bot_nochats: boolean;
    verified: boolean;
    restricted: boolean;
    min: boolean;
    bot_inline_geo: boolean;
    support: boolean;
    scam: boolean;
    apply_min_photo: boolean;
    fake: boolean;
    bot_attach_menu: boolean;
    premium: boolean;
    attach_menu_enabled: boolean;
    id: number;
    access_hash: number;
    first_name?: string;
    last_name?: string;
    username?: string;

    // photo: TelegramPostPhoto4;

    // status: TelegramPostUser;

    // emoji_status: TelegramPostEmojiStatus;
    bot_info_version?: number;
}