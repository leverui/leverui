import { Carousel as PrimitiveCarousel } from '../primitives/components/carousel';

/** Match each styled Carousel slot to the primitive's native element. */
export const carouselPartTags = {
  itemGroup: 'div',
  item: 'div',
  control: 'div',
  prevTrigger: 'button',
  nextTrigger: 'button',
  autoplayTrigger: 'button',
  indicatorGroup: 'div',
  indicator: 'button',
} as const;

export type CarouselPartSlot = keyof typeof carouselPartTags;

/** Keep the primitive behavior behind the matching Lever UI part name. */
export const carouselPartComponents = {
  itemGroup: PrimitiveCarousel.ItemGroup,
  item: PrimitiveCarousel.Item,
  control: PrimitiveCarousel.Control,
  prevTrigger: PrimitiveCarousel.PreviousTrigger,
  nextTrigger: PrimitiveCarousel.NextTrigger,
  autoplayTrigger: PrimitiveCarousel.AutoplayTrigger,
  indicatorGroup: PrimitiveCarousel.IndicatorGroup,
  indicator: PrimitiveCarousel.Indicator,
} as const;
