import { describe, expect, it } from 'vitest';

import { ARTWORKS } from '@/constants/artworks';
import { resolveArtworkImage, resolveCategoryImages, resolveHeroImage } from '@/lib/images';
import { getArtworkIds } from '@/data/catalogue';
import { CATEGORIES } from '@/constants/categories';

/**
 * One photo per artwork, keyed exactly on `<categoryId>/<artworkId>`. These
 * assert the catalogue is fully illustrated — if someone adds a piece and
 * forgets its photo, or misnames the file, this fails rather than silently
 * showing a placeholder in production.
 */
describe('resolveArtworkImage', () => {
  it('resolves a photo for every piece in the catalogue', () => {
    const missing = ARTWORKS.filter((a) => resolveArtworkImage(a.categoryId, a.id) === null).map(
      (a) => `${a.categoryId}/${a.id}`,
    );

    expect(missing).toEqual([]);
  });

  it('returns null rather than throwing for an unknown piece', () => {
    expect(resolveArtworkImage('wedding', 'does-not-exist')).toBeNull();
    expect(resolveArtworkImage('nope', 'nope')).toBeNull();
  });

  it('does not match on a prefix — ids must resolve exactly', () => {
    expect(resolveArtworkImage('decor', 'mahade')).toBeNull();
  });
});

describe('resolveCategoryImages', () => {
  it('resolves a photo for every piece in every collection', () => {
    for (const category of CATEGORIES) {
      const ids = getArtworkIds(category.id);

      // The card cycles through all of them, so a missing photo is a gap in
      // the rotation rather than a placeholder nobody would notice.
      expect(resolveCategoryImages(category.id, ids), category.id).toHaveLength(ids.length);
    }
  });

  it('keeps catalogue order', () => {
    const ids = getArtworkIds('wedding');
    const [first, second] = resolveCategoryImages('wedding', ids);

    expect(first).toBe(resolveArtworkImage('wedding', ids[0] ?? ''));
    expect(second).toBe(resolveArtworkImage('wedding', ids[1] ?? ''));
  });

  it('omits pieces that have no photo yet, rather than leaving a blank slide', () => {
    expect(resolveCategoryImages('wedding', ['does-not-exist'])).toEqual([]);
  });

  it('handles an empty collection', () => {
    expect(resolveCategoryImages('wedding', [])).toEqual([]);
  });
});

describe('resolveHeroImage', () => {
  it('resolves the hero photo', () => {
    // The homepage above-the-fold image; its absence would silently fall back
    // to the "drop image here" placeholder in production.
    expect(resolveHeroImage()).not.toBeNull();
  });
});
