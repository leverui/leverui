import type { SwatchTriggerProps, SwatchTriggerState } from '@zag-js/color-picker';
import { mergeProps } from '../../utils/merge-part-props';
import type { Assign } from '../../types';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useColorPickerContext } from './use-color-picker-context';

export type ColorPickerSwatchTriggerState = SwatchTriggerState;

export type ColorPickerSwatchTriggerBaseProps = SwatchTriggerProps &
  PolymorphicProps<'button', ColorPickerSwatchTriggerState>;
export type ColorPickerSwatchTriggerProps = Assign<
  HTMLProps<'button'>,
  ColorPickerSwatchTriggerBaseProps
>;

/** Render the ColorPicker swatch trigger. */
export const ColorPickerSwatchTrigger = (props: ColorPickerSwatchTriggerProps) => {
  const [triggerProps, localProps] = createSplitProps<SwatchTriggerProps>()(props, [
    'value',
    'disabled',
  ]);
  const api = useColorPickerContext();
  const mergedProps = mergeProps(() => api().getSwatchTriggerProps(triggerProps), localProps);

  return <primitive.button {...mergedProps} state={api().getSwatchTriggerState(triggerProps)} />;
};
