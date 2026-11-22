import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useSliderContext } from './use-slider-context';

export type SliderLabelBaseProps = PolymorphicProps<'label'>;
export type SliderLabelProps = Assign<HTMLProps<'label'>, SliderLabelBaseProps>;

/** Render the Slider label. */
export const SliderLabel = (props: SliderLabelProps) => {
  const api = useSliderContext();
  const mergedProps = mergeProps(() => api().getLabelProps(), props);

  return <primitive.label {...mergedProps} />;
};
