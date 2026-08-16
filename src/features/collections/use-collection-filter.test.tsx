import { act, render, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';

import { CollectionFilterProvider } from './collection-filter-provider';
import { useCollectionFilter, type CollectionFilter } from './use-collection-filter';

function wrapper({ children }: { children: ReactNode }) {
  return <CollectionFilterProvider>{children}</CollectionFilterProvider>;
}

/**
 * TASK 3 in the brief, flagged there as "a real bug if missed".
 *
 * The filter belongs to a collection, not to the page. Entering a *different*
 * collection must start clean no matter which entry point was used; returning
 * to the *same* collection keeps what was typed.
 *
 * ⚠️ The unmount tests below matter most. Opening an artwork **unmounts** the
 * category page, so an implementation holding the filter in that component's
 * own `useState` loses it on back — and a test that only re-renders the hook
 * will not notice. That bug shipped once and was caught in a browser, not here.
 * These remount the consumer to model real navigation.
 */
describe('useCollectionFilter', () => {
  it('starts empty and unsorted', () => {
    const { result } = renderHook(() => useCollectionFilter('wedding'), { wrapper });

    expect(result.current.query).toBe('');
    expect(result.current.sort).toBe('featured');
  });

  it('holds a query and sort within one collection', () => {
    const { result } = renderHook(() => useCollectionFilter('wedding'), { wrapper });

    act(() => {
      result.current.setQuery('curtain');
    });
    act(() => {
      result.current.setSort('price-desc');
    });

    expect(result.current.query).toBe('curtain');
    expect(result.current.sort).toBe('price-desc');
  });

  it('PRESERVES the filter when the page unmounts and returns to the same collection', () => {
    // The artwork-detail-then-back path: the provider stays mounted while the
    // category page itself is unmounted and later remounted.
    let latest: CollectionFilter | null = null;
    // Read through a function: TypeScript does not narrow a captured `let`
    // inside a nested function, so this keeps the declared type.
    const read = (): CollectionFilter => {
      if (latest === null) throw new Error('probe never rendered');
      return latest;
    };

    function Probe({ id }: { id: string }) {
      latest = useCollectionFilter(id);
      return null;
    }

    function Harness({ mounted, id }: { mounted: boolean; id: string }) {
      return (
        <CollectionFilterProvider>
          {mounted ? <Probe id={id} /> : <span />}
        </CollectionFilterProvider>
      );
    }

    const view = render(<Harness mounted id="wedding" />);

    act(() => {
      read().setQuery('curtain');
    });
    act(() => {
      read().setSort('price-asc');
    });

    // Navigate into an artwork: the category page unmounts.
    view.rerender(<Harness mounted={false} id="wedding" />);
    // Press back: it remounts on the same collection.
    view.rerender(<Harness mounted id="wedding" />);

    expect(read().query).toBe('curtain');
    expect(read().sort).toBe('price-asc');
  });

  it('still RESETS after an unmount when the collection changed', () => {
    let latest: CollectionFilter | null = null;
    // Read through a function: TypeScript does not narrow a captured `let`
    // inside a nested function, so this keeps the declared type.
    const read = (): CollectionFilter => {
      if (latest === null) throw new Error('probe never rendered');
      return latest;
    };

    function Probe({ id }: { id: string }) {
      latest = useCollectionFilter(id);
      return null;
    }

    function Harness({ mounted, id }: { mounted: boolean; id: string }) {
      return (
        <CollectionFilterProvider>
          {mounted ? <Probe id={id} /> : <span />}
        </CollectionFilterProvider>
      );
    }

    const view = render(<Harness mounted id="wedding" />);
    act(() => {
      read().setQuery('curtain');
    });

    view.rerender(<Harness mounted={false} id="wedding" />);
    view.rerender(<Harness mounted id="decor" />);

    expect(read().query).toBe('');
    expect(read().sort).toBe('featured');
  });

  it('RESETS when entering a different collection', () => {
    const { result, rerender } = renderHook(({ id }) => useCollectionFilter(id), {
      wrapper,
      initialProps: { id: 'wedding' },
    });

    act(() => {
      result.current.setQuery('curtain');
    });
    act(() => {
      result.current.setSort('price-asc');
    });

    rerender({ id: 'decor' });

    expect(result.current.query).toBe('');
    expect(result.current.sort).toBe('featured');
  });

  it('resets immediately, with no stale frame', () => {
    const seen: string[] = [];
    const { result, rerender } = renderHook(
      ({ id }) => {
        const filter = useCollectionFilter(id);
        seen.push(filter.query);
        return filter;
      },
      { wrapper, initialProps: { id: 'wedding' } },
    );

    act(() => {
      result.current.setQuery('curtain');
    });
    seen.length = 0;
    rerender({ id: 'names' });

    expect(seen.every((q) => q === '')).toBe(true);
  });

  it('lets the new collection be filtered independently after a reset', () => {
    const { result, rerender } = renderHook(({ id }) => useCollectionFilter(id), {
      wrapper,
      initialProps: { id: 'wedding' },
    });

    act(() => {
      result.current.setQuery('curtain');
    });
    rerender({ id: 'decor' });
    act(() => {
      result.current.setQuery('mahadev');
    });

    expect(result.current.query).toBe('mahadev');

    rerender({ id: 'wedding' });
    expect(result.current.query).toBe('');
  });

  it('does not leak a sort mode across collections', () => {
    const { result, rerender } = renderHook(({ id }) => useCollectionFilter(id), {
      wrapper,
      initialProps: { id: 'wedding' },
    });

    act(() => {
      result.current.setSort('price-desc');
    });
    rerender({ id: 'calendar' });
    expect(result.current.sort).toBe('featured');

    // And editing the new collection does not resurrect the old query.
    act(() => {
      result.current.setSort('price-asc');
    });
    expect(result.current.query).toBe('');
  });

  it('throws a helpful error outside the provider', () => {
    expect(() => renderHook(() => useCollectionFilter('wedding'))).toThrow(
      /CollectionFilterProvider/,
    );
  });
});
