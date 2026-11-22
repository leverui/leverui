import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useSliderContext } from './use-slider-context';

export type SliderRangeBaseProps = PolymorphicProps<'div'>;
export type SliderRangeProps = Assign<HTMLProps<'div'>, SliderRangeBaseProps>;

/** Render the Slider range. */
export const SliderRange = (props: SliderRangeProps) => {
  const api = useSliderContext();
  const mergedProps = mergeProps(() => api().getRangeProps(), props);

  return <primitive.div {...mergedProps} />;
};
