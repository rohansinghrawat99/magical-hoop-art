import { StitchBackdrop } from '@/components/decor/stitch-backdrop';
import {
  AppImage,
  Badge,
  Button,
  CardLink,
  Eyebrow,
  HoopFrame,
  HoopPlaceholder,
  ImageCarousel,
  SectionHeading,
  Stat,
  StepItem,
} from '@/components/ui';
import { ROUTES, SECTION_IDS } from '@/constants/navigation';
import { PROCESS_STEPS } from '@/constants/process';
import { COLLECTIONS_SECTION, HERO, PROCESS_SECTION, SITE } from '@/constants/site';
import { CATEGORIES_WITH_STATS, getArtworkIds, TOTAL_ARTWORKS } from '@/data/catalogue';
import { useEnquiry } from '@/features/enquiry/use-enquiry';
import { useSmoothScrollTo } from '@/hooks/use-smooth-scroll-to';
import { formatPieceCount } from '@/lib/format';
import { resolveCategoryImages, resolveHeroImage } from '@/lib/images';

export function MobileHome() {
  const { openEnquiry } = useEnquiry();
  const scrollTo = useSmoothScrollTo();
  const heroImage = resolveHeroImage();

  return (
    <>
      <section className="animate-rise-in px-5 pt-[34px] pb-2">
        <Eyebrow density="mobile" withRule className="mb-[18px]">
          {HERO.eyebrow}
        </Eyebrow>

        <h1 className="m-0 mb-4 font-display text-[44px] leading-[1.04] font-light tracking-[-.01em]">
          {HERO.headingLeadMobile}{' '}
          <span className="font-script text-[1.06em] text-accent">{HERO.headingScript}</span>
        </h1>

        <p className="m-0 mb-[26px] text-[15.5px] leading-[1.7] text-pretty text-ink-body">
          {HERO.blurbMobile}
        </p>

        <div className="flex flex-col gap-[10px]">
          <Button
            variant="ink"
            density="mobile"
            fullWidth
            onClick={() => {
              scrollTo(SECTION_IDS.collections.mobile);
            }}
          >
            Browse collections
          </Button>
          <Button
            variant="outline"
            density="mobile"
            fullWidth
            onClick={() => {
              openEnquiry();
            }}
          >
            Custom order
          </Button>
        </div>
      </section>

      <section className="animate-ring-in px-0 pt-8 pb-[6px]">
        <div className="flex justify-center px-5">
          <HoopFrame context="hero" density="mobile" fill={heroImage ? 'plain' : 'striped'}>
            <AppImage
              src={heroImage}
              alt="A finished hand-embroidered hoop"
              priority
              fallback={
                <HoopPlaceholder
                  context="heroMobile"
                  label={HERO.placeholderLabel}
                  caption={HERO.placeholderCaption}
                />
              }
            />
          </HoopFrame>
        </div>

        <div className="mt-8 flex justify-around px-3 text-[9.5px] tracking-[.14em] text-ink-faint uppercase">
          <Stat density="mobile" value={`${String(TOTAL_ARTWORKS)}+`} label="pieces" />
          <Stat density="mobile" value={String(CATEGORIES_WITH_STATS.length)} label="collections" />
          <Stat density="mobile" value={SITE.makeTime.replace(' days', '')} label="days" />
        </div>
      </section>

      <section id={SECTION_IDS.collections.mobile} className="px-5 pt-[46px] pb-[10px]">
        <SectionHeading
          density="mobile"
          eyebrow={COLLECTIONS_SECTION.eyebrow}
          heading={COLLECTIONS_SECTION.heading}
          aside={COLLECTIONS_SECTION.aside}
        />

        <div className="flex flex-col gap-4">
          {CATEGORIES_WITH_STATS.map((category) => (
            <CardLink key={category.id} density="mobile" to={ROUTES.category(category.id)}>
              <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden bg-soft">
                <StitchBackdrop weave="collectionTight" />

                <HoopFrame context="categoryCard" density="mobile">
                  <ImageCarousel
                    images={resolveCategoryImages(category.id, getArtworkIds(category.id))}
                    alt=""
                    fallback={
                      <HoopPlaceholder context="cardMobile" label={category.placeholderLabel} />
                    }
                  />
                </HoopFrame>

                <Badge density="mobile" className="absolute top-3 right-3">
                  {formatPieceCount(category.count)}
                </Badge>
              </div>

              <div className="flex flex-col gap-[7px] px-[18px] pt-[18px] pb-5">
                <h3 className="m-0 font-display text-[23px] leading-[1.15] font-normal">
                  {category.name}
                </h3>
                <p className="m-0 text-[13.5px] leading-[1.6] text-ink-soft">{category.blurb}</p>

                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[13px]">from {category.priceFrom}</span>
                  <span className="text-[11px] tracking-[.18em] text-accent uppercase">
                    View <span aria-hidden="true">→</span>
                  </span>
                </div>
              </div>
            </CardLink>
          ))}
        </div>
      </section>

      <section id={SECTION_IDS.process.mobile} className="mt-[46px] bg-soft px-5 py-11">
        <Eyebrow density="mobile" className="mb-[10px]">
          {PROCESS_SECTION.eyebrow}
        </Eyebrow>
        <h2 className="m-0 mb-7 font-display text-[30px] leading-[1.12] font-light">
          {PROCESS_SECTION.heading}
        </h2>

        <ol className="flex list-none flex-col gap-[22px] p-0">
          {PROCESS_STEPS.map((step) => (
            <StepItem key={step.n} step={step} density="mobile" />
          ))}
        </ol>
      </section>
    </>
  );
}
