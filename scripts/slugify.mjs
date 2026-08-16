/**
 * The single slug rule for the whole project.
 *
 * An artwork's `id` is the slug of its title, and its photo file is named after
 * that same id. Both sides must agree exactly or the photo silently fails to
 * resolve, so the rule lives here and is imported by both the image pipeline
 * and the test that pins `id === slugify(title)`.
 *
 * Handles the awkward real-world cases:
 *   "Photos … (3/4 photos …)"     → "…-3-4-photos-…"   (macOS stores / as :)
 *   "Mother's Day Hoop"           → "mothers-day-hoop" (apostrophes vanish)
 *   "Calendar & Curtain Theme"    → "calendar-curtain-theme"
 *   "Birthday wish with clouds,  Name"  → collapses the double space
 */
export function slugify(value) {
  return value
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // strip accents
    .toLowerCase()
    .replace(/['’]/g, '') // apostrophes join words: mother's -> mothers
    .replace(/[^a-z0-9]+/g, '-') // everything else becomes a separator
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

/**
 * Strip the extension from a dropped photo, tolerating the double extensions
 * the source files carry (`Memory Hoop.JPG.jpeg`).
 */
export function baseName(fileName) {
  return fileName
    .replace(/\.(jpe?g|png|heic|heif|webp|avif|tiff?)$/i, '')
    .replace(/\.(jpe?g|png|heic|heif)$/i, '');
}
