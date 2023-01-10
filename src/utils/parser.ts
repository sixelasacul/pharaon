// https://fr.wikipedia.org/wiki/Alphabet_phon%C3%A9tique_international
// https://www.academie-francaise.fr/la-terminaison-des-mots-en-aon-se-prononce-t-elle-hon-ou
const graphicVowels = [
  'a',
  'e',
  'i',
  'o',
  'u',
  'y',
  'é',
  'è',
  'ê',
  'â',
  'ë',
  'ï',
  'î',
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
  'ay',
  'ey',
  'uy',
  'oi',
  'oy',
  'ue',
  'uoi',
];
// https://fr.wikipedia.org/wiki/Consonne_sourde
// n itself isn't a voiceless consonant, but as it is combined with a vowel, from a phonetic stand point, it breaks the syllable
const strongConsonants = ['b', 'c', 'd', 'g', 'k', 'p', 'q', 't', 'n'];
const mediumConsonants = ['f', 'v', 's', 'z'];
const specialCharacters = ["'", '-'];
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
  ')',
];

const VOWEL_REGEX = new RegExp(`([${graphicVowels.join('')}])`, 'i');
const CONSONANT_REGEX = new RegExp(`([^${graphicVowels.join('')}])`, 'i');
const PHONETIC_VOWEL_SPLIT_REGEX = new RegExp(
  `(${phoneticVowels.join('|')})|([${graphicVowels.join('')}])`,
  'gi'
);
const VOWEL_CONSONANT_SPLIT_REGEX = new RegExp(
  `([${graphicVowels.join('')}]+)|([^${graphicVowels
    .concat(specialCharacters)
    .join('')}]+)|([${specialCharacters.join('')}]+)`,
  'gi'
);
// n should be a specific edge case, as it is not really a strong consonant itself, but with
// a vowel, it produces a new sound which is mostly always incompatible with weak consonants
// e.g. hanse (han-se), ainsi (ain-si)
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

/**
 * `gn` is a whole different problem. Based on usage, it can sound like `ni`, which will be in one syllable, or `g-n`, which will be split.
 * Because of this, I'll need to reference all the usages of one of them to distinguish between these 2 sounds.
 * Though, `ni` is the most common, so that should be the default, and a specific branch should cover the `g-n` edge case.
 */

