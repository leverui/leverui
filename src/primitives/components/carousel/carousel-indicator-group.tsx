import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useCarouselContext } from './use-carousel-context';

export type CarouselIndicatorGroupBaseProps = PolymorphicProps<'div'>;
export type CarouselIndicatorGroupProps = Assign<HTMLProps<'div'>, CarouselIndicatorGroupBaseProps>;

/** Render the Carousel indicator group. */
export const CarouselIndicatorGroup = (props: CarouselIndicatorGroupProps) => {
  const api = useCarouselContext();
  const mergedProps = mergeProps(() => api().getIndicatorGroupProps(), props);

  return <primitive.div {...mergedProps} />;
};
