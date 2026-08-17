import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AppImage, Chip, Modal, ModalClose, SearchField } from '@/components/ui';
import { ROUTES } from '@/constants/navigation';
import { searchGrouped } from '@/data/catalogue';
import { useIsMobile } from '@/hooks/use-is-mobile';
import { cn } from '@/lib/cn';
import { formatPieceCount, formatPriceRange, formatSizeSummary } from '@/lib/format';
import { resolveArtworkImage } from '@/lib/images';
import { LIFT } from '@/lib/motion';
import type { Artwork, CategoryWithStats } from '@/types/content';

import { NoMatches } from './no-matches';
import { POPULAR_QUERIES } from './search-context';
import { useSearch } from './use-search';

/**
 * The catalogue-wide search overlay.
 *
 * Built on the shared `Modal`, so it inherits the focus trap, Escape and
 * scroll lock rather than reimplementing them. Only the geometry is overridden:
 * a wider card, sitting nearer the top on desktop, with a fixed header row over
 * a scrolling body.
 */
export function SearchOverlay() {
  const { open, setOpen, closeSearch } = useSearch();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const groups = useMemo(() => searchGrouped(query), [query]);
  const total = groups.reduce((sum, group) => sum + group.artworks.length, 0);
  const hasQuery = query.trim().length > 0;

  // Closing always clears, so the overlay never reopens mid-thought.
  function dismiss() {
    setQuery('');
    closeSearch();
  }

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  // Autofocus once the sheet has settled; Radix moves focus on mount.
  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => inputRef.current?.focus(), 60);
    return () => {
      window.clearTimeout(id);
    };
  }, [open]);

  function goToArtwork(artwork: Artwork) {
    dismiss();
    void navigate(ROUTES.artwork(artwork.categoryId, artwork.id));
  }

  return (
    <Modal
      open={open}
      onOpenChange={(next) => {
        if (next) setOpen(true);
        else dismiss();
      }}
      title="Search the catalogue"
      className={cn(
        'flex flex-col overflow-hidden p-0',
        isMobile
          ? 'max-h-[calc(100dvh-32px)] p-0'
          : 'top-[10vh] w-[min(660px,calc(100%-40px))] -translate-y-0 p-0',
      )}
    >
      {/* Fixed header row */}
      <div className="flex shrink-0 items-center gap-3 border-b border-line pr-4 pl-1">
        <SearchField
          ref={inputRef}
          variant="overlay"
          label="Search the catalogue"
          placeholder="Search names, dates, occasions…"
          value={query}
          onValueChange={setQuery}
          autoComplete="off"
        />
        <ModalClose className="shrink-0 cursor-pointer rounded-[100px] bg-soft px-4 py-2 text-[11.5px] tracking-[.16em] text-ink uppercase transition-colors hover:text-accent">
          Close
        </ModalClose>
      </div>

      {/* Scrolling body */}
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {!hasQuery ? (
          <div className="px-5 py-6">
            <p className="m-0 mb-4 text-[9.5px] tracking-[.22em] text-ink-label uppercase">
              Popular occasions
            </p>
            <div className="flex flex-wrap gap-[10px]">
              {POPULAR_QUERIES.map((suggestion) => (
                <Chip
                  key={suggestion}
                  density={isMobile ? 'mobile' : 'desktop'}
                  onClick={() => {
                    setQuery(suggestion);
                    inputRef.current?.focus();
                  }}
                >
                  {suggestion}
                </Chip>
              ))}
            </div>
          </div>
        ) : total === 0 ? (
          <NoMatches heading="Nothing matches that — yet" onBeforeEnquire={dismiss} />
        ) : (
          <div className="pb-4">
            <p
              aria-live="polite"
              className="m-0 px-5 pt-5 pb-1 text-[9.5px] tracking-[.22em] text-ink-label uppercase"
            >
              {formatPieceCount(total)}
            </p>

            {groups.map((group) => (
              <SearchGroupSection
                key={group.category.id}
                category={group.category}
                artworks={group.artworks}
                onSelect={goToArtwork}
              />
            ))}
          </div>
        )}
      </div>

      {isMobile ? <div className="h-[env(safe-area-inset-bottom)] shrink-0" /> : null}
    </Modal>
  );
}

function SearchGroupSection({
  category,
  artworks,
  onSelect,
}: {
  category: CategoryWithStats;
  artworks: readonly Artwork[];
  onSelect: (artwork: Artwork) => void;
}) {
  return (
    <section>
      <h3 className="m-0 px-5 pt-5 pb-2 text-[9.5px] font-normal tracking-[.22em] text-accent uppercase">
        {category.name} · {artworks.length}
      </h3>

      <ul className="m-0 list-none p-0">
        {artworks.map((artwork) => (
          <li key={artwork.id}>
            <button
              type="button"
              onClick={() => {
                onSelect(artwork);
              }}
              className={cn(
                'flex w-full cursor-pointer items-center gap-4 px-5 py-3 text-left',
                'hover:bg-soft',
                LIFT,
              )}
            >
              <span className="relative size-[42px] shrink-0 overflow-hidden rounded-full border-[3px] border-gold bg-white">
                <AppImage
                  src={resolveArtworkImage(artwork.categoryId, artwork.id)}
                  alt=""
                  fallback={null}
                />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block truncate font-display text-[19px] leading-[1.2]">
                  {artwork.title}
                </span>
                <span className="block text-[12px] text-ink-faint">
                  {formatSizeSummary(artwork)}
                </span>
              </span>

              <span className="shrink-0 text-[14px] text-accent">{formatPriceRange(artwork)}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
