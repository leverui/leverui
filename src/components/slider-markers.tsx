import { splitProps } from '../primitives/utils/split-props';
import { For, Show } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import { renderSliderPart } from './slider-part';
import type {
  SliderMarkerGroupProps,
  SliderMarkerIndicatorProps,
  SliderMarkerLabelProps,
  SliderMarkerProps,
  SliderMarksProps,
} from './slider-part-props';

/** Position all marks against the current Slider range. */
export function SliderMarkerGroup<As extends PrimitiveNativeTag = 'div'>(
  props: SliderMarkerGroupProps<As>,
): JSX.Element {
  return renderSliderPart({ slot: 'markerGroup', props });
}

/** Bind one numeric mark to the primitive's position and under-value state. */
export function SliderMarker<As extends PrimitiveNativeTag = 'span'>(
  props: SliderMarkerProps<As>,
): JSX.Element {
  return renderSliderPart({ slot: 'marker', props });
}

/** Style the visible dot within one Slider mark. */
export function SliderMarkerIndicator<As extends PrimitiveNativeTag = 'div'>(
  props: SliderMarkerIndicatorProps<As>,
): JSX.Element {
  return renderSliderPart({ slot: 'markerIndicator', props });
}

/** Style optional text within one Slider mark. */
export function SliderMarkerLabel<As extends PrimitiveNativeTag = 'span'>(
  props: SliderMarkerLabelProps<As>,
): JSX.Element {
  return renderSliderPart({ slot: 'markerLabel', props });
}

/** Render numeric and labeled marks from a reactive list. */
export function SliderMarks<As extends PrimitiveNativeTag = 'div'>(
  props: SliderMarksProps<As>,
): JSX.Element {
  const [local, groupProps] = splitProps(props, ['marks']);
  const composed = mergeProps(groupProps, {
    /** Keep generated marks under the primitive's positioning group. */
    get children() {
      return (
        <For each={local.marks}>
          {
            /** Keep each mark's position and optional label together. */
            (mark) => {
              const value = typeof mark === 'number' ? mark : mark.value;
              const label = typeof mark === 'number' ? undefined : mark.label;
              return (
                <SliderMarker value={value}>
                  <SliderMarkerIndicator />
                  <Show when={label !== undefined}>
                    <SliderMarkerLabel>{label}</SliderMarkerLabel>
                  </Show>
                </SliderMarker>
              );
            }
          }
        </For>
      );
    },
  });
  return (
    <Show when={local.marks?.length}>
      {renderSliderPart({ slot: 'markerGroup', props: composed })}
    </Show>
  );
}
