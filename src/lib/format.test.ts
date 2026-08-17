import { describe, expect, it } from 'vitest';

import { ARTWORKS } from '@/constants/artworks';
import {
  formatPieceCount,
  formatPrice,
  formatPriceRange,
  formatPriceWithCurrency,
  formatSizeSummary,
} from '@/lib/format';
import type { Artwork } from '@/types/content';

const twoSizes: Artwork = {
  id: 'test-piece',
  categoryId: 'wedding',
  title: 'Engagement Theme',
  options: [
    { label: '10 inch ring', price: 200 },
    { label: '12 inch ring', price: 250 },
  ],
};

const oneSize: Artwork = {
  id: 'hanky',
  categoryId: 'names',
  title: 'Customised Initial on Handkerchief',
  options: [{ label: '12 × 12 inch', price: 50 }],
};

describe('price formatting', () => {
  it('formats a bare price', () => {
    expect(formatPrice(125)).toBe('$125');
  });

  it('appends the currency where it is spelled out', () => {
    expect(formatPriceWithCurrency(125)).toBe('$125 AUD');
  });

  it('quotes a multi-size piece as "from" its cheapest option', () => {
    expect(formatPriceRange(twoSizes)).toBe('from $200');
  });

  it('quotes a single-size piece flat', () => {
    expect(formatPriceRange(oneSize)).toBe('$50');
  });
});

describe('formatSizeSummary', () => {
  it('joins the distinct measurements', () => {
    expect(formatSizeSummary(twoSizes)).toBe('10 & 12 inch');
  });

  it('passes through a non-ring size', () => {
    expect(formatSizeSummary(oneSize)).toBe('12 × 12 inch');
  });

  it('never doubles the unit when a label already carries one', () => {
    // "12 × 12 inch" cannot be reduced to a bare number, so appending " inch"
    // produced "10 & 12 × 12 inch inch".
    const mixed: Artwork = {
      id: 'mixed',
      categoryId: 'names',
      title: 'Mixed',
      options: [
        { label: '10 inch ring', price: 120 },
        { label: '12 × 12 inch', price: 50 },
      ],
    };
    const summary = formatSizeSummary(mixed);
    expect(summary).not.toMatch(/inch\s+inch/);
    expect(summary).toContain('12 × 12 inch');
  });

  it('collapses repeated measurements from variant labels', () => {
    const mandap = ARTWORKS.find((a) => a.id === 'mandap-theme-with-cartoon-couple');
    // Four options across two variants, but only two distinct ring sizes.
    expect(formatSizeSummary(mandap!)).toBe('10 & 12 inch');
  });
});

describe('formatPieceCount', () => {
  it('pluralises', () => {
    expect(formatPieceCount(1)).toBe('1 piece');
    expect(formatPieceCount(11)).toBe('11 pieces');
    expect(formatPieceCount(0)).toBe('0 pieces');
  });
});
