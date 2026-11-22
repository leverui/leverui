import { splitProps } from '../primitives/utils/split-props';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import { renderColorPickerPart } from './color-picker-part';
import type {
  ColorPickerChannelTextProps,
  ColorPickerContentProps,
  ColorPickerControlProps,
  ColorPickerFormatSelectProps,
  ColorPickerFormatTriggerProps,
  ColorPickerLabelProps,
  ColorPickerPositionerProps,
  ColorPickerTriggerProps,
  ColorPickerValueSwatchProps,
  ColorPickerValueTextProps,
  ColorPickerViewProps,
} from './color-picker-part-props';

/** Associate visible text with the ColorPicker input and trigger. */
export function ColorPickerLabel<As extends PrimitiveNativeTag = 'label'>(
  props: ColorPickerLabelProps<As>,
): JSX.Element {
  return renderColorPickerPart({ slot: 'label', props });
}

/** Group the input, value swatch, and trigger. */
export function ColorPickerControl<As extends PrimitiveNativeTag = 'div'>(
  props: ColorPickerControlProps<As>,
): JSX.Element {
  return renderColorPickerPart({ slot: 'control', props });
}

/** Show the current machine color in the swatch slot. */
export function ColorPickerValueSwatch<As extends PrimitiveNativeTag = 'div'>(
  props: ColorPickerValueSwatchProps<As>,
): JSX.Element {
  return renderColorPickerPart({ slot: 'valueSwatch', props });
}

/** Open the picker with a default current-color swatch. */
function ColorPickerTriggerImpl(props: ColorPickerTriggerProps): JSX.Element {
  const [content, rest] = splitProps(props, ['children']);
  const merged = mergeProps(rest, {
    /** Create the default swatch beneath the primitive's machine context. */
    get children() {
      return <>{content.children === undefined ? <ColorPickerValueSwatch /> : content.children}</>;
    },
  });
  return renderColorPickerPart({ slot: 'trigger', props: merged });
}

/** Preserve native element selection on the public trigger. */
export const ColorPickerTrigger = ColorPickerTriggerImpl as <
  As extends PrimitiveNativeTag = 'button',
>(
  props: ColorPickerTriggerProps<As>,
) => JSX.Element;

/** Anchor the picker content to its trigger. */
export function ColorPickerPositioner<As extends PrimitiveNativeTag = 'div'>(
  props: ColorPickerPositionerProps<As>,
): JSX.Element {
  return renderColorPickerPart({ slot: 'positioner', props });
}

/** Render the present color selection controls. */
export function ColorPickerContent<As extends PrimitiveNativeTag = 'div'>(
  props: ColorPickerContentProps<As>,
): JSX.Element {
  return renderColorPickerPart({ slot: 'content', props });
}

/** Display the selected color in a requested string format. */
export function ColorPickerValueText<As extends PrimitiveNativeTag = 'span'>(
  props: ColorPickerValueTextProps<As>,
): JSX.Element {
  return renderColorPickerPart({ slot: 'valueText', props });
}

/** Show controls for one machine color format. */
export function ColorPickerView<As extends PrimitiveNativeTag = 'div'>(
  props: ColorPickerViewProps<As>,
): JSX.Element {
  return renderColorPickerPart({ slot: 'view', props });
}

/** Select a color format with the primitive's native select. */
export function ColorPickerFormatSelect<As extends PrimitiveNativeTag = 'select'>(
  props: ColorPickerFormatSelectProps<As>,
): JSX.Element {
  return renderColorPickerPart({ slot: 'formatSelect', props });
}

/** Change the active color format with a native button. */
export function ColorPickerFormatTrigger<As extends PrimitiveNativeTag = 'button'>(
  props: ColorPickerFormatTriggerProps<As>,
): JSX.Element {
  return renderColorPickerPart({ slot: 'formatTrigger', props });
}

/** Label individual color channels in caller-owned layouts. */
export function ColorPickerChannelText<As extends PrimitiveNativeTag = 'span'>(
  props: ColorPickerChannelTextProps<As>,
): JSX.Element {
  return renderColorPickerPart({ slot: 'channelText', props });
}
