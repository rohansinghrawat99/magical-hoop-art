import { createContext } from 'react';

export interface SearchContextValue {
  open: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  setOpen: (open: boolean) => void;
}

/**
 * Lives apart from the provider component so that file exports only components,
 * which is what keeps React Fast Refresh working.
 */
export const SearchContext = createContext<SearchContextValue | null>(null);

/**
 * Chips offered when the overlay is opened with an empty query. Each is a plain
 * query string, so tapping one is identical to typing it.
 */
export const POPULAR_QUERIES: readonly string[] = [
  'Anniversary',
  'Wedding',
  'Birthday',
  'Calendar',
  'Pearl border',
  'Kerchief',
];
