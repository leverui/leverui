import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useCarouselContext } from './use-carousel-context';

export type CarouselItemGroupBaseProps = PolymorphicProps<'div'>;
export type CarouselItemGroupProps = Assign<HTMLProps<'div'>, CarouselItemGroupBaseProps>;

/** Render the Carousel item group. */
export const CarouselItemGroup = (props: CarouselItemGroupProps) => {
  const api = useCarouselContext();
  const mergedProps = mergeProps(() => api().getItemGroupProps(), props);
  return <primitive.div {...mergedProps} />;
};
