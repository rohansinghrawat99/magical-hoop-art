import { useNavigate } from 'react-router-dom';

import { Modal, ModalClose } from '@/components/ui';
import { ROUTES, SECTION_IDS } from '@/constants/navigation';
import { SITE } from '@/constants/site';
import { CATEGORIES_WITH_STATS } from '@/data/catalogue';
import { useEnquiry } from '@/features/enquiry/use-enquiry';
import { useSearch } from '@/features/search/use-search';
import { useSmoothScrollTo } from '@/hooks/use-smooth-scroll-to';

export interface MobileMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * The fullscreen mobile menu: home, the five collections, process, enquire.
 *
 * Built on the shared `Modal` so it inherits the focus trap, Esc-to-close and
 * scroll lock rather than reimplementing them.
 */
export function MobileMenu({ open, onOpenChange }: MobileMenuProps) {
  const navigate = useNavigate();
  const scrollTo = useSmoothScrollTo();
  const { openEnquiry } = useEnquiry();
  const { openSearch } = useSearch();

  function close() {
    onOpenChange(false);
  }

  function goTo(path: string) {
    close();
    void navigate(path);
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Menu" variant="fullscreen">
      <div className="flex justify-end">
        <ModalClose className="flex size-11 cursor-pointer items-center justify-center text-[26px] font-light">
          <span aria-hidden="true">×</span>
        </ModalClose>
      </div>

      <nav aria-label="Mobile" className="mt-5 flex flex-col gap-1">
        <MenuLink
          onClick={() => {
            goTo(ROUTES.home);
          }}
        >
          Home
        </MenuLink>

        <MenuLink
          onClick={() => {
            close();
            openSearch();
          }}
        >
          Search
        </MenuLink>

        {CATEGORIES_WITH_STATS.map((category) => (
          <MenuLink
            key={category.id}
            onClick={() => {
              goTo(ROUTES.category(category.id));
            }}
          >
            {category.shortName}
          </MenuLink>
        ))}

        <MenuLink
          onClick={() => {
            goTo(ROUTES.home);
            scrollTo(SECTION_IDS.process.mobile);
          }}
        >
          Process
        </MenuLink>

        <MenuLink
          onClick={() => {
            close();
            openEnquiry();
          }}
        >
          Enquire
        </MenuLink>
      </nav>

      <p className="mt-auto px-1 pt-7 pb-1 text-[12px] text-ink-label">{SITE.taglineShort}</p>
    </Modal>
  );
}

function MenuLink({ onClick, children }: { onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="animate-rise-in cursor-pointer border-b border-line-ink px-1 py-[18px] text-left font-display text-[28px] font-light"
    >
      {children}
    </button>
  );
}
