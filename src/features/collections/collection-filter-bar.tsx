import { Chip, SearchField } from '@/components/ui';
import { cn } from '@/lib/cn';
import { nextSortMode, SORT_LABELS, type SortMode } from '@/lib/search';

export interface CollectionFilterBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  sort: SortMode;
  onSortChange: (sort: SortMode) => void;
  /** Pieces currently shown. */
  shown: number;
  /** Pieces in the collection overall. */
  total: number;
  density?: 'desktop' | 'mobile';
}

/**
 * The filter row on a collection page: a search pill, a sort pill that cycles,
 * and the count line beneath.
 */
export function CollectionFilterBar({
  query,
  onQueryChange,
  sort,
  onSortChange,
  shown,
  total,
  density = 'desktop',
}: CollectionFilterBarProps) {
  const isMobile = density === 'mobile';
  const filtering = query.trim().length > 0;

  return (
    <div className={cn('mb-7', isMobile && 'mb-6')}>
      <div className="flex items-stretch gap-3">
        <SearchField
          density={density}
          label={`Search ${String(total)} pieces in this collection`}
          placeholder="Search this collection…"
          value={query}
          onValueChange={onQueryChange}
          clearable
          autoComplete="off"
          wrapperClassName="flex-1"
        />

        <Chip
          density={density}
          aria-label={`Sort: ${SORT_LABELS[sort]}. Tap to change.`}
          onClick={() => {
            onSortChange(nextSortMode(sort));
          }}
          className={cn(
            'shrink-0 tracking-[.14em] whitespace-nowrap uppercase',
            isMobile ? 'px-4 text-[11px]' : 'text-[12px]',
          )}
        >
          {SORT_LABELS[sort]}
        </Chip>
      </div>

      <p
        aria-live="polite"
        className={cn(
          'm-0 tracking-[.16em] text-ink-label uppercase',
          isMobile ? 'mt-3 text-[10px]' : 'mt-4 text-[12px]',
        )}
      >
        {filtering
          ? `${String(shown)} of ${String(total)} pieces matching “${query.trim()}”`
          : `${String(total)} pieces`}
      </p>
    </div>
  );
}
