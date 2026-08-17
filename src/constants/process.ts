import type { ProcessStep } from '@/types/content';

/**
 * The "How it works" section on the home page.
 *
 * The desktop grid is `auto-fit`, so adding or removing a step reflows on its
 * own — but `PROCESS_SECTION.heading` in site.ts names the count out loud, so
 * check that line whenever this list changes length.
 */
export const PROCESS_STEPS: readonly ProcessStep[] = [
  {
    n: '01',
    title: 'Share Your Idea',
    body: 'Send me your preferred names, dates, colours, photos, lines or any ideas.',
  },
  {
    n: '02',
    title: 'Design & Quote',
    body: 'I’ll share a design layout and final quote for your approval before stitching begins.',
  },
  {
    n: '03',
    title: 'Handcrafted with Love',
    body: 'Your hoop is carefully hand-embroidered with beautiful ribbonwork, beads and pearl detailing.',
  },
  {
    n: '04',
    title: 'Final Look',
    body: 'Before packing the order, I’ll share the picture of your Hoop.',
  },
  {
    n: '05',
    title: 'Wrapped & Delivered',
    body: 'Your finished hoop is beautifully gift-wrapped with a handwritten note and safely delivered to you. Shipping World-wide.',
  },
] as const;
