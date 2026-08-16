import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Input, Textarea } from '@/components/ui/field';

describe('Input', () => {
  it('is labelled even though the design shows only a placeholder', () => {
    render(<Input label="Your name" placeholder="Your name" />);
    expect(screen.getByLabelText('Your name')).toBeInTheDocument();
  });

  it('uses a 16px font so iOS Safari does not zoom on focus', () => {
    render(<Input label="Your name" />);
    expect(screen.getByLabelText('Your name').className).toContain('text-[16px]');
  });

  it('marks itself invalid and announces the error when one is set', () => {
    render(<Input label="Your name" error="Please tell me your name." />);

    const input = screen.getByLabelText('Your name');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('Please tell me your name.');
    expect(input).toHaveAccessibleDescription('Please tell me your name.');
  });

  it('is not marked invalid when there is no error', () => {
    render(<Input label="Your name" />);
    expect(screen.getByLabelText('Your name')).toHaveAttribute('aria-invalid', 'false');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});

describe('Textarea', () => {
  it('is labelled and accepts rows', () => {
    render(<Textarea label="Details" rows={3} />);
    expect(screen.getByLabelText('Details')).toHaveAttribute('rows', '3');
  });
});
