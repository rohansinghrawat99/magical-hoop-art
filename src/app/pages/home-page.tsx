import { Shell } from '@/app/shell';
import { LOWEST_PRICE } from '@/data/catalogue';
import { DesktopHome } from '@/features/home/desktop';
import { MobileHome } from '@/features/home/mobile';
import { useIsMobile } from '@/hooks/use-is-mobile';
import { formatPriceWithCurrency } from '@/lib/format';

export function HomePage() {
  const isMobile = useIsMobile();

  return (
    <Shell
      bottomBar={{
        label: 'Made to order',
        value: `Custom hoop from ${formatPriceWithCurrency(LOWEST_PRICE)}`,
      }}
    >
      {isMobile ? <MobileHome /> : <DesktopHome />}
    </Shell>
  );
}
