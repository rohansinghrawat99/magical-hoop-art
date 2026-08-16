import { describe, expect, it } from 'vitest';

import { getArtworks } from '@/data/catalogue';
import { lowestPrice } from '@/lib/price';
import {
  filterArtworks,
  matchesQuery,
  nextSortMode,
  SORT_LABELS,
  sortArtworks,
  type SortMode,
} from '@/lib/search';
import type { Artwork } from '@/types/content';

const wedding = getArtworks('wedding');
const decor = getArtworks('decor');

describe('matchesQuery', () => {
  const mandap = wedding.find((a) => a.id === 'mandap-theme-with-cartoon-couple')!;

  it('matches an empty query against everything', () => {
    expect(matchesQuery(mandap, '')).toBe(true);
    expect(matchesQuery(mandap, '   ')).toBe(true);
  });

  it('is case insensitive', () => {
    expect(matchesQuery(mandap, 'MANDAP')).toBe(true);
    expect(matchesQuery(mandap, 'mandap')).toBe(true);
  });

  it('matches on a substring, not just whole words', () => {
    expect(matchesQuery(mandap, 'manda')).toBe(true);
    expect(matchesQuery(mandap, 'artoon')).toBe(true);
  });

  it('matches on the size labels', () => {
    expect(matchesQuery(mandap, '12 inch')).toBe(true);
  });

  it('matches on the collection name when given one', () => {
    expect(matchesQuery(mandap, 'engagement', 'Wedding, Anniversary & Engagement')).toBe(true);
    expect(matchesQuery(mandap, 'engagement')).toBe(false);
  });

  it('requires every term to match', () => {
    expect(matchesQuery(mandap, 'mandap cartoon')).toBe(true);
    expect(matchesQuery(mandap, 'mandap rainbow')).toBe(false);
  });

  it('ignores punctuation the visitor happens to type', () => {
    expect(matchesQuery(mandap, 'mandap!')).toBe(true);
  });
});

describe('filterArtworks', () => {
  it('returns everything for an empty query', () => {
    expect(filterArtworks(wedding, '')).toHaveLength(wedding.length);
  });

  it('narrows to the matching pieces', () => {
    const result = filterArtworks(wedding, 'curtain');
    expect(result.length).toBeGreaterThan(0);
    expect(result.length).toBeLessThan(wedding.length);
    for (const artwork of result) {
      expect(artwork.title.toLowerCase()).toContain('curtain');
    }
  });

  it('returns an empty array when nothing matches', () => {
    expect(filterArtworks(wedding, 'helicopter')).toEqual([]);
  });

  it('does not mutate the input', () => {
    const before = [...wedding];
    filterArtworks(wedding, 'curtain');
    expect(wedding).toEqual(before);
  });

  it('preserves catalogue order', () => {
    const result = filterArtworks(wedding, 'couple');
    const order = wedding.filter((a) => result.includes(a));
    expect(result).toEqual(order);
  });
});

describe('sortArtworks', () => {
  it('leaves catalogue order alone in featured mode', () => {
    expect(sortArtworks(decor, 'featured')).toEqual([...decor]);
  });

  it('sorts ascending by the cheapest option, numerically', () => {
    const prices = sortArtworks(decor, 'price-asc').map(lowestPrice);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  it('sorts descending', () => {
    const prices = sortArtworks(decor, 'price-desc').map(lowestPrice);
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });

  it('compares numbers rather than formatted strings', () => {
    // String comparison would put "$1000" before "$90".
    const pieces: Artwork[] = [
      { id: 'a', categoryId: 'decor', title: 'A', options: [{ label: '10 inch ring', price: 90 }] },
      {
        id: 'b',
        categoryId: 'decor',
        title: 'B',
        options: [{ label: '10 inch ring', price: 1000 }],
      },
    ];
    expect(sortArtworks(pieces, 'price-asc').map((a) => a.id)).toEqual(['a', 'b']);
  });

  it('does not mutate the input', () => {
    const before = [...decor];
    sortArtworks(decor, 'price-desc');
    expect(decor).toEqual(before);
  });

  it('keeps the same set of pieces in every mode', () => {
    for (const mode of ['featured', 'price-asc', 'price-desc'] as SortMode[]) {
      const ids = sortArtworks(wedding, mode)
        .map((a) => a.id)
        .sort();
      expect(ids).toEqual(wedding.map((a) => a.id).sort());
    }
  });
});

describe('nextSortMode', () => {
  it('cycles Featured → Price ↑ → Price ↓ → Featured', () => {
    expect(nextSortMode('featured')).toBe('price-asc');
    expect(nextSortMode('price-asc')).toBe('price-desc');
    expect(nextSortMode('price-desc')).toBe('featured');
  });

  it('labels every mode', () => {
    expect(SORT_LABELS.featured).toBe('Featured');
    expect(SORT_LABELS['price-asc']).toContain('Price');
    expect(SORT_LABELS['price-desc']).toContain('Price');
  });
});

describe('identity is carried by id, never by position', () => {
  /**
   * The spec calls this out as a real bug if missed: after filtering and
   * sorting, a card must still open its own artwork. Because the transforms
   * return the artwork objects themselves — and the UI links via `artwork.id` —
   * the rendered index is never used as an identifier.
   */
  it('keeps each piece paired with its own id through filter and sort', () => {
    const filtered = filterArtworks(wedding, 'couple');
    const sorted = sortArtworks(filtered, 'price-desc');

    for (const artwork of sorted) {
      const original = wedding.find((a) => a.id === artwork.id);
      expect(original).toBe(artwork);
      expect(artwork.title).toBe(original?.title);
    }
  });

  it('changes order between modes without changing membership', () => {
    const asc = sortArtworks(wedding, 'price-asc').map((a) => a.id);
    const desc = sortArtworks(wedding, 'price-desc').map((a) => a.id);

    expect(asc).not.toEqual(desc);
    expect([...asc].sort()).toEqual([...desc].sort());
  });
});
