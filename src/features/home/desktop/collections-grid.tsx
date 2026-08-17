import { StitchBackdrop } from '@/components/decor/stitch-backdrop';
import {
  Badge,
  CardLink,
  Container,
  HoopPlaceholder,
  ImageCarousel,
  PhotoFrame,
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
                {/* Square, not the design's 4:3: every photo in the catalogue
                    is square, and `object-cover` in a 4:3 panel cut a quarter
                    of each piece away — hoops lost their top and bottom. */}
                <PhotoFrame context="collectionCard">
                  <StitchBackdrop weave="collection" />

                  <ImageCarousel
                    images={covers}
                    alt=""
                    fallback={<HoopPlaceholder context="card" label={category.placeholderLabel} />}
                  />

                  <Badge className="absolute top-[10px] right-[10px]">
                    {formatPieceCount(category.count)}
                  </Badge>
                </PhotoFrame>

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
