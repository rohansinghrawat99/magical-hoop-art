/**
 * Artwork photo resolution.
 *
 * Photos live in the repository under `src/assets/artworks/<categoryId>/` and
 * are bundled by Vite, which content-hashes them so they can be served with a
 * long immutable cache. Nothing is fetched from an external host — see
 * docs/CONTENT_GUIDE.md for why, and for the naming convention.
 *
 * The glob is eager so lookups are synchronous and a missing file is simply an
 * absent key rather than a build error: components fall back to the design's
 * placeholder hoop, so a piece added before its photo still renders.
 */

const modules = import.meta.glob<string>('../assets/artworks/**/*.{webp,jpg,jpeg,png,avif}', {
  eager: true,
  import: 'default',
});

const heroModules = import.meta.glob<string>('../assets/hero/*.{webp,jpg,jpeg,png,avif}', {
  eager: true,
  import: 'default',
});

/**
 * Build `"<categoryId>/<artworkId>-<n>" -> url`, sorted so `-1` comes first.
 *
 * `../assets/artworks/wedding/blue-lehenga-couple-1.webp`
 *   becomes `wedding/blue-lehenga-couple-1`
 */
function indexByKey(entries: Record<string, string>, prefix: string): Map<string, string> {
  const map = new Map<string, string>();

  for (const [path, url] of Object.entries(entries)) {
    const withoutPrefix = path.slice(path.indexOf(prefix) + prefix.length);
    const key = withoutPrefix.replace(/\.[^.]+$/, '');
    map.set(key, url);
  }

  return map;
}

const artworkImages = indexByKey(modules, '../assets/artworks/');
const heroImages = indexByKey(heroModules, '../assets/hero/');

/**
 * The photo for a piece, or `null` if it has none yet.
 *
 * One photo per artwork, named exactly after the piece's id:
 * `src/assets/artworks/wedding/blue-lehenga-couple.webp`.
 */
export function resolveArtworkImage(categoryId: string, artworkId: string): string | null {
  return artworkImages.get(`${categoryId}/${artworkId}`) ?? null;
}

/**
 * Every photo in a collection, in catalogue order, skipping pieces that have
 * none yet.
 *
 * The home page's collection card cycles through the whole set, so this is a
 * list rather than a single cover. Pieces without a photo are omitted rather
 * than left as gaps — a blank slide mid-rotation reads as a broken image.
 */
export function resolveCategoryImages(
  categoryId: string,
  artworkIds: readonly string[],
): readonly string[] {
  const urls: string[] = [];

  for (const artworkId of artworkIds) {
    const url = resolveArtworkImage(categoryId, artworkId);
    if (url) urls.push(url);
  }

  return urls;
}

/** The hero image, from `src/assets/hero/hero-hoop.*`. */
export function resolveHeroImage(): string | null {
  return heroImages.get('hero-hoop') ?? null;
}
