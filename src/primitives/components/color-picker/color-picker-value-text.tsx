import type { Assign } from '../../types';
import type { ColorStringFormat } from '@zag-js/color-utils';
import { mergeProps } from '../../utils/merge-part-props';
import { createMemo } from 'solid-js';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useColorPickerContext } from './use-color-picker-context';

interface FormatProps {
  format?: ColorStringFormat;
}

export type ColorPickerValueTextBaseProps = PolymorphicProps<'span'> & FormatProps;
export type ColorPickerValueTextProps = Assign<HTMLProps<'span'>, ColorPickerValueTextBaseProps>;

/** Render the ColorPicker value text. */
export const ColorPickerValueText = (props: ColorPickerValueTextProps) => {
  const colorPicker = useColorPickerContext();
  const [formatProps, localProps] = createSplitProps<FormatProps>()(props, ['format']);
  const mergedProps = mergeProps(() => colorPicker().getValueTextProps(), localProps);
  const valueAsString = createMemo(() =>
    formatProps.format
      ? colorPicker().value.toString(formatProps.format)
      : colorPicker().valueAsString,
  );

  return <primitive.span {...mergedProps}>{props.children || valueAsString()}</primitive.span>;
};
