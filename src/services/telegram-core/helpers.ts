import type { Api } from 'telegram';

export function getUserDisplayNameFromApiUser(user: Api.User) {
    const { firstName = '', lastName = '', username = '', accessHash } = user;

    if (username) return `@${username}`;

    let displayName = '';
    if (firstName) displayName = firstName;
    if (lastName) displayName = `${displayName} ${lastName}`;
    if (displayName.trim()) return displayName;

    return accessHash?.toString() ?? '';
}
export function getUserDisplayNameFromApiMessage(apiMessage: Api.Message) {
    const { sender } = apiMessage;
    if (sender && sender.className === 'User')
        return getUserDisplayNameFromApiUser(sender);

    if (sender && sender.className === 'Channel') return 'Channel_Bot';

    return 'unkown_user';
}


export function getMessagesParticipantIds(apiMessages: Api.Message[]) {
    const participantIds = new Set<number>();
    for (const apiMessage of apiMessages) {
        if (apiMessage.fromId && apiMessage.fromId.className === 'PeerUser')
            participantIds.add(apiMessage.fromId.userId.toJSNumber());
    }

    return participantIds;
}