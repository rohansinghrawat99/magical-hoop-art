import { Link } from 'react-router-dom';

import { StitchBackdrop } from '@/components/decor/stitch-backdrop';
import {
  AppImage,
  BackLink,
  Container,
  Eyebrow,
  HoopPlaceholder,
  PhotoFrame,
} from '@/components/ui';
import { ROUTES } from '@/constants/navigation';
import { getArtworks } from '@/data/catalogue';
import { CollectionFilterBar } from '@/features/collections/collection-filter-bar';
import { useCollectionFilter } from '@/features/collections/use-collection-filter';
import { NoMatches } from '@/features/search/no-matches';
import { cn } from '@/lib/cn';
import { formatPieceCount, formatPriceRange, formatSizeSummary } from '@/lib/format';
import { resolveArtworkImage } from '@/lib/images';
import { LIFT, LIFT_DISTANCE } from '@/lib/motion';
import { filterArtworks, sortArtworks } from '@/lib/search';
import type { CategoryWithStats } from '@/types/content';

export function DesktopCategoryPage({ category }: { category: CategoryWithStats }) {
  const artworks = getArtworks(category.id);
  const { query, sort, setQuery, setSort } = useCollectionFilter(category.id);

  /**
   * Filtering and sorting produce a new array, but each card still links by the
   * piece's own `id` — never by its position in this array — so reordering can
   * never send a visitor to the wrong artwork.
   */
  const visible = sortArtworks(filterArtworks(artworks, query, category.name), sort);

  return (
    <div className="animate-fade-in px-10 pt-14 pb-[90px]">
      <Container>
        <BackLink to={ROUTES.home} className="mb-[34px]">
          All collections
        </BackLink>

        <header className="mb-11 flex animate-rise-in flex-wrap items-end justify-between gap-[30px] border-b border-line pb-[26px]">
          <div>
            <Eyebrow className="mb-3">{formatPieceCount(category.count)}</Eyebrow>
            <h1 className="m-0 font-display text-page leading-none font-light">{category.name}</h1>
          </div>
          <p className="m-0 max-w-[38ch] text-[15px] leading-[1.7] text-ink-muted">
            {category.blurb}
          </p>
        </header>

        <CollectionFilterBar
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
          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-[30px]">
            {visible.map((artwork) => (
              <Link
                key={artwork.id}
                to={ROUTES.artwork(category.id, artwork.id)}
                className={cn('group text-ink hover:text-ink', LIFT, LIFT_DISTANCE.artworkCard)}
              >
                <PhotoFrame context="artworkCard">
                  <StitchBackdrop weave="card" />

                  <AppImage
                    src={resolveArtworkImage(category.id, artwork.id)}
                    alt={artwork.title}
                    fallback={
                      <HoopPlaceholder
                        context="artworkCard"
                        label="photo"
                        caption={artwork.title}
                      />
                    }
                  />
                </PhotoFrame>

                <div className="px-1 pt-4">
                  <div className="font-display text-[23px] leading-[1.2]">{artwork.title}</div>
                  {/* Under the title, as on mobile. The design laid this over
                      the foot of the photo, which worked when the photo was a
                      hoop on a pale panel and stopped working once it filled
                      the frame. */}
                  <div className="mt-[6px] flex items-center justify-between text-[13px] text-ink-faint">
                    <span>{formatSizeSummary(artwork)}</span>
                    <span className="text-accent">{formatPriceRange(artwork)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
