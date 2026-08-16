import { describe, expect, it } from 'vitest';

import { ARTWORKS } from '@/constants/artworks';
import { resolveArtworkImage, resolveCategoryImage, resolveHeroImage } from '@/lib/images';
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

describe('resolveCategoryImage', () => {
  it('finds a cover photo for every collection', () => {
    for (const category of CATEGORIES) {
      expect(
        resolveCategoryImage(category.id, getArtworkIds(category.id)),
        category.id,
      ).not.toBeNull();
    }
  });

  it('handles an empty collection', () => {
    expect(resolveCategoryImage('wedding', [])).toBeNull();
  });
});

describe('resolveHeroImage', () => {
  it('resolves the hero photo', () => {
    // The homepage above-the-fold image; its absence would silently fall back
    // to the "drop image here" placeholder in production.
    expect(resolveHeroImage()).not.toBeNull();
  });
});
