import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useColorPickerChannelPropsContext } from './use-color-picker-channel-props-context';
import { useColorPickerContext } from './use-color-picker-context';

export type ColorPickerChannelSliderLabelBaseProps = PolymorphicProps<'label'>;
export type ColorPickerChannelSliderLabelProps = Assign<
  HTMLProps<'label'>,
  ColorPickerChannelSliderLabelBaseProps
>;

/** Render the ColorPicker channel slider label. */
export const ColorPickerChannelSliderLabel = (props: ColorPickerChannelSliderLabelProps) => {
  const colorPicker = useColorPickerContext();
  const channelProps = useColorPickerChannelPropsContext();
  const mergedProps = mergeProps(
    () => colorPicker().getChannelSliderLabelProps(channelProps),
    props,
  );

  return <primitive.label {...mergedProps} />;
};
