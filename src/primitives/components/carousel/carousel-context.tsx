import { type JSX } from '@solidjs/web';
import { type UseCarouselContext, useCarouselContext } from './use-carousel-context';

export interface CarouselContextProps {
  children: (context: UseCarouselContext) => JSX.Element;
}

/** Render the Carousel context context through a function child. */
export const CarouselContext = (props: CarouselContextProps) =>
  props.children(useCarouselContext());
