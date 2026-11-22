import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useCarouselContext } from './use-carousel-context';

export type CarouselPreviousTriggerBaseProps = PolymorphicProps<'button'>;
export type CarouselPreviousTriggerProps = Assign<
  HTMLProps<'button'>,
  CarouselPreviousTriggerBaseProps
>;

/** Render the Carousel previous trigger. */
export const CarouselPreviousTrigger = (props: CarouselPreviousTriggerProps) => {
  const api = useCarouselContext();
  const mergedProps = mergeProps(() => api().getPreviousTriggerProps(), props);

  return <primitive.button {...mergedProps} />;
};
