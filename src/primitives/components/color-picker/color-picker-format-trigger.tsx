import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useColorPickerContext } from './use-color-picker-context';

export type ColorPickerFormatTriggerBaseProps = PolymorphicProps<'button'>;
export type ColorPickerFormatTriggerProps = Assign<
  HTMLProps<'button'>,
  ColorPickerFormatTriggerBaseProps
>;

/** Render the ColorPicker format trigger. */
export const ColorPickerFormatTrigger = (props: ColorPickerFormatTriggerProps) => {
  const api = useColorPickerContext();
  const mergedProps = mergeProps(() => api().getFormatTriggerProps(), props);

  return <primitive.button {...mergedProps} />;
};
