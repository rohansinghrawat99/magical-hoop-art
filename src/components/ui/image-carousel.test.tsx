import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ImageCarousel } from '@/components/ui/image-carousel';
import { CYCLE_MS, SLIDE_MS } from '@/hooks/use-carousel-tick';

const IMAGES = ['/a.webp', '/b.webp', '/c.webp'];

/** Decorative photos carry `alt=""`, so they have no accessible role to query. */
function sources(root: ParentNode): string[] {
  return [...root.querySelectorAll('img')].map((img) => img.getAttribute('src') ?? '');
}

function slides(root: ParentNode): (HTMLElement | null)[] {
  return [...root.querySelectorAll('img')].map((img) => img.parentElement);
}

let elapsed = 0;

/**
 * Run to just past the slide at the head of turn `n`, so it has settled.
 *
 * Two advances, not one: the settle timer is scheduled by an effect, and
 * effects only run when React flushes at the end of an `act`. Jumping the whole
 * turn in a single advance would schedule that timer after the clock had
 * already passed it.
 */
function turn(n: number): void {
  const tickAt = n * CYCLE_MS;

  act(() => {
    vi.advanceTimersByTime(tickAt - elapsed);
  });
  act(() => {
    vi.advanceTimersByTime(SLIDE_MS);
  });

  elapsed = tickAt + SLIDE_MS;
}

/** jsdom has no IntersectionObserver, so `useInView` reports true throughout. */
describe('ImageCarousel', () => {
  beforeEach(() => {
    elapsed = 0;
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the fallback when the collection has no photos yet', () => {
    render(<ImageCarousel images={[]} alt="" fallback={<span>placeholder</span>} />);

    expect(screen.getByText('placeholder')).toBeInTheDocument();
    expect(document.querySelector('img')).toBeNull();
  });

  it('shows a single photo without mounting a second slide', () => {
    const { container } = render(<ImageCarousel images={['/only.webp']} alt="" fallback={null} />);

    expect(sources(container)).toEqual(['/only.webp']);
  });

  it('mounts the next photo ahead of time so it is decoded before it moves', () => {
    const { container } = render(<ImageCarousel images={IMAGES} alt="" fallback={null} />);

    expect(sources(container)).toEqual(['/a.webp', '/b.webp']);
  });

  it('advances to the next photo on its own', () => {
    const { container } = render(<ImageCarousel images={IMAGES} alt="" fallback={null} />);

    turn(1);
    expect(sources(container)).toEqual(['/b.webp', '/c.webp']);

    turn(2);
    expect(sources(container)).toEqual(['/c.webp', '/a.webp']);
  });

  it('wraps back to the first photo', () => {
    const { container } = render(<ImageCarousel images={IMAGES} alt="" fallback={null} />);

    turn(IMAGES.length);

    expect(sources(container)).toEqual(['/a.webp', '/b.webp']);
  });

  it('slides the pair one place left, then settles without re-animating', () => {
    const { container } = render(<ImageCarousel images={IMAGES} alt="" fallback={null} />);

    const [current, incoming] = slides(container);
    expect(current?.className).toContain('translate-x-0');
    expect(incoming?.className).toContain('translate-x-full');

    // Mid-slide: the outgoing photo is on its way out and the incoming one has
    // taken the centre. Both are the same DOM nodes, so this is one movement.
    act(() => {
      vi.advanceTimersByTime(CYCLE_MS);
    });
    expect(slides(container)[0]).toBe(current);
    expect(slides(container)[1]).toBe(incoming);
    expect(current?.className).toContain('-translate-x-full');
    expect(incoming?.className).toContain('translate-x-0');

    // Settled: the photo that arrived keeps its node and its position, so it
    // does not jump back across the hoop.
    act(() => {
      vi.advanceTimersByTime(SLIDE_MS);
    });
    expect(slides(container)[0]).toBe(incoming);
    expect(incoming?.className).toContain('translate-x-0');
  });

  /**
   * Tailwind v4 compiles `translate-x-*` to the standalone `translate`
   * property, so a `transition-[transform]` list would leave the slide
   * untransitioned and make it snap. Same trap as `src/lib/motion.ts`.
   */
  it('names `translate` as the moving property, which is what Tailwind v4 sets', () => {
    const { container } = render(<ImageCarousel images={IMAGES} alt="" fallback={null} />);
    const classes = slides(container)[0]?.className ?? '';
    const properties = /transition-\[([^\]]+)\]/.exec(classes)?.[1]?.split(',') ?? [];

    expect(properties).toContain('translate');
  });

  it('turns every carousel on the same beat, whatever their photo counts', () => {
    const { container } = render(
      <>
        <ImageCarousel images={IMAGES} alt="" fallback={null} />
        <ImageCarousel images={['/x.webp', '/y.webp']} alt="" fallback={null} />
      </>,
    );

    const [long, short] = [...container.children];
    expect(long).toBeDefined();
    expect(short).toBeDefined();
    if (!long || !short) return;

    turn(1);
    expect(sources(long)[0]).toBe('/b.webp');
    expect(sources(short)[0]).toBe('/y.webp');

    turn(2);
    expect(sources(long)[0]).toBe('/c.webp');
    expect(sources(short)[0]).toBe('/x.webp');
  });

  it('does not hold the shared clock open for a collection of one', () => {
    const { unmount } = render(<ImageCarousel images={['/only.webp']} alt="" fallback={null} />);

    expect(vi.getTimerCount()).toBe(0);
    unmount();
  });

  it('offers nothing to scroll or swipe — the card is a single link', () => {
    const { container } = render(<ImageCarousel images={IMAGES} alt="" fallback={null} />);

    expect(container.firstElementChild?.className).toContain('overflow-hidden');
  });
});
