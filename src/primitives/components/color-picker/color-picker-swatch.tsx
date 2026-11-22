import type { Assign } from '../../types';
import type { SwatchProps } from '@zag-js/color-picker';
import { mergeProps } from '../../utils/merge-part-props';
import { createMemo } from 'solid-js';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useColorPickerContext } from './use-color-picker-context';
import { ColorPickerSwatchPropsProvider } from './use-color-picker-swatch-props-context';

export type ColorPickerSwatchBaseProps = SwatchProps & PolymorphicProps<'div'>;
export type ColorPickerSwatchProps = Assign<HTMLProps<'div'>, ColorPickerSwatchBaseProps>;

/** Render the ColorPicker swatch. */
export const ColorPickerSwatch = (props: ColorPickerSwatchProps) => {
  const [itemProps, localProps] = createSplitProps<SwatchProps>()(props, ['respectAlpha', 'value']);
  const api = useColorPickerContext();
  const swatchProps = createMemo(() => ({
    respectAlpha: itemProps.respectAlpha,
    value: itemProps.value,
  }));
  const mergedProps = mergeProps(() => api().getSwatchProps(swatchProps()), localProps);

  return (
    <ColorPickerSwatchPropsProvider value={swatchProps}>
      <primitive.div {...mergedProps} />
    </ColorPickerSwatchPropsProvider>
  );
};
