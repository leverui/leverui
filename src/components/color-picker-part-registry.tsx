import { ColorPicker as PrimitiveColorPicker } from '../primitives/components/color-picker';
import { primitive, type PolymorphicProps } from '../primitives/components/factory';
import { type JSX } from '@solidjs/web';

/** Render the additional styled text slot as a native span. */
function ChannelTextElement(
  props: JSX.HTMLAttributes<HTMLSpanElement> & PolymorphicProps<'span'>,
): JSX.Element {
  return <primitive.span {...props} />;
}

/** Bind each public part to its primitive behavior or native text element. */
export const colorPickerPartComponents = {
  area: PrimitiveColorPicker.Area,
  areaBackground: PrimitiveColorPicker.AreaBackground,
  areaThumb: PrimitiveColorPicker.AreaThumb,
  channelInput: PrimitiveColorPicker.ChannelInput,
  channelSlider: PrimitiveColorPicker.ChannelSlider,
  channelSliderLabel: PrimitiveColorPicker.ChannelSliderLabel,
  channelSliderThumb: PrimitiveColorPicker.ChannelSliderThumb,
  channelSliderTrack: PrimitiveColorPicker.ChannelSliderTrack,
  channelSliderValueText: PrimitiveColorPicker.ChannelSliderValueText,
  channelText: ChannelTextElement,
  content: PrimitiveColorPicker.Content,
  control: PrimitiveColorPicker.Control,
  eyeDropperTrigger: PrimitiveColorPicker.EyeDropperTrigger,
  formatSelect: PrimitiveColorPicker.FormatSelect,
  formatTrigger: PrimitiveColorPicker.FormatTrigger,
  label: PrimitiveColorPicker.Label,
  positioner: PrimitiveColorPicker.Positioner,
  swatch: PrimitiveColorPicker.Swatch,
  swatchGroup: PrimitiveColorPicker.SwatchGroup,
  swatchIndicator: PrimitiveColorPicker.SwatchIndicator,
  swatchTrigger: PrimitiveColorPicker.SwatchTrigger,
  transparencyGrid: PrimitiveColorPicker.TransparencyGrid,
  trigger: PrimitiveColorPicker.Trigger,
  valueSwatch: PrimitiveColorPicker.ValueSwatch,
  valueText: PrimitiveColorPicker.ValueText,
  view: PrimitiveColorPicker.View,
} as const;

/** Match each primitive part's actual default native element. */
export const colorPickerPartTags = {
  area: 'div',
  areaBackground: 'div',
  areaThumb: 'div',
  channelInput: 'input',
  channelSlider: 'div',
  channelSliderLabel: 'label',
  channelSliderThumb: 'div',
  channelSliderTrack: 'div',
  channelSliderValueText: 'span',
  channelText: 'span',
  content: 'div',
  control: 'div',
  eyeDropperTrigger: 'button',
  formatSelect: 'select',
  formatTrigger: 'button',
  label: 'label',
  positioner: 'div',
  swatch: 'div',
  swatchGroup: 'div',
  swatchIndicator: 'div',
  swatchTrigger: 'button',
  transparencyGrid: 'div',
  trigger: 'button',
  valueSwatch: 'div',
  valueText: 'span',
  view: 'div',
} as const;

export type ColorPickerPartSlot = keyof typeof colorPickerPartComponents;
