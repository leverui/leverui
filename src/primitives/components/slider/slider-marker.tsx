import type { Assign } from '../../types';
import type { MarkerProps, MarkerState } from '@zag-js/slider';
import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useSliderContext } from './use-slider-context';

export type SliderMarkerState = MarkerState;

export type SliderMarkerBaseProps = MarkerProps & PolymorphicProps<'span', SliderMarkerState>;
export type SliderMarkerProps = Assign<HTMLProps<'span'>, SliderMarkerBaseProps>;

/** Render the Slider marker. */
export const SliderMarker = (props: SliderMarkerProps) => {
  const [markerProps, localProps] = createSplitProps<MarkerProps>()(props, ['value']);
  const api = useSliderContext();
  const mergedProps = mergeProps(() => api().getMarkerProps(markerProps), localProps);

  return <primitive.span {...mergedProps} state={api().getMarkerState(markerProps)} />;
};
