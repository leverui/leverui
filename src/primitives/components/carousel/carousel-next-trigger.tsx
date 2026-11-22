import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useCarouselContext } from './use-carousel-context';

export type CarouselNextTriggerBaseProps = PolymorphicProps<'button'>;
export type CarouselNextTriggerProps = Assign<HTMLProps<'button'>, CarouselNextTriggerBaseProps>;

/** Render the Carousel next trigger. */
export const CarouselNextTrigger = (props: CarouselNextTriggerProps) => {
  const api = useCarouselContext();
  const mergedProps = mergeProps(() => api().getNextTriggerProps(), props);

  return <primitive.button {...mergedProps} />;
};
