import { Navigate, useParams } from 'react-router-dom';

import { Shell } from '@/app/shell';
import { ROUTES } from '@/constants/navigation';
import { getArtwork, getCategory } from '@/data/catalogue';
import { DesktopArtworkPage } from '@/features/artwork/desktop';
import { MobileArtworkPage } from '@/features/artwork/mobile';
import { useIsMobile } from '@/hooks/use-is-mobile';
import { formatPriceRange } from '@/lib/format';

export function ArtworkPage() {
  const { categoryId, artworkId } = useParams();
  const isMobile = useIsMobile();

  const category = getCategory(categoryId);
  const artwork = getArtwork(categoryId, artworkId);

  if (category === null) return <Navigate to={ROUTES.home} replace />;
  if (artwork === null) return <Navigate to={ROUTES.category(category.id)} replace />;

  return (
    <Shell
      bottomBar={{
        // The design used the piece's tag here; with no tags supplied, the
        // collection name is the most useful thing to put above the title.
        label: category.name,
        value: `${artwork.title} · ${formatPriceRange(artwork)}`,
        enquirySubject: `${artwork.title} — ${category.name}`,
      }}
    >
      {/*
        `key` remounts the page when the piece changes. Both artwork URLs render
        this same element, so without it the selected size survives an
        artwork→artwork jump (reachable from the search overlay) and points at
        an option the new piece does not have — leaving every size pill
        unselected while the price silently falls back to the first option.
      */}
      {isMobile ? (
        <MobileArtworkPage key={artwork.id} artwork={artwork} category={category} />
      ) : (
        <DesktopArtworkPage key={artwork.id} artwork={artwork} category={category} />
      )}
    </Shell>
  );
}
