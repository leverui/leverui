import { type JSX } from '@solidjs/web';
import type { ColorPickerChannelInputProps } from './color-picker-part-props';
import { ColorPickerChannelInput } from './color-picker-parts-area';

type WithoutChannel<Props> = Props extends unknown ? Omit<Props, 'channel'> : never;
export type ColorPickerInputProps = WithoutChannel<ColorPickerChannelInputProps<'input'>>;

/** Edit the current color as hexadecimal text. */
export function ColorPickerInput(props: ColorPickerInputProps): JSX.Element {
  return <ColorPickerChannelInput channel="hex" {...props} />;
}
