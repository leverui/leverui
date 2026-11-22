import { type JSX } from '@solidjs/web';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import { CarouselChevronLeftIcon, CarouselChevronRightIcon } from './carousel-icons';
import { renderCarouselPart } from './carousel-part';
import type {
  CarouselAutoplayTriggerProps,
  CarouselControlProps,
  CarouselIndicatorGroupProps,
  CarouselIndicatorProps,
  CarouselItemGroupProps,
  CarouselItemProps,
  CarouselNextTriggerProps,
  CarouselPrevTriggerProps,
} from './carousel-part-props';

/** Render the primitive managed slide track. */
export function CarouselItemGroup<As extends PrimitiveNativeTag = 'div'>(
  props: CarouselItemGroupProps<As>,
): JSX.Element {
  return renderCarouselPart('itemGroup', props);
}

/** Render one indexed Carousel slide. */
export function CarouselItem<As extends PrimitiveNativeTag = 'div'>(
  props: CarouselItemProps<As>,
): JSX.Element {
  return renderCarouselPart('item', props);
}

/** Group navigation controls near the track. */
export function CarouselControl<As extends PrimitiveNativeTag = 'div'>(
  props: CarouselControlProps<As>,
): JSX.Element {
  return renderCarouselPart('control', props);
}

/** Move to the preceding page with the primitive's disabled boundary state. */
export function CarouselPrevTrigger<As extends PrimitiveNativeTag = 'button'>(
  props: CarouselPrevTriggerProps<As>,
): JSX.Element {
  return renderCarouselPart(
    'prevTrigger',
    props,
    /** Supply the default chevron unless the caller owns its content. */
    () => <CarouselChevronLeftIcon />,
  );
}

/** Move to the following page with the primitive's disabled boundary state. */
export function CarouselNextTrigger<As extends PrimitiveNativeTag = 'button'>(
  props: CarouselNextTriggerProps<As>,
): JSX.Element {
  return renderCarouselPart(
    'nextTrigger',
    props,
    /** Supply the default chevron unless the caller owns its content. */
    () => <CarouselChevronRightIcon />,
  );
}

/** Toggle the Carousel machine's autoplay state. */
export function CarouselAutoplayTrigger<As extends PrimitiveNativeTag = 'button'>(
  props: CarouselAutoplayTriggerProps<As>,
): JSX.Element {
  return renderCarouselPart('autoplayTrigger', props);
}

/** Group page indicators with the primitive's navigation semantics. */
export function CarouselIndicatorGroup<As extends PrimitiveNativeTag = 'div'>(
  props: CarouselIndicatorGroupProps<As>,
): JSX.Element {
  return renderCarouselPart('indicatorGroup', props);
}

/** Jump to an indexed Carousel page. */
export function CarouselIndicator<As extends PrimitiveNativeTag = 'button'>(
  props: CarouselIndicatorProps<As>,
): JSX.Element {
  return renderCarouselPart('indicator', props);
}
