/* eslint-disable max-len */
import { randomNumber } from '../../utils/numbers.js';
import { queuePrompt } from '../../services/comfy-ui/comfy-ui.js';
import { enhancePrompts } from './enhance-prompt.js';
import { v4 as uuidv4 } from 'uuid';
import { StabilityAiImageToImageParams, StabilityAiTextToImageParams, generate, imageToImage, textToImage } from '../../services/stability-ai/stability-ai.js';
import { cloudinaryClient } from '../../services/cloudinary/cloudinary.js';
import { notifyWebhook } from './ notify-webhook.js';
import { get } from '../../services/network.js';
import axios from 'axios';

// export interface EnhancePromptOptions {
//     //
// }

export interface QueueEnhanceTextToImagePromptPayload {
    engineId: string;
    positivePrompt: string;
    negativePrompt?: string;
    filenamePrefix?: string;
    stabilityAiTextToImageParams?: StabilityAiTextToImageParams;
    // options?: EnhancePromptOptions;
}
export interface QueueEnhanceImageToImagePromptPayload {
    engineId: string;
    initImage: string;
    positivePrompt: string;
    negativePrompt?: string;
    stabilityAiImageToImageParams?: StabilityAiImageToImageParams;
    // options?: EnhancePromptOptions;
}

export async function queueEnhancePrompt(payload: QueueEnhanceTextToImagePromptPayload) {
    const { positivePrompt, negativePrompt, extraData, filenamePrefix = '' } = payload;

    const comfyUiPositivePrompt = `best quality, masterpiece, detailed, ((modest)), ((Fully clothed, loose clothes)), (${positivePrompt}), Cute, 3D, studio lighting, minimal, Depth of field, dribbble, Behance, quasi-object, 16K`;
    const comfyUiNegativePrompt = `${negativePrompt}, low quality, exposed skin, worst quality, watermark, signature, lowres, bad anatomy, bad hands, bad face, text, woman, error, missing fingers, extra digit, fewer digits, nsfw, cropped, worst quality, low quality`;
    // const comfyUiPositivePrompt = `(((${positivePrompt}))), (masterpiece) (illustration) (best quality) (cinematic lighting) (sharp focus) (photorealistic) (best quality) (detailed skin) (intricate details) (8k) (detailed eyes) (sharp focus)`;
    // const comfyUiNegativePrompt = `${negativePrompt}. (nsfw) (monochrome) (bad hands) (disfigured) (grain) (Deformed) (poorly drawn) (mutilated) (lowres) (deformed) (dark) (lowpoly) (CG) (3d) (blurry) (duplicate) (watermark) (label) (signature) (frames) (text)`;
    const comfyUiPrompt = {
        '3': {
            'inputs': {
                'seed': randomNumber(0, 2 ** 64),
                'steps': 24,
                'cfg': 6,
                'sampler_name': 'dpmpp_2m',
                'scheduler': 'normal',
                'denoise': 1,
                'model': ['4', 0],
                'positive': ['6', 0],
                'negative': ['7', 0],
                'latent_image': ['5', 0]
            },

            'class_type': 'KSampler'
        },

        '4': { 'inputs': { 'ckpt_name': 'revAnimated_v122.safetensors' }, 'class_type': 'CheckpointLoaderSimple' },
        '5': { 'inputs': { 'width': 512, 'height': 768, 'batch_size': 1 }, 'class_type': 'EmptyLatentImage' },
        '6': { 'inputs': { 'text': comfyUiPositivePrompt, 'clip': ['4', 1] }, 'class_type': 'CLIPTextEncode' },
        '7': { 'inputs': { 'text': comfyUiNegativePrompt, 'clip': ['4', 1] }, 'class_type': 'CLIPTextEncode' },
        '9': { 'inputs': { 'filename_prefix': filenamePrefix, 'images': ['12', 0] }, 'class_type': 'SaveImage' },
        '10': { 'inputs': { 'vae_name': 'vae-ft-mse-840000-ema-pruned.ckpt' }, class_type: 'VAELoader' },
        '12': { 'inputs': { 'samples': ['3', 0], 'vae': ['10', 0] }, 'class_type': 'VAEDecode' },

        // '10': { 'inputs': { 'upscale_model': ['11', 0], 'image': ['8', 0] }, 'class_type': 'ImageUpscaleWithModel' },
        // '11': { 'inputs': { 'model_name': '4x_foolhardy_Remacri.pth' }, 'class_type': 'UpscaleModelLoader' },
    };

    return queuePrompt({ prompt: comfyUiPrompt, extra_data: extraData });
}

