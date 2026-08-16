import { Button } from '@/components/ui';
import { useEnquiry } from '@/features/enquiry/use-enquiry';

export interface MobileBottomBarProps {
  /** Small uppercase line, e.g. "8 pieces" or the artwork's tag. */
  label: string;
  /** The prominent line beneath it. */
  value: string;
  /** Subject passed to the enquiry form when the button is pressed. */
  enquirySubject?: string;
}

/**
 * The persistent mobile action bar.
 *
 * Its two lines change with the current view — a summary on home, the
 * collection on a category page, the piece and price on an artwork page.
 * Padded for the home indicator via `env(safe-area-inset-bottom)`.
 */
export function MobileBottomBar({ label, value, enquirySubject }: MobileBottomBarProps) {
  const { openEnquiry } = useEnquiry();

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex items-center gap-3 border-t border-line-header bg-veil-bar px-5 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))] backdrop-blur-[16px]">
      <div className="min-w-0 flex-1">
        <div className="text-[9.5px] tracking-[.2em] text-ink-subtle uppercase">{label}</div>
        <div className="truncate font-display text-[19px] leading-[1.2]">{value}</div>
      </div>

      <Button
        variant="accent"
        density="mobile"
        size="compact"
        className="shrink-0"
        onClick={() => {
          openEnquiry(enquirySubject);
        }}
      >
        Enquire
      </Button>
    </div>
  );
}
