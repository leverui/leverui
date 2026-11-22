import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useColorPickerContext } from './use-color-picker-context';

export type ColorPickerControlBaseProps = PolymorphicProps<'div'>;
export type ColorPickerControlProps = Assign<HTMLProps<'div'>, ColorPickerControlBaseProps>;

/** Render the ColorPicker control. */
export const ColorPickerControl = (props: ColorPickerControlProps) => {
  const api = useColorPickerContext();
  const mergedProps = mergeProps(() => api().getControlProps(), props);

  return <primitive.div {...mergedProps} />;
};
