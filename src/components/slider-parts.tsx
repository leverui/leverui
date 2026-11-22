import { type JSX } from '@solidjs/web';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import { renderSliderPart } from './slider-part';
import type {
  SliderControlProps,
  SliderDraggingIndicatorProps,
  SliderLabelProps,
  SliderRangeProps,
  SliderThumbProps,
  SliderTrackProps,
  SliderValueTextProps,
} from './slider-part-props';

/** Bind pointer movement to the Slider's control. */
export function SliderControl<As extends PrimitiveNativeTag = 'div'>(
  props: SliderControlProps<As>,
): JSX.Element {
  return renderSliderPart({ slot: 'control', props });
}

/** Show the active drag value from the Slider machine. */
export function SliderDraggingIndicator<As extends PrimitiveNativeTag = 'span'>(
  props: SliderDraggingIndicatorProps<As>,
): JSX.Element {
  return renderSliderPart({ slot: 'draggingIndicator', props });
}

/** Associate a native label with the Slider's thumb controls. */
export function SliderLabel<As extends PrimitiveNativeTag = 'label'>(
  props: SliderLabelProps<As>,
): JSX.Element {
  return renderSliderPart({ slot: 'label', props });
}

/** Display the selected portion of the Slider track. */
export function SliderRange<As extends PrimitiveNativeTag = 'div'>(
  props: SliderRangeProps<As>,
): JSX.Element {
  return renderSliderPart({ slot: 'range', props });
}

/** Bind one indexed thumb to the primitive's keyboard and pointer behavior. */
export function SliderThumb<As extends PrimitiveNativeTag = 'div'>(
  props: SliderThumbProps<As>,
): JSX.Element {
  return renderSliderPart({ slot: 'thumb', props });
}

/** Display the Slider's available range behind its selected range. */
export function SliderTrack<As extends PrimitiveNativeTag = 'div'>(
  props: SliderTrackProps<As>,
): JSX.Element {
  return renderSliderPart({ slot: 'track', props });
}

/** Render the machine's formatted selected value. */
export function SliderValueText<As extends PrimitiveNativeTag = 'span'>(
  props: SliderValueTextProps<As>,
): JSX.Element {
  return renderSliderPart({ slot: 'valueText', props });
}
