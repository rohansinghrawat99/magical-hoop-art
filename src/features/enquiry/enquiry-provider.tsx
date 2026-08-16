import { useCallback, useMemo, useState, type ReactNode } from 'react';

import { DEFAULT_SUBJECT, EnquiryContext, type EnquiryContextValue } from './enquiry-context';

/**
 * Holds the enquiry modal's state.
 *
 * The form is reachable from the header, the footer, the mobile bottom bar, the
 * mobile menu and the artwork page, so its state lives above all of them rather
 * than being threaded through props.
 */
export function EnquiryProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState(DEFAULT_SUBJECT);

  const openEnquiry = useCallback((next: string = DEFAULT_SUBJECT) => {
    setSubject(next);
    setOpen(true);
  }, []);

  const closeEnquiry = useCallback(() => {
    setOpen(false);
  }, []);

  const value = useMemo<EnquiryContextValue>(
    () => ({ open, subject, openEnquiry, closeEnquiry, setOpen }),
    [open, subject, openEnquiry, closeEnquiry],
  );

  return <EnquiryContext.Provider value={value}>{children}</EnquiryContext.Provider>;
}
