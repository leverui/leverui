import type { Assign } from '../../types';
import type { ChannelProps } from '@zag-js/color-picker';
import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { ColorPickerChannelPropsProvider } from './use-color-picker-channel-props-context';
import { useColorPickerContext } from './use-color-picker-context';
import { useColorPickerFormatPropsContext } from './use-color-picker-format-context';

export type ColorPickerChannelSliderBaseProps = ChannelProps & PolymorphicProps<'div'>;
export type ColorPickerChannelSliderProps = Assign<
  HTMLProps<'div'>,
  ColorPickerChannelSliderBaseProps
>;

/** Render the ColorPicker channel slider. */
export const ColorPickerChannelSlider = (props: ColorPickerChannelSliderProps) => {
  const [channelProps, localProps] = createSplitProps<ChannelProps>()(props, [
    'channel',
    'orientation',
  ]);

  const api = useColorPickerContext();

  const formatProps = useColorPickerFormatPropsContext();
  const channelSliderProps = mergeProps(channelProps, formatProps);

  const mergedProps = mergeProps(() => api().getChannelSliderProps(channelSliderProps), localProps);

  return (
    <ColorPickerChannelPropsProvider value={channelProps}>
      <primitive.div {...mergedProps} />
    </ColorPickerChannelPropsProvider>
  );
};
