import { describe, expect, it } from 'vitest';

import { buttonVariants } from '@/components/ui/button-variants';
import { LIFT, LIFT_DISTANCE, PRESS } from '@/lib/motion';

/**
 * These guard a bug that is invisible in review and in jsdom.
 *
 * Tailwind v4 compiles `-translate-y-*` to the standalone CSS `translate`
 * property, not to `transform`. A transition list naming only `transform`
 * therefore leaves the lift untransitioned: the element snaps to its hovered
 * position on the first frame while the shadow eases in behind it. It looks
 * like jank but no frames are dropped, so profiling finds nothing.
 *
 * It shipped in three components. Caught by sampling the computed `translate`
 * value over the course of a real hover in Chromium.
 */
describe('LIFT', () => {
  it('transitions `translate`, which is the property Tailwind v4 actually sets', () => {
    expect(LIFT).toContain('translate');
  });

  it('never names `transform` alone as the moving property', () => {
    const properties = /transition-\[([^\]]+)\]/.exec(LIFT)?.[1]?.split(',') ?? [];
    if (properties.includes('transform')) {
      expect(properties).toContain('translate');
    }
    expect(properties.length).toBeGreaterThan(0);
  });

  it('carries a duration and the shared easing so motion is consistent', () => {
    expect(LIFT).toContain('duration-500');
    expect(LIFT).toContain('ease-hoop');
  });
});

describe('button motion', () => {
  it('lifts the solid variants', () => {
    expect(buttonVariants({ variant: 'accent', density: 'desktop' })).toContain(
      LIFT_DISTANCE.button,
    );
    expect(buttonVariants({ variant: 'ink', density: 'desktop' })).toContain(LIFT_DISTANCE.button);
  });

  it('does NOT lift the outline variant — the design changes its fill instead', () => {
    const outline = buttonVariants({ variant: 'outline', density: 'desktop' });
    expect(outline).not.toContain(LIFT_DISTANCE.button);
    expect(outline).toContain('hover:bg-soft');
  });

  it('does not lift the ghost variant either', () => {
    expect(buttonVariants({ variant: 'ghost', density: 'desktop' })).not.toContain(
      LIFT_DISTANCE.button,
    );
  });

  it('presses instead of lifting on mobile', () => {
    const mobile = buttonVariants({ variant: 'accent', density: 'mobile' });
    expect(mobile).toContain(PRESS.button);
    expect(mobile).not.toContain(LIFT_DISTANCE.button);
  });

  it('applies the shared transition to every variant', () => {
    for (const variant of ['accent', 'ink', 'outline', 'ghost'] as const) {
      expect(buttonVariants({ variant })).toContain('translate');
    }
  });
});