// export async function queueEnhancePrompts(payloads: QueueEnhanceTextToImagePromptPayload[]) {
//     const prompts = payloads.map(payload => payload.positivePrompt);
//     const enhancedPrompts = await enhancePrompts(prompts);

//     const id = uuidv4();
//     const comfyResponses = [];
//     enhancedPrompts.forEach(async enhancedPrompt => {
//         const res = await queueEnhancePrompt({ positivePrompt: enhancedPrompt, filenamePrefix: `${id}` });
//         console.log('**************************');
//         console.log(res);
//         console.log('**************************');
//         comfyResponses.push(res.body);

//     });

//     return { id, comfyResponses };
// }
export async function queueEnhanceTextToImagePrompts(payloads: QueueEnhanceTextToImagePromptPayload[]) {
    // const prompts = payloads.map(payload => payload.positivePrompt);
    // const enhancedPrompt = await enhancePrompts(prompts);

    const id = uuidv4();

    payloads.forEach(async (payload, i) => {
        const { positivePrompt, negativePrompt, stabilityAiTextToImageParams, engineId } = payload;
        const params: StabilityAiTextToImageParams = {
            text_prompts: [{
                text: positivePrompt
            }],
            ...stabilityAiTextToImageParams
        };
        try {
            const fileNamePrefix = `${id}_${i}`;
            const res = await textToImage(engineId, params);

            res.artifacts.forEach((image, index) => {
                // writeFileSync(resolve(dirname(fileURLToPath(import.meta.url)), `output/${fileNamePrefix}_${index}.png`), Buffer.from(image.base64, 'base64'));
                console.log(`[cloudinaryClient] uploading ${fileNamePrefix}..`);

                cloudinaryClient.v2.uploader.upload(`data:image/jpeg;base64,${image.base64}`, {
                    async: false,
                    folder: 'schrodi-stories',
                    public_id: `${fileNamePrefix}_${index}`
                }, (error, callResult) => {
                    notifyWebhook({ id, error: error?.message, data: callResult });
                });
            });
        } catch (error) {
            console.error(error);
            notifyWebhook({ id, error: error.message, data: null });
        }
    });

    return { id };
}


export async function queueEnhanceImageToImagePrompts(payloads: QueueEnhanceImageToImagePromptPayload[]) {
    const id = uuidv4();

    payloads.forEach(async (payload, i) => {
        const { engineId, positivePrompt, stabilityAiImageToImageParams, initImage } = payload;
        try {
            const response = await axios.get(initImage, {
                responseType: 'arraybuffer',
            });
            const buffer = Buffer.from(response.data);
            console.log();

            const params: StabilityAiImageToImageParams = {
                text_prompts: [{
                    text: positivePrompt
                }],
                init_image: buffer,
                ...stabilityAiImageToImageParams
            };

            const fileNamePrefix = `${id}_${i}`;
            const res = await imageToImage(engineId, params);

            res.artifacts.forEach((image, index) => {
                // writeFileSync(resolve(dirname(fileURLToPath(import.meta.url)), `output/${fileNamePrefix}_${index}.png`), Buffer.from(image.base64, 'base64'));
                console.log(`[cloudinaryClient] uploading ${fileNamePrefix}..`);

                cloudinaryClient.v2.uploader.upload(`data:image/jpeg;base64,${image.base64}`, {
                    async: false,
                    folder: 'schrodi-stories',
                    public_id: `${fileNamePrefix}_${index}`
                }, (error, callResult) => {
                    notifyWebhook({ id, error: error?.message, data: callResult });
                });
            });
        } catch (error) {
            console.error(error);
            notifyWebhook({ id, error: error.message, data: null });
        }
    });

    return { id };
}

