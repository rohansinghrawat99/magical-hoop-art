import type { Artwork } from '@/types/content';

/** `125` → `"$125"` */
export function formatPrice(price: number): string {
  return `$${String(price)}`;
}

/** `125` → `"$125 AUD"` — used where the currency needs spelling out. */
export function formatPriceWithCurrency(price: number): string {
  return `${formatPrice(price)} AUD`;
}

/**
 * The price shown on a grid card.
 *
 * Most pieces come in two sizes, so the card quotes the cheaper one as "from
 * $X". A piece with a single option quotes it flat.
 */
export function formatPriceRange(artwork: Artwork): string {
  const prices = artwork.options.map((option) => option.price);
  const low = Math.min(...prices);
  const high = Math.max(...prices);

  return low === high ? formatPrice(low) : `from ${formatPrice(low)}`;
}

/**
 * The size summary on a grid card, e.g. `"10 & 12 inch"` or `"12 × 12 inch"`.
 *
 * Reduces the option labels to their distinct leading measurements so the card
 * stays short; the full labels live on the artwork page.
 */
export function formatSizeSummary(artwork: Artwork): string {
  const measurements = [
    ...new Set(
      artwork.options.map((option) => {
        const match = /^(\d+)\s*inch/i.exec(option.label);
        return match?.[1] ?? option.label;
      }),
    ),
  ];

  // Only append the unit when every part is a bare number. A label the regex
  // could not reduce (e.g. "12 × 12 inch") already carries its own unit, and
  // appending again produced "10 & 12 × 12 inch inch".
  const allNumeric = measurements.every((value) => /^\d+$/.test(value));

  if (measurements.length === 1) {
    const only = measurements[0] ?? '';
    return allNumeric ? `${only} inch` : only;
  }

  return allNumeric ? `${measurements.join(' & ')} inch` : measurements.join(' · ');
}

/**
 * The artwork copy shown on the detail page.
 *
 * Generated from the title and the sizes on offer unless `description` is set
 * on the piece explicitly.
 */
export function buildArtworkDescription(artwork: Artwork): string {
  if (artwork.description) return artwork.description;

  const opening = `Hand-embroidered to order — ${artwork.title.toLowerCase()}.`;

  return (
    `${opening} Every element is re-stitched for you, so names, dates and the ` +
    `colour of the fabric change to match your occasion. Thread work is finished ` +
    `at the back and sealed, ready to hang straight out of the box.`
  );
}

/** `"3 pieces"` / `"1 piece"` */
export function formatPieceCount(count: number): string {
  return `${String(count)} ${count === 1 ? 'piece' : 'pieces'}`;
}
