import { lowestPrice } from '@/lib/price';
import { normalise } from '@/lib/tags';
import type { Artwork } from '@/types/content';

/**
 * Pure matching and ordering helpers for the in-collection filter.
 *
 * Everything here takes its data as arguments and returns new arrays, so it is
 * unit-testable without a router, a DOM or the catalogue. The catalogue-wide
 * overlay search lives in `src/data/catalogue.ts`, which layers ranking and
 * derived tags on top of the same idea.
 */

export type SortMode = 'featured' | 'price-asc' | 'price-desc';

export const SORT_MODES: readonly SortMode[] = ['featured', 'price-asc', 'price-desc'];

export const SORT_LABELS: Record<SortMode, string> = {
  featured: 'Featured',
  'price-asc': 'Price ↑',
  'price-desc': 'Price ↓',
};

/** Cycle Featured → Price ↑ → Price ↓ → Featured. */
export function nextSortMode(mode: SortMode): SortMode {
  const index = SORT_MODES.indexOf(mode);
  return SORT_MODES[(index + 1) % SORT_MODES.length] ?? 'featured';
}

/**
 * Everything about a piece that a visitor might type: its title, the size
 * labels, any manual keywords, and the collection it belongs to.
 */
export function artworkHaystack(artwork: Artwork, categoryName = ''): string {
  return normalise(
    [
      artwork.title,
      artwork.options.map((option) => option.label).join(' '),
      (artwork.tags ?? []).join(' '),
      categoryName,
    ].join(' '),
  );
}

/**
 * Case-insensitive substring match. Multiple words must all appear, so extra
 * words narrow the result rather than widening it.
 */
export function matchesQuery(artwork: Artwork, query: string, categoryName = ''): boolean {
  const terms = normalise(query).split(' ').filter(Boolean);
  if (terms.length === 0) return true;

  const haystack = artworkHaystack(artwork, categoryName);
  return terms.every((term) => haystack.includes(term));
}

/** Pieces matching `query`, in their original order. An empty query matches all. */
export function filterArtworks(
  artworks: readonly Artwork[],
  query: string,
  categoryName = '',
): Artwork[] {
  if (normalise(query).length === 0) return [...artworks];
  return artworks.filter((artwork) => matchesQuery(artwork, query, categoryName));
}

/**
 * Order pieces for display.
 *
 * `featured` preserves catalogue order. Price modes compare the numeric
 * `price` on each option — never the formatted string, which would sort
 * "$1000" before "$90".
 */
export function sortArtworks(artworks: readonly Artwork[], mode: SortMode): Artwork[] {
  const next = [...artworks];
  if (mode === 'featured') return next;

  const direction = mode === 'price-asc' ? 1 : -1;
  return next.sort((a, b) => (lowestPrice(a) - lowestPrice(b)) * direction);
}
