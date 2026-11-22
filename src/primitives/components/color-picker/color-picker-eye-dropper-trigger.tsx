import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useColorPickerContext } from './use-color-picker-context';

export type ColorPickerEyeDropperTriggerBaseProps = PolymorphicProps<'button'>;
export type ColorPickerEyeDropperTriggerProps = Assign<
  HTMLProps<'button'>,
  ColorPickerEyeDropperTriggerBaseProps
>;

/** Render the ColorPicker eye dropper trigger. */
export const ColorPickerEyeDropperTrigger = (props: ColorPickerEyeDropperTriggerProps) => {
  const api = useColorPickerContext();
  const mergedProps = mergeProps(() => api().getEyeDropperTriggerProps(), props);

  return <primitive.button {...mergedProps} />;
};
