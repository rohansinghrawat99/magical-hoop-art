import { useState } from 'react';

import { StitchBackdrop } from '@/components/decor/stitch-backdrop';
import {
  AppImage,
  BackLink,
  Button,
  Container,
  Eyebrow,
  HoopPlaceholder,
  PhotoFrame,
  OptionGroup,
  RouteButton,
  SpecList,
} from '@/components/ui';
import { ROUTES } from '@/constants/navigation';
import { PRICE_NOTE, SIZE_LABEL, STATIC_SPECS } from '@/constants/product';
import { useEnquiry } from '@/features/enquiry/use-enquiry';
import { buildArtworkDescription, formatPriceWithCurrency } from '@/lib/format';
import { resolveArtworkImage } from '@/lib/images';
import type { Artwork, CategoryWithStats } from '@/types/content';

export interface DesktopArtworkPageProps {
  artwork: Artwork;
  category: CategoryWithStats;
}

export function DesktopArtworkPage({ artwork, category }: DesktopArtworkPageProps) {
  const { openEnquiry } = useEnquiry();
  const options = artwork.options;
  const [sizeLabel, setSizeLabel] = useState(options[0].label);
  const selected = options.find((o) => o.label === sizeLabel) ?? options[0];
  const sizeLabels = options.map((o) => o.label);

  const specs = [{ k: SIZE_LABEL, v: selected.label }, ...STATIC_SPECS];
  const subject = `${artwork.title} — ${category.name}`;

  return (
    <div className="animate-fade-in px-10 pt-14 pb-[90px]">
      <Container>
        <BackLink to={ROUTES.category(category.id)} className="mb-[34px]">
          {category.name}
        </BackLink>

        <div className="grid grid-cols-2 items-start gap-16">
          <div className="relative animate-ring-in">
            <PhotoFrame context="detail">
              <StitchBackdrop weave="detail" />

              <AppImage
                src={resolveArtworkImage(category.id, artwork.id)}
                alt={artwork.title}
                fallback={
                  <HoopPlaceholder context="detail" label="main photo" caption={artwork.title} />
                }
              />
            </PhotoFrame>
          </div>

          <div className="sticky top-[110px] animate-rise-in">
            <Eyebrow className="mb-4">{category.name}</Eyebrow>

            <h1 className="m-0 mb-[14px] font-display text-detail leading-[1.05] font-light">
              {artwork.title}
            </h1>

            <div className="mb-[26px] flex items-baseline gap-[14px]">
              <div className="font-display text-[34px] text-accent">
                {formatPriceWithCurrency(selected.price)}
              </div>
              <div className="text-[13px] text-ink-subtle">{PRICE_NOTE}</div>
            </div>

            <p className="m-0 mb-[30px] text-[16px] leading-[1.8] text-pretty text-ink-strong">
              {buildArtworkDescription(artwork)}
            </p>

            <SpecList specs={specs} className="mb-8" />

            <div className="mb-7 grid gap-[10px]">
              <div className="text-[11px] tracking-[.2em] text-ink-label uppercase">
                {SIZE_LABEL}
              </div>
              <OptionGroup
                label={SIZE_LABEL}
                options={sizeLabels}
                value={sizeLabel}
                onValueChange={setSizeLabel}
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                variant="accent"
                size="wide"
                className="min-w-[200px] flex-1"
                onClick={() => {
                  openEnquiry(subject);
                }}
              >
                Enquire about this piece
              </Button>
              <RouteButton variant="outline" size="wide" to={ROUTES.category(category.id)}>
                More like this
              </RouteButton>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
