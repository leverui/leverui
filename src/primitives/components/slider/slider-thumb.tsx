import type { Assign } from '../../types';
import type { ThumbProps, ThumbState } from '@zag-js/slider';
import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useSliderContext } from './use-slider-context';
import { SliderThumbPropsProvider } from './use-slider-thumb-props-context';

export type SliderThumbState = ThumbState;

export type SliderThumbBaseProps = ThumbProps & PolymorphicProps<'div', SliderThumbState>;
export type SliderThumbProps = Assign<HTMLProps<'div'>, SliderThumbBaseProps>;

/** Render the Slider thumb. */
export const SliderThumb = (props: SliderThumbProps) => {
  const [thumbProps, localProps] = createSplitProps<ThumbProps>()(props, [
    'index',
    'name',
    'disabled',
  ]);
  const slider = useSliderContext();
  const mergedProps = mergeProps(() => slider().getThumbProps(thumbProps), localProps);

  return (
    <SliderThumbPropsProvider value={thumbProps}>
      <primitive.div {...mergedProps} state={slider().getThumbState(thumbProps)} />
    </SliderThumbPropsProvider>
  );
};
