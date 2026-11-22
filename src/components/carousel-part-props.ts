import type { Carousel as PrimitiveCarousel } from '../primitives/components/carousel';
import type {
  PrimitiveNativeElementProps,
  PrimitiveNativeTag,
} from './primitive-native-element-props';

type CarouselItemBehavior = Pick<PrimitiveCarousel.ItemBaseProps, 'index' | 'snapAlign'>;
type CarouselIndicatorBehavior = Pick<PrimitiveCarousel.IndicatorBaseProps, 'index' | 'readOnly'>;
type PartAppearance = { unstyled?: boolean | undefined };

export type CarouselItemGroupProps<As extends PrimitiveNativeTag = 'div'> =
  PrimitiveNativeElementProps<'div', PartAppearance, As>;
export type CarouselItemProps<As extends PrimitiveNativeTag = 'div'> = PrimitiveNativeElementProps<
  'div',
  CarouselItemBehavior & PartAppearance,
  As
>;
export type CarouselControlProps<As extends PrimitiveNativeTag = 'div'> =
  PrimitiveNativeElementProps<'div', PartAppearance, As>;
export type CarouselPrevTriggerProps<As extends PrimitiveNativeTag = 'button'> =
  PrimitiveNativeElementProps<'button', PartAppearance, As>;
export type CarouselNextTriggerProps<As extends PrimitiveNativeTag = 'button'> =
  PrimitiveNativeElementProps<'button', PartAppearance, As>;
export type CarouselAutoplayTriggerProps<As extends PrimitiveNativeTag = 'button'> =
  PrimitiveNativeElementProps<'button', PartAppearance, As>;
export type CarouselIndicatorGroupProps<As extends PrimitiveNativeTag = 'div'> =
  PrimitiveNativeElementProps<'div', PartAppearance, As>;
export type CarouselIndicatorProps<As extends PrimitiveNativeTag = 'button'> =
  PrimitiveNativeElementProps<'button', CarouselIndicatorBehavior & PartAppearance, As>;
