import type WebSocket from 'ws';
import { get, post } from '../network.js';
import { createWebSocket } from '../ws/ws.js';
import { logger } from '../logger.js';
import { notifyWebhook } from '../../modules/ notify-webhook.js';

let ws: WebSocket | null = null;
let clientId = '32371c472bf0441da26c154deed68d91';
export interface ConfyUiPromptPayload {
    prompt: Record<string, unknown>;
    extra_data?: unknown;
    client_id?: string;
}

// {
//     'client_id': '32371c472bf0441da26c154deed68d91',

//     'prompt': {
//         '3': {
//             'inputs': {
//                 'seed': randomNumber(0, 2 ** 64),
//                 'steps': 22, 'cfg': 7, 'sampler_name': 'dpmpp_2m', 'scheduler': 'normal', 'denoise': 1, 'model': ['4', 0], 'positive': ['6', 0], 'negative': ['7', 0], 'latent_image': ['5', 0] },

//             'class_type': 'KSampler' },

//         '4': { 'inputs': { 'ckpt_name': 'deliberate_v2.safetensors' }, 'class_type': 'CheckpointLoaderSimple' },
//         '5': { 'inputs': { 'width': 512, 'height': 512, 'batch_size': 1 }, 'class_type': 'EmptyLatentImage' },
//         '6': { 'inputs': { 'text': 'A cute Kawaii tiny hyper realistic baby jaguar, wearing hip hop clothes, city background. wide angle full body, 8k, Cinematography, photorealistic,epic composition Unreal Engine,Cinematic, Color Grading, Portrait Photography,Ultra-Wide Angle, Depth of Field, hyper detailed _SamDoesArt2_, photorealistic, realistic, photorealistic, best quality, super high resolution, beautiful, masterpiece, best quality, perfect lighting, best quality, super high resolution, photo realistic, super detailed, masterpiece, best quality,\\n', 'clip': ['4', 1] }, 'class_type': 'CLIPTextEncode' },
//         '7': { 'inputs': { 'text': '(low quality, worst quality:1.4), canvas frame, cartoon, 3d, ((disfigured)), ((bad art)), ((deformed)),((extra limbs)),((close up)),((b&w)), weird colors, blurry, (((duplicate))), ((morbid)), ((mutilated)), [out of frame], extra fingers, mutated hands, ((poorly drawn hands)), ((poorly drawn face)), (((mutation))), (((deformed))), ((ugly)), blurry, ((bad anatomy)), (((bad proportions))), ((extra limbs)), cloned face, (((disfigured))), out of frame, ugly, extra limbs, (bad anatomy), gross proportions, (malformed limbs), ((missing arms)), ((missing legs)), (((extra arms))), (((extra legs))), mutated hands, (fused fingers), (too many fingers), (((long neck))), Photoshop, video game, ugly, tiling, poorly drawn hands, poorly drawn feet, poorly drawn face, out of frame, mutation, mutated, extra limbs, extra legs, extra arms, disfigured, deformed, cross-eye, body out of frame, blurry, bad art, bad anatomy,3d render, canvas frame, cartoon, 3d, ((disfigured)), ((bad art)), ((deformed)),((extra limbs)),((close up)),((b&w)), wierd colors, blurry, (((duplicate))), ((morbid)), ((mutilated)), [out of frame], extra fingers, mutated hands, ((poorly drawn hands)), ((poorly drawn face)), (((mutation))), (((deformed))), ((ugly)), blurry, ((bad anatomy)), (((bad proportions))), ((extra limbs)), cloned face, (((disfigured))), out of frame, ugly, extra limbs, (bad anatomy), gross proportions, (malformed limbs), ((missing arms)), ((missing legs)), (((extra arms))), (((extra legs))), mutated hands, (fused fingers), (too many fingers), (((long neck))), Photoshop, video game, ugly, tiling, poorly drawn hands, poorly drawn feet, poorly drawn face, out of frame, mutation, mutated, extra limbs, extra legs, extra arms, disfigured, deformed, cross-eye, body out of frame, blurry, bad art, bad anatomy, 3d render', 'clip': ['4', 1] }, 'class_type': 'CLIPTextEncode' },
//         '8': { 'inputs': { 'samples': ['3', 0], 'vae': ['4', 2] }, 'class_type': 'VAEDecode' },
//         '9': { 'inputs': { 'filename_prefix': 'ComfyUI', 'images': ['8', 0] }, 'class_type': 'SaveImage' }
//     }
// })

