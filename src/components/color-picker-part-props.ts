import type {
  ColorPickerAreaProps as PrimitiveAreaProps,
  ColorPickerChannelInputProps as PrimitiveChannelInputProps,
  ColorPickerChannelSliderProps as PrimitiveChannelSliderProps,
  ColorPickerSwatchProps as PrimitiveSwatchProps,
  ColorPickerSwatchTriggerProps as PrimitiveSwatchTriggerProps,
  ColorPickerTransparencyGridProps as PrimitiveTransparencyGridProps,
  ColorPickerValueSwatchProps as PrimitiveValueSwatchProps,
  ColorPickerValueTextProps as PrimitiveValueTextProps,
  ColorPickerViewProps as PrimitiveViewProps,
} from '../primitives/components/color-picker';
import type { NativeHtmlAliases } from '../styled-system/native-html-aliases';
import type {
  PrimitiveNativeElementProps,
  PrimitiveNativeTag,
} from './primitive-native-element-props';
import type { colorPickerPartTags, ColorPickerPartSlot } from './color-picker-part-registry';

/** Preserve the primitive's machine-specific props on their owning public part. */
export type ColorPickerPartBehavior<Slot extends ColorPickerPartSlot> = Slot extends 'area'
  ? Pick<PrimitiveAreaProps, 'xChannel' | 'yChannel'>
  : Slot extends 'channelInput'
    ? Pick<PrimitiveChannelInputProps, 'channel' | 'orientation'>
    : Slot extends 'channelSlider'
      ? Pick<PrimitiveChannelSliderProps, 'channel' | 'orientation'>
      : Slot extends 'swatch'
        ? Pick<PrimitiveSwatchProps, 'value' | 'respectAlpha'>
        : Slot extends 'swatchTrigger'
          ? Pick<PrimitiveSwatchTriggerProps, 'value' | 'disabled'>
          : Slot extends 'transparencyGrid'
            ? Pick<PrimitiveTransparencyGridProps, 'size'>
            : Slot extends 'valueSwatch'
              ? Pick<PrimitiveValueSwatchProps, 'respectAlpha'>
              : Slot extends 'valueText'
                ? Pick<PrimitiveValueTextProps, 'format'>
                : Slot extends 'view'
                  ? Pick<PrimitiveViewProps, 'format'>
                  : object;

export type ColorPickerPartProps<
  Slot extends ColorPickerPartSlot,
  As extends PrimitiveNativeTag = (typeof colorPickerPartTags)[Slot],
> = PrimitiveNativeElementProps<
  (typeof colorPickerPartTags)[Slot],
  ColorPickerPartBehavior<Slot> & NativeHtmlAliases & { unstyled?: boolean },
  As
>;

export type ColorPickerAreaProps<As extends PrimitiveNativeTag = 'div'> = ColorPickerPartProps<
  'area',
  As
>;
export type ColorPickerAreaBackgroundProps<As extends PrimitiveNativeTag = 'div'> =
  ColorPickerPartProps<'areaBackground', As>;
export type ColorPickerAreaThumbProps<As extends PrimitiveNativeTag = 'div'> = ColorPickerPartProps<
  'areaThumb',
  As
>;
export type ColorPickerChannelInputProps<As extends PrimitiveNativeTag = 'input'> =
  ColorPickerPartProps<'channelInput', As>;
export type ColorPickerChannelSliderProps<As extends PrimitiveNativeTag = 'div'> =
  ColorPickerPartProps<'channelSlider', As>;
export type ColorPickerChannelSliderLabelProps<As extends PrimitiveNativeTag = 'label'> =
  ColorPickerPartProps<'channelSliderLabel', As>;
export type ColorPickerChannelSliderThumbProps<As extends PrimitiveNativeTag = 'div'> =
  ColorPickerPartProps<'channelSliderThumb', As>;
export type ColorPickerChannelSliderTrackProps<As extends PrimitiveNativeTag = 'div'> =
  ColorPickerPartProps<'channelSliderTrack', As>;
export type ColorPickerChannelSliderValueTextProps<As extends PrimitiveNativeTag = 'span'> =
  ColorPickerPartProps<'channelSliderValueText', As>;
export type ColorPickerChannelTextProps<As extends PrimitiveNativeTag = 'span'> =
  ColorPickerPartProps<'channelText', As>;
export type ColorPickerContentProps<As extends PrimitiveNativeTag = 'div'> = ColorPickerPartProps<
  'content',
  As
>;
export type ColorPickerControlProps<As extends PrimitiveNativeTag = 'div'> = ColorPickerPartProps<
  'control',
  As
>;
export type ColorPickerFormatSelectProps<As extends PrimitiveNativeTag = 'select'> =
  ColorPickerPartProps<'formatSelect', As>;
export type ColorPickerFormatTriggerProps<As extends PrimitiveNativeTag = 'button'> =
  ColorPickerPartProps<'formatTrigger', As>;
export type ColorPickerLabelProps<As extends PrimitiveNativeTag = 'label'> = ColorPickerPartProps<
  'label',
  As
>;
export type ColorPickerPositionerProps<As extends PrimitiveNativeTag = 'div'> =
  ColorPickerPartProps<'positioner', As>;
export type ColorPickerSwatchProps<As extends PrimitiveNativeTag = 'div'> = ColorPickerPartProps<
  'swatch',
  As
>;
export type ColorPickerSwatchGroupProps<As extends PrimitiveNativeTag = 'div'> =
  ColorPickerPartProps<'swatchGroup', As>;
export type ColorPickerSwatchIndicatorProps<As extends PrimitiveNativeTag = 'div'> =
  ColorPickerPartProps<'swatchIndicator', As>;
export type ColorPickerSwatchTriggerProps<As extends PrimitiveNativeTag = 'button'> =
  ColorPickerPartProps<'swatchTrigger', As>;
export type ColorPickerTransparencyGridProps<As extends PrimitiveNativeTag = 'div'> =
  ColorPickerPartProps<'transparencyGrid', As>;
export type ColorPickerTriggerProps<As extends PrimitiveNativeTag = 'button'> =
  ColorPickerPartProps<'trigger', As>;
export type ColorPickerValueSwatchProps<As extends PrimitiveNativeTag = 'div'> =
  ColorPickerPartProps<'valueSwatch', As>;
export type ColorPickerValueTextProps<As extends PrimitiveNativeTag = 'span'> =
  ColorPickerPartProps<'valueText', As>;
export type ColorPickerViewProps<As extends PrimitiveNativeTag = 'div'> = ColorPickerPartProps<
  'view',
  As
>;
