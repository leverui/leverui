import type {
  SliderMarkerProps as PrimitiveMarkerProps,
  SliderThumbProps as PrimitiveThumbProps,
} from '../primitives/components/slider';
import { type JSX } from '@solidjs/web';
import type {
  PrimitiveNativeElementProps,
  PrimitiveNativeTag,
} from './primitive-native-element-props';
import type { NativeHtmlAliases } from '../styled-system/native-html-aliases';
import type { sliderPartTags, SliderPartSlot } from './slider-part-registry';

export type SliderPartBehavior<Slot extends SliderPartSlot> = Slot extends 'thumb'
  ? Pick<PrimitiveThumbProps, 'index' | 'name'>
  : Slot extends 'marker'
    ? Pick<PrimitiveMarkerProps, 'value'>
    : object;

export type SliderPartProps<
  Slot extends SliderPartSlot,
  As extends PrimitiveNativeTag = (typeof sliderPartTags)[Slot],
> = PrimitiveNativeElementProps<
  (typeof sliderPartTags)[Slot],
  SliderPartBehavior<Slot> & NativeHtmlAliases & { unstyled?: boolean },
  As
>;

export type SliderControlProps<As extends PrimitiveNativeTag = 'div'> = SliderPartProps<
  'control',
  As
>;
export type SliderDraggingIndicatorProps<As extends PrimitiveNativeTag = 'span'> = SliderPartProps<
  'draggingIndicator',
  As
>;
export type SliderLabelProps<As extends PrimitiveNativeTag = 'label'> = SliderPartProps<
  'label',
  As
>;
export type SliderMarkerProps<As extends PrimitiveNativeTag = 'span'> = SliderPartProps<
  'marker',
  As
>;
export type SliderMarkerGroupProps<As extends PrimitiveNativeTag = 'div'> = SliderPartProps<
  'markerGroup',
  As
>;
export type SliderMarkerIndicatorProps<As extends PrimitiveNativeTag = 'div'> = SliderPartProps<
  'markerIndicator',
  As
>;
export type SliderMarkerLabelProps<As extends PrimitiveNativeTag = 'span'> = SliderPartProps<
  'markerLabel',
  As
>;
export type SliderRangeProps<As extends PrimitiveNativeTag = 'div'> = SliderPartProps<'range', As>;
export type SliderThumbProps<As extends PrimitiveNativeTag = 'div'> = SliderPartProps<'thumb', As>;
export type SliderTrackProps<As extends PrimitiveNativeTag = 'div'> = SliderPartProps<'track', As>;
export type SliderValueTextProps<As extends PrimitiveNativeTag = 'span'> = SliderPartProps<
  'valueText',
  As
>;

type GeneratedPartProps<Props, Supplied extends PropertyKey> = Props extends unknown
  ? Omit<Props, Supplied | 'children'> & { children?: never }
  : never;

export type SliderThumbsProps<As extends PrimitiveNativeTag = 'div'> = GeneratedPartProps<
  SliderThumbProps<As>,
  'index'
>;

export type SliderMark = number | { value: number; label: JSX.Element };
export type SliderMarksProps<As extends PrimitiveNativeTag = 'div'> = GeneratedPartProps<
  SliderMarkerGroupProps<As>,
  never
> & { marks?: readonly SliderMark[] };
