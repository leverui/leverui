import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useSliderContext } from './use-slider-context';
import { useSliderThumbPropsContext } from './use-slider-thumb-props-context';

export type SliderDraggingIndicatorBaseProps = PolymorphicProps<'span'>;
export type SliderDraggingIndicatorProps = Assign<
  HTMLProps<'span'>,
  SliderDraggingIndicatorBaseProps
>;

/** Render the Slider dragging indicator. */
export const SliderDraggingIndicator = (props: SliderDraggingIndicatorProps) => {
  const slider = useSliderContext();
  const thumbProps = useSliderThumbPropsContext();
  const mergedProps = mergeProps(() => slider().getDraggingIndicatorProps(thumbProps), props);

  return (
    <primitive.span {...mergedProps}>
      {props.children || slider().getThumbValue(thumbProps.index)}
    </primitive.span>
  );
};
