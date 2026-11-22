import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useSliderContext } from './use-slider-context';

export type SliderControlBaseProps = PolymorphicProps<'div'>;
export type SliderControlProps = Assign<HTMLProps<'div'>, SliderControlBaseProps>;

/** Render the Slider control. */
export const SliderControl = (props: SliderControlProps) => {
  const api = useSliderContext();
  const mergedProps = mergeProps(() => api().getControlProps(), props);

  return <primitive.div {...mergedProps} />;
};
