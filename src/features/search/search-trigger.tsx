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

export interface SearchTriggerProps {
  density?: 'desktop' | 'mobile';
}

/**
 * The header's Search pill — desktop between "Process" and Enquire, mobile
 * immediately left of the hamburger.
 *
 * Soft fill with a transparent border that warms to the trim colour on hover —
 * present enough to find, quiet enough not to compete with Enquire.
 *
 * The same pill at both densities, save for a floor on its height: mobile
 * controls have to stay tappable at 44px, and the desktop padding alone leaves
 * it at 36. See docs/ACCESSIBILITY.md.
 */
export function SearchTrigger({ density = 'desktop' }: SearchTriggerProps) {
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
        density === 'mobile' && 'min-h-11',
      )}
    >
      <HoopGlyph className="size-[13px]" />
      Search
    </button>
  );
}
