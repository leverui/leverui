import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useSliderContext } from './use-slider-context';

export type SliderMarkerGroupBaseProps = PolymorphicProps<'div'>;
export type SliderMarkerGroupProps = Assign<HTMLProps<'div'>, SliderMarkerGroupBaseProps>;

/** Render the Slider marker group. */
export const SliderMarkerGroup = (props: SliderMarkerGroupProps) => {
  const api = useSliderContext();
  const mergedProps = mergeProps(() => api().getMarkerGroupProps(), props);

  return <primitive.div {...mergedProps} />;
};
