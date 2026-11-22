import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useColorPickerContext } from './use-color-picker-context';

export type ColorPickerLabelBaseProps = PolymorphicProps<'label'>;
export type ColorPickerLabelProps = Assign<HTMLProps<'label'>, ColorPickerLabelBaseProps>;

/** Render the ColorPicker label. */
export const ColorPickerLabel = (props: ColorPickerLabelProps) => {
  const api = useColorPickerContext();
  const mergedProps = mergeProps(() => api().getLabelProps(), props);

  return <primitive.label {...mergedProps} />;
};
