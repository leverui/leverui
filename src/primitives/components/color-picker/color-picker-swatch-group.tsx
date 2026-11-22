import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useColorPickerContext } from './use-color-picker-context';

export type ColorPickerSwatchGroupBaseProps = PolymorphicProps<'div'>;
export type ColorPickerSwatchGroupProps = Assign<HTMLProps<'div'>, ColorPickerSwatchGroupBaseProps>;

/** Render the ColorPicker swatch group. */
export const ColorPickerSwatchGroup = (props: ColorPickerSwatchGroupProps) => {
  const api = useColorPickerContext();
  const mergedProps = mergeProps(() => api().getSwatchGroupProps(), props);

  return <primitive.div {...mergedProps} />;
};