export function init(cid = '') {
    if (ws) return ws;
    if (cid) clientId = cid;

    ws = createWebSocket(`ws://127.0.0.1:8188/ws?clientId=${clientId}`, {
        perMessageDeflate: false
    });

    ws.on('error', console.error);
    ws.on('close', console.log); // TODO recconect
    ws.on('message', event => {
        try {
            const msg = JSON.parse(event.toString());
            // notifyWebhook({});
            console.log(JSON.stringify(msg, null, 4));

            switch (msg.type) {
            case 'status': {
                if (msg.data.sid)
                    clientId = msg.data.sid;
                    // this.dispatchEvent(new CustomEvent('status', { detail: msg.data.status }));
                break;
            }

            case 'progress': {
                // console.log(msg.type);
                break;
            }
            case 'executing': {
                // console.log(msg.type);
                break;
            }
            case 'executed': {
                // console.log(msg.type);
                // this.dispatchEvent(new CustomEvent('executed', { detail: msg.data }));
                break;
            }
            default: {
                throw new Error(`Unknown message type ${msg.type}`);
            }
            }
        } catch {
            console.warn('Unhandled message:', event);
        }
    });
}

export async function queuePrompt(payload: ConfyUiPromptPayload) {
    const { prompt, extra_data } = payload;
    logger.debug('[services/comfy-ui] queuePrompt');
    return post('http://127.0.0.1:8188/prompt', JSON.stringify({ client_id: clientId, prompt, extra_data }));
}

/**
 * Gets the current state of the queue
 * @returns The currently running and queued items
 */
async function getQueue() {
    try {
        const res = await get('/queue');
        const data = await res.json();
        return {
            // Running action uses a different endpoint for cancelling
            Running: data.queue_running.map(prompt => ({
                prompt,
                remove: { name: 'Cancel', cb: () => api.interrupt() },
            })),

            Pending: data.queue_pending.map(prompt => ({ prompt })),
        };
    } catch (error) {
        console.error(error);
        return { Running: [], Pending: [] };
    }
}

/**
     * Gets the prompt execution history
     * @returns Prompt history including node outputs
     */
export async function getHistory() {
    try {
        const res = await get('/history');
        return { History: Object.values(await res.json()) };
    } catch (error) {
        console.error(error);
        return { History: [] };
    }
}

/**
 * Deletes an item from the specified list
 * @param {string} type The type of item to delete, queue or history
 * @param {number} id The id of the item to delete
 */
export async function deleteItem(type: 'history' | 'queue', id: string) {
    await post(type, { delete: [id] });
}

/**
 * Clears the specified list
 * @param {string} type The type of list to clear, queue or history
 */
export async function clearItems(type: 'history' | 'queue') {
    await post(type, { clear: true });
}

/**
 * Interrupts the execution of the running prompt
 */
export async function interrupt() {
    await post('interrupt');
}

/**
    * Poll status  for colab and other things that don't support websockets.
*/
// export function pollQueue() {
//     setInterval(async () => {
//         try {
//             const resp = await fetch('http://127.0.0.1:8188/prompt');
//             const status = await resp.json();
//             this.dispatchEvent(new CustomEvent('status', { detail: status }));
//         } catch {
//             this.dispatchEvent(new CustomEvent('status', { detail: null }));
//         }
//     }, 1000);
// }