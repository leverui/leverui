import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { useLocaleContext } from '../../providers/index';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useColorPickerChannelPropsContext } from './use-color-picker-channel-props-context';
import { useColorPickerContext } from './use-color-picker-context';

export type ColorPickerChannelSliderValueTextBaseProps = PolymorphicProps<'span'>;
export type ColorPickerChannelSliderValueTextProps = Assign<
  HTMLProps<'span'>,
  ColorPickerChannelSliderValueTextBaseProps
>;

/** Render the ColorPicker channel slider value text. */
export const ColorPickerChannelSliderValueText = (
  props: ColorPickerChannelSliderValueTextProps,
) => {
  const colorPicker = useColorPickerContext();
  const localeContext = useLocaleContext();
  const channelProps = useColorPickerChannelPropsContext();
  const mergedProps = mergeProps(
    () => colorPicker().getChannelSliderValueTextProps(channelProps),
    props,
  );

  return (
    <primitive.span {...mergedProps}>
      {props.children ||
        colorPicker().getChannelValueText(channelProps.channel, localeContext().locale)}
    </primitive.span>
  );
};
