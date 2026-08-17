/**
 * Content model.
 *
 * Everything the site displays is plain, serialisable data declared in
 * `src/constants/`. There is no CMS and no API — adding a piece means adding an
 * object to an array. See docs/CONTENT_GUIDE.md.
 */

/** Category ids are the URL segment: /collections/:categoryId */
export type CategoryId = 'photo-frames' | 'thoughts' | 'calendar' | 'wedding' | 'names' | 'decor';

export interface Category {
  id: CategoryId;
  /** Full display name, e.g. "Wedding, Anniversary & Engagement". */
  name: string;
  /** Condensed label for the mobile menu, e.g. "Wedding". */
  shortName: string;
  /** One or two sentences shown on the category card and category page. */
  blurb: string;
  /** Placeholder caption shown inside the hoop when no photo exists yet. */
  placeholderLabel: string;
}

/**
 * A category with its derived figures attached. `count` and `priceFrom` are
 * computed from the artworks array rather than stored, so they can never drift
 * out of sync when a piece is added or removed.
 */
export interface CategoryWithStats extends Category {
  count: number;
  /** Lowest price in the category, already formatted (e.g. "$95"). */
  priceFrom: string;
}

/**
 * One size a piece can be ordered in, with its price.
 *
 * Sizes and prices vary per piece — most come in 10 and 12 inch, one is 12 and
 * 14 inch, the handkerchiefs are a single flat size, and the Mandap piece has
 * four options because the cartoon and 3D couple versions are priced apart. So
 * the options live on the artwork rather than in one global list.
 */
export interface SizeOption {
  /** Display label, e.g. "10 inch ring" or "12 × 12 inch". */
  label: string;
  /** AUD, whole dollars. */
  price: number;
}

export interface Artwork {
  /**
   * Stable kebab-case slug — the URL segment and the photo filename.
   * Always `slugify(title)`; pinned by a test.
   */
  id: string;
  categoryId: CategoryId;
  title: string;
  /**
   * At least one — typed as a non-empty tuple so `options[0]` is always
   * defined. The first option is the one preselected on the artwork page.
   */
  options: readonly [SizeOption, ...SizeOption[]];
  /**
   * Extra search keywords beyond those derived automatically from the title
   * and collection. Rarely needed — see `src/lib/tags.ts`.
   */
  tags?: readonly string[];
}

export interface ProcessStep {
  /** Zero-padded ordinal as displayed, e.g. "01". */
  n: string;
  title: string;
  body: string;
}

export interface Spec {
  /** Label, rendered uppercase. */
  k: string;
  /** Value. */
  v: string;
}
