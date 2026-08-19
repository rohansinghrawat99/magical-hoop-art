import type { Artwork, Category } from '@/types/content';

/**
 * Search tags for the catalogue.
 *
 * Tags are **derived**, never stored. `deriveTags()` runs over a piece's title,
 * its collection and its size options, so a new artwork added to
 * `src/constants/artworks.ts` is searchable the moment it appears — nobody has
 * to remember to tag it. An artwork may add extra keywords via its optional
 * `tags` field, but that is for things the title genuinely cannot imply.
 *
 * Two layers:
 *   1. **Words** — meaningful tokens lifted straight from the title.
 *   2. **Concepts** — a curated map so a shopper's vocabulary finds a maker's.
 *      Someone searching "wedding" should find "Mandap Theme"; someone
 *      searching "religious" should find Swastik, Mahadev and Makka Madina.
 */

/** Words that carry no search signal, or that every piece shares. */
const STOPWORDS = new Set([
  'a',
  'an',
  'and',
  'at',
  'by',
  'can',
  'be',
  'for',
  'from',
  'in',
  'is',
  'it',
  'of',
  'on',
  'only',
  'or',
  'some',
  'the',
  'this',
  'to',
  'up',
  'with',
  'your',
  // Shared by nearly every piece, so they do not discriminate.
  'hoop',
  'theme',
  'ring',
  'inch',
  // Counting and filler words picked up from titles.
  'one',
  'four',
  'view',
]);

/**
 * Concept → the words that imply it.
 *
 * Matching is on whole words from the title, except entries containing a space,
 * which are matched as a phrase against the whole normalised title.
 */
const CONCEPTS: Record<string, readonly string[]> = {
  wedding: ['wedding', 'mandap', 'bride', 'groom', 'marriage', 'shaadi', 'curtain'],
  engagement: ['engagement'],
  anniversary: ['anniversary'],
  couple: ['couple', 'couples'],
  birthday: ['birthday'],
  mother: ['mom', 'mother', 'mothers', 'motherhood', 'mum'],
  friendship: ['friendship', 'friends'],
  baby: ['baby', 'babies', 'newborn', 'birth', 'sibling', 'siblings', 'pram', 'parents'],

  photo: ['photo', 'photos', 'photoframe', 'photograph', 'photographs', 'memory', 'frame'],
  calendar: ['calendar', 'date', 'dates'],
  quote: ['lines', 'words', 'thoughts', 'wish', 'wishes', 'message', 'poem', 'shayari'],

  floral: ['floral', 'florals', 'flower', 'flowers', 'rose', 'roses', 'bouquet', 'maple'],
  heart: ['heart'],
  star: ['star'],
  rainbow: ['rainbow'],
  cloud: ['cloud', 'clouds'],
  swing: ['swing'],
  pearls: ['pearl', 'pearls'],
  lace: ['lace'],
  'french-knot': ['french knot', 'knot'],

  name: ['name', 'names', 'initial', 'initials', 'monogram'],
  doll: ['doll', 'dolls'],
  '3d': ['3d'],
  cartoon: ['cartoon'],

  devotional: ['swastik', 'mahadev', 'radha', 'krishna', 'makka', 'madina', 'prayer'],
  hindu: ['swastik', 'mahadev', 'radha', 'krishna'],
  islamic: ['makka', 'madina'],

  handkerchief: ['handkerchief', 'kerchief'],
  personalised: ['customised', 'customized', 'personalised', 'personalized', 'custom'],
};

/** Lower-case, strip punctuation, collapse whitespace. */
export function normalise(value: string): string {
  return value
    .normalize('NFKD')
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function words(value: string): string[] {
  return normalise(value).split(' ').filter(Boolean);
}

/**
 * Every search tag for a piece: title words, collection words, matched concepts
 * and any manual extras. Sorted so the output is stable.
 */
export function deriveTags(artwork: Artwork, category: Category | undefined): string[] {
  const tags = new Set<string>();

  const titleWords = words(artwork.title);
  const normalisedTitle = normalise(artwork.title);

  for (const word of titleWords) {
    if (!STOPWORDS.has(word) && word.length > 1) tags.add(word);
  }

  if (category) {
    for (const word of words(category.name)) {
      if (!STOPWORDS.has(word) && word.length > 1) tags.add(word);
    }
  }

  const haystack = `${normalisedTitle} ${category ? normalise(category.name) : ''}`;
  const haystackWords = new Set(haystack.split(' ').filter(Boolean));

  for (const [concept, triggers] of Object.entries(CONCEPTS)) {
    const hit = triggers.some((trigger) =>
      trigger.includes(' ') ? haystack.includes(trigger) : haystackWords.has(trigger),
    );
    if (hit) tags.add(concept);
  }

  // The handkerchief pieces are identifiable from their size, not their title.
  if (artwork.options.some((option) => /inch\s*[x×]\s*|×/i.test(option.label))) {
    tags.add('handkerchief');
  }

  for (const extra of artwork.tags ?? []) {
    for (const word of words(extra)) tags.add(word);
  }

  return [...tags].sort();
}
