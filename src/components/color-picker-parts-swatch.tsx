import { type JSX } from '@solidjs/web';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import { renderColorPickerPart } from './color-picker-part';
import type {
  ColorPickerSwatchGroupProps,
  ColorPickerSwatchIndicatorProps,
  ColorPickerSwatchProps,
  ColorPickerSwatchTriggerProps,
} from './color-picker-part-props';

/** Group the available color swatches with default spacing. */
export function ColorPickerSwatchGroup<As extends PrimitiveNativeTag = 'div'>(
  props: ColorPickerSwatchGroupProps<As>,
): JSX.Element {
  return renderColorPickerPart({ slot: 'swatchGroup', props });
}

/** Select a preset swatch through the primitive's machine. */
export function ColorPickerSwatchTrigger<As extends PrimitiveNativeTag = 'button'>(
  props: ColorPickerSwatchTriggerProps<As>,
): JSX.Element {
  return renderColorPickerPart({ slot: 'swatchTrigger', props });
}

/** Paint one preset color and provide its indicator context. */
export function ColorPickerSwatch<As extends PrimitiveNativeTag = 'div'>(
  props: ColorPickerSwatchProps<As>,
): JSX.Element {
  return renderColorPickerPart({ slot: 'swatch', props });
}

/** Reveal the current preset swatch's selected marker. */
export function ColorPickerSwatchIndicator<As extends PrimitiveNativeTag = 'div'>(
  props: ColorPickerSwatchIndicatorProps<As>,
): JSX.Element {
  return renderColorPickerPart({ slot: 'swatchIndicator', props });
}
