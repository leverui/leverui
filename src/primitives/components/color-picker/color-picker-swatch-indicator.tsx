import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useColorPickerContext } from './use-color-picker-context';
import { useColorPickerSwatchPropsContext } from './use-color-picker-swatch-props-context';

export type ColorPickerSwatchIndicatorBaseProps = PolymorphicProps<'div'>;
export type ColorPickerSwatchIndicatorProps = Assign<
  HTMLProps<'div'>,
  ColorPickerSwatchIndicatorBaseProps
>;

/** Render the ColorPicker swatch indicator. */
export const ColorPickerSwatchIndicator = (props: ColorPickerSwatchIndicatorProps) => {
  const api = useColorPickerContext();
  const swatchProps = useColorPickerSwatchPropsContext();
  const mergedProps = mergeProps(() => api().getSwatchIndicatorProps(swatchProps()), props);

  return <primitive.div {...mergedProps} />;
};
