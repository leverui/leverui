import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useColorPickerChannelPropsContext } from './use-color-picker-channel-props-context';
import { useColorPickerContext } from './use-color-picker-context';
import { useColorPickerFormatPropsContext } from './use-color-picker-format-context';

export type ColorPickerChannelSliderTrackBaseProps = PolymorphicProps<'div'>;
export type ColorPickerChannelSliderTrackProps = Assign<
  HTMLProps<'div'>,
  ColorPickerChannelSliderTrackBaseProps
>;

/** Render the ColorPicker channel slider track. */
export const ColorPickerChannelSliderTrack = (props: ColorPickerChannelSliderTrackProps) => {
  const api = useColorPickerContext();

  const formatProps = useColorPickerFormatPropsContext();
  const channelProps = useColorPickerChannelPropsContext();
  const channelSliderProps = mergeProps(channelProps, formatProps);

  const mergedProps = mergeProps(() => api().getChannelSliderTrackProps(channelSliderProps), props);

  return <primitive.div {...mergedProps} />;
};
