export interface TelegramPostChat {
    _: string;
    creator: boolean;
    left: boolean;
    broadcast: boolean;
    verified: boolean;
    megagroup: boolean;
    restricted: boolean;
    signatures: boolean;
    min: boolean;
    scam: boolean;
    has_link: boolean;
    has_geo: boolean;
    slowmode_enabled: boolean;
    call_active: boolean;
    call_not_empty: boolean;
    fake: boolean;
    gigagroup: boolean;
    noforwards: boolean;
    join_to_send: boolean;
    join_request: boolean;
    id: number;
    access_hash: number;
    title: string;
    username: string;

    // photo: TelegramPostPhoto3;
    date: number;

    // default_banned_rights: DefaultBannedRights;
}