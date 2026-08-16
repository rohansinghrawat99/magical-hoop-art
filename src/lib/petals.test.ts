import { describe, expect, it } from 'vitest';

import { buildPetalField, PETAL_COUNT } from '@/lib/petals';

/**
 * The petal field is a port of the design's generator. These tests pin the
 * properties that make it a *faithful* port — determinism and shape counts — so
 * a well-meaning refactor of the "magic numbers" fails loudly.
 */
describe('buildPetalField', () => {
  it('is deterministic', () => {
    expect(buildPetalField(16)).toEqual(buildPetalField(16));
  });

  it('emits the falling petals plus four anchor blooms', () => {
    expect(buildPetalField(16)).toHaveLength(16 + 4);
    expect(buildPetalField(12)).toHaveLength(12 + 4);
  });

  it('matches the design counts per breakpoint', () => {
    expect(PETAL_COUNT).toEqual({ mobile: 12, desktop: 16 });
  });

  it('gives falling petals a single petal and no centre', () => {
    const field = buildPetalField(12);
    for (const bloom of field.slice(0, 12)) {
      expect(bloom.petals).toHaveLength(1);
      expect(bloom.core).toBeNull();
    }
  });

  it('gives anchor blooms a centre, petals and leaves', () => {
    const anchors = buildPetalField(12).slice(12);
    expect(anchors).toHaveLength(4);
    for (const bloom of anchors) {
      expect(bloom.core).not.toBeNull();
      // 5-7 petals plus exactly 2 leaves.
      expect(bloom.petals.length).toBeGreaterThanOrEqual(7);
      expect(bloom.petals.length).toBeLessThanOrEqual(9);
    }
  });

  it('blurs and fades the anchor blooms as the design specifies', () => {
    for (const bloom of buildPetalField(12).slice(12)) {
      expect(bloom.wrap.opacity).toBe(0.45);
      expect(bloom.wrap.filter).toBe('blur(4px)');
    }
  });

  it('drives colours from design tokens rather than hard-coded hex', () => {
    const serialised = JSON.stringify(buildPetalField(12));
    expect(serialised).toContain('var(--color-');
    expect(serialised).not.toMatch(/#[0-9a-f]{6}/i);
  });

  it('animates falling petals with the fallPetal keyframes', () => {
    for (const bloom of buildPetalField(12).slice(0, 12)) {
      expect(String(bloom.wrap.animation)).toContain('fallPetal');
      expect(String(bloom.wrap.animationDelay)).toMatch(/^-/);
    }
  });
});
