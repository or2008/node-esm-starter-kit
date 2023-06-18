import { post } from '../../services/network.js';


export interface NotifyWebhookPaylod {
    id: string;
    error: string;
    data: null | Record<string, unknown>
}
export function notifyWebhook(payload: NotifyWebhookPaylod) {
    console.log(`[notify-webhook] Notifying with payload ${JSON.stringify(payload)}`);
    post('https://api.schrodi.co/stable-update', JSON.stringify(payload));
}