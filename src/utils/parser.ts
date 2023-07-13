// https://fr.wikipedia.org/wiki/Alphabet_phon%C3%A9tique_international
// https://www.academie-francaise.fr/la-terminaison-des-mots-en-aon-se-prononce-t-elle-hon-ou
const graphicVowels = [
  'a',
  'e',
  'i',
  'o',
  'u',
  'y',
  'â',
  'é',
  'è',
  'ê',
  'ë',
  'ï',
  'î',
  'ù',
  'û'
];
const phoneticVowels = [
  'ée',
  'eau',
  'au',
  'ou',
  'eu',
  'oeu',
  'œu',
  'ei',
  'où',
  'ie',
  'ui',
  'oui',
  'ai',
  'aî',
  'ay',
  'ey',
  'uy',
  'oi',
  'oy',
  'ue',
  'uoi',
  'oie',
  'ué'
];
// https://fr.wikipedia.org/wiki/Consonne_sourde
// n itself isn't a voiceless consonant, but as it is combined with a vowel,
// from a phonetic stand point, it breaks the syllable
const strongConsonants = ['b', 'c', 'd', 'g', 'k', 'p', 'q', 't', 'n', 'm'];
const mediumConsonants = ['f', 'v', 's', 'z'];
// TODO: " at the beginning of the word is grouped with the syllable, but not at the end
const specialCharacters = ["'", '"', '-'];
const wordSeparators = [
  '\\s',
  '\\r',
  ',',
  '.',
  ';',
  ':',
  '!',
  '?',
  '\\-',
  '(',
  ')'
];

const VOWEL_REGEX = new RegExp(`([${graphicVowels.join('')}])`, 'i');
const PHONETIC_VOWEL_SPLIT_REGEX = new RegExp(
  `(${phoneticVowels.join('|')})|([${graphicVowels.join('')}])`,
  'gi'
);
const VOWEL_CONSONANT_SPLIT_REGEX = new RegExp(
  `([${graphicVowels.join('')}]+)|([^${graphicVowels
    .concat(specialCharacters)
    .join('')}\\d]+)|([${specialCharacters.join('')}\\d]+)`,
  'gi'
);
const IS_STRONG_CONSONANT = new RegExp(
  `[${strongConsonants.join('')}]`,
  'i'
);
const IS_SPECIAL_CHARACTER = new RegExp(
  `[${specialCharacters.join('')}]`,
  'i'
);
// n should be a specific edge case, as it is not really a strong consonant
// itself, but with a vowel, it produces a new sound which is mostly always
// incompatible with weak consonants, e.g. hanse (han-se), ainsi (ain-si)
// Specific edge covered with `gn` because considered as a group (sounds like `ni`)
const VOICELESS_CONSONANT_GROUP_REGEX = new RegExp(
  `(gn|[${strongConsonants.join('')}][^${strongConsonants.join(
    ''
  )}])|([${mediumConsonants.join('')}][^${strongConsonants
    .concat(mediumConsonants)
    .join('')}])`,
  'i'
);
const WORD_SEPARATOR_REGEX = new RegExp(`[${wordSeparators.join('')}]+`);
const WORD_SEPARATOR_SPLIT_REGEX = new RegExp(
  `([${wordSeparators.join('')}]+)|([^${wordSeparators.join('')}]+)`,
  'g'
);

