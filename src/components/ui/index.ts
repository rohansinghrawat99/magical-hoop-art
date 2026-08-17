/**
 * The shared primitive library.
 *
 * Feature code imports from here, never from a component file directly, so the
 * public surface of the design system is one list. Components in this folder
 * are content-agnostic: they take data through props and know nothing about
 * artworks or collections. See docs/ENGINEERING_STANDARDS.md.
 */
export { AppImage, type AppImageProps } from './app-image';
export { BackLink, type BackLinkProps } from './back-link';
export { Badge, type BadgeProps } from './badge';
export { Button, type ButtonProps } from './button';
export { buttonVariants } from './button-variants';
export { CardLink, type CardLinkProps } from './card';
export { Chip, type ChipProps } from './chip';
export { Container } from './container';
export { Eyebrow, type EyebrowProps } from './eyebrow';
export { Input, Textarea, type InputProps, type TextareaProps } from './field';
export { HoopFrame, type HoopFrameProps } from './hoop-frame';
export { HoopPlaceholder, type HoopPlaceholderProps } from './hoop-placeholder';
export { ImageCarousel, type ImageCarouselProps } from './image-carousel';
export {
  ExternalButton,
  RouteButton,
  type ExternalButtonProps,
  type RouteButtonProps,
} from './link-button';
export { PhotoFrame, type PhotoFrameProps } from './photo-frame';
export { Modal, ModalClose, SheetHandle, type ModalProps } from './modal';
export { OptionGroup, type OptionGroupProps } from './option-group';
export { SearchField, type SearchFieldProps } from './search-field';
export { SectionHeading, type SectionHeadingProps } from './section-heading';
export { SpecList, type SpecListProps } from './spec-list';
export { Stat, type StatProps } from './stat';
export { StepItem, type StepItemProps } from './step-item';