export function extractSyllables(word: string) {
  const splitByVowels =
    word.match(VOWEL_CONSONANT_SPLIT_REGEX)?.reverse() ?? [];
  const syllables: string[] = [];
  let currentSyllable = '';

  splitByVowels.forEach((group, index) => {
    const isVowelGroup = VOWEL_REGEX.test(group);
    const isSpecialCharacter = specialCharacters.includes(group);
    const hasVowelsInSyllable = VOWEL_REGEX.test(currentSyllable);
    if (currentSyllable.length === 0 && !isVowelGroup) {
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
          console.error('could not parse vowel group: ', group);
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

// console.log(extractSyllables('intempesties'));
// console.log(extractSyllables('expression'));
// console.log(extractSyllables('materiau'));
// console.log(extractSyllables('lointain'));
// console.log(extractSyllables('longtemps'));
// console.log(extractSyllables('pourquoi'));
// console.log(extractSyllables('abnegation'));
// console.log(extractSyllables('ablation'));
// console.log(extractSyllables('segregation'));
// console.log(extractSyllables('abstenir'));
// console.log(extractSyllables('subtropical'));
// console.log(extractSyllables('pharaon'));
// console.log(extractSyllables('contre-temps'));
// console.log(extractSyllables("l'marathon"));
// console.log(extractSyllables("l'Empereur"));
// console.log(extractSyllables('frères'));
// console.log(extractSyllables('fleuris'));
// console.log(extractSyllables('effleurées'));
// console.log(extractSyllables('transaction'));
// console.log(extractSyllables('ainsi'));
// console.log(extractSyllables('aîné'));
// console.log(extractSyllables('abcès'));
// console.log(extractSyllables('abscisse'));
// console.log(extractSyllables('piscine'));
// console.log(extractSyllables('encaisser'));
// console.log(extractSyllables('pneumatique'));
// console.log(extractSyllables('apnée'));
// console.log(extractSyllables('amphétamine'));
// console.log(extractSyllables('trombone'));
// console.log(extractSyllables('honteux'));
// console.log(extractSyllables('ankylose'));
// console.log(extractSyllables('ophtalmologue'));

// const lyrics = `
// Riche comme Salomon et beau comme Apollon
// J'ai l'humour à Choron et l'anneau à Sauron
// Riche comme Salomon et beau comme Apollon
// J'ai l'humour à Choron et l'anneau à Sauron

// J'préfère laisser mes enfants dans ta gorge, plutôt qu'en garderie (splash)
// Je roule des joints qui font la taille du bâton de Gandalf le gris
// Ici, on nique la justice, la police et la gendarmerie
// J'me prélasse dans un palace, la femme de ménage mange ma te-bi (mange)
// Si t'es chaude, j'ramène mes potes et j'assouvis tes fantasmes de fille
// Transac' de weed, faut qu'je m'empare de c'fric, j'tire des grandes taffes de hish' (j'tire)
// Je pense à dédicacer tous mes frères qui se branlent à Fleury (wow)
// Je sors de l'ombre, faut qu'tu augmentes le son si t'entends pas c'que j'dis (t'entends)
// Chacun son tour et son heure de gloire, maintenant tu remballes de-spee (remballes)
// J'te conseille d'éviter le monde du rap, c'est tellement sale, petit (sale)
// Fais comme bon te semble et profite avant que tes rents-pa te grillent
// Mais sache que rien ne vaut d'être en famille d'vant un grand plat de riz

// J'suis dans les catacombes, je vise ton canasson
// J'sors des rimes à la s'conde, l'Empereur, le pharaon
// Le soir, je drague ta blonde, j'vais gagner l'marathon
// Chargeur plein d'balles à plomb, pas l'temps pour la baston
// J'suis dans les catacombes, je vise ton canasson
// J'sors des rimes à la s'conde, l'Empereur, le pharaon
// Le soir, je drague ta blonde, j'vais gagner l'marathon
// Chargeur plein d'balles à plomb, pas l'temps pour la baston
// Tounsi

// J'veux pas te faire de peine, mon sucre d'orge
// Mais la plupart de mes frères n'ont plus d'remords
// Mes enfants s'promènent au fond d'une gorge (splash)
// Mets mon son dans ta voiture de sport (vroum, nion)
// J'ai même pas réussi à décrocher l'bac
// J'ai bien trop perdu mais, désormais, j'gagne
// C'est l'bordel, man, j'vais te déformer l'crâne
// C'est la goutte de sperme qui fait déborder l'vase (splash, splash, splash)
// Elle suce des bites comme des cornets d'glace (sucepute)
// On veut du bif' comme des monégasques (splash)
// T'as les genoux fléchis car tu portes des bas (wow)
// J'reviens avec du te-shi et des bords d'Espagne

// J'suis dans les catacombes, je vise ton canasson
// J'sors des rimes à la s'conde, l'Empereur, le pharaon
// Le soir, je drague ta blonde, j'vais gagner l'marathon
// Chargeur plein d'balles à plomb, pas l'temps pour la baston
// J'suis dans les catacombes, je vise ton canasson
// J'sors des rimes à la s'conde, l'Empereur, le pharaon
// Le soir, je drague ta blonde, j'vais gagner l'marathon
// Chargeur plein d'balles à plomb, pas l'temps pour la baston

// Goûte mes macarons ou bien nous t'saccagerons
// On y va à fond, dans ton rap à la con
// J'le fais à ma façon, je n'accepte pas l'pardon
// C'est pour mes vagabonds d'l'allée Louis-Aragon
// `;
// console.time('phrase');
// console.log(extractSyllablesFromSentence(lyrics));
// console.timeEnd('phrase');
