import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AppImage } from '@/components/ui/app-image';

describe('AppImage', () => {
  it('renders the fallback when no photo has been added yet', () => {
    render(<AppImage src={null} alt="Blue Lehenga Couple" fallback={<span>placeholder</span>} />);

    expect(screen.getByText('placeholder')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('renders the photo once one exists', () => {
    render(
      <AppImage src="/a.webp" alt="Blue Lehenga Couple" fallback={<span>placeholder</span>} />,
    );

    expect(screen.getByRole('img', { name: 'Blue Lehenga Couple' })).toHaveAttribute(
      'src',
      '/a.webp',
    );
    expect(screen.queryByText('placeholder')).not.toBeInTheDocument();
  });

  it('lazy-loads and decodes off the main thread', () => {
    render(<AppImage src="/a.webp" alt="Piece" fallback={null} />);

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('loading', 'lazy');
    expect(img).toHaveAttribute('decoding', 'async');
  });
});
