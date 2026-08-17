import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { HoopFrame } from '@/components/ui/hoop-frame';

/** The hoop and its inner disc, in document order. */
function renderHoop(ui: React.ReactElement) {
  const { container } = render(ui);
  const hoop = container.firstElementChild as HTMLElement;
  return { hoop, disc: hoop.firstElementChild as HTMLElement };
}

describe('HoopFrame', () => {
  it('keeps the ring square in every context', () => {
    for (const context of ['hero', 'categoryCard', 'artworkCard', 'detail'] as const) {
      const { hoop } = renderHoop(<HoopFrame context={context} density="mobile" />);
      expect(hoop.className).toContain('aspect-square');
    }
  });

  /**
   * A percentage height on the disc is a WebKit trap: Safari resolves it
   * against the hoop's border box rather than its content box, so the disc came
   * out taller than the ring, overflowed, stretched it, and every photo
   * rendered as an oval on iOS. The disc's height must derive from its own
   * width instead. See the note in hoop-frame.tsx.
   */
  it('sizes the inner disc from its own width, never a percentage height', () => {
    for (const context of ['hero', 'categoryCard', 'artworkCard', 'detail'] as const) {
      for (const density of ['desktop', 'mobile'] as const) {
        const { disc } = renderHoop(<HoopFrame context={context} density={density} />);
        expect(disc.className).toContain('w-full');
        expect(disc.className).toContain('aspect-square');
        expect(disc.className).not.toContain('size-full');
        expect(disc.className).not.toContain('h-full');
      }
    }
  });

  it('renders children inside the disc', () => {
    const { disc } = renderHoop(
      <HoopFrame context="hero" density="desktop">
        <span>stitched</span>
      </HoopFrame>,
    );
    expect(disc).toHaveTextContent('stitched');
  });
});
