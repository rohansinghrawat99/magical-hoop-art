import { useState } from 'react';

import { StitchBackdrop } from '@/components/decor/stitch-backdrop';
import {
  AppImage,
  BackLink,
  Eyebrow,
  HoopPlaceholder,
  OptionGroup,
  SpecList,
} from '@/components/ui';
import { ROUTES } from '@/constants/navigation';
import { PRICE_NOTE_MOBILE, SIZE_LABEL, STATIC_SPECS } from '@/constants/product';
import { buildArtworkDescription, formatPriceWithCurrency } from '@/lib/format';
import { resolveArtworkImage } from '@/lib/images';
import type { Artwork, CategoryWithStats } from '@/types/content';

export interface MobileArtworkPageProps {
  artwork: Artwork;
  category: CategoryWithStats;
}

export function MobileArtworkPage({ artwork, category }: MobileArtworkPageProps) {
  const options = artwork.options;
  const [sizeLabel, setSizeLabel] = useState(options[0].label);
  const selected = options.find((o) => o.label === sizeLabel) ?? options[0];
  const sizeLabels = options.map((o) => o.label);

  const specs = [{ k: SIZE_LABEL, v: selected.label }, ...STATIC_SPECS];

  return (
    <div className="animate-fade-in px-5 pt-5 pb-10">
      <BackLink to={ROUTES.category(category.id)} density="mobile">
        {category.name}
      </BackLink>

      {/* Flex column only for the placeholder — see the desktop detail page. */}
      <div className="relative mt-2 flex aspect-square animate-ring-in flex-col items-center justify-center gap-2 overflow-hidden rounded-[20px] bg-soft text-center">
        <StitchBackdrop weave="detailTight" />

        <AppImage
          src={resolveArtworkImage(category.id, artwork.id)}
          alt={artwork.title}
          fallback={
            <HoopPlaceholder context="detailMobile" label="main photo" caption={artwork.title} />
          }
        />
      </div>

      <div className="mt-7 animate-rise-in">
        <Eyebrow density="mobile" className="mb-[10px]">
          {category.name}
        </Eyebrow>

        <h1 className="m-0 mb-[10px] font-display text-[34px] leading-[1.05] font-light">
          {artwork.title}
        </h1>

        <div className="mb-5 flex items-baseline gap-[10px]">
          <div className="font-display text-[28px] text-accent">
            {formatPriceWithCurrency(selected.price)}
          </div>
          <div className="text-[12px] text-ink-subtle">{PRICE_NOTE_MOBILE}</div>
        </div>

        <p className="m-0 mb-[26px] text-[15px] leading-[1.75] text-pretty text-ink-strong">
          {buildArtworkDescription(artwork)}
        </p>

        <div className="mb-[10px] text-[10px] tracking-[.2em] text-ink-label uppercase">
          {SIZE_LABEL}
        </div>
        <OptionGroup
          density="mobile"
          label={SIZE_LABEL}
          options={sizeLabels}
          value={sizeLabel}
          onValueChange={setSizeLabel}
          className="mb-[26px]"
        />

        <SpecList density="mobile" specs={specs} />
      </div>
    </div>
  );
}
