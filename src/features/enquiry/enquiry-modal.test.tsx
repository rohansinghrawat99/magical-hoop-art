import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Button } from '@/components/ui';
import { EnquiryModal } from '@/features/enquiry/enquiry-modal';
import { useEnquiry } from '@/features/enquiry/use-enquiry';
import { renderWithProviders } from '@/test/render';
import { DESKTOP_WIDTH, setViewport } from '@/test/viewport';

const PIECE = {
  subject: 'Blue Lehenga Couple — Wedding',
  sizes: ['10 inch ring', '12 inch ring'],
  size: '12 inch ring',
};

/** `general` opens the form the way the header and footer buttons do. */
function Harness({ general = false }: { general?: boolean }) {
  const { openEnquiry } = useEnquiry();

  return (
    <>
      <Button
        onClick={() => {
          openEnquiry(general ? undefined : PIECE);
        }}
      >
        Enquire
      </Button>
      <EnquiryModal />
    </>
  );
}

/** Open the form and wait for it. */
async function openForm() {
  await userEvent.click(screen.getByRole('button', { name: 'Enquire' }));
  await screen.findByRole('dialog');
}

describe('EnquiryModal', () => {
  beforeEach(() => {
    setViewport(DESKTOP_WIDTH);
  });

  it('stays closed until asked', () => {
    renderWithProviders(<Harness />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens carrying the subject of the piece', async () => {
    renderWithProviders(<Harness />);

    await userEvent.click(screen.getByRole('button', { name: 'Enquire' }));

    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Blue Lehenga Couple — Wedding')).toBeInTheDocument();
  });

  it('closes on Escape and returns focus to the trigger', async () => {
    renderWithProviders(<Harness />);

    const trigger = screen.getByRole('button', { name: 'Enquire' });
    await userEvent.click(trigger);
    await screen.findByRole('dialog');

    await userEvent.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
    // Radix restores focus asynchronously, after the close transition.
    await waitFor(() => {
      expect(trigger).toHaveFocus();
    });
  });

  it('validates the required fields before submitting', async () => {
    renderWithProviders(<Harness />);

    await userEvent.click(screen.getByRole('button', { name: 'Enquire' }));
    await screen.findByRole('dialog');

    await userEvent.click(screen.getByRole('button', { name: 'Send enquiry' }));

    expect(await screen.findAllByRole('alert')).toHaveLength(3);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('clears a field error as soon as the visitor types', async () => {
    renderWithProviders(<Harness />);

    await userEvent.click(screen.getByRole('button', { name: 'Enquire' }));
    await screen.findByRole('dialog');
    await userEvent.click(screen.getByRole('button', { name: 'Send enquiry' }));

    expect(await screen.findAllByRole('alert')).toHaveLength(3);

    await userEvent.type(screen.getByLabelText('Your name'), 'Priya');

    await waitFor(() => {
      expect(screen.getAllByRole('alert')).toHaveLength(2);
    });
  });

  it('arrives showing the size the visitor was already looking at', async () => {
    renderWithProviders(<Harness />);
    await openForm();

    expect(screen.getByRole('radio', { name: '12 inch ring' })).toHaveAttribute('data-state', 'on');
    expect(screen.getByRole('radio', { name: '10 inch ring' })).toHaveAttribute(
      'data-state',
      'off',
    );
  });

  it('offers no size selector for a general enquiry', async () => {
    renderWithProviders(<Harness general />);
    await openForm();

    expect(screen.queryByRole('radio')).not.toBeInTheDocument();
    expect(screen.getByText('Custom hoop art')).toBeInTheDocument();
  });

  it('sends the size that is lit when the enquiry goes out', async () => {
    vi.stubEnv('VITE_WHATSAPP_NUMBER', '61412345678');
    const open = vi.fn();
    vi.stubGlobal('open', open);

    renderWithProviders(<Harness />);
    await openForm();

    // Change the mind that was made up on the piece page.
    await userEvent.click(screen.getByRole('radio', { name: '10 inch ring' }));

    await userEvent.type(screen.getByLabelText('Your name'), 'Priya');
    await userEvent.type(screen.getByLabelText('Mobile or email'), 'priya@example.com');
    await userEvent.type(screen.getByLabelText('Occasion and date needed'), 'Anniversary, Feb');
    await userEvent.click(screen.getByRole('button', { name: 'Send enquiry' }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    const text = decodeURIComponent(String(open.mock.calls[0]?.[0]));
    expect(text).toContain('Size: 10 inch ring');
    expect(text).not.toContain('12 inch ring');

    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('opens a prefilled WhatsApp conversation on a valid submission', async () => {
    vi.stubEnv('VITE_WHATSAPP_NUMBER', '61412345678');
    const open = vi.fn();
    vi.stubGlobal('open', open);

    renderWithProviders(<Harness />);

    await userEvent.click(screen.getByRole('button', { name: 'Enquire' }));
    await screen.findByRole('dialog');

    await userEvent.type(screen.getByLabelText('Your name'), 'Priya');
    await userEvent.type(screen.getByLabelText('Mobile or email'), 'priya@example.com');
    await userEvent.type(screen.getByLabelText('Occasion and date needed'), 'Anniversary, Feb');
    await userEvent.click(screen.getByRole('button', { name: 'Send enquiry' }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    expect(open).toHaveBeenCalledOnce();
    const url = String(open.mock.calls[0]?.[0]);
    expect(url).toContain('wa.me');
    expect(decodeURIComponent(url)).toContain('Priya');
    expect(decodeURIComponent(url)).toContain('Blue Lehenga Couple');

    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });
});
