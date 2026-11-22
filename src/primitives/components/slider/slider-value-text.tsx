import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useSliderContext } from './use-slider-context';

export type SliderValueTextBaseProps = PolymorphicProps<'span'>;
export type SliderValueTextProps = Assign<HTMLProps<'span'>, SliderValueTextBaseProps>;

/** Render the Slider value text. */
export const SliderValueText = (props: SliderValueTextProps) => {
  const api = useSliderContext();
  const mergedProps = mergeProps(() => api().getValueTextProps(), props);

  return (
    <primitive.span {...mergedProps}>{props.children || api().value.join(',')}</primitive.span>
  );
};
