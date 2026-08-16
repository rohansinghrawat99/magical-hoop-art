import type { Category } from '@/types/content';

/**
 * The six collections, in the order they appear on the home page.
 *
 * Piece counts and "from" prices are NOT declared here — they are derived from
 * `artworks.ts` by the selectors in `src/data/`, so they stay correct
 * automatically. See docs/CONTENT_GUIDE.md.
 */
export const CATEGORIES: readonly Category[] = [
  {
    id: 'photo-frames',
    name: 'Photo Frames',
    shortName: 'Photo Frames',
    blurb:
      'Your own photographs stitched into florals, pearls and lace — calendars, hanging frames and memory hoops.',
    placeholderLabel: 'photo hoop',
  },
  {
    id: 'thoughts',
    name: 'Some Thoughts',
    shortName: 'Some Thoughts',
    blurb:
      'Long messages, birthday wishes and devotional themes stitched for the person who needs to read them.',
    placeholderLabel: 'quote hoop',
  },
  {
    id: 'calendar',
    name: 'Calendar Wishes',
    shortName: 'Calendar Wishes',
    blurb:
      'The month, the date circled in a tiny heart. Birthdays and anniversaries made permanent.',
    placeholderLabel: 'calendar hoop',
  },
  {
    id: 'wedding',
    name: 'Wedding, Anniversary & Engagement',
    shortName: 'Wedding',
    blurb:
      'Mandap scenes, curtain themes and 3D couples — the pieces people gift at every wedding.',
    placeholderLabel: 'couple hoop',
  },
  {
    id: 'names',
    name: 'Names & Initials',
    shortName: 'Names & Initials',
    blurb: 'A name, two initials, a monogram — framed in florals, French knots and pearls.',
    placeholderLabel: 'name hoop',
  },
  {
    id: 'decor',
    name: 'Home Decor',
    shortName: 'Home Decor',
    blurb: 'Devotional pieces for the prayer corner, entryway and living room wall.',
    placeholderLabel: 'decor hoop',
  },
] as const;
