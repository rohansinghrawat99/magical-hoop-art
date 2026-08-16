import { useContext } from 'react';

import { SearchContext, type SearchContextValue } from './search-context';

/** Access the global search overlay. Must be used within `SearchProvider`. */
export function useSearch(): SearchContextValue {
  const ctx = useContext(SearchContext);

  if (ctx === null) {
    throw new Error('useSearch must be used within a SearchProvider');
  }

  return ctx;
}
