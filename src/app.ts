import { sendAdminMessage } from './services/telegram.js';
import { init as initTelegramBotCommands } from './telegram-bot-commands.js';
import { logger } from './services/logger.js';
import { getVideoChapters, getVideoMetadata, getVideoSubtitle, getVideoTranscript, youtubeUrlParser } from './services/youtube.js';
import { summarize } from './services/nlpcloud.js';
import { countWords } from './services/string.js';
import { tokenizeSentence } from './modules/db/text-preprocessor/tokenizer/index.js';
import { splitToChunks } from './modules/db/text-preprocessor/chunks-split/index.js';
import { createCompletion } from './services/open-ai.js';
import { CustomError } from './errors.js';

async function summarizeVideoTranscriptChunks(chunks: string, videoTitle: string) {
    for (const chunk of [chunks[0]]) {
        const prompt = `${videoTitle}. ${chunk}\n\n Tl;dr`;

        logger.debug(prompt);
        const summarizedText = await createCompletion({
            prompt,
            max_tokens: 300, // ~224 words
            temperature: 0.7,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 1
        });

        // const summarizedText = await summarize(`${videoTitle} \n\n ${chunk}`);
        logger.debug('--------------- RES ----------------');
        logger.debug(summarizedText);
        logger.debug('--------------- /RES ----------------');
        if (!summarizedText) return;
    }
}

async function onYoutubeVideoMessage(videoId: string) {
    const [videoMetadata, videoChapters, videoTranscript] = await Promise.all(
        [
            getVideoMetadata(videoId),
            getVideoChapters(videoId),
            getVideoTranscript(videoId)
        ]);

    const { title } = videoMetadata.snippet;
    logger.info(title);

    const allText = videoTranscript.map(item => item.text.replace('\n', ' ').trim()).join(' ');

    // const allText = videoTranscript.map(item => item.text.trim()).join(' ');
    logger.info(allText);
    logger.info(`Word Count - ${countWords(allText).toLocaleString()}`);

    // TODO - currently splitToChunks is naive and breaks sentences in the middle. need to keep last chunk sentece whole
    const chunks = await splitToChunks(allText, { chunkSize: 7500 });
    if (!chunks || chunks.length === 0) throw new CustomError('[onYoutubeVideoMessage] no chunks from splitToChunks');

    // logger.info(chunks);

    // await summarizeVideoTranscriptChunks(chunks, title);

    // append title to first chunk

    // const sentences = tokenizeSentence(allText);
    // logger.info(sentences);

    // logger.info(videoChapters);




    // logger.info(summarizedText);
    // sendAdminMessage(summarizedText);

}

async function main() {
    const msg = 'Running.. 🎯🤖';
    logger.info(msg);

    // sendAdminMessage(msg);

    initTelegramBotCommands();

    const videoId = youtubeUrlParser('https://www.youtube.com/watch?v=ui_kEJ7C3O0&ab_channel=TheTapesArchive'); // Steve Vai
    // const videoId = youtubeUrlParser('https://www.youtube.com/watch?v=N7JeTPCsE-4&t=454s&ab_channel=6MonthsLater'); // Sonos
    // const videoId = youtubeUrlParser('https://www.youtube.com/watch?v=lqpJiZQpgu8'); // No cc
    console.log('videoId', videoId);

    if (videoId === false) return;

    onYoutubeVideoMessage(videoId);
}

main().catch((error: unknown) => {
    // if (error instanceof CustomError)
    //     logger.debug(error);

    logger.error(error);
});
