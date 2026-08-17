import { useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

import { PetalField } from '@/components/decor/petal-field';
import { DesktopFooter } from '@/components/layout/desktop-footer';
import { DesktopHeader } from '@/components/layout/desktop-header';
import { MobileBottomBar } from '@/components/layout/mobile-bottom-bar';
import type { EnquiryPiece } from '@/features/enquiry/enquiry-context';
import { MobileFooter } from '@/components/layout/mobile-footer';
import { MobileHeader } from '@/components/layout/mobile-header';
import { MobileMenu } from '@/components/layout/mobile-menu';
import { EnquiryModal } from '@/features/enquiry/enquiry-modal';
import { SearchOverlay } from '@/features/search/search-overlay';
import { useIsMobile } from '@/hooks/use-is-mobile';

/** What the mobile bottom bar shows for the current route. */
export interface BottomBarContent {
  label: string;
  value: string;
  enquiryPiece?: EnquiryPiece;
}

export interface ShellProps {
  children: ReactNode;
  bottomBar: BottomBarContent;
}

/**
 * The page chrome.
 *
 * Desktop and mobile get entirely separate headers, footers and furniture —
 * this is the switch the design performs in JS at 860px. See
 * docs/ARCHITECTURE.md for why the two trees are not merged.
 */
export function Shell({ children, bottomBar }: ShellProps) {
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Close the menu whenever the route changes, and whenever the viewport
  // crosses into the desktop tree — otherwise rotating a tablet out and back
  // remounts the fullscreen menu unprompted.
  const [lastPath, setLastPath] = useState(location.pathname);
  if (lastPath !== location.pathname) {
    setLastPath(location.pathname);
    if (menuOpen) setMenuOpen(false);
  }
  if (!isMobile && menuOpen) setMenuOpen(false);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-canvas text-ink">
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <PetalField />

      {isMobile ? (
        <div className="relative z-10 pb-24">
          <MobileHeader
            menuOpen={menuOpen}
            onToggleMenu={() => {
              setMenuOpen((open) => !open);
            }}
          />

          <main id="main">{children}</main>

          <MobileFooter />

          <MobileBottomBar
            label={bottomBar.label}
            value={bottomBar.value}
            {...(bottomBar.enquiryPiece === undefined
              ? {}
              : { enquiryPiece: bottomBar.enquiryPiece })}
          />

          <MobileMenu open={menuOpen} onOpenChange={setMenuOpen} />
        </div>
      ) : (
        <div className="relative z-10">
          <DesktopHeader />
          <main id="main">{children}</main>
          <DesktopFooter />
        </div>
      )}

      <SearchOverlay />
      <EnquiryModal />
    </div>
  );
}
