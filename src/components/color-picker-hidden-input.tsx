import { ColorPicker as PrimitiveColorPicker } from '../primitives/components/color-picker';
import { type JSX } from '@solidjs/web';

export type ColorPickerHiddenInputProps = Parameters<typeof PrimitiveColorPicker.HiddenInput>[0];

/** Keep the form-owned primitive input outside the keyboard tab order by default. */
export function ColorPickerHiddenInput(props: ColorPickerHiddenInputProps): JSX.Element {
  return <PrimitiveColorPicker.HiddenInput tabindex={-1} {...props} />;
}
