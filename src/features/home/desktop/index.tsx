import { DesktopCollectionsGrid } from './collections-grid';
import { DesktopHero } from './hero';
import { DesktopProcessSection } from './process-section';

export function DesktopHome() {
  return (
    <>
      <DesktopHero />
      <DesktopCollectionsGrid />
      <DesktopProcessSection />
    </>
  );
}
