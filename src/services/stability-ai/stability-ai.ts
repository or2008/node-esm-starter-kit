import { writeFileSync } from 'node:fs';
import { post } from '../network.js';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export interface StabilityAiTextToImageParams {
    text_prompts: { text: string, weight?: number }[],
    cfg_scale?: number,
    clip_guidance_preset?: string,
    height?: number,
    width?: number,
    samples?: number,
    steps?: number,

}

// const engineId = 'stable-diffusion-v1-5';
const engineId = 'stable-diffusion-xl-beta-v2-2-2';
const apiHost = process.env.API_HOST ?? 'https://api.stability.ai';
const apiKey = process.env.STABILITYAI_API_KEY;

interface GenerationResponse {
    artifacts: Array<{
        base64: string
        seed: number
        finishReason: string
    }>
}

export async function generate(params: StabilityAiTextToImageParams) {
    const body = Object.assign({}, {
        cfg_scale: 7,
        clip_guidance_preset: 'FAST_BLUE',
        height: 512,
        width: 512,
        samples: 1,
        steps: 20,
    }, params);
    console.log(`[stability-ai] generating text-to-image with the following body request: ${JSON.stringify(body)}` );

    const res = await post(`${apiHost}/v1/generation/${engineId}/text-to-image`,
        JSON.stringify(body),
        {
            Authorization: `Bearer ${apiKey}`,
        }
    );

    const resJSON = (await res.json()) as GenerationResponse;

    if (!resJSON.artifacts) throw new Error(resJSON.message);

    return resJSON;
}