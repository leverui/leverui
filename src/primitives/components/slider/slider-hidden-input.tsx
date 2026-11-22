import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useSliderContext } from './use-slider-context';
import { useSliderThumbPropsContext } from './use-slider-thumb-props-context';

export type SliderHiddenInputBaseProps = PolymorphicProps<'input'>;
export type SliderHiddenInputProps = Assign<HTMLProps<'input'>, SliderHiddenInputBaseProps>;

/** Render the Slider hidden input. */
export const SliderHiddenInput = (props: SliderHiddenInputProps) => {
  const slider = useSliderContext();
  const thumbProps = useSliderThumbPropsContext();
  const mergedProps = mergeProps(slider().getHiddenInputProps(thumbProps), props);

  return <primitive.input {...mergedProps} />;
};
