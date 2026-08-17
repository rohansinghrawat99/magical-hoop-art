import type { Spec } from '@/types/content';

/**
 * Spec rows on the artwork page.
 *
 * The size row is not here — each piece carries its own size options (see
 * `Artwork.options`), and the selected one is prepended at render time.
 */
export const STATIC_SPECS: readonly Spec[] = [
  { k: 'Base fabric', v: 'Cotton / satin — your choice' },
  { k: 'Made in', v: '7–10 days' },
  { k: 'Shipping', v: 'World-wide, tracked' },
  { k: 'Personalisation', v: 'Names, dates, colours included' },
] as const;

/** Label above the size selector on the artwork page. */
export const SIZE_LABEL = 'Size';

/** Reassurance line beside the price. */
export const PRICE_NOTE = 'incl. hoop, packaging & gift note';
export const PRICE_NOTE_MOBILE = 'incl. hoop & gift note';
