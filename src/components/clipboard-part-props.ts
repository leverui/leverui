import { type JSX } from '@solidjs/web';
import type {
  PrimitiveNativeElementProps,
  PrimitiveNativeTag,
} from './primitive-native-element-props';
import type { clipboardPartTags, ClipboardPartSlot } from './clipboard-part-registry';

export type ClipboardPartProps<
  Slot extends ClipboardPartSlot,
  As extends PrimitiveNativeTag = (typeof clipboardPartTags)[Slot],
> = PrimitiveNativeElementProps<
  (typeof clipboardPartTags)[Slot],
  { unstyled?: boolean | undefined },
  As
>;

export type ClipboardTriggerProps<As extends PrimitiveNativeTag = 'button'> = ClipboardPartProps<
  'trigger',
  As
>;
export type ClipboardControlProps<As extends PrimitiveNativeTag = 'div'> = ClipboardPartProps<
  'control',
  As
>;
export type ClipboardIndicatorProps<As extends PrimitiveNativeTag = 'div'> =
  PrimitiveNativeElementProps<'div', { copied?: JSX.Element; unstyled?: boolean | undefined }, As>;
export type ClipboardInputProps<As extends PrimitiveNativeTag = 'input'> = ClipboardPartProps<
  'input',
  As
>;
export type ClipboardLabelProps<As extends PrimitiveNativeTag = 'label'> = ClipboardPartProps<
  'label',
  As
>;
export type ClipboardValueTextProps<As extends PrimitiveNativeTag = 'span'> = ClipboardPartProps<
  'valueText',
  As
>;
export type ClipboardCopyTextProps<As extends PrimitiveNativeTag = 'div'> =
  ClipboardIndicatorProps<As>;
