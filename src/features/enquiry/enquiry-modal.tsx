import { useEffect, useState, type SubmitEventHandler } from 'react';

import { Button, Input, Modal, ModalClose, OptionGroup, Textarea } from '@/components/ui';
import { Eyebrow } from '@/components/ui/eyebrow';
import { SIZE_LABEL } from '@/constants/product';
import { useIsMobile } from '@/hooks/use-is-mobile';

import { useEnquiry } from './use-enquiry';
import { buildWhatsAppUrl, isWhatsAppConfigured, type EnquiryFields } from './whatsapp';

type FormErrors = Partial<Record<'name' | 'contact' | 'occasion', string>>;

const EMPTY: Omit<EnquiryFields, 'subject'> = {
  name: '',
  contact: '',
  occasion: '',
  message: '',
};

function validate(fields: Omit<EnquiryFields, 'subject'>): FormErrors {
  const errors: FormErrors = {};

  if (fields.name.trim().length === 0) {
    errors.name = 'Please tell me your name.';
  }
  if (fields.contact.trim().length === 0) {
    errors.contact = 'A mobile number or email so I can reply.';
  }
  if (fields.occasion.trim().length === 0) {
    errors.occasion = 'Which occasion, and when do you need it?';
  }

  return errors;
}

/**
 * The enquiry form, a centred card on both trees.
 *
 * Submitting opens a prefilled WhatsApp conversation rather than posting to a
 * server — there is no backend, and it puts the enquiry straight into the
 * channel the business already uses.
 */
export function EnquiryModal() {
  const { open, setOpen, piece, closeEnquiry } = useEnquiry();
  const isMobile = useIsMobile();
  const [fields, setFields] = useState(EMPTY);
  const [errors, setErrors] = useState<FormErrors>({});

  const sizes = piece.sizes ?? [];
  const [size, setSize] = useState(piece.size ?? sizes[0] ?? '');

  /**
   * Follow whichever piece the form was opened from. The provider hands over a
   * fresh object each time, so this runs on every open and the pills arrive
   * showing the size the visitor was already looking at.
   */
  useEffect(() => {
    setSize(piece.size ?? piece.sizes?.[0] ?? '');
  }, [piece]);

  const configured = isWhatsAppConfigured();

  function update(key: keyof typeof EMPTY, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    const nextErrors = validate(fields);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    // Never clear a valid enquiry we cannot actually send — that would discard
    // the visitor's message silently. The warning below the fields explains why.
    if (!configured) return;

    window.open(
      buildWhatsAppUrl({
        ...fields,
        subject: piece.subject,
        ...(size.length > 0 ? { size } : {}),
      }),
      '_blank',
      'noopener,noreferrer',
    );

    setFields(EMPTY);
    closeEnquiry();
  };

  return (
    <Modal open={open} onOpenChange={setOpen} title="Enquire about a hoop">
      <div className="mb-5 flex items-start justify-between gap-5">
        <div>
          <Eyebrow className="mb-[10px] text-[10px] tracking-[.28em]">Enquiry</Eyebrow>
          <h2 className="m-0 font-display text-[30px] leading-[1.08] font-light">
            Tell me what you&rsquo;d like stitched
          </h2>
        </div>
        <ModalClose className="cursor-pointer px-2 py-[2px] text-[24px] leading-none text-ink transition-colors hover:text-accent">
          <span aria-hidden="true">×</span>
        </ModalClose>
      </div>

      <p className="mb-5 rounded-xl bg-soft px-4 py-3 text-[13px]">
        Piece: <strong className="font-medium">{piece.subject}</strong>
      </p>

      {/* The same pills as the piece page, so the size can still be changed
          here — the enquiry carries whichever one is lit when it is sent. */}
      {sizes.length > 0 ? (
        <div className="mb-5 grid gap-[10px]">
          <div className="text-[10px] tracking-[.2em] text-ink-label uppercase">{SIZE_LABEL}</div>
          <OptionGroup
            label={SIZE_LABEL}
            options={sizes}
            value={size}
            onValueChange={setSize}
            density={isMobile ? 'mobile' : 'desktop'}
          />
        </div>
      ) : null}

      <form onSubmit={handleSubmit} noValidate className="grid gap-3">
        <Input
          label="Your name"
          placeholder="Your name"
          autoComplete="name"
          value={fields.name}
          error={errors.name}
          onChange={(e) => {
            update('name', e.target.value);
          }}
        />
        <Input
          label="Mobile or email"
          placeholder="Mobile or email"
          autoComplete="tel"
          value={fields.contact}
          error={errors.contact}
          onChange={(e) => {
            update('contact', e.target.value);
          }}
        />
        <Input
          label="Occasion and date needed"
          placeholder="Occasion & date needed"
          value={fields.occasion}
          error={errors.occasion}
          onChange={(e) => {
            update('occasion', e.target.value);
          }}
        />
        <Textarea
          label="Details"
          placeholder="Names, dates, colours, anything you'd like on the hoop…"
          rows={3}
          value={fields.message}
          onChange={(e) => {
            update('message', e.target.value);
          }}
        />

        {configured ? null : (
          <p role="status" className="px-1 text-[12px] text-ink-label">
            The WhatsApp number has not been set yet — see{' '}
            <code className="font-mono">src/constants/site.ts</code>.
          </p>
        )}

        <Button
          type="submit"
          variant="accent"
          density={isMobile ? 'mobile' : 'desktop'}
          size={isMobile ? 'wide' : 'default'}
          fullWidth
          className="tracking-[.18em]"
        >
          Send enquiry
        </Button>

        <p className="m-0 text-center text-[12px] text-ink-label">I usually reply within a day.</p>
      </form>
    </Modal>
  );
}
