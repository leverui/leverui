import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useFieldContext } from '../field/index';
import { useColorPickerContext } from './use-color-picker-context';

export type ColorPickerHiddenInputBaseProps = PolymorphicProps<'input'>;
export type ColorPickerHiddenInputProps = Assign<
  HTMLProps<'input'>,
  ColorPickerHiddenInputBaseProps
>;

/** Render the ColorPicker hidden input. */
export const ColorPickerHiddenInput = (props: ColorPickerHiddenInputProps) => {
  const colorPicker = useColorPickerContext();
  const mergedProps = mergeProps(() => colorPicker().getHiddenInputProps(), props);
  const field = useFieldContext();

  return <primitive.input aria-describedby={field?.().ariaDescribedby} {...mergedProps} />;
};
