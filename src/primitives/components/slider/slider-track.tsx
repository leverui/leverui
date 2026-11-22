import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useSliderContext } from './use-slider-context';

export type SliderTrackBaseProps = PolymorphicProps<'div'>;
export type SliderTrackProps = Assign<HTMLProps<'div'>, SliderTrackBaseProps>;

/** Render the Slider track. */
export const SliderTrack = (props: SliderTrackProps) => {
  const api = useSliderContext();
  const mergedProps = mergeProps(() => api().getTrackProps(), props);

  return <primitive.div {...mergedProps} />;
};
