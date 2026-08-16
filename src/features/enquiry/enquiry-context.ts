import { createContext } from 'react';

export interface EnquiryContextValue {
  open: boolean;
  /** What the enquiry is about, shown in the modal and sent to WhatsApp. */
  subject: string;
  /** Open the form. Pass a subject when enquiring about a specific piece. */
  openEnquiry: (subject?: string) => void;
  closeEnquiry: () => void;
  setOpen: (open: boolean) => void;
}

export const DEFAULT_SUBJECT = 'Custom hoop art';

/**
 * Lives apart from the provider component so that file exports only components,
 * which is what keeps React Fast Refresh working.
 */
export const EnquiryContext = createContext<EnquiryContextValue | null>(null);
