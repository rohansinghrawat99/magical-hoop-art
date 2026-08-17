import { useCallback, useMemo, useState, type ReactNode } from 'react';

import {
  DEFAULT_PIECE,
  EnquiryContext,
  type EnquiryContextValue,
  type EnquiryPiece,
} from './enquiry-context';

/**
 * Holds the enquiry modal's state.
 *
 * The form is reachable from the header, the footer, the mobile bottom bar, the
 * mobile menu and the artwork page, so its state lives above all of them rather
 * than being threaded through props.
 */
export function EnquiryProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [piece, setPiece] = useState<EnquiryPiece>(DEFAULT_PIECE);

  const openEnquiry = useCallback((next: EnquiryPiece = DEFAULT_PIECE) => {
    setPiece(next);
    setOpen(true);
  }, []);

  const closeEnquiry = useCallback(() => {
    setOpen(false);
  }, []);

  const value = useMemo<EnquiryContextValue>(
    () => ({ open, piece, openEnquiry, closeEnquiry, setOpen }),
    [open, piece, openEnquiry, closeEnquiry],
  );

  return <EnquiryContext.Provider value={value}>{children}</EnquiryContext.Provider>;
}
