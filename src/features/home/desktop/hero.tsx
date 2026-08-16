import {
  AppImage,
  Button,
  Container,
  Eyebrow,
  HoopFrame,
  HoopPlaceholder,
  Stat,
} from '@/components/ui';
import { SECTION_IDS } from '@/constants/navigation';
import { HERO, SITE } from '@/constants/site';
import { TOTAL_ARTWORKS } from '@/data/catalogue';
import { CATEGORIES_WITH_STATS } from '@/data/catalogue';
import { useEnquiry } from '@/features/enquiry/use-enquiry';
import { useSmoothScrollTo } from '@/hooks/use-smooth-scroll-to';
import { resolveHeroImage } from '@/lib/images';

export function DesktopHero() {
  const { openEnquiry } = useEnquiry();
  const scrollTo = useSmoothScrollTo();
  const heroImage = resolveHeroImage();

  return (
    <section className="relative px-10 pt-24 pb-[70px]">
      <Container className="grid grid-cols-[1.05fr_.95fr] items-center gap-[60px]">
        <div className="animate-rise-in">
          <Eyebrow withRule className="mb-[26px]">
            {HERO.eyebrow}
          </Eyebrow>

          <h1 className="m-0 mb-5 font-display text-hero leading-[1.02] font-light tracking-[-.01em] text-balance">
            {HERO.headingLead}
            <br />
            {HERO.headingTail}{' '}
            <span className="font-script text-[1.05em] text-accent">{HERO.headingScript}</span>
          </h1>

          <p className="m-0 mb-[34px] max-w-[44ch] text-[17px] leading-[1.75] text-pretty text-ink-body">
            {HERO.blurb}
          </p>

          <div className="flex flex-wrap gap-[14px]">
            <Button
              variant="ink"
              onClick={() => {
                scrollTo(SECTION_IDS.collections.desktop);
              }}
            >
              Browse collections
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                openEnquiry();
              }}
            >
              Custom order
            </Button>
          </div>

          <div className="mt-[52px] flex gap-[38px] text-[12px] tracking-[.14em] text-ink-faint uppercase">
            <Stat value={`${String(TOTAL_ARTWORKS)}+`} label="pieces stitched" />
            <Stat value={String(CATEGORIES_WITH_STATS.length)} label="collections" />
            <Stat value={SITE.makeTime.replace(' days', '')} label="days to make" />
          </div>
        </div>

        <div className="relative flex animate-ring-in items-center justify-center">
          <div
            aria-hidden="true"
            className="absolute aspect-square w-[96%] [animation:drift_24s_ease-in-out_infinite] rounded-full border border-dashed border-[rgb(233_169_184_/_0.7)]"
          />
          {/* The woven stripe is placeholder scaffolding — once a real hero photo
              exists it should sit on plain white, or the texture shows through any
              transparency in the image. */}
          <HoopFrame context="hero" density="desktop" fill={heroImage ? 'plain' : 'striped'}>
            <AppImage
              src={heroImage}
              alt="A finished hand-embroidered hoop"
              priority
              fallback={
                <HoopPlaceholder
                  context="hero"
                  label={HERO.placeholderLabel}
                  caption={HERO.placeholderCaption}
                  dims={HERO.placeholderDims}
                />
              }
            />
          </HoopFrame>
        </div>
      </Container>
    </section>
  );
}
