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

    return prompts;
    // const gptRespons = await createCompletion({ prompt: gptPrompt });
    // console.log(gptRespons);

    // return gptRespons;

    // return [
    //     'Fika the White Female Husky with blue eyes, out for a walk on a sunny day, surrounded by greenery, close-up, with a food cart in the background, sausage, tempting smell, hyper-realistic, with a surreal twist, bloated, lethargic, on a diet, feast, indulgence, sickness, hospitalized, food poisoning, caution, by Jono Dry, artstation, vibrant colors, sharp details, textured, beautiful, cinematic lighting',
    //     'Fika the White Female Husky with blue eyes, in a hospital bed, surrounded by medical equipment, feeling sick and weak, close-up, white walls, somber atmosphere, with a doctor examining her, food poisoning, caution, by Marco Bucci, deviantart, monochromatic, highly detailed, sharp focus, dramatic lighting, sci-fi, dystopian, surreal, nightmare',
    //     'Fika the White Female Husky with blue eyes, in a dark alley, looking at a suspicious food cart, side view, suspicious ingredients, hidden secrets, investigation, interrogating the vendor, surreal twist, by Simon Stålenhag, artstation, highly detailed, cinematic, dark, retro-futuristic, moody lighting, dystopian, sci-fi, cyberpunk',
    //     'Fika the White Female Husky with blue eyes, in a courtroom, surrounded by lawyers, judges, and the accused vendor, facing trial, justice, truth, by Jason Seiler, artstation, highly detailed, sharp focus, cinematic lighting, dramatic, realistic, textured',
    //     'Fika the White Female Husky with blue eyes, sitting on a mountain peak, surrounded by clouds, meditating, finding peace, by John Beckley, artstation, highly detailed, monochromatic, serene, cinematic, dreamy lighting, surreal, fantasy.'
    // ];
    return [
        'Oleg the Energetic, a blond 6-year-old boy, with a huge smile, walking and riding his bike with joy and energy, in a vibrant enchanted forest, carrying an ancient scroll in his backpack, by Bob Ross and Hayao Miyazaki, artstation, hyperrealistic, full body, with sharp details, cinematic lighting, and warm colors.',
        'A vivid green forest with hidden trails, where Oleg the Energetic, a blond 6-year-old boy, enjoys walking and riding his bike with excitement and curiosity, surrounded by vibrant nature, with the sunlight peeking through the leaves, in a composition that conveys motion and dynamism, by Thomas Kinkade and Bob Ross, artstation, highly detailed, with a focus on the foreground and the play of light and shadows.',
        'Enchanted forest brimming with colorful flora, fauna, and magical creatures, where Oleg the Energetic, a blond 6-year-old boy, sets foot on an adventure filled with mystery and wonder, accompanied by his loyal dog, and guided by the ancient scroll in his backpack, by Brian Froud and Jim Henson, artstation, whimsical and imaginative, with a focus on the details and the richness of the environment, using a warm color palette and a soft lighting.',
        'A serene and misty lake shimmering blue-green, surrounded by a lush forest, where the ethereal mermaid, the Graceful, a green-blue humanoid with a shimmering tail, helps Oleg the Energetic, a blond 6-year-old boy, find the ancient scroll he\'s been seeking, by Anne Stokes and Jasmine Becket-Griffith, artstation, dreamy and surreal, with a focus on the aquatic world and the interplay of light and water, using a cool color palette and a soft lighting.',
        'Oleg the Energetic, a blond 6-year-old boy, triumphantly standing in the middle of a vibrant forest, holding the ancient scroll in his hand, after a thrilling adventure full of obstacles and challenges, by Brian Froud and John Bauer, artstation, fantastical and epic, with a focus on the hero\'s journey and the symbolism of the forest, using a bold color palette and a dramatic lighting.',

    ];
}