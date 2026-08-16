import * as Dialog from '@radix-ui/react-dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useEffect, useRef, type ReactNode } from 'react';

import { useIsMobile } from '@/hooks/use-is-mobile';
import { cn } from '@/lib/cn';

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Accessible name. Rendered visually only when `showTitle` is set. */
  title: string;
  children: ReactNode;
  /**
   * `dialog` centres a card on desktop and slides a sheet up on mobile —
   * the enquiry form. `fullscreen` covers the viewport — the mobile menu.
   */
  variant?: 'dialog' | 'fullscreen';
  className?: string;
}

/**
 * The one modal in the system, wrapping Radix Dialog.
 *
 * Radix handles focus trapping, restoring focus to the trigger on close, Esc,
 * scroll locking, portalling and `aria-modal` — behaviour the design's
 * plain-div overlay had no way to provide. The look is entirely ours.
 *
 * This is the only file that imports Radix Dialog; feature code composes this.
 */
export function Modal({
  open,
  onOpenChange,
  title,
  children,
  variant = 'dialog',
  className,
}: ModalProps) {
  const isMobile = useIsMobile();

  /**
   * Remember what was focused before the modal opened, and put focus back there
   * when it closes.
   *
   * Radix normally restores focus to its own `Dialog.Trigger`, but this modal is
   * opened from state (the header, the footer, the bottom bar, an artwork page)
   * rather than through a Trigger, so there is nothing for it to return to and
   * focus lands on `<body>`. Verified in Chromium, not just jsdom.
   */
  const lastFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (open) {
      lastFocused.current = document.activeElement as HTMLElement | null;
    }
  }, [open]);

  const restoreFocus = (event: Event) => {
    const target = lastFocused.current;
    if (target?.isConnected === true) {
      event.preventDefault();
      target.focus();
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        {variant === 'fullscreen' ? (
          <Dialog.Content
            onCloseAutoFocus={restoreFocus}
            className={cn(
              'fixed inset-0 z-[70] flex animate-fade-in flex-col overflow-auto bg-white p-5',
              className,
            )}
          >
            <VisuallyHidden asChild>
              <Dialog.Title>{title}</Dialog.Title>
            </VisuallyHidden>
            {children}
          </Dialog.Content>
        ) : (
          <>
            <Dialog.Overlay
              className={cn(
                'fixed inset-0 z-[90] animate-fade-in bg-scrim backdrop-blur-[6px]',
                isMobile ? 'flex items-end justify-center' : 'flex items-center justify-center p-6',
              )}
            />
            <Dialog.Content
              onCloseAutoFocus={restoreFocus}
              className={cn(
                'fixed z-[90] overflow-auto bg-white',
                isMobile
                  ? [
                      'inset-x-0 bottom-0 max-h-[92vh] animate-sheet-up rounded-t-[26px]',
                      'px-5 pt-[22px] pb-[calc(26px+env(safe-area-inset-bottom))]',
                    ]
                  : [
                      'top-1/2 left-1/2 max-h-[90vh] w-[min(560px,calc(100%-48px))]',
                      '-translate-x-1/2 -translate-y-1/2 animate-rise-in',
                      'rounded-[22px] border border-line-strong p-10',
                    ],
                className,
              )}
            >
              <VisuallyHidden asChild>
                <Dialog.Title>{title}</Dialog.Title>
              </VisuallyHidden>
              {children}
            </Dialog.Content>
          </>
        )}
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/** Close button that works anywhere inside a `Modal`. */
export function ModalClose({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <Dialog.Close className={className} aria-label="Close">
      {children}
    </Dialog.Close>
  );
}

/** The grab handle drawn at the top of the mobile sheet. */
export function SheetHandle() {
  return (
    <div aria-hidden="true" className="mx-auto mb-5 h-1 w-10 rounded bg-[rgb(58_42_47_/_0.18)]" />
  );
}
