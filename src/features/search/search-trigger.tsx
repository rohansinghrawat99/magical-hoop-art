import { cn } from '@/lib/cn';
import { LIFT } from '@/lib/motion';

import { useSearch } from './use-search';

/** The ring glyph, echoing the brandmark rather than a generic magnifier. */
function HoopGlyph({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn('shrink-0 rounded-full border-2 border-accent', className)}
    />
  );
}

/**
 * The desktop header's Search pill, between "Process" and the Enquire button.
 *
 * Soft fill with a transparent border that warms to the trim colour on hover —
 * present enough to find, quiet enough not to compete with Enquire.
 */
export function SearchTrigger() {
  const { openSearch } = useSearch();

  return (
    <button
      type="button"
      onClick={openSearch}
      className={cn(
        'flex cursor-pointer items-center gap-[10px] rounded-[100px] border border-transparent',
        'bg-soft px-[18px] py-[10px] text-[11.5px] tracking-[.16em] text-ink uppercase',
        'hover:border-gold',
        LIFT,
      )}
    >
      <HoopGlyph className="size-[13px]" />
      Search
    </button>
  );
}

/** The mobile header's 44×44 search button, immediately left of the hamburger. */
export function SearchIconButton() {
  const { openSearch } = useSearch();

  return (
    <button
      type="button"
      onClick={openSearch}
      aria-label="Search"
      className="flex size-11 cursor-pointer items-center justify-center"
    >
      <HoopGlyph className="size-[17px]" />
    </button>
  );
}
