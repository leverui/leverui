import type { Assign } from '../../types';
import type { IndicatorProps, IndicatorState } from '@zag-js/carousel';
import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useCarouselContext } from './use-carousel-context';

export type CarouselIndicatorState = IndicatorState;

export type CarouselIndicatorBaseProps = IndicatorProps &
  PolymorphicProps<'button', CarouselIndicatorState>;
export type CarouselIndicatorProps = Assign<HTMLProps<'button'>, CarouselIndicatorBaseProps>;

/** Render the Carousel indicator. */
export const CarouselIndicator = (props: CarouselIndicatorProps) => {
  const [indicatorProps, localProps] = createSplitProps<IndicatorProps>()(props, [
    'index',
    'readOnly',
  ]);
  const api = useCarouselContext();
  const mergedProps = mergeProps(() => api().getIndicatorProps(indicatorProps), localProps);

  return <primitive.button {...mergedProps} state={api().getIndicatorState(indicatorProps)} />;
};
