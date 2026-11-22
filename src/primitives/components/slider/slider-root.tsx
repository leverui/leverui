import type { RootState } from '@zag-js/slider';
import { mergeProps } from '../../utils/merge-part-props';
import type { Assign } from '../../types';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { type UseSliderProps, useSlider } from './use-slider';
import { SliderProvider } from './use-slider-context';

export type SliderRootState = RootState;

export type SliderRootBaseProps = UseSliderProps & PolymorphicProps<'div', SliderRootState>;
export type SliderRootProps = Assign<HTMLProps<'div'>, SliderRootBaseProps>;

/** Render the Slider root. */
export const SliderRoot = (props: SliderRootProps) => {
  const [useSliderProps, localProps] = createSplitProps<UseSliderProps>()(props, [
    'getAriaLabel',
    'getAriaLabelledBy',
    'defaultValue',
    'disabled',
    'form',
    'getAriaValueText',
    'id',
    'ids',
    'invalid',
    'largeStep',
    'max',
    'min',
    'minStepsBetweenThumbs',
    'name',
    'onFocusChange',
    'onValueChange',
    'onValueChangeEnd',
    'orientation',
    'origin',
    'readOnly',
    'step',
    'thumbAlignment',
    'thumbCollisionBehavior',
    'thumbSize',
    'value',
  ]);
  const api = useSlider(useSliderProps);
  const mergedProps = mergeProps(() => api().getRootProps(), localProps);

  return (
    <SliderProvider value={api}>
      <primitive.div {...mergedProps} state={api().getRootState()} />
    </SliderProvider>
  );
};
