import type { Assign } from '../../types';
import type { ColorFormat } from '@zag-js/color-picker';
import { mergeProps } from '../../utils/merge-part-props';
import { Show } from 'solid-js';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { colorPickerAnatomy } from './color-picker.anatomy';
import { useColorPickerContext } from './use-color-picker-context';
import { ColorPickerFormatPropsProvider } from './use-color-picker-format-context';

interface FormatOptions {
  format: ColorFormat;
}

export type ColorPickerViewBaseProps = FormatOptions & PolymorphicProps<'div'>;
export type ColorPickerViewProps = Assign<HTMLProps<'div'>, ColorPickerViewBaseProps>;

/** Render the ColorPicker view. */
export const ColorPickerView = (props: ColorPickerViewProps) => {
  const api = useColorPickerContext();
  const [formatProps, localProps] = createSplitProps<FormatOptions>()(props, ['format']);
  const mergedProps = mergeProps(() => colorPickerAnatomy.build().view.attrs, localProps);

  return (
    <ColorPickerFormatPropsProvider value={formatProps}>
      <Show when={api().format === props.format}>
        <primitive.div data-format={props.format} {...mergedProps} />
      </Show>
    </ColorPickerFormatPropsProvider>
  );
};
