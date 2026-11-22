import type { Assign } from '../../types';
import type { ChannelInputProps } from '@zag-js/color-picker';
import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useFieldContext } from '../field/index';
import { useColorPickerContext } from './use-color-picker-context';

export type ColorPickerChannelInputBaseProps = ChannelInputProps & PolymorphicProps<'input'>;
export type ColorPickerChannelInputProps = Assign<
  HTMLProps<'input'>,
  ColorPickerChannelInputBaseProps
>;

/** Render the ColorPicker channel input. */
export const ColorPickerChannelInput = (props: ColorPickerChannelInputProps) => {
  const [channelProps, inputProps] = createSplitProps<ChannelInputProps>()(props, [
    'channel',
    'orientation',
  ]);
  const api = useColorPickerContext();
  const mergedProps = mergeProps(() => api().getChannelInputProps(channelProps), inputProps);
  const field = useFieldContext();

  return <primitive.input aria-describedby={field?.().ariaDescribedby} {...mergedProps} />;
};
