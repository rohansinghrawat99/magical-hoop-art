import type { Artwork } from '@/types/content';

/**
 * Price maths over a piece's size options.
 *
 * Lives in `lib/` rather than `data/` so the pure search and sort helpers can
 * use it without depending on the catalogue.
 */

/** The cheapest option — what "from $X" quotes and what price sorting uses. */
export function lowestPrice(artwork: Artwork): number {
  return artwork.options.reduce(
    (min, option) => (option.price < min ? option.price : min),
    Number.POSITIVE_INFINITY,
  );
}

/** The dearest option. */
export function highestPrice(artwork: Artwork): number {
  return artwork.options.reduce((max, option) => (option.price > max ? option.price : max), 0);
}
