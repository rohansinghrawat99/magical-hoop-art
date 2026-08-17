import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PhotoFrame } from '@/components/ui/photo-frame';

const CONTEXTS = ['collectionCard', 'artworkCard', 'detail'] as const;
const DENSITIES = ['desktop', 'mobile'] as const;

/** The mat and the well it holds, in document order. */
function renderFrame(ui: React.ReactElement) {
  const { container } = render(ui);
  const mat = container.firstElementChild as HTMLElement;
  return { mat, well: mat.firstElementChild as HTMLElement };
}

describe('PhotoFrame', () => {
  it('carries the gold gradient in every context', () => {
    for (const context of CONTEXTS) {
      const { mat } = renderFrame(<PhotoFrame context={context} />);
      expect(mat.className).toContain('var(--color-gold)');
      expect(mat.className).toContain('var(--color-gold-tint)');
    }
  });

  it('stays square, so a square photo is never cropped', () => {
    for (const context of CONTEXTS) {
      for (const density of DENSITIES) {
        const { mat } = renderFrame(<PhotoFrame context={context} density={density} />);
        expect(mat.className).toContain('aspect-square');
      }
    }
  });

  /**
   * The mat's width lives on the well as an inset, never as padding on the mat.
   * A photo fills the frame with `inset-0`, which resolves against the padding
   * box, so padding here would inset the photo a second time and leave a
   * double-width mat on one axis.
   */
  it('insets the well rather than padding the mat', () => {
    for (const context of CONTEXTS) {
      for (const density of DENSITIES) {
        const { mat, well } = renderFrame(<PhotoFrame context={context} density={density} />);

        expect(well.className).toContain('absolute');
        expect(well.className).toMatch(/inset-/);
        expect(mat.className).not.toMatch(/(^|\s)p-/);
      }
    }
  });

  it('clips the photo to the well, inside the mat', () => {
    const { mat, well } = renderFrame(<PhotoFrame context="detail" />);

    expect(mat.className).toContain('overflow-hidden');
    expect(well.className).toContain('overflow-hidden');
    expect(well.className).toMatch(/rounded-/);
  });

  it('centres a placeholder, which is the only in-flow child', () => {
    const { well } = renderFrame(
      <PhotoFrame context="artworkCard">
        <span>no photo yet</span>
      </PhotoFrame>,
    );

    expect(well.className).toContain('flex-col');
    expect(well.className).toContain('items-center');
    expect(well.className).toContain('justify-center');
    expect(well).toHaveTextContent('no photo yet');
  });

  it('lets a call site dress the mat and the well separately', () => {
    const { mat, well } = renderFrame(
      <PhotoFrame context="artworkCard" className="mt-2" wellClassName="bg-soft" />,
    );

    expect(mat.className).toContain('mt-2');
    expect(well.className).toContain('bg-soft');
  });
});
