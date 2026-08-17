import { Brandmark } from '@/components/layout/brandmark';
import { SearchTrigger } from '@/features/search/search-trigger';
import { cn } from '@/lib/cn';

export interface MobileHeaderProps {
  menuOpen: boolean;
  onToggleMenu: () => void;
}

/** The sticky mobile header: brandmark, the Search pill, and the hamburger. */
export function MobileHeader({ menuOpen, onToggleMenu }: MobileHeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-line-header bg-veil-strong px-5 py-[14px] backdrop-blur-[16px]">
      <Brandmark density="mobile" />

      <div className="flex items-center gap-2">
        <SearchTrigger density="mobile" />

        <button
          type="button"
          onClick={onToggleMenu}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          className="-mr-[10px] flex size-11 cursor-pointer flex-col items-center justify-center gap-[5px]"
        >
          <span
            aria-hidden="true"
            className={cn(
              'h-[1.5px] w-5 bg-ink transition-transform duration-300',
              menuOpen && 'translate-y-[3.5px] rotate-45',
            )}
          />
          <span
            aria-hidden="true"
            className={cn(
              'h-[1.5px] w-5 bg-ink transition-transform duration-300',
              menuOpen && '-translate-y-[3px] -rotate-45',
            )}
          />
        </button>
      </div>
    </header>
  );
}
