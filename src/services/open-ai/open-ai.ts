import { Configuration, OpenAIApi } from 'openai';

import { getOpenAiApiKey } from '../../config.js';

const configuration = new Configuration({
    apiKey: getOpenAiApiKey()
});

const openai = new OpenAIApi(configuration);

export function getApi() {
    return openai;
}
