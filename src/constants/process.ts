import type { ProcessStep } from '@/types/content';

/** The "How it works" section on the home page. */
export const PROCESS_STEPS: readonly ProcessStep[] = [
  {
    n: '01',
    title: 'Send your idea',
    body: 'Names, dates, colours, a photo you love — anything you want on the hoop.',
  },
  {
    n: '02',
    title: 'Sketch & quote',
    body: 'I share a rough layout and the final price before any thread is cut.',
  },
  {
    n: '03',
    title: 'Stitched by hand',
    body: 'Seven to ten days of embroidery, ribbon work and pearl detailing.',
  },
  {
    n: '04',
    title: 'Wrapped & shipped',
    body: 'Gift-wrapped with a handwritten note and shipped world-wide.',
  },
] as const;
