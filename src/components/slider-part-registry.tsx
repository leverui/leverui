import { Slider as PrimitiveSlider } from '../primitives/components/slider';
import { primitiveNativeParts } from './primitive-native-parts';

/** Bind each public Slider part to its native tag. */
export const sliderPartTags = {
  control: 'div',
  draggingIndicator: 'span',
  label: 'label',
  marker: 'span',
  markerGroup: 'div',
  markerIndicator: 'div',
  markerLabel: 'span',
  range: 'div',
  thumb: 'div',
  track: 'div',
  valueText: 'span',
} as const;

export type SliderPartSlot = keyof typeof sliderPartTags;

/** Keep machine-owned and presentation-only parts in one registry. */
export const sliderPartComponents = {
  control: PrimitiveSlider.Control,
  draggingIndicator: PrimitiveSlider.DraggingIndicator,
  label: PrimitiveSlider.Label,
  marker: PrimitiveSlider.Marker,
  markerGroup: PrimitiveSlider.MarkerGroup,
  markerIndicator: primitiveNativeParts.div,
  markerLabel: primitiveNativeParts.span,
  range: PrimitiveSlider.Range,
  thumb: PrimitiveSlider.Thumb,
  track: PrimitiveSlider.Track,
  valueText: PrimitiveSlider.ValueText,
} as const;
