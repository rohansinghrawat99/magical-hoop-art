import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { SearchField } from '@/components/ui/search-field';

describe('SearchField', () => {
  it('is labelled even though the design shows only a placeholder', () => {
    // Without a generated id fallback the <label for> pointed at nothing and
    // the accessible name was lost entirely.
    render(
      <SearchField
        label="Search this collection"
        placeholder="Search…"
        value=""
        onValueChange={vi.fn()}
      />,
    );

    const input = screen.getByLabelText('Search this collection');
    expect(input).toBeInTheDocument();
    expect(input.id).not.toBe('');
  });

  it('gives two fields on one page distinct ids', () => {
    render(
      <>
        <SearchField label="First" value="" onValueChange={vi.fn()} />
        <SearchField label="Second" value="" onValueChange={vi.fn()} />
      </>,
    );

    expect(screen.getByLabelText('First').id).not.toBe(screen.getByLabelText('Second').id);
  });

  it('honours an explicit id', () => {
    render(<SearchField id="chosen" label="Search" value="" onValueChange={vi.fn()} />);
    expect(screen.getByLabelText('Search').id).toBe('chosen');
  });

  it('shows the clear affordance only when there is text', async () => {
    const onValueChange = vi.fn();
    const { rerender } = render(
      <SearchField label="Search" clearable value="" onValueChange={onValueChange} />,
    );
    expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument();

    rerender(<SearchField label="Search" clearable value="doll" onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Clear search' }));
    expect(onValueChange).toHaveBeenCalledWith('');
  });

  it('reports what the visitor types', async () => {
    const onValueChange = vi.fn();
    render(<SearchField label="Search" value="" onValueChange={onValueChange} />);

    await userEvent.type(screen.getByLabelText('Search'), 'a');
    expect(onValueChange).toHaveBeenCalledWith('a');
  });
});
