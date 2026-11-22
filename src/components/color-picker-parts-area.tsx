import { splitProps } from '../primitives/utils/split-props';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import { renderColorPickerPart } from './color-picker-part';
import type {
  ColorPickerAreaBackgroundProps,
  ColorPickerAreaProps,
  ColorPickerAreaThumbProps,
  ColorPickerChannelInputProps,
  ColorPickerChannelSliderLabelProps,
  ColorPickerChannelSliderProps,
  ColorPickerChannelSliderThumbProps,
  ColorPickerChannelSliderTrackProps,
  ColorPickerChannelSliderValueTextProps,
  ColorPickerTransparencyGridProps,
} from './color-picker-part-props';

/** Paint the selected channel gradient behind the area thumb. */
export function ColorPickerAreaBackground<As extends PrimitiveNativeTag = 'div'>(
  props: ColorPickerAreaBackgroundProps<As>,
): JSX.Element {
  return renderColorPickerPart({ slot: 'areaBackground', props });
}

/** Show and move the active color within the two-dimensional area. */
export function ColorPickerAreaThumb<As extends PrimitiveNativeTag = 'div'>(
  props: ColorPickerAreaThumbProps<As>,
): JSX.Element {
  return renderColorPickerPart({ slot: 'areaThumb', props });
}

/** Compose the default area background and thumb. */
function ColorPickerAreaImpl(props: ColorPickerAreaProps): JSX.Element {
  const [content, rest] = splitProps(props, ['children']);
  const merged = mergeProps(rest, {
    /** Create the default parts under the primitive's area channel context. */
    get children() {
      return (
        <>
          {content.children === undefined ? (
            <>
              <ColorPickerAreaBackground />
              <ColorPickerAreaThumb />
            </>
          ) : (
            content.children
          )}
        </>
      );
    },
  });
  return renderColorPickerPart({ slot: 'area', props: merged });
}

/** Preserve native element selection on the public area wrapper. */
export const ColorPickerArea = ColorPickerAreaImpl as <As extends PrimitiveNativeTag = 'div'>(
  props: ColorPickerAreaProps<As>,
) => JSX.Element;

/** Paint a checkerboard behind alpha-bearing colors. */
export function ColorPickerTransparencyGrid<As extends PrimitiveNativeTag = 'div'>(
  props: ColorPickerTransparencyGridProps<As>,
): JSX.Element {
  return renderColorPickerPart({ slot: 'transparencyGrid', props });
}

/** Paint one color channel's interactive slider track. */
export function ColorPickerChannelSliderTrack<As extends PrimitiveNativeTag = 'div'>(
  props: ColorPickerChannelSliderTrackProps<As>,
): JSX.Element {
  return renderColorPickerPart({ slot: 'channelSliderTrack', props });
}

/** Show the draggable thumb for one color channel. */
export function ColorPickerChannelSliderThumb<As extends PrimitiveNativeTag = 'div'>(
  props: ColorPickerChannelSliderThumbProps<As>,
): JSX.Element {
  return renderColorPickerPart({ slot: 'channelSliderThumb', props });
}

/** Compose the transparency grid, track, and thumb. */
function ColorPickerChannelSliderImpl(props: ColorPickerChannelSliderProps): JSX.Element {
  const [content, rest] = splitProps(props, ['children']);
  const merged = mergeProps(rest, {
    /** Create default parts under the primitive's channel context. */
    get children() {
      return (
        <>
          {content.children === undefined ? (
            <>
              <ColorPickerTransparencyGrid size="0.6rem" />
              <ColorPickerChannelSliderTrack />
              <ColorPickerChannelSliderThumb />
            </>
          ) : (
            content.children
          )}
        </>
      );
    },
  });
  return renderColorPickerPart({ slot: 'channelSlider', props: merged });
}

/** Preserve native element selection on the public channel slider. */
export const ColorPickerChannelSlider = ColorPickerChannelSliderImpl as <
  As extends PrimitiveNativeTag = 'div',
>(
  props: ColorPickerChannelSliderProps<As>,
) => JSX.Element;

/** Associate a native label with the selected channel slider. */
export function ColorPickerChannelSliderLabel<As extends PrimitiveNativeTag = 'label'>(
  props: ColorPickerChannelSliderLabelProps<As>,
): JSX.Element {
  return renderColorPickerPart({ slot: 'channelSliderLabel', props });
}

/** Display the machine's current channel value. */
export function ColorPickerChannelSliderValueText<As extends PrimitiveNativeTag = 'span'>(
  props: ColorPickerChannelSliderValueTextProps<As>,
): JSX.Element {
  return renderColorPickerPart({ slot: 'channelSliderValueText', props });
}

/** Edit one color channel through the primitive's native input. */
export function ColorPickerChannelInput<As extends PrimitiveNativeTag = 'input'>(
  props: ColorPickerChannelInputProps<As>,
): JSX.Element {
  return renderColorPickerPart({ slot: 'channelInput', props });
}
