import { type Api } from 'telegram';

export function getUserDisplayNameFromApiMessage(apiMessage: Api.Message, users ) {
    // const { fromId, peerId } = apiMessage;
    // if (fromId) {
    //     const user = getUserById(users, from_id.user_id);
    //     if (!user) return from_id.user_id;
    //     return getUserDisplayName(user);
    // };

    // if (peer_id) return 'Channel_Bot';

    return 'unkown_user';
}


export function getMessagesParticipants(apiMessages: Api.Message[]) {
    const participants = new Set<number>();
    for (const apiMessage of apiMessages)
        participants.add(apiMessage.fromId.userId);

    return participants;

}