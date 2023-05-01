/* eslint-disable max-len */
import { readFileSync } from 'fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createCompletion } from '../../services/open-ai.js';

const GPTMultipleSDPrompts =
    readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), './enhanced-prompt-templates/GPT_multiple_sd_prompts_v0.0.1.txt'), 'utf-8');

export async function enhancePrompts(prompts: string[]): Promise<string[]> {
    const gptPrompt = GPTMultipleSDPrompts.replace('***[array_of_prompts]***', prompts.map((prompt, i) => `${prompt}`).join('\n\n'));
    console.log(gptPrompt);

    // const gptRespons = await createCompletion({ prompt: gptPrompt });
    // console.log(gptRespons);

    // return gptRespons;

    return [
        'Fika the White Female Husky with blue eyes, out for a walk on a sunny day, surrounded by greenery, close-up, with a food cart in the background, sausage, tempting smell, hyper-realistic, with a surreal twist, bloated, lethargic, on a diet, feast, indulgence, sickness, hospitalized, food poisoning, caution, by Jono Dry, artstation, vibrant colors, sharp details, textured, beautiful, cinematic lighting',
        'Fika the White Female Husky with blue eyes, in a hospital bed, surrounded by medical equipment, feeling sick and weak, close-up, white walls, somber atmosphere, with a doctor examining her, food poisoning, caution, by Marco Bucci, deviantart, monochromatic, highly detailed, sharp focus, dramatic lighting, sci-fi, dystopian, surreal, nightmare',
        'Fika the White Female Husky with blue eyes, in a dark alley, looking at a suspicious food cart, side view, suspicious ingredients, hidden secrets, investigation, interrogating the vendor, surreal twist, by Simon Stålenhag, artstation, highly detailed, cinematic, dark, retro-futuristic, moody lighting, dystopian, sci-fi, cyberpunk',
        'Fika the White Female Husky with blue eyes, in a courtroom, surrounded by lawyers, judges, and the accused vendor, facing trial, justice, truth, by Jason Seiler, artstation, highly detailed, sharp focus, cinematic lighting, dramatic, realistic, textured',
        'Fika the White Female Husky with blue eyes, sitting on a mountain peak, surrounded by clouds, meditating, finding peace, by John Beckley, artstation, highly detailed, monochromatic, serene, cinematic, dreamy lighting, surreal, fantasy.'
    ];
}