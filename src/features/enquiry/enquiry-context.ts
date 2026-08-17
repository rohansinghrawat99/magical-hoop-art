import { createContext } from 'react';

/** What an enquiry is about. */
export interface EnquiryPiece {
  /** Shown in the modal and sent to WhatsApp. */
  subject: string;
  /**
   * The sizes this piece comes in. Present only for a specific piece — a
   * general enquiry has no size to choose, so the form omits the selector.
   */
  sizes?: readonly string[];
  /** The size selected on the page the visitor opened the form from. */
  size?: string;
}

export interface EnquiryContextValue {
  open: boolean;
  piece: EnquiryPiece;
  /** Open the form. Pass a piece when enquiring about a specific one. */
  openEnquiry: (piece?: EnquiryPiece) => void;
  closeEnquiry: () => void;
  setOpen: (open: boolean) => void;
}

export const DEFAULT_PIECE: EnquiryPiece = { subject: 'Custom hoop art' };

/**
 * Lives apart from the provider component so that file exports only components,
 * which is what keeps React Fast Refresh working.
 */
export const EnquiryContext = createContext<EnquiryContextValue | null>(null);
