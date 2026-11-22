import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useCarouselContext } from './use-carousel-context';

export type CarouselControlBaseProps = PolymorphicProps<'div'>;
export type CarouselControlProps = Assign<HTMLProps<'div'>, CarouselControlBaseProps>;

/** Render the Carousel control. */
export const CarouselControl = (props: CarouselControlProps) => {
  const api = useCarouselContext();
  const mergedProps = mergeProps(() => api().getControlProps(), props);

  return <primitive.div {...mergedProps} />;
};
