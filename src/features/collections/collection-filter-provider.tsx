import { useMemo, useState, type ReactNode } from 'react';

import {
  CollectionFilterContext,
  EMPTY_FILTER,
  type CollectionFilterState,
  type CollectionFilterStore,
} from './collection-filter-context';

/**
 * Holds the collection page's search query and sort mode.
 *
 * **This must sit above the router.** Opening an artwork unmounts the category
 * page, so state kept inside that component is destroyed and pressing back
 * would silently lose the visitor's filter. Storing it here is what lets
 * "returning to the same collection" preserve it.
 */
export function CollectionFilterProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CollectionFilterState>({
    categoryId: '',
    ...EMPTY_FILTER,
  });

  const value = useMemo<CollectionFilterStore>(() => ({ state, setState }), [state]);

  return (
    <CollectionFilterContext.Provider value={value}>{children}</CollectionFilterContext.Provider>
  );
}
