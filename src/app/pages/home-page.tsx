import { Shell } from '@/app/shell';
import { DesktopHome } from '@/features/home/desktop';
import { MobileHome } from '@/features/home/mobile';
import { useIsMobile } from '@/hooks/use-is-mobile';

export function HomePage() {
  const isMobile = useIsMobile();

  return (
    <Shell
      bottomBar={{
        label: 'Made to order',
        value: 'Customized Gifts',
      }}
    >
      {isMobile ? <MobileHome /> : <DesktopHome />}
    </Shell>
  );
}
