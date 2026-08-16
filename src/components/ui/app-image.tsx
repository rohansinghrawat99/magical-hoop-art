import { type ImgHTMLAttributes, type ReactNode } from 'react';

import { cn } from '@/lib/cn';

export interface AppImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> {
  /** Resolved URL, or `null` when the photo has not been added yet. */
  src: string | null;
  /** Required — describes the piece, not the fact that it is a photo. */
  alt: string;
  /** Rendered in place of the image when `src` is `null`. */
  fallback: ReactNode;
  /** Fill the parent rather than sit in the flow. Parent must be positioned. */
  fill?: boolean;
  /**
   * Load eagerly and at high priority. Set on above-the-fold imagery — the
   * hero — where lazy loading would delay Largest Contentful Paint.
   */
  priority?: boolean;
}

/**
 * An artwork photo with a built-in empty state.
 *
 * Photos are bundled and content-hashed by Vite (see src/lib/images.ts). When
 * one is missing the component renders `fallback` — the design's placeholder
 * hoop — so an incomplete catalogue degrades gracefully instead of showing a
 * broken image.
 */
export function AppImage({
  src,
  alt,
  fallback,
  fill = true,
  priority = false,
  className,
  ...rest
}: AppImageProps) {
  if (src === null) return <>{fallback}</>;

  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
      className={cn(fill && 'absolute inset-0 size-full object-cover', className)}
      {...rest}
    />
  );
}
