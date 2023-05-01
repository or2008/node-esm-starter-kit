/* eslint-disable max-len */
import { randomNumber } from '../../utils/numbers.js';
import { queuePrompt } from '../../services/comfy-ui/comfy-ui.js';
import { enhancePrompts } from './enhance-prompt.js';
// export interface EnhancePromptOptions {
//     //
// }

export interface QueueEnhancePromptPayload {
    positivePrompt: string;
    negativePrompt?: string;
    // options?: EnhancePromptOptions;
}

export async function queueEnhancePrompt(payload: QueueEnhancePromptPayload): Promise<void> {
    const { positivePrompt, negativePrompt } = payload;

    const comfyUiPositivePrompt = `${positivePrompt}. (((wide angle))), 8k, Cinematography, photorealistic, epic composition Unreal Engine, Cinematic, Color Grading, Portrait Photography, Ultra-Wide Angle, Depth of Field, hyper detailed _SamDoesArt2_, best quality, super high resolution, beautiful, masterpiece, best quality, perfect lighting, super high resolution, super detailed, masterpiece, best quality.`;
    const comfyUiNegativePrompt = `${negativePrompt}. (low quality, worst quality:1.4), canvas frame, cartoon, 3d, ((disfigured)), ((bad art)), ((deformed)),((extra limbs)),((close up)),((b&w)), weird colors, blurry, (((duplicate))), ((morbid)), ((mutilated)), [out of frame], extra fingers, mutated hands, ((poorly drawn hands)), ((poorly drawn face)), (((mutation))), (((deformed))), ((ugly)), blurry, ((bad anatomy)), (((bad proportions))), ((extra limbs)), cloned face, (((disfigured))), out of frame, ugly, extra limbs, (bad anatomy), gross proportions, (malformed limbs), ((missing arms)), ((missing legs)), (((extra arms))), (((extra legs))), mutated hands, (fused fingers), (too many fingers), (((long neck))), Photoshop, video game, ugly, tiling, poorly drawn hands, poorly drawn feet, poorly drawn face, out of frame, mutation, mutated, extra limbs, extra legs, extra arms, disfigured, deformed, cross-eye, body out of frame, blurry, bad art, bad anatomy,3d render, canvas frame, cartoon, 3d, ((disfigured)), ((bad art)), ((deformed)),((extra limbs)),((close up)),((b&w)), wierd colors, blurry, (((duplicate))), ((morbid)), ((mutilated)), [out of frame], extra fingers, mutated hands, ((poorly drawn hands)), ((poorly drawn face)), (((mutation))), (((deformed))), ((ugly)), blurry, ((bad anatomy)), (((bad proportions))), ((extra limbs)), cloned face, (((disfigured))), out of frame, ugly, extra limbs, (bad anatomy), gross proportions, (malformed limbs), ((missing arms)), ((missing legs)), (((extra arms))), (((extra legs))), mutated hands, (fused fingers), (too many fingers), (((long neck))), Photoshop, video game, ugly, tiling, poorly drawn hands, poorly drawn feet, poorly drawn face, out of frame, mutation, mutated, extra limbs, extra legs, extra arms, disfigured, deformed, cross-eye, body out of frame, blurry, bad art, bad anatomy, 3d render`;

    const comfyUiPrompt = {
        '3': {
            'inputs': {
                'seed': randomNumber(0, 2 ** 64),
                'steps': 22,
                'cfg': 7,
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

        '4': { 'inputs': { 'ckpt_name': 'deliberate_v2.safetensors' }, 'class_type': 'CheckpointLoaderSimple' },
        '5': { 'inputs': { 'width': 512, 'height': 512, 'batch_size': 1 }, 'class_type': 'EmptyLatentImage' },
        '6': { 'inputs': { 'text': comfyUiPositivePrompt, 'clip': ['4', 1] }, 'class_type': 'CLIPTextEncode' },
        '7': { 'inputs': { 'text': comfyUiNegativePrompt, 'clip': ['4', 1] }, 'class_type': 'CLIPTextEncode' },
        '8': { 'inputs': { 'samples': ['3', 0], 'vae': ['4', 2] }, 'class_type': 'VAEDecode' },
        '9': { 'inputs': { 'filename_prefix': 'ComfyUI', 'images': ['8', 0] }, 'class_type': 'SaveImage' }
    };

    return queuePrompt(comfyUiPrompt);
}

export async function queueEnhancePrompts(payloads: QueueEnhancePromptPayload[]): Promise<void> {
    const prompts = payloads.map(payload => payload.positivePrompt);
    const enhancedPrompts = await enhancePrompts(prompts);

    enhancedPrompts.forEach(enhancedPrompt => {
        queueEnhancePrompt({ positivePrompt: enhancedPrompt });
    });
}