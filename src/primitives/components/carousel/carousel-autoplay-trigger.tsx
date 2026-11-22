import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useCarouselContext } from './use-carousel-context';

export type CarouselAutoplayTriggerBaseProps = PolymorphicProps<'button'>;
export type CarouselAutoplayTriggerProps = Assign<
  HTMLProps<'button'>,
  CarouselAutoplayTriggerBaseProps
>;

/** Render the Carousel autoplay trigger. */
export const CarouselAutoplayTrigger = (props: CarouselAutoplayTriggerProps) => {
  const api = useCarouselContext();
  const mergedProps = mergeProps(() => api().getAutoplayTriggerProps(), props);

  return <primitive.button {...mergedProps} />;
};