// `gn` is a whole different problem. Based on usage, it can sound like `ni`,
// which will be in one syllable, or `g-n`, which will be split. Because of this,
// I'll need to reference all the usages of one of them to distinguish between
// these 2 sounds. Though, `ni` is the most common, so that should be the
// default, and a specific branch should cover the `g-n` edge case.
export function extractSyllables(word: string) {
  const splitByVowels =
    word.match(VOWEL_CONSONANT_SPLIT_REGEX)?.reverse() ?? [];
  const syllables: string[] = [];
  let currentSyllable = '';

  splitByVowels.forEach((group, index) => {
    const isVowelGroup = VOWEL_REGEX.test(group);
    const isSpecialCharacter = IS_SPECIAL_CHARACTER.test(group);
    const isNumber = /\d+/.test(group);
    const hasVowelsInSyllable = VOWEL_REGEX.test(currentSyllable);
    
    if (isNumber) {
      syllables.unshift(currentSyllable);
      syllables.unshift(group);
      currentSyllable = '';
    } else if (currentSyllable.length === 0 && !isVowelGroup) {
      currentSyllable = group;
    } else if (index === splitByVowels.length - 1 && !isVowelGroup) {
      currentSyllable = group + currentSyllable;
    } else if (isSpecialCharacter) {
      currentSyllable = group + currentSyllable;
    } else if (!hasVowelsInSyllable && isVowelGroup) {
      if (!phoneticVowels.includes(group)) {
        // No more than 2 vowel groups next to each other
        const matches = group.match(PHONETIC_VOWEL_SPLIT_REGEX);
        if (matches?.length === 2) {
          const [first, last] = matches;
          currentSyllable = last + currentSyllable;
          syllables.unshift(currentSyllable);
          currentSyllable = first;
        } else if (matches?.length === 1) {
          const vowel = matches;
          currentSyllable = vowel + currentSyllable;
        } else {
          console.warn('could not parse vowel group: ', group);
          currentSyllable = matches?.join('') + currentSyllable;
        }
      } else {
        currentSyllable = group + currentSyllable;
      }
    } else if (hasVowelsInSyllable && !isVowelGroup) {
      // Find strong-weak consonants group
      // If there's none, split in half
      // If there's one, find it, split with the rest, and assign in groups
      if (group.length === 1) {
        currentSyllable = group + currentSyllable;
      } else if (group[0] === 'n') {
        // In that case, it should be always split (as the next group will be a vowel), vowel + n
        // is a whole different sound, and n isn't a strong consonant anymore
        const [n, ...rest] = group;
        const [first, last] =
          VOICELESS_CONSONANT_GROUP_REGEX.test(rest.join('')) ||
          rest.length === 1
            ? ['', rest.join('')]
            : rest;
        currentSyllable = last + currentSyllable;
        syllables.unshift(currentSyllable);
        currentSyllable = n + first;
      } else if (VOICELESS_CONSONANT_GROUP_REGEX.test(group)) {
        const subgroupPosition = group.search(VOICELESS_CONSONANT_GROUP_REGEX);
        const subgroup = group.slice(subgroupPosition, subgroupPosition + 2);
        const restPosition = subgroupPosition === 0 ? 2 : 0;
        const rest = group.slice(restPosition, restPosition + 1);
        if (rest) {
          const first = subgroupPosition === 0 ? subgroup : rest;
          const last = subgroupPosition === 0 ? rest : subgroup;
          currentSyllable = last + currentSyllable;
          syllables.unshift(currentSyllable);
          currentSyllable = first;
        } else {
          currentSyllable = subgroup + currentSyllable;
          syllables.unshift(currentSyllable);
          currentSyllable = '';
        }
      } else if (IS_STRONG_CONSONANT.test(group.at(-1)!!)) {
        const rest = group.slice(0, group.length - 1);
        const last = group.at(-1)!!;
        currentSyllable = last + currentSyllable;
        syllables.unshift(currentSyllable);
        currentSyllable = rest;
      } else {
        const [first, last] = group.split('');
        currentSyllable = last + currentSyllable;
        syllables.unshift(currentSyllable);
        currentSyllable = first;
      }
    } else {
      syllables.unshift(currentSyllable);
      currentSyllable = group;
    }
  });

  if (currentSyllable) {
    syllables.unshift(currentSyllable);
  }
  return syllables;
}

export function extractSyllablesFromSentence(sentence: string) {
  const words = sentence.match(WORD_SEPARATOR_SPLIT_REGEX) ?? [];
  return words.flatMap((word) =>
    WORD_SEPARATOR_REGEX.test(word) ? word : extractSyllables(word)
  );
}
