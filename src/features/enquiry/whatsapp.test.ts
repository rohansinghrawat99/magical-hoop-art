import { describe, expect, it } from 'vitest';

import { buildWhatsAppUrl } from '@/features/enquiry/whatsapp';

const fields = {
  name: 'Priya',
  contact: '0412 345 678',
  occasion: 'Anniversary, 14 Feb',
  message: 'Navy base with pearls',
  subject: 'Blue Lehenga Couple — Wedding, Anniversary & Engagement',
};

describe('buildWhatsAppUrl', () => {
  it('points at wa.me', () => {
    expect(buildWhatsAppUrl(fields)).toMatch(/^https:\/\/wa\.me\//);
  });

  it('encodes every field into the prefilled message', () => {
    const text = decodeURIComponent(buildWhatsAppUrl(fields).split('?text=')[1] ?? '');

    expect(text).toContain('Blue Lehenga Couple');
    expect(text).toContain('Priya');
    expect(text).toContain('0412 345 678');
    expect(text).toContain('Anniversary, 14 Feb');
    expect(text).toContain('Navy base with pearls');
  });

  it('percent-encodes characters that would break the URL', () => {
    const url = buildWhatsAppUrl(fields);
    // The subject contains an em dash and an ampersand.
    expect(url).not.toContain(' ');
    expect(url).not.toContain('&Engagement');
  });

  it('omits the details line when no message was typed', () => {
    const text = decodeURIComponent(
      buildWhatsAppUrl({ ...fields, message: '   ' }).split('?text=')[1] ?? '',
    );
    expect(text).not.toContain('Details:');
  });
});
