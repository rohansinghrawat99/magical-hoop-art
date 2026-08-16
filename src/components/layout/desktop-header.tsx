import { useLocation, useNavigate } from 'react-router-dom';

import { Brandmark } from '@/components/layout/brandmark';
import { Button } from '@/components/ui';
import { SearchTrigger } from '@/features/search/search-trigger';
import { DESKTOP_NAV, ROUTES, SECTION_IDS } from '@/constants/navigation';
import { useEnquiry } from '@/features/enquiry/use-enquiry';
import { useSmoothScrollTo } from '@/hooks/use-smooth-scroll-to';

/** The sticky desktop header: brandmark, two nav jumps, and the enquire pill. */
export function DesktopHeader() {
  const { openEnquiry } = useEnquiry();
  const scrollTo = useSmoothScrollTo();
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * The nav links point at sections of the home page. From a collection or
   * artwork page we have to route home first, then jump.
   */
  function goToSection(target: keyof typeof SECTION_IDS) {
    const id = SECTION_IDS[target].desktop;

    if (location.pathname !== ROUTES.home) {
      void navigate(ROUTES.home);
    }
    scrollTo(id);
  }

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between gap-6 border-b border-line-header bg-veil px-10 py-[18px] backdrop-blur-[14px]">
      <Brandmark />

      <nav
        aria-label="Main"
        className="flex items-center gap-[34px] text-[13px] tracking-[.14em] uppercase"
      >
        {DESKTOP_NAV.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => {
              goToSection(item.target);
            }}
            className="cursor-pointer border-b border-transparent pb-[3px] transition-colors hover:border-gold"
          >
            {item.label}
          </button>
        ))}

        <SearchTrigger />

        <Button
          variant="accent"
          size="compact"
          onClick={() => {
            openEnquiry();
          }}
        >
          Enquire
        </Button>
      </nav>
    </header>
  );
}
