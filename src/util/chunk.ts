import { Chunk, FindChunks } from 'react-highlight-words';

export const findChunksFullWord = ({
  autoEscape,
  caseSensitive,
  sanitize,
  searchWords,
  textToHighlight,
}: FindChunks): Chunk[] => {
  const chunks = [] as Chunk[];
  const textLow = textToHighlight.toLowerCase();
  // Match at the beginning of each new word
  // New word start after whitespace or - (hyphen)
  const sep = /[-\s]+/;

  // Match at the beginning of each new word
  // New word start after whitespace or - (hyphen)
  const singleTextWords = textLow.split(sep);

  // It could be possible that there are multiple spaces between words
  // Hence we store the index (position) of each single word with textToHighlight
  let fromIndex = 0;
  const singleTextWordsWithPos = singleTextWords.map((s) => {
    const indexInWord = textLow.indexOf(s, fromIndex);
    fromIndex = indexInWord;
    return {
      word: s,
      index: indexInWord,
    };
  });

  // Add chunks for every searchWord
  searchWords.forEach((sw) => {
    const low = (sw as string).toLowerCase();
    // Do it for every single text word
    singleTextWordsWithPos.forEach((s) => {
      if (s.word.replace(/[^A-Za-z0-9-]/gi, '') === low) {
        const start = s.index;
        const end = s.index + low.length;
        chunks.push({
          start,
          end,
        });
      }
    });

    // The complete word including whitespace should also be handled, e.g.
    // searchWord='Angela Mer' should be highlighted in 'Angela Merkel'
    if (textLow.replace(/[^A-Za-z0-9-]/gi, '') === low) {
      const start = 0;
      const end = low.length;
      chunks.push({
        start,
        end,
      });
    }
  });

  return chunks;
};
