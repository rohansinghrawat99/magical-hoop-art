import { getWhatsAppNumber } from '@/constants/site';

export interface EnquiryFields {
  name: string;
  contact: string;
  occasion: string;
  message: string;
  /** The piece being asked about, or "Custom hoop art". */
  subject: string;
}

/** `true` once a WhatsApp number has been configured. */
export function isWhatsAppConfigured(): boolean {
  return normaliseNumber(getWhatsAppNumber()).length > 0;
}

/** Strip everything a person might type around the digits: `+61 412 345 678`. */
function normaliseNumber(raw: string): string {
  return raw.replace(/\D/g, '');
}

/**
 * Compose the prefilled WhatsApp message.
 *
 * `wa.me` works on both mobile (opens the app) and desktop (opens WhatsApp Web),
 * which is why it beats `mailto:` for a made-to-order craft business.
 */
export function buildWhatsAppUrl(fields: EnquiryFields): string {
  const number = normaliseNumber(getWhatsAppNumber());

  const lines = [
    `Hi! I'd like to enquire about: ${fields.subject}`,
    '',
    `Name: ${fields.name}`,
    `Contact: ${fields.contact}`,
    `Occasion & date needed: ${fields.occasion}`,
  ];

  if (fields.message.trim().length > 0) {
    lines.push('', `Details: ${fields.message.trim()}`);
  }

  return `https://wa.me/${number}?text=${encodeURIComponent(lines.join('\n'))}`;
}
