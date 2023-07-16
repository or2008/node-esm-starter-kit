import { writeFileSync } from 'node:fs';
import { get, post } from '../network.js';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import FormData from 'form-data';
import { convertObjectToFormData, convertToFormData, serialize } from '../../utils/form-data.js';
import axios from 'axios';
import { logger } from '../logger.js';

export interface StabilityAiTextToImageParams {
    text_prompts: { text: string, weight?: number }[],
    cfg_scale?: number,
    clip_guidance_preset?: string,
    height?: number,
    width?: number,
    samples?: number,
    steps?: number,
    seed?: number,
    style_preset?: string;
}

export interface StabilityAiImageToImageParams {
    text_prompts: { text: string, weight?: number }[],
    init_image: Buffer,
    init_image_mode?: string,
    image_strength?: number,
    cfg_scale?: number,
    clip_guidance_preset?: string,
    sampler?: string,
    height?: number,
    width?: number,
    samples?: number,
    steps?: number,
    seed?: number,
    style_preset?: string;

}

const apiHost = 'https://api.stability.ai';
const apiKey = process.env.STABILITYAI_API_KEY;

interface GenerationResponse {
    artifacts: Array<{
        base64: string
        seed: number
        finishReason: string
    }>
}

export async function textToImage(engineId: string, params: StabilityAiTextToImageParams) {
    const body = Object.assign({}, {
        cfg_scale: 7,
        clip_guidance_preset: 'FAST_BLUE',
        height: 512,
        width: 512,
        samples: 1,
        steps: 30,
    }, params);

    console.log('[stability-ai] generating text-to-image with the following body request:');
    console.log(`POST ${apiHost}/v1/generation/${engineId}/image-to-image ${JSON.stringify(body)}`);

    try {
        const res = await post(`${apiHost}/v1/generation/${engineId}/text-to-image`,
            JSON.stringify(body),
            {
                Authorization: `Bearer ${apiKey}`,
            }
        );

        const resJSON = (await res.json()) as GenerationResponse;
        console.log(resJSON);

        if (!resJSON.artifacts) throw new Error(resJSON.message);

        return resJSON;
    } catch (error) {
        logger.error(error.message);
        throw new Error(error.message);
    }
}

export async function imageToImage(engineId: string, params: StabilityAiImageToImageParams) {
    const body = Object.assign({}, {
        'init_image': params.init_image,
        'image_strength': 0.35,
        // 'init_image_mode': 'IMAGE_STRENGTH',
        // 'init_image': '<image binary>',
        // 'text_prompts[0][text]': 'A dog space commander',
        // 'text_prompts[0][weight]': 1,
        // 'cfg_scale': 7,
        // 'clip_guidance_preset': 'FAST_BLUE',
        // 'sampler': 'K_DPM_2_ANCESTRAL',
        // 'samples': 3,
        // 'steps': 20
    }, params);

    const formData = convertObjectToFormData(body);
    console.log(formData.toString());

    // const formData = new FormData();

    // console.log(params.init_image);

    // formData.append('init_image', params.init_image);
    // formData.append('init_image_mode', 'IMAGE_STRENGTH');
    // formData.append('image_strength', 0.35);
    // formData.append('text_prompts[0][text]', 'Galactic dog wearing a cape');

    // formData.append('init_image_mode', 'IMAGE_STRENGTH');
    // formData.append('image_strength', 0.35);
    // formData.append('text_prompts[0][text]', 'Galactic dog wearing a cape');
    // formData.append('cfg_scale', 7);
    // formData.append('clip_guidance_preset', 'FAST_BLUE');
    // formData.append('samples', 1);
    // formData.append('steps', 30);


    console.log('[stability-ai] generating text-to-image with the following body request:');
    console.log(`POST ${apiHost}/v1/generation/${engineId}/image-to-image ${JSON.stringify(body)}`);

    try {
        const res = await axios.post(`${apiHost}/v1/generation/${engineId}/image-to-image`,
            formData,
            {
                headers: {
                    'accept': '*/*',
                    'accept-language': 'en,en-US;q=0.9,he;q=0.8,de;q=0.7,ru;q=0.6,zh-CN;q=0.5,zh;q=0.4,pt;q=0.3,fr;q=0.2',
                    'content-type': 'application/json',
                    ...formData.getHeaders(),
                    Authorization: `Bearer ${apiKey}`,
                }
            }
        );

        // const resJSON = (await res.json()) as GenerationResponse;
        console.log(res.data);

        if (!res.data.artifacts) throw new Error(res.data.message);

        return res.data;
    } catch (error) {
        logger.error(error.message);

        throw new Error(error.message);
    }
}