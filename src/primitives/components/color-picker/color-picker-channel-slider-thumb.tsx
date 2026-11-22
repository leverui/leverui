import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useColorPickerChannelPropsContext } from './use-color-picker-channel-props-context';
import { useColorPickerContext } from './use-color-picker-context';
import { useColorPickerFormatPropsContext } from './use-color-picker-format-context';

export type ColorPickerChannelSliderThumbBaseProps = PolymorphicProps<'div'>;
export type ColorPickerChannelSliderThumbProps = Assign<
  HTMLProps<'div'>,
  ColorPickerChannelSliderThumbBaseProps
>;

/** Render the ColorPicker channel slider thumb. */
export const ColorPickerChannelSliderThumb = (props: ColorPickerChannelSliderThumbProps) => {
  const api = useColorPickerContext();

  const formatProps = useColorPickerFormatPropsContext();
  const channelProps = useColorPickerChannelPropsContext();
  const channelSliderProps = mergeProps(channelProps, formatProps);

  const mergedProps = mergeProps(() => api().getChannelSliderThumbProps(channelSliderProps), props);

  return <primitive.div {...mergedProps} />;
};
