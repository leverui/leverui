import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { For } from 'solid-js';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useColorPickerContext } from './use-color-picker-context';

export type ColorPickerFormatSelectBaseProps = PolymorphicProps<'select'>;
export type ColorPickerFormatSelectProps = Assign<
  HTMLProps<'select'>,
  ColorPickerFormatSelectBaseProps
>;

/** Render the ColorPicker format select. */
export const ColorPickerFormatSelect = (props: ColorPickerFormatSelectProps) => {
  const api = useColorPickerContext();
  const mergedProps = mergeProps(() => api().getFormatSelectProps(), props);

  return (
    <primitive.select {...mergedProps}>
      <For keyed={false} each={['rgba', 'hsla', 'hsba']}>
        {(format) => <primitive.option value={format()}>{format()}</primitive.option>}
      </For>
    </primitive.select>
  );
};
