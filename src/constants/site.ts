/**
 * Brand-level copy and contact details.
 */

/**
 * Full international format, digits only — no `+`, spaces or dashes.
 * Australian mobile 04xx xxx xxx becomes 61 4xx xxx xxx.
 *
 * `+61 430 610 556` → `61430610556`
 *
 * Override per-environment with `VITE_WHATSAPP_NUMBER` if ever needed.
 */
export const WHATSAPP_NUMBER = '61430610556';

/**
 * The number actually used at runtime.
 *
 * Read through a function rather than a module constant so `VITE_WHATSAPP_NUMBER`
 * is resolved per call — a module-level read would freeze the value at import
 * time, which makes the env var impossible to override in tests.
 */
export function getWhatsAppNumber(): string {
  const fromEnv: unknown = import.meta.env.VITE_WHATSAPP_NUMBER;
  return typeof fromEnv === 'string' && fromEnv.length > 0 ? fromEnv : WHATSAPP_NUMBER;
}

export const SITE = {
  name: 'Magical Hoop Art',
  /**
   * The footer signature, set in Parisienne. Lower-case "hoop art" is
   * deliberate — it matches the wordmark, not the title-cased `name`.
   */
  signature: 'Magical hoop art',
  /** The wordmark is set in two parts; see the Brandmark component. */
  wordmarkTop: 'Magical',
  wordmarkBottom: 'hoop art',
  tagline: 'Made to order · Shipped world-wide · Prices in AUD',
  taglineShort: 'Made to order · Shipped world-wide',
  currency: 'AUD',
  makeTime: '7–10 days',
} as const;

export const HERO = {
  eyebrow: 'Handmade · Made to order',
  headingLead: 'Stories stitched',
  headingLeadMobile: 'Stories stitched into a',
  headingScript: 'Frame',
  headingTail: 'into a',
  blurb:
    'Your memories, beautifully stitched by hands. Personalised embroidery hoops created with love to celebrate the people, moments and stories that mean the most to you. Shipping World-wide.',
  /**
   * The same words as `blurb`. The design ran a shorter line on mobile, so the
   * two are still separate keys — shorten this one if the full blurb ever
   * crowds the phone hero, and the desktop copy stays as it is.
   */
  blurbMobile:
    'Your memories, beautifully stitched by hands. Personalised embroidery hoops created with love to celebrate the people, moments and stories that mean the most to you. Shipping World-wide.',
  placeholderLabel: 'hero hoop photo',
  placeholderCaption: 'drop image here',
  placeholderDims: '1200 × 1200 · square crop',
} as const;

export const COLLECTIONS_SECTION = {
  eyebrow: 'Collections',
  heading: 'Find the one for your occasion',
  aside:
    'Every piece is made to order - Every element is re-stitched for you, things can be customised as per your occasion. Thread work is finished at the back and sealed, ready to hang straight out of the box.',
} as const;

export const PROCESS_SECTION = {
  eyebrow: 'How it works',
  /** Names the length of PROCESS_STEPS — keep the two in step. */
  heading: 'Five steps from your idea to the hoop on your wall',
} as const;

/** Instagram handle, without the `@`. */
export const INSTAGRAM_HANDLE = 'magical_hoopart';

export const SOCIAL_LINKS = [
  // The canonical profile URL. Links copied from the Instagram app carry an
  // `?igsh=…` share-tracking parameter; it is deliberately dropped here since
  // it adds nothing and goes stale.
  { label: 'Instagram', href: `https://www.instagram.com/${INSTAGRAM_HANDLE}` },
  { label: 'WhatsApp', href: `https://wa.me/${WHATSAPP_NUMBER}` },
] as const;
