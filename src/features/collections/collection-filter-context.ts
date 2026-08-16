import { createContext, type Dispatch, type SetStateAction } from 'react';

import type { SortMode } from '@/lib/search';

export interface CollectionFilterState {
  /** Which collection these values belong to. */
  categoryId: string;
  query: string;
  sort: SortMode;
}

export const EMPTY_FILTER: Omit<CollectionFilterState, 'categoryId'> = {
  query: '',
  sort: 'featured',
};

export interface CollectionFilterStore {
  state: CollectionFilterState;
  setState: Dispatch<SetStateAction<CollectionFilterState>>;
}

/**
 * Lives apart from the provider component so that file exports only components,
 * which is what keeps React Fast Refresh working.
 */
export const CollectionFilterContext = createContext<CollectionFilterStore | null>(null);
