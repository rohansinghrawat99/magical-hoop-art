/**
 * Route helpers. Every internal link is built from these, so a URL shape only
 * ever changes in one place.
 */
export const ROUTES = {
  home: '/',
  category: (categoryId: string) => `/collections/${categoryId}`,
  artwork: (categoryId: string, artworkId: string) => `/collections/${categoryId}/${artworkId}`,
} as const;

/**
 * Anchor ids for the smooth-scroll jumps. The desktop and mobile trees render
 * separate sections, so each has its own id — matching the design.
 */
export const SECTION_IDS = {
  collections: { desktop: 'collections', mobile: 'mcollections' },
  process: { desktop: 'process', mobile: 'mprocess' },
} as const;

/** Desktop header links. "Enquire" is rendered separately as a button. */
export const DESKTOP_NAV = [
  { label: 'Collections', target: 'collections' },
  { label: 'Process', target: 'process' },
] as const;
