import { describe, expect, it } from 'vitest';

import { slugify } from '../../scripts/slugify.mjs';
import { ARTWORKS } from '@/constants/artworks';
import { CATEGORIES } from '@/constants/categories';
import {
  CATEGORIES_WITH_STATS,
  getArtwork,
  getArtworks,
  getCategory,
  isCategoryId,
  lowestPrice,
  LOWEST_PRICE,
  TOTAL_ARTWORKS,
} from '@/data/catalogue';

describe('catalogue integrity', () => {
  it('gives every artwork an id unique within its collection', () => {
    for (const category of CATEGORIES) {
      const ids = getArtworks(category.id).map((a) => a.id);
      expect(new Set(ids).size, `duplicate id in ${category.id}`).toBe(ids.length);
    }
  });

  it('derives every id from its title', () => {
    for (const artwork of ARTWORKS) {
      // Two pieces genuinely share a title; the second carries a -N suffix.
      const expected = slugify(artwork.title);
      expect(artwork.id).toMatch(new RegExp(`^${expected}(-\\d+)?$`));
    }
  });

  it('assigns every artwork to a real category', () => {
    const known = new Set(CATEGORIES.map((c) => c.id));
    for (const artwork of ARTWORKS) {
      expect(known.has(artwork.categoryId)).toBe(true);
    }
  });

  it('uses url-safe ids', () => {
    for (const artwork of ARTWORKS) {
      expect(artwork.id).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(encodeURIComponent(artwork.id)).toBe(artwork.id);
    }
  });

  it('gives every artwork at least one priced size option', () => {
    for (const artwork of ARTWORKS) {
      expect(artwork.options.length).toBeGreaterThan(0);
      for (const option of artwork.options) {
        expect(option.label.trim().length).toBeGreaterThan(0);
        expect(option.price).toBeGreaterThan(0);
        expect(Number.isInteger(option.price)).toBe(true);
      }
    }
  });

  it('has no duplicate size labels within a piece', () => {
    for (const artwork of ARTWORKS) {
      const labels = artwork.options.map((o) => o.label);
      expect(new Set(labels).size, artwork.id).toBe(labels.length);
    }
  });
});

describe('derived stats', () => {
  it('counts pieces per category from the artworks array', () => {
    const total = CATEGORIES_WITH_STATS.reduce((sum, c) => sum + c.count, 0);
    expect(total).toBe(TOTAL_ARTWORKS);
    expect(TOTAL_ARTWORKS).toBe(ARTWORKS.length);
  });

  it('holds all seven collections in the order supplied', () => {
    expect(CATEGORIES_WITH_STATS.map((c) => c.id)).toEqual([
      'photo-frames',
      'thoughts',
      'calendar',
      'wedding',
      'names',
      'decor',
      'baby',
    ]);
  });

  it('derives "from" price as the cheapest option in the collection', () => {
    for (const category of CATEGORIES_WITH_STATS) {
      const cheapest = Math.min(...getArtworks(category.id).map(lowestPrice));
      expect(category.priceFrom).toBe(`$${String(cheapest)}`);
    }
  });

  it('reports the lowest price across the whole catalogue', () => {
    expect(LOWEST_PRICE).toBe(Math.min(...ARTWORKS.map(lowestPrice)));
  });

  it('keeps every category non-empty', () => {
    for (const category of CATEGORIES_WITH_STATS) {
      expect(category.count).toBeGreaterThan(0);
    }
  });
});

describe('lookups', () => {
  it('finds a category by id', () => {
    expect(getCategory('photo-frames')?.name).toBe('Photo Frames');
    expect(getCategory('wedding')?.name).toBe('Wedding, Anniversary & Engagement');
  });

  it('returns null for an unknown category', () => {
    expect(getCategory('nope')).toBeNull();
    expect(getCategory(undefined)).toBeNull();
  });

  it('finds an artwork within its category', () => {
    expect(getArtwork('decor', 'mahadev')?.options[0].price).toBe(300);
  });

  it('returns null when the artwork is in a different category', () => {
    expect(getArtwork('decor', 'engagement-theme')).toBeNull();
  });

  it('keeps same-titled pieces in different collections separate', () => {
    // "Anniversary Hoop with Bold Names and florals" exists in two collections.
    expect(getArtwork('calendar', 'anniversary-hoop-with-bold-names-and-florals')).not.toBeNull();
    expect(getArtwork('names', 'anniversary-hoop-with-bold-names-and-florals')).not.toBeNull();
  });

  it('narrows category ids', () => {
    expect(isCategoryId('thoughts')).toBe(true);
    expect(isCategoryId('thought')).toBe(false);
    expect(isCategoryId(undefined)).toBe(false);
  });
});
