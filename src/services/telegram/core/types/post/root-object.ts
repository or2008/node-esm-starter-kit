import { type TelegramPostChat } from './chat.js';
import { type TelegramPostFromId, type TelegramPostPeerId } from './peer.js';
import { type TelegramPostUser } from './user.js';

export interface TelegramPostMessage {
    _: string;
    out: boolean;
    mentioned: boolean;
    media_unread: boolean;
    silent: boolean;
    post: boolean;
    from_scheduled: boolean;
    legacy: boolean;
    edit_hide: boolean;
    pinned: boolean;
    noforwards: boolean;
    id: number;
    from_id?: TelegramPostFromId;
    peer_id?: TelegramPostPeerId;
    date: number;
    message: string;
    media: TelegramPostMessage;

    // replies: TelegramPostReplies;
    // entities: TelegramPostEntity[];
    edit_date?: number;

    // reactions: TelegramPostReactions;
    // fwd_from: TelegramPostFwdFrom;
    views?: number;
    forwards?: number;

    // reply_to: TelegramPostReplyTo;
}

export interface TelegramGetPostsResponse {
    _: string;
    inexact: boolean;
    pts: number;
    count: number;
    messages: TelegramPostMessage[];
    chats: TelegramPostChat[];
    users: TelegramPostUser[];

    // sponsored_messages: any[];
}


//


// interface TelegramPostText2 {
//     _: string;
//     text: any;
//     url: string;
//     webpage_id?: number;
// }

// interface TelegramPostText {
//     _: string;
//     text: any;
//     texts: Text2[];
// }

// interface TelegramPostAuthor {
//     _: string;
//     text: string;
// }

// interface TelegramPostText3 {
//     _: string;
//     text: string;
// }

// interface TelegramPostItem {
//     _: string;
//     num: string;
//     text: Text3;
// }

// interface TelegramPostReplies {
//     _: string;
//     comments: boolean;
//     replies: number;
//     replies_pts: number;
//     max_id?: number;
// }

// interface TelegramPostEntity {
//     _: string;
//     offset: number;
//     length: number;
//     url: string;
// }

// interface TelegramPostReaction {
//     _: string;
//     emoticon: string;
// }

// interface TelegramPostResult {
//     _: string;
//     reaction: Reaction;
//     count: number;
// }

// interface TelegramPostPeerId2 {
//     _: string;
//     user_id: number;
// }

// interface TelegramPostReaction2 {
//     _: string;
//     emoticon: string;
// }

// interface TelegramPostRecentReaction {
//     _: string;
//     big: boolean;
//     unread: boolean;
//     peer_id: PeerId2;
//     reaction: Reaction2;
// }

// interface TelegramPostReactions {
//     _: string;
//     min: boolean;
//     can_see_list: boolean;
//     results: Result[];
//     recent_reactions: RecentReaction[];
// }

// interface TelegramPostFromId2 {
//     _: string;
//     channel_id: number;
// }

// interface TelegramPostFwdFrom {
//     _: string;
//     imported: boolean;
//     from_id: FromId2;
//     date: number;
//     channel_post: number;
// }

// interface TelegramPostReplyTo {
//     _: string;
//     reply_to_scheduled: boolean;
//     reply_to_msg_id: number;
//     reply_to_top_id: number;
// }

// interface TelegramPostDefaultBannedRights {
//     _: string;
//     view_messages: boolean;
//     send_messages: boolean;
//     send_media: boolean;
//     send_stickers: boolean;
//     send_gifs: boolean;
//     send_games: boolean;
//     send_inline: boolean;
//     embed_links: boolean;
//     send_polls: boolean;
//     change_info: boolean;
//     invite_users: boolean;
//     pin_messages: boolean;
//     until_date: number;
// }

// interface TelegramPostStatus {
//     _: string;
//     was_online?: number;
// }

// interface TelegramPostEmojiStatus {
//     _: string;
//     document_id: number;
// }
