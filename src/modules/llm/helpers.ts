// https://beta.openai.com/tokenizer
import { encode } from 'gpt-3-encoder';


// A helpful rule of thumb is that one token generally corresponds to ~4 characters of text for common English text
export function getTotalTokens(text: string) {
    const tokens = encode(text);
    return tokens.length;
}
