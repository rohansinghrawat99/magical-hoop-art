import type { CSSProperties } from 'react';

/**
 * The drifting floral background.
 *
 * This is a faithful port of the generator in the Claude Design source. The
 * seeded RNG, the multipliers, the petal counts and the anchor positions are
 * all reproduced exactly, so the same seeds lay out the same field as the
 * original — that is what makes the background pixel-identical rather than
 * merely similar. Do not "tidy" the magic numbers.
 *
 * Colours are the one deliberate change: the design inlined hex values, we
 * reference the design tokens through `var(--color-*)` so the field re-themes
 * with everything else.
 */

const TINTS = ['accent', 'soft', 'gold'] as const;

type Tint = (typeof TINTS)[number];

/** Inner/outer gradient stops per tint, matching the design's `colors` map. */
const TINT_STOPS: Record<Tint, readonly [string, string]> = {
  accent: [
    'color-mix(in srgb, var(--color-accent) 62%, #fff)',
    'color-mix(in srgb, var(--color-accent) 26%, #fff)',
  ],
  soft: [
    'color-mix(in srgb, var(--color-soft) 96%, #fff)',
    'color-mix(in srgb, var(--color-soft) 55%, #fff)',
  ],
  gold: [
    'color-mix(in srgb, var(--color-gold) 72%, #fff)',
    'color-mix(in srgb, var(--color-gold) 28%, #fff)',
  ],
};

export interface PetalShape {
  id: string;
  style: CSSProperties;
}

export interface BloomShape {
  id: string;
  wrap: CSSProperties;
  petals: PetalShape[];
  /** `null` for falling petals, which have no visible centre. */
  core: CSSProperties | null;
}

interface BloomOptions {
  opacity?: number;
  blur?: number;
}

/** Deterministic pseudo-random in [0, 1). Identical to the design's `rnd`. */
function rnd(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

function bloom(
  i: number,
  x: number,
  y: number,
  size: number,
  tint: Tint,
  opts: BloomOptions = {},
): BloomShape {
  const petalCount = 5 + Math.floor(rnd(i * 3.1) * 3);
  const spin = rnd(i * 5.7) * 360;
  const len = size;
  const wid = size * (0.52 + rnd(i * 2.3) * 0.18);
  const stops = TINT_STOPS[tint];

  const petals: PetalShape[] = [];

  // Outer ring of petals.
  for (let k = 0; k < petalCount; k += 1) {
    const angle = spin + (360 / petalCount) * k + rnd(i * 7 + k) * 10 - 5;
    const l = len * (0.86 + rnd(i * 11 + k) * 0.28);
    const w = wid * (0.86 + rnd(i * 13 + k) * 0.24);

    petals.push({
      id: `p${String(k)}`,
      style: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: `${String(w)}px`,
        height: `${String(l)}px`,
        marginLeft: `${String(-w / 2)}px`,
        marginTop: `${String(-l)}px`,
        transformOrigin: '50% 100%',
        transform: `rotate(${String(angle)}deg)`,
        borderRadius:
          `${String(w)}px ${String(w)}px ${String(w * 0.4)}px ${String(w * 0.4)}px / ` +
          `${String(l * 0.62)}px ${String(l * 0.62)}px ${String(l * 0.38)}px ${String(l * 0.38)}px`,
        background: `radial-gradient(120% 92% at 50% 12%, ${stops[0]}, ${stops[1]})`,
      },
    });
  }

  // Two leaves tucked behind the bloom.
  for (let k = 0; k < 2; k += 1) {
    const angle = spin + 140 + k * 80;
    const l = len * 1.15;
    const w = len * 0.26;

    petals.push({
      id: `l${String(k)}`,
      style: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: `${String(w)}px`,
        height: `${String(l)}px`,
        marginLeft: `${String(-w / 2)}px`,
        marginTop: `${String(-l)}px`,
        transformOrigin: '50% 100%',
        transform: `rotate(${String(angle)}deg)`,
        borderRadius:
          `${String(w)}px ${String(w)}px 2px 2px / ` +
          `${String(l * 0.7)}px ${String(l * 0.7)}px 4px 4px`,
        background:
          'linear-gradient(180deg, color-mix(in srgb, var(--color-gold) 46%, #fff), ' +
          'color-mix(in srgb, var(--color-gold) 14%, #fff))',
        zIndex: -1,
      },
    });
  }

  const cs = size * 0.4;

  return {
    id: `b${String(i)}`,
    wrap: {
      position: 'absolute',
      left: `${String(x)}%`,
      top: `${String(y)}%`,
      width: 0,
      height: 0,
      opacity: opts.opacity ?? 0.85,
      filter: `blur(${String(opts.blur ?? 0)}px)`,
      animation: `drift ${String(16 + rnd(i * 17) * 16)}s ease-in-out infinite`,
      animationDelay: `-${String(rnd(i * 19) * 20)}s`,
    },
    petals,
    core: {
      position: 'absolute',
      left: 0,
      top: 0,
      width: `${String(cs)}px`,
      height: `${String(cs)}px`,
      margin: `${String(-cs / 2)}px 0 0 ${String(-cs / 2)}px`,
      borderRadius: '50%',
      background:
        'radial-gradient(circle at 40% 35%, color-mix(in srgb, var(--color-gold) 85%, #fff), ' +
        'color-mix(in srgb, var(--color-gold) 40%, #fff))',
    },
  };
}

/** Four large, blurred blooms pinned to the corners of the viewport. */
const ANCHORS: readonly (readonly [number, number])[] = [
  [4, 10],
  [94, 74],
  [88, 16],
  [8, 86],
];

/**
 * The full background field: `count` single petals falling top-to-bottom, plus
 * the four anchor blooms.
 *
 * The design calls this with 12 on mobile and 16 on desktop.
 */
export function buildPetalField(count: number): BloomShape[] {
  const out: BloomShape[] = [];

  for (let i = 0; i < count; i += 1) {
    const tint = TINTS[i % 3] ?? 'accent';
    const b = bloom(i + 80, 0, 0, 16 + rnd(i * 2.1) * 16, tint);

    out.push({
      id: `fall${String(i)}`,
      // A falling petal is a single petal with no centre.
      petals: b.petals.slice(0, 1),
      core: null,
      wrap: {
        position: 'absolute',
        left: `${String(rnd(i * 1.9) * 100)}%`,
        top: 0,
        width: 0,
        height: 0,
        opacity: 0.8,
        animation: `fallPetal ${String(20 + rnd(i * 3.3) * 22)}s linear infinite`,
        animationDelay: `-${String(rnd(i * 4.7) * 30)}s`,
      },
    });
  }

  ANCHORS.forEach((anchor, i) => {
    const tint = TINTS[i % 3] ?? 'accent';
    out.push(
      bloom(i + 130, anchor[0], anchor[1], 60 + rnd(i * 6.1) * 50, tint, {
        opacity: 0.45,
        blur: 4,
      }),
    );
  });

  return out;
}

/** Petal counts, matching the design's `fallingPetals(mobile ? 12 : 16)`. */
export const PETAL_COUNT = { mobile: 12, desktop: 16 } as const;
