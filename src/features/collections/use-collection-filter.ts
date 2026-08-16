import { useCallback, useContext } from 'react';

import type { SortMode } from '@/lib/search';

import { CollectionFilterContext, EMPTY_FILTER } from './collection-filter-context';

export interface CollectionFilter {
  query: string;
  sort: SortMode;
  setQuery: (query: string) => void;
  setSort: (sort: SortMode) => void;
}

/**
 * The search box and sort mode for a collection page.
 *
 * **The filter belongs to a collection, not to the page.** Entering a
 * *different* collection — from a collection card, the mobile menu, a global
 * search result, or Home — starts clean; returning to the *same* collection,
 * typically back from an artwork detail page, keeps what was typed.
 *
 * That rule lives here, keyed on `categoryId`, rather than being re-applied at
 * every call site — which is exactly how one entry point ends up forgetting it.
 *
 * The stored values are simply *ignored* when they belong to another
 * collection, and the first edit adopts the current one. Deriving rather than
 * resetting avoids setting state during render — illegal across a provider
 * boundary — and avoids an effect, which would paint one stale frame first.
 */
export function useCollectionFilter(categoryId: string): CollectionFilter {
  const store = useContext(CollectionFilterContext);

  if (store === null) {
    throw new Error('useCollectionFilter must be used within a CollectionFilterProvider');
  }

  const { state, setState } = store;
  const active = state.categoryId === categoryId ? state : { categoryId, ...EMPTY_FILTER };
  const { query, sort } = active;

  const setQuery = useCallback(
    (next: string) => {
      setState((prev) => ({
        categoryId,
        query: next,
        sort: prev.categoryId === categoryId ? prev.sort : EMPTY_FILTER.sort,
      }));
    },
    [categoryId, setState],
  );

  const setSort = useCallback(
    (next: SortMode) => {
      setState((prev) => ({
        categoryId,
        query: prev.categoryId === categoryId ? prev.query : EMPTY_FILTER.query,
        sort: next,
      }));
    },
    [categoryId, setState],
  );

  return { query, sort, setQuery, setSort };
}
