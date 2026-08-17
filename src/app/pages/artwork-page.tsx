import { useState } from 'react';
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

  /**
   * The selected size, owned here rather than by the two page trees.
   *
   * On mobile the size pills are on the page but the Enquire button is in the
   * shell's bottom bar, so the selection has to live above both for the enquiry
   * to carry it.
   *
   * It is tagged with the piece it belongs to. Both artwork URLs render this
   * same element, so a piece → piece jump (reachable from the search overlay)
   * does not remount the route; comparing the id makes the choice fall back to
   * the new piece's first option instead of holding a size it has no pill for.
   */
  const [chosen, setChosen] = useState<{ artworkId: string; label: string } | null>(null);

  const category = getCategory(categoryId);
  const artwork = getArtwork(categoryId, artworkId);

  if (category === null) return <Navigate to={ROUTES.home} replace />;
  if (artwork === null) return <Navigate to={ROUTES.category(category.id)} replace />;

  const sizes = artwork.options.map((option) => option.label);
  const size = chosen?.artworkId === artwork.id ? chosen.label : artwork.options[0].label;

  function selectSize(label: string) {
    if (artwork !== null) setChosen({ artworkId: artwork.id, label });
  }

  return (
    <Shell
      bottomBar={{
        // The design used the piece's tag here; with no tags supplied, the
        // collection name is the most useful thing to put above the title.
        label: category.name,
        value: `${artwork.title} · ${formatPriceRange(artwork)}`,
        enquiryPiece: { subject: `${artwork.title} — ${category.name}`, sizes, size },
      }}
    >
      {isMobile ? (
        <MobileArtworkPage
          artwork={artwork}
          category={category}
          size={size}
          onSizeChange={selectSize}
        />
      ) : (
        <DesktopArtworkPage
          artwork={artwork}
          category={category}
          size={size}
          onSizeChange={selectSize}
        />
      )}
    </Shell>
  );
}
