import { Button } from '@/components/ui';
import { useEnquiry } from '@/features/enquiry/use-enquiry';
import { useIsMobile } from '@/hooks/use-is-mobile';
import { cn } from '@/lib/cn';

export interface NoMatchesProps {
  /** Heading. The overlay and the collection grid word this differently. */
  heading: string;
  /** Draw the soft-pink panel used on a collection page. */
  panel?: boolean;
  /** Runs before the enquiry modal opens — the overlay uses it to close itself. */
  onBeforeEnquire?: () => void;
  className?: string;
}

/**
 * What a visitor sees when nothing matches.
 *
 * Almost every piece here is made to order, so an empty result is an
 * opportunity rather than a dead end — it offers the enquiry form, reusing the
 * shared modal rather than forking it.
 */
export function NoMatches({ heading, panel = false, onBeforeEnquire, className }: NoMatchesProps) {
  const { openEnquiry } = useEnquiry();
  const isMobile = useIsMobile();

  return (
    <div
      className={cn(
        'text-center',
        panel ? 'rounded-[18px] bg-soft px-6 py-14' : 'px-6 py-12',
        className,
      )}
    >
      <h3
        className={cn(
          'm-0 font-display font-light',
          isMobile ? 'text-[26px] leading-[1.15]' : 'text-[30px] leading-[1.08]',
        )}
      >
        {heading}
      </h3>

      <p className="mx-auto mt-3 mb-7 max-w-[42ch] text-[14px] leading-[1.7] text-ink-muted">
        Almost everything here is made to order, so if you can picture it I can probably stitch it.
      </p>

      <Button
        variant="accent"
        density={isMobile ? 'mobile' : 'desktop'}
        onClick={() => {
          onBeforeEnquire?.();
          openEnquiry();
        }}
      >
        Enquire for a custom piece
      </Button>
    </div>
  );
}
