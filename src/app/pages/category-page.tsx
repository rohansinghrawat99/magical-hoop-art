import { Navigate, useParams } from 'react-router-dom';

import { Shell } from '@/app/shell';
import { ROUTES } from '@/constants/navigation';
import { getCategory } from '@/data/catalogue';
import { DesktopCategoryPage } from '@/features/collections/desktop';
import { MobileCategoryPage } from '@/features/collections/mobile';
import { useIsMobile } from '@/hooks/use-is-mobile';
import { formatPieceCount } from '@/lib/format';

export function CategoryPage() {
  const { categoryId } = useParams();
  const isMobile = useIsMobile();
  const category = getCategory(categoryId);

  if (category === null) return <Navigate to={ROUTES.home} replace />;

  return (
    <Shell
      bottomBar={{
        label: formatPieceCount(category.count),
        value: `${category.name} — from ${category.priceFrom}`,
      }}
    >
      {isMobile ? (
        <MobileCategoryPage category={category} />
      ) : (
        <DesktopCategoryPage category={category} />
      )}
    </Shell>
  );
}
