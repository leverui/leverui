import type { Assign } from '../../types';
import type { SwatchProps } from '@zag-js/color-picker';
import { mergeProps } from '../../utils/merge-part-props';
import { createMemo } from 'solid-js';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useColorPickerContext } from './use-color-picker-context';
import { ColorPickerSwatchPropsProvider } from './use-color-picker-swatch-props-context';

type ValueSwatchProps = Omit<SwatchProps, 'value'>;

export type ColorPickerValueSwatchBaseProps = ValueSwatchProps & PolymorphicProps<'div'>;
export type ColorPickerValueSwatchProps = Assign<HTMLProps<'div'>, ColorPickerValueSwatchBaseProps>;

/** Render the ColorPicker value swatch. */
export const ColorPickerValueSwatch = (props: ColorPickerValueSwatchProps) => {
  const [valueSwatchProps, localProps] = createSplitProps<ValueSwatchProps>()(props, [
    'respectAlpha',
  ]);
  const colorPicker = useColorPickerContext();
  const swatchProps = createMemo(() => ({
    respectAlpha: valueSwatchProps.respectAlpha,
    value: colorPicker().value,
  }));
  const mergedProps = mergeProps(() => colorPicker().getSwatchProps(swatchProps()), localProps);

  return (
    <ColorPickerSwatchPropsProvider value={swatchProps}>
      <primitive.div {...mergedProps} />
    </ColorPickerSwatchPropsProvider>
  );
};
