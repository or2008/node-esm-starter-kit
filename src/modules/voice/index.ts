import { v4 as uuidv4 } from 'uuid';
import { cloudinaryClient } from '../../services/cloudinary/cloudinary.js';
import { notifyWebhook } from '../ notify-webhook.js';
import { ElevenlabsAiTextToSpeechParams, callApi, textToSpeech } from '../../services/elevenlabs/elevenlabs.js';
import { logger } from '../../services/logger.js';
import axios from 'axios';
import FormData from 'form-data';


export interface QueueEnhanceTextToSpeechPromptPayload {
    voiceId: string;
    text: string;
    elevenlabsTextToSpeechParams?: ElevenlabsAiTextToSpeechParams;
}

export async function queueEnhanceTextToSpeechPrompts(payloads: QueueEnhanceTextToSpeechPromptPayload[]) {
    const id = uuidv4();

    payloads.forEach(async (payload, i) => {
        const { text, elevenlabsTextToSpeechParams, voiceId } = payload;
        try {
            const fileNamePrefix = `${id}_${i}`;
            const res = await textToSpeech(voiceId, text, elevenlabsTextToSpeechParams);

            logger.info(`[cloudinaryClient] uploading ${fileNamePrefix}..`);

            const uploadStream = cloudinaryClient.v2.uploader.upload_stream({
                timeout: 1800000,
                resource_type: 'auto',
                folder: 'voice',
                public_id: `${fileNamePrefix}`

            },
            function (error, result) {
                notifyWebhook({ id, error: error?.message, data: result });
            });

            res.data.pipe(uploadStream);


        } catch (error) {
            logger.error(error.message);
            notifyWebhook({ id, error: error.message, data: null });
        }
    });

    return { id };
}

export async function cloneVoice(text: string, voiceUrls: string[]) {
    const voiceName = 'tempLala';

    const voiceFilesTasks = voiceUrls.map(async url => {
        const response = await axios.get(url, {
            responseType: 'arraybuffer',
        });
        const buffer = Buffer.from(response.data);
        return buffer;
    });

    const voiceFiles = await Promise.all(voiceFilesTasks);

    try {
        const formData = new FormData();
        formData.append('name', voiceName);
        voiceFiles.forEach(file => {
            formData.append('files', file, { contentType: 'audio/mpeg', filename: 'or_voice.mp3' });
        });

        const { voice_id, message } = await callApi('POST', '/v1/voices/add',
            formData,
            {
                headers: {
                    'accept': '*/*',
                    'accept-language': 'en,en-US;q=0.9,he;q=0.8,de;q=0.7,ru;q=0.6,zh-CN;q=0.5,zh;q=0.4,pt;q=0.3,fr;q=0.2',
                    'content-type': 'application/json',
                    ...formData.getHeaders()
                }
            }
        );

        if (!voice_id) throw new Error(message);

        const text2speechRes = await queueEnhanceTextToSpeechPrompts([{
            text,
            voiceId: voice_id
        }]);

        const deleteRes = callApi('DELETE', `/v1/voices/${voice_id}`);
        return text2speechRes;
    } catch (error) {
        logger.error(error.message);

        throw new Error(error.message);
    }

}


