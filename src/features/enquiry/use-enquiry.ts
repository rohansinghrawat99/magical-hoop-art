import { useContext } from 'react';

import { EnquiryContext, type EnquiryContextValue } from './enquiry-context';

/** Access the enquiry modal. Must be used within `EnquiryProvider`. */
export function useEnquiry(): EnquiryContextValue {
  const ctx = useContext(EnquiryContext);

  if (ctx === null) {
    throw new Error('useEnquiry must be used within an EnquiryProvider');
  }

  return ctx;
}
