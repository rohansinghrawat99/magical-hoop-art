import { Link } from 'react-router-dom';

import { StitchBackdrop } from '@/components/decor/stitch-backdrop';
import { AppImage, BackLink, Eyebrow, HoopPlaceholder, PhotoFrame } from '@/components/ui';
import { ROUTES } from '@/constants/navigation';
import { getArtworks } from '@/data/catalogue';
import { CollectionFilterBar } from '@/features/collections/collection-filter-bar';
import { useCollectionFilter } from '@/features/collections/use-collection-filter';
import { NoMatches } from '@/features/search/no-matches';
import { cn } from '@/lib/cn';
import { formatPieceCount, formatPriceRange, formatSizeSummary } from '@/lib/format';
import { resolveArtworkImage } from '@/lib/images';
import { LIFT, PRESS } from '@/lib/motion';
import { filterArtworks, sortArtworks } from '@/lib/search';
import type { CategoryWithStats } from '@/types/content';

export function MobileCategoryPage({ category }: { category: CategoryWithStats }) {
  const artworks = getArtworks(category.id);
  const { query, sort, setQuery, setSort } = useCollectionFilter(category.id);

  // Cards link by `id`, never by index, so reordering cannot mis-target them.
  const visible = sortArtworks(filterArtworks(artworks, query, category.name), sort);

  return (
    <div className="animate-fade-in px-5 pt-5 pb-10">
      <BackLink to={ROUTES.home} density="mobile">
        All collections
      </BackLink>

      <Eyebrow density="mobile" className="my-[10px]">
        {formatPieceCount(category.count)}
      </Eyebrow>

      <h1 className="m-0 mb-3 font-display text-[36px] leading-[1.04] font-light">
        {category.name}
      </h1>
      <p className="m-0 mb-[26px] text-[14px] leading-[1.65] text-ink-soft">{category.blurb}</p>

      <CollectionFilterBar
        density="mobile"
        query={query}
        onQueryChange={setQuery}
        sort={sort}
        onSortChange={setSort}
        shown={visible.length}
        total={artworks.length}
      />

      {visible.length === 0 ? (
        <NoMatches heading="Nothing matches that — yet" panel />
      ) : (
        <div className="grid grid-cols-2 gap-[14px]">
          {visible.map((artwork) => (
            <Link
              key={artwork.id}
              to={ROUTES.artwork(category.id, artwork.id)}
              className={cn('text-ink hover:text-ink', LIFT, PRESS.button)}
            >
              <PhotoFrame context="artworkCard" density="mobile" wellClassName="bg-soft">
                <StitchBackdrop weave="cardTight" />

                <AppImage
                  src={resolveArtworkImage(category.id, artwork.id)}
                  alt={artwork.title}
                  fallback={<HoopPlaceholder context="cardMobile" caption={artwork.title} />}
                />
              </PhotoFrame>

              <div className="px-[2px] pt-[10px]">
                <div className="font-display text-[17px] leading-[1.2]">{artwork.title}</div>
                <div className="mt-1 flex items-center justify-between text-[11.5px] text-ink-faint">
                  <span>{formatSizeSummary(artwork)}</span>
                  <span className="text-accent">{formatPriceRange(artwork)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
