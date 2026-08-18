import { ARTWORKS } from '@/constants/artworks';
import { CATEGORIES } from '@/constants/categories';
import { formatPrice } from '@/lib/format';
import { highestPrice, lowestPrice } from '@/lib/price';
import { deriveTags, normalise } from '@/lib/tags';
import type { Artwork, Category, CategoryId, CategoryWithStats } from '@/types/content';

export { highestPrice, lowestPrice };

/**
 * Read-only views over the constant files.
 *
 * The catalogue is static, so everything here is computed once at module load
 * rather than on every render. Counts, "from" prices and search tags are all
 * derived — never hand-maintained — so they cannot drift when a piece is added.
 */

const byCategory = new Map<CategoryId, Artwork[]>(CATEGORIES.map((c) => [c.id, []]));

for (const artwork of ARTWORKS) {
  byCategory.get(artwork.categoryId)?.push(artwork);
}

const categoriesById = new Map<string, Category>(CATEGORIES.map((c) => [c.id, c]));

function statsFor(category: Category): CategoryWithStats {
  const pieces = byCategory.get(category.id) ?? [];
  const lowest = pieces.reduce(
    (min, piece) => Math.min(min, lowestPrice(piece)),
    Number.POSITIVE_INFINITY,
  );

  return {
    ...category,
    count: pieces.length,
    priceFrom: pieces.length > 0 ? formatPrice(lowest) : '—',
  };
}

/** All collections, in display order, with derived counts and prices. */
export const CATEGORIES_WITH_STATS: readonly CategoryWithStats[] = CATEGORIES.map(statsFor);

const statsById = new Map<string, CategoryWithStats>(CATEGORIES_WITH_STATS.map((c) => [c.id, c]));

export function isCategoryId(value: string | undefined): value is CategoryId {
  return value !== undefined && categoriesById.has(value);
}

/** A collection by url segment, or `null` when the segment is unknown. */
export function getCategory(categoryId: string | undefined): CategoryWithStats | null {
  if (categoryId === undefined) return null;
  return statsById.get(categoryId) ?? null;
}

/** Every piece in a collection, in catalogue order. */
export function getArtworks(categoryId: CategoryId): readonly Artwork[] {
  return byCategory.get(categoryId) ?? [];
}

/** A single piece, or `null` when the id does not exist in that collection. */
export function getArtwork(
  categoryId: string | undefined,
  artworkId: string | undefined,
): Artwork | null {
  if (!isCategoryId(categoryId) || artworkId === undefined) return null;
  return getArtworks(categoryId).find((a) => a.id === artworkId) ?? null;
}

/** Ids of every piece in a collection — used to pick a collection cover photo. */
export function getArtworkIds(categoryId: CategoryId): readonly string[] {
  return getArtworks(categoryId).map((a) => a.id);
}

/** Total pieces across all collections — the hero's headline figure. */
export const TOTAL_ARTWORKS = ARTWORKS.length;

/** Lowest price anywhere, for any "from $X" line. */
export const LOWEST_PRICE = ARTWORKS.reduce(
  (min, piece) => Math.min(min, lowestPrice(piece)),
  Number.POSITIVE_INFINITY,
);

// ---------------------------------------------------------------------------
// Search
// ---------------------------------------------------------------------------

interface IndexEntry {
  artwork: Artwork;
  title: string;
  /** Title, size labels and collection name, for plain substring matching. */
  text: string;
  tags: readonly string[];
}

/**
 * Built once at module load from the derived tags, so any piece added to
 * `artworks.ts` is searchable immediately with no extra step.
 */
const SEARCH_INDEX: readonly IndexEntry[] = ARTWORKS.map((artwork) => {
  const category = categoriesById.get(artwork.categoryId);

  return {
    artwork,
    title: normalise(artwork.title),
    text: normalise(
      [
        artwork.title,
        artwork.options.map((option) => option.label).join(' '),
        category?.name ?? '',
      ].join(' '),
    ),
    tags: deriveTags(artwork, category),
  };
});

/** The tags a piece is searchable by. Exposed mainly for tests and tooling. */
export function getTags(artwork: Artwork): readonly string[] {
  return (
    SEARCH_INDEX.find((entry) => entry.artwork === artwork)?.tags ??
    deriveTags(artwork, categoriesById.get(artwork.categoryId))
  );
}

/** Every distinct tag in the catalogue, sorted. Useful for a filter UI. */
export const ALL_TAGS: readonly string[] = [
  ...new Set(SEARCH_INDEX.flatMap((entry) => entry.tags)),
].sort();

/**
 * Keyword search across titles and derived tags.
 *
 * Every term must match something (AND), so "birthday doll" narrows rather than
 * widens. Within a term, a title hit outranks a tag hit, and an exact tag
 * outranks a prefix. Ties keep catalogue order.
 */
export function searchArtworks(query: string): readonly Artwork[] {
  const terms = normalise(query).split(' ').filter(Boolean);
  if (terms.length === 0) return [];

  const scored: { artwork: Artwork; score: number; order: number }[] = [];

  SEARCH_INDEX.forEach((entry, order) => {
    let total = 0;

    for (const term of terms) {
      let best = 0;

      if (entry.title.includes(term)) best = 10;
      // Size labels and the collection name, so "12 inch" and "wedding" work.
      else if (entry.text.includes(term)) best = 6;

      for (const tag of entry.tags) {
        if (tag === term) best = Math.max(best, 8);
        else if (tag.startsWith(term)) best = Math.max(best, 4);
        // Substring so "kerchief" reaches "handkerchief".
        else if (tag.includes(term)) best = Math.max(best, 3);
      }

      // A term that matches nothing disqualifies the piece.
      if (best === 0) return;
      total += best;
    }

    scored.push({ artwork: entry.artwork, score: total, order });
  });

  return scored
    .sort((a, b) => b.score - a.score || a.order - b.order)
    .map((entry) => entry.artwork);
}

/** A collection with the pieces of it that matched a search. */
export interface SearchGroup {
  category: CategoryWithStats;
  artworks: readonly Artwork[];
}

/**
 * Search results grouped by collection, collections in catalogue order.
 *
 * The overlay renders these directly; empty collections are omitted.
 */
export function searchGrouped(query: string): readonly SearchGroup[] {
  const matches = searchArtworks(query);
  if (matches.length === 0) return [];

  const byId = new Map<string, Artwork[]>();
  for (const artwork of matches) {
    const bucket = byId.get(artwork.categoryId);
    if (bucket) bucket.push(artwork);
    else byId.set(artwork.categoryId, [artwork]);
  }

  return CATEGORIES_WITH_STATS.flatMap((category) => {
    const artworks = byId.get(category.id);
    return artworks ? [{ category, artworks }] : [];
  });
}
