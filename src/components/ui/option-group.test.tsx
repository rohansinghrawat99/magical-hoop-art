import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { OptionGroup } from '@/components/ui/option-group';

const SIZES = ['15 cm', '20 cm', '25 cm'] as const;

describe('OptionGroup', () => {
  it('exposes an accessible group name', () => {
    render(<OptionGroup label="Hoop size" options={SIZES} value="20 cm" onValueChange={vi.fn()} />);
    // Radix ToggleGroup type="single" exposes radiogroup semantics.
    expect(screen.getByRole('radiogroup', { name: 'Hoop size' })).toBeInTheDocument();
  });

  it('marks the selected option as pressed', () => {
    render(<OptionGroup label="Hoop size" options={SIZES} value="20 cm" onValueChange={vi.fn()} />);

    expect(screen.getByRole('radio', { name: '20 cm' })).toHaveAttribute('data-state', 'on');
    expect(screen.getByRole('radio', { name: '15 cm' })).toHaveAttribute('data-state', 'off');
  });

  it('reports a new selection', async () => {
    const onValueChange = vi.fn();
    render(
      <OptionGroup label="Hoop size" options={SIZES} value="20 cm" onValueChange={onValueChange} />,
    );

    await userEvent.click(screen.getByRole('radio', { name: '25 cm' }));
    expect(onValueChange).toHaveBeenCalledWith('25 cm');
  });

  it('cannot be emptied by clicking the selected option again', async () => {
    const onValueChange = vi.fn();
    render(
      <OptionGroup label="Hoop size" options={SIZES} value="20 cm" onValueChange={onValueChange} />,
    );

    await userEvent.click(screen.getByRole('radio', { name: '20 cm' }));
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
