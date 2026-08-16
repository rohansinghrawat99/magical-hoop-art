import { useCallback, useMemo, useState, type ReactNode } from 'react';

import { SearchContext, type SearchContextValue } from './search-context';

/**
 * Whether the global search overlay is open.
 *
 * Openable from the desktop header pill, the mobile header icon and the mobile
 * menu, so the state sits above all three rather than being threaded through.
 * The query itself is local to the overlay — closing clears it.
 */
export function SearchProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const openSearch = useCallback(() => {
    setOpen(true);
  }, []);
  const closeSearch = useCallback(() => {
    setOpen(false);
  }, []);

  const value = useMemo<SearchContextValue>(
    () => ({ open, openSearch, closeSearch, setOpen }),
    [open, openSearch, closeSearch],
  );

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}
