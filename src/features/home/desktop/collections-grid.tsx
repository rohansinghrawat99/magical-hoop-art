import { StitchBackdrop } from '@/components/decor/stitch-backdrop';
import {
  Badge,
  CardLink,
  Container,
  HoopPlaceholder,
  ImageCarousel,
  SectionHeading,
} from '@/components/ui';
import { ROUTES, SECTION_IDS } from '@/constants/navigation';
import { COLLECTIONS_SECTION } from '@/constants/site';
import { CATEGORIES_WITH_STATS, getArtworkIds } from '@/data/catalogue';
import { formatPieceCount } from '@/lib/format';
import { resolveCategoryImages } from '@/lib/images';

export function DesktopCollectionsGrid() {
  return (
    <section id={SECTION_IDS.collections.desktop} className="px-10 pt-[70px] pb-[30px]">
      <Container>
        <SectionHeading
          eyebrow={COLLECTIONS_SECTION.eyebrow}
          heading={COLLECTIONS_SECTION.heading}
          aside={COLLECTIONS_SECTION.aside}
          divider
          className="mb-11"
        />

        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-[26px] pb-[70px]">
          {CATEGORIES_WITH_STATS.map((category) => {
            const covers = resolveCategoryImages(category.id, getArtworkIds(category.id));

            return (
              <CardLink key={category.id} to={ROUTES.category(category.id)}>
                {/* Flex column only for the placeholder, which is the sole
                    in-flow child — the photo, weave and badge are all
                    absolute. No padding here: `inset-0` resolves against the
                    padding box, so any would inset the photo off the edges. */}
                <div className="relative flex aspect-[4/3] flex-col items-center justify-center gap-[6px] overflow-hidden bg-soft text-center">
                  <StitchBackdrop weave="collection" />

                  <ImageCarousel
                    images={covers}
                    alt=""
                    fallback={<HoopPlaceholder context="card" label={category.placeholderLabel} />}
                  />

                  <Badge className="absolute top-[14px] right-4">
                    {formatPieceCount(category.count)}
                  </Badge>
                </div>

                <div className="flex flex-1 flex-col gap-[10px] px-[26px] pt-[26px] pb-7">
                  <h3 className="m-0 font-display text-[27px] leading-[1.15] font-normal">
                    {category.name}
                  </h3>
                  <p className="m-0 text-[14px] leading-[1.65] text-ink-soft">{category.blurb}</p>

                  <div className="mt-auto flex items-center justify-between pt-[18px]">
                    <span className="text-[13px] tracking-[.06em]">from {category.priceFrom}</span>
                    <span className="text-[12px] tracking-[.18em] text-accent uppercase">
                      View <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </div>
              </CardLink>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
