import { describe, expect, it } from 'vitest';

import { searchArtworks } from '@/data/catalogue';
import { POPULAR_QUERIES } from '@/features/search/search-context';

/**
 * A suggestion chip that returns nothing is worse than no chip at all — it
 * reads as a broken site. These stay honest as the catalogue changes: add a
 * piece or retire one, and a chip that stops matching fails here rather than in
 * front of a customer.
 */
describe('popular occasion chips', () => {
  it.each([...POPULAR_QUERIES])('“%s” returns at least one piece', (query) => {
    expect(searchArtworks(query).length).toBeGreaterThan(0);
  });

  it('offers six distinct suggestions', () => {
    expect(POPULAR_QUERIES).toHaveLength(6);
    expect(new Set(POPULAR_QUERIES).size).toBe(6);
  });
});
