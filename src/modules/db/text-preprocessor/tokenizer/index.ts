import natural from 'natural';

const { SentenceTokenizer, WordTokenizer } = natural;

const sentenceTokenize = new SentenceTokenizer();
const wordTokenizer = new WordTokenizer();

// splitting text into individual sentences
export function tokenizeSentence(text: string) {
    return sentenceTokenize.tokenize(text);
}
export function tokenizeWord(text: string) {
    return wordTokenizer.tokenize(text);
}