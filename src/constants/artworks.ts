import type { Artwork } from '@/types/content';

/**
 * Every piece in the catalogue, grouped by collection and in display order.
 *
 * To add one: append an object with a unique kebab-case `id` — always the
 * slugified title — and at least one size option. That id is the URL segment
 * (`/collections/wedding/<id>`) and the photo filename
 * (`src/assets/artworks/wedding/<id>.webp`). Piece counts, "from" prices and
 * search tags are all derived. See docs/CONTENT_GUIDE.md.
 */
export const ARTWORKS: readonly Artwork[] = [
  // --- Photo Frames ------------------------------------------------------
  {
    id: 'couple-on-swing-with-customised-calendar-and-four-photos',
    categoryId: 'photo-frames',
    title: 'Couple on Swing with customised Calendar and four photos',
    options: [
      { label: '12 inch ring', price: 250 },
      { label: '14 inch ring', price: 300 },
    ],
  },
  {
    id: 'photos-with-some-line-with-black-flower-lace-pearls-3-4-photos-can-be-customised-with-pearls',
    categoryId: 'photo-frames',
    title:
      'Photos with some line with black flower lace & pearls (3/4 photos can be customised with pearls)',
    options: [
      { label: '10 inch ring', price: 250 },
      { label: '12 inch ring', price: 275 },
    ],
  },
  {
    id: 'one-photo-with-floral-border-name-some-lines-black-flower-lace-with-pearls',
    categoryId: 'photo-frames',
    title: 'One photo with floral border, name & some lines, black flower lace with pearls',
    options: [
      { label: '10 inch ring', price: 175 },
      { label: '12 inch ring', price: 200 },
    ],
  },
  {
    id: 'double-hoop-photoframe-with-florals-names-and-dates',
    categoryId: 'photo-frames',
    title: 'Double hoop photoframe with florals, names and dates',
    options: [
      { label: '10 inch ring', price: 180 },
      { label: '12 inch ring', price: 220 },
    ],
  },
  {
    id: 'hanging-photos-with-name-and-some-words',
    categoryId: 'photo-frames',
    title: 'Hanging photos with name and some words',
    options: [
      { label: '10 inch ring', price: 175 },
      { label: '12 inch ring', price: 200 },
    ],
  },
  {
    id: 'memory-hoop',
    categoryId: 'photo-frames',
    title: 'Memory Hoop',
    options: [
      { label: '10 inch ring', price: 100 },
      { label: '12 inch ring', price: 150 },
    ],
  },

  // --- Some Thoughts -----------------------------------------------------
  {
    id: 'mothers-day-hoop',
    categoryId: 'thoughts',
    title: "Mother's Day Hoop",
    options: [
      { label: '10 inch ring', price: 250 },
      { label: '12 inch ring', price: 300 },
    ],
  },
  {
    id: 'customised-thoughts-on-handkerchief',
    categoryId: 'thoughts',
    title: 'Customised thoughts on Handkerchief',
    options: [{ label: '12 × 12 inch', price: 50 }],
  },
  {
    id: 'birthday-wish-with-heart-floral-theme',
    categoryId: 'thoughts',
    title: 'Birthday wish with Heart Floral Theme',
    options: [
      { label: '10 inch ring', price: 150 },
      { label: '12 inch ring', price: 175 },
    ],
  },
  {
    id: 'birthday-wish-with-heart-floral-theme-2',
    categoryId: 'thoughts',
    title: 'Birthday wish with Heart Floral Theme',
    options: [
      { label: '10 inch ring', price: 150 },
      { label: '12 inch ring', price: 175 },
    ],
  },
  {
    id: 'hoop-for-mom',
    categoryId: 'thoughts',
    title: 'Hoop for Mom',
    options: [
      { label: '10 inch ring', price: 150 },
      { label: '12 inch ring', price: 175 },
    ],
  },
  {
    id: 'birthday-hoop-with-doll',
    categoryId: 'thoughts',
    title: 'Birthday hoop with Doll',
    options: [
      { label: '10 inch ring', price: 175 },
      { label: '12 inch ring', price: 200 },
    ],
  },
  {
    id: 'rainbow-and-cloud-theme',
    categoryId: 'thoughts',
    title: 'Rainbow and Cloud Theme',
    options: [
      { label: '10 inch ring', price: 190 },
      { label: '12 inch ring', price: 220 },
    ],
  },
  {
    id: 'customised-makka-madina-theme',
    categoryId: 'thoughts',
    title: 'Customised Makka Madina Theme',
    options: [
      { label: '10 inch ring', price: 200 },
      { label: '12 inch ring', price: 250 },
    ],
  },
  {
    id: 'birthday-wish-with-name-3d-doll',
    categoryId: 'thoughts',
    title: 'Birthday wish with Name & 3D Doll',
    options: [
      { label: '10 inch ring', price: 200 },
      { label: '12 inch ring', price: 250 },
    ],
  },
  {
    id: 'birthday-hoop-with-name-3d-doll-with-some-lines',
    categoryId: 'thoughts',
    title: 'Birthday Hoop with Name & 3D Doll with some lines',
    options: [
      { label: '10 inch ring', price: 200 },
      { label: '12 inch ring', price: 250 },
    ],
  },
  {
    id: 'customised-background-view-with-girls-on-swing-and-some-lines',
    categoryId: 'thoughts',
    title: 'Customised background view with girls on swing and some lines',
    options: [
      { label: '10 inch ring', price: 230 },
      { label: '12 inch ring', price: 275 },
    ],
  },

  // --- Calendar Wishes ---------------------------------------------------
  {
    id: 'calendar-with-florals-only',
    categoryId: 'calendar',
    title: 'Calendar With Florals only',
    options: [
      { label: '10 inch ring', price: 150 },
      { label: '12 inch ring', price: 180 },
    ],
  },
  {
    id: 'calendar-with-star-heart',
    categoryId: 'calendar',
    title: 'Calendar With Star-Heart',
    options: [
      { label: '10 inch ring', price: 120 },
      { label: '12 inch ring', price: 150 },
    ],
  },
  {
    id: 'calendar-with-florals-only-2',
    categoryId: 'calendar',
    title: 'Calendar With Florals only',
    options: [
      { label: '10 inch ring', price: 150 },
      { label: '12 inch ring', price: 180 },
    ],
  },
  {
    id: 'birthday-wish-with-clouds-name-3d-doll',
    categoryId: 'calendar',
    title: 'Birthday wish with clouds, Name & 3D Doll',
    options: [
      { label: '10 inch ring', price: 175 },
      { label: '12 inch ring', price: 200 },
    ],
  },
  {
    id: 'anniversary-hoop-with-bold-names-and-florals',
    categoryId: 'calendar',
    title: 'Anniversary Hoop with Bold Names and florals',
    options: [
      { label: '10 inch ring', price: 200 },
      { label: '12 inch ring', price: 230 },
    ],
  },
  {
    id: 'friendship-hoop-with-3d-girls-on-swing',
    categoryId: 'calendar',
    title: 'Friendship hoop with 3D girls on swing',
    options: [
      { label: '10 inch ring', price: 200 },
      { label: '12 inch ring', price: 250 },
    ],
  },
  {
    id: 'birthday-hoop-with-couple-on-swing',
    categoryId: 'calendar',
    title: 'Birthday hoop with couple on swing',
    options: [
      { label: '10 inch ring', price: 200 },
      { label: '12 inch ring', price: 250 },
    ],
  },

  // --- Wedding, Anniversary & Engagement ---------------------------------
  {
    id: 'curtain-theme-with-3d-couple',
    categoryId: 'wedding',
    title: 'Curtain Theme with 3D Couple',
    options: [
      { label: '10 inch ring', price: 150 },
      { label: '12 inch ring', price: 175 },
    ],
  },
  {
    id: 'engagement-theme',
    categoryId: 'wedding',
    title: 'Engagement Theme',
    options: [
      { label: '10 inch ring', price: 200 },
      { label: '12 inch ring', price: 250 },
    ],
  },
  {
    id: 'names-and-initials-theme-with-3d-couple',
    categoryId: 'wedding',
    title: 'Names and Initials Theme With 3D Couple',
    options: [
      { label: '10 inch ring', price: 175 },
      { label: '12 inch ring', price: 200 },
    ],
  },
  {
    id: 'calendar-theme-with-3d-couple',
    categoryId: 'wedding',
    title: 'Calendar Theme with 3D Couple',
    options: [
      { label: '10 inch ring', price: 200 },
      { label: '12 inch ring', price: 250 },
    ],
  },
  {
    id: 'calendar-curtain-theme-with-3d-couple',
    categoryId: 'wedding',
    title: 'Calendar & Curtain Theme with 3D Couple',
    options: [{ label: '12 inch ring', price: 280 }],
  },
  {
    id: 'heart-floral-theme-with-cartoon-couple',
    categoryId: 'wedding',
    title: 'Heart Floral Theme with Cartoon Couple',
    options: [
      { label: '10 inch ring', price: 230 },
      { label: '12 inch ring', price: 280 },
    ],
  },
  {
    id: 'heart-floral-with-3d-couple',
    categoryId: 'wedding',
    title: 'Heart Floral with 3D Couple',
    options: [
      { label: '10 inch ring', price: 250 },
      { label: '12 inch ring', price: 300 },
    ],
  },
  {
    id: 'mandap-theme-with-cartoon-couple',
    categoryId: 'wedding',
    title: 'Mandap Theme with Cartoon Couple',
    options: [
      { label: '10 inch ring · cartoon couple', price: 250 },
      { label: '12 inch ring · cartoon couple', price: 300 },
      { label: '10 inch ring · 3D couple', price: 280 },
      { label: '12 inch ring · 3D couple', price: 330 },
    ],
  },

  // --- Names & Initials --------------------------------------------------
  {
    id: 'single-name-and-florals',
    categoryId: 'names',
    title: 'Single Name and Florals',
    options: [
      { label: '10 inch ring', price: 120 },
      { label: '12 inch ring', price: 150 },
    ],
  },
  {
    id: 'customised-initial-on-handkerchief',
    categoryId: 'names',
    title: 'Customised Initial on Handkerchief',
    options: [{ label: '12 × 12 inch', price: 50 }],
  },
  {
    id: 'vertical-names-and-florals',
    categoryId: 'names',
    title: 'Vertical Names and Florals',
    options: [
      { label: '10 inch ring', price: 150 },
      { label: '12 inch ring', price: 180 },
    ],
  },
  {
    id: 'horizontal-names-and-florals',
    categoryId: 'names',
    title: 'Horizontal Names and Florals',
    options: [
      { label: '10 inch ring', price: 150 },
      { label: '12 inch ring', price: 180 },
    ],
  },
  {
    id: 'heart-floral-theme',
    categoryId: 'names',
    title: 'Heart Floral Theme',
    options: [
      { label: '10 inch ring', price: 180 },
      { label: '12 inch ring', price: 200 },
    ],
  },
  {
    id: 'anniversary-hoop-with-bold-names-and-florals',
    categoryId: 'names',
    title: 'Anniversary Hoop with Bold Names and florals',
    options: [
      { label: '10 inch ring', price: 200 },
      { label: '12 inch ring', price: 230 },
    ],
  },
  {
    id: 'french-knot-filled-up-initials-with-maple-leaf-with-some-florals',
    categoryId: 'names',
    title: 'French Knot filled-up Initials with Maple Leaf with some florals',
    options: [
      { label: '10 inch ring', price: 250 },
      { label: '12 inch ring', price: 280 },
    ],
  },

  // --- Home Decor --------------------------------------------------------
  {
    id: 'knot-stitched-swastik',
    categoryId: 'decor',
    title: 'Knot Stitched Swastik',
    options: [
      { label: '10 inch ring', price: 350 },
      { label: '12 inch ring', price: 500 },
    ],
  },
  {
    id: 'radha-krishna',
    categoryId: 'decor',
    title: 'Radha Krishna',
    options: [
      { label: '10 inch ring', price: 300 },
      { label: '12 inch ring', price: 450 },
    ],
  },
  {
    id: 'mahadev',
    categoryId: 'decor',
    title: 'Mahadev',
    options: [
      { label: '10 inch ring', price: 300 },
      { label: '12 inch ring', price: 450 },
    ],
  },
] as const;
