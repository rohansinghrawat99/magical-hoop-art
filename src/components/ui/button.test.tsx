import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders a real button element, not a clickable div', () => {
    render(<Button>Enquire</Button>);
    expect(screen.getByRole('button', { name: 'Enquire' })).toBeInTheDocument();
  });

  it('defaults to type="button" so it never submits a form by accident', () => {
    render(<Button>Enquire</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('honours an explicit type', () => {
    render(<Button type="submit">Send</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('is reachable and activatable by keyboard', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Enquire</Button>);

    await userEvent.tab();
    expect(screen.getByRole('button')).toHaveFocus();

    await userEvent.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('applies the accent variant by default', () => {
    render(<Button>Enquire</Button>);
    expect(screen.getByRole('button').className).toContain('bg-accent');
  });

  it('switches padding with density', () => {
    const { rerender } = render(<Button density="desktop">Go</Button>);
    expect(screen.getByRole('button').className).toContain('px-[34px]');

    rerender(<Button density="mobile">Go</Button>);
    expect(screen.getByRole('button').className).toContain('p-[17px]');
  });

  it('lets a call site override classes without forking the component', () => {
    render(<Button className="bg-ink">Go</Button>);
    const cls = screen.getByRole('button').className;
    expect(cls).toContain('bg-ink');
    expect(cls).not.toContain('bg-accent');
  });

  it('uses a 100px radius, matching the design', () => {
    render(<Button>Go</Button>);
    expect(screen.getByRole('button').className).toContain('rounded-[100px]');
  });
});
