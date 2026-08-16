import { useMemo } from 'react';

import { useIsMobile } from '@/hooks/use-is-mobile';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { buildPetalField, PETAL_COUNT } from '@/lib/petals';

/**
 * The drifting floral background behind the whole site.
 *
 * Fixed, non-interactive and hidden from assistive tech. The shapes come from
 * `lib/petals.ts`, a faithful port of the design's generator.
 *
 * Skipped entirely when the visitor prefers reduced motion — the stylesheet
 * would freeze the animation anyway, and a static field of stray petals reads
 * as clutter rather than decoration.
 */
export function PetalField() {
  const isMobile = useIsMobile();
  const reducedMotion = usePrefersReducedMotion();

  const blooms = useMemo(
    () => buildPetalField(isMobile ? PETAL_COUNT.mobile : PETAL_COUNT.desktop),
    [isMobile],
  );

  if (reducedMotion) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {blooms.map((bloom) => (
        <div key={bloom.id} style={bloom.wrap}>
          {bloom.petals.map((petal) => (
            <div key={petal.id} style={petal.style} />
          ))}
          {bloom.core ? <div style={bloom.core} /> : null}
        </div>
      ))}
    </div>
  );
}
