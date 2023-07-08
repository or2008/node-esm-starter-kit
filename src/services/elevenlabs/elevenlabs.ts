import { post } from '../network.js';
import { convertObjectToFormData } from '../../utils/form-data.js';
import axios from 'axios';
import { createWriteStream } from 'fs';

export interface ElevenlabsAiTextToSpeechVoiceSettings {
    stability: number,
    similarity_boost: number,
    style: number,
    use_speaker_boost: boolean
}

export interface ElevenlabsAiTextToSpeechParams {
    model_id: string;
    text: string;
    voice_settings?: ElevenlabsAiTextToSpeechVoiceSettings;
}

const apiHost = 'https://api.elevenlabs.io';
const apiKey = process.env.ELEVENLABS_API_KEY;

interface GenerationResponse {
    details: Array<{
        loc: string[];
        msg: string;
        type: string;
    }>
}

export async function textToSpeech(voiceId: string, text: string, params?: ElevenlabsAiTextToSpeechParams) {
    const body = Object.assign({}, {
        // model_id: 'eleven_monolingual_v1',
        text,
    }, params) as ElevenlabsAiTextToSpeechParams;

    console.log('[stability-ai] generating text-to-speech with the following body request:');
    console.log(`POST ${apiHost}/v1/text-to-speech/${voiceId} ${JSON.stringify(body)}`);

    try {
        const response = await axios({
            method: 'POST',
            url: `${apiHost}/v1/text-to-speech/${voiceId}`,
            data: body,
            headers: {
                'Accept': 'audio/mpeg',
                'xi-api-key': apiKey,
                'Content-Type': 'application/json',
            },
            responseType: 'stream'
        });

        return response;
        // const resJSON = (await res.json()) as GenerationResponse;
        // console.log(resJSON);

        // if (!resJSON.artifacts) throw new Error(resJSON.message);

        // return resJSON;
    } catch (error) {
        console.error(error);

        throw new Error(error.message);
    }
}