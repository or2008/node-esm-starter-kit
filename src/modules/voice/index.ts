import { v4 as uuidv4 } from 'uuid';
import { StabilityAiTextToImageParams, textToImage } from '../../services/stability-ai/stability-ai.js';
import { cloudinaryClient } from '../../services/cloudinary/cloudinary.js';
import { notifyWebhook } from '../ notify-webhook.js';
import { ElevenlabsAiTextToSpeechParams, textToSpeech } from '../../services/elevenlabs/elevenlabs.js';


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


            console.log(`[cloudinaryClient] uploading ${fileNamePrefix}..`);

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
            console.error(error);
            notifyWebhook({ id, error: error.message, data: null });
        }
    });

    return { id };
}


