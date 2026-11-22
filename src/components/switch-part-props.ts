import { type JSX } from '@solidjs/web';
import type { NativeHtmlAliases } from '../styled-system/native-html-aliases';
import type {
  PrimitiveNativeElementProps,
  PrimitiveNativeTag,
} from './primitive-native-element-props';
import type { switchPartTags, SwitchPartSlot } from './switch-part-registry';

export type SwitchPartProps<
  Slot extends SwitchPartSlot,
  As extends PrimitiveNativeTag = (typeof switchPartTags)[Slot],
> = PrimitiveNativeElementProps<
  (typeof switchPartTags)[Slot],
  NativeHtmlAliases & { unstyled?: boolean },
  As
>;

export type SwitchControlProps<As extends PrimitiveNativeTag = 'span'> = SwitchPartProps<
  'control',
  As
>;
export type SwitchLabelProps<As extends PrimitiveNativeTag = 'span'> = SwitchPartProps<'label', As>;
export type SwitchThumbProps<As extends PrimitiveNativeTag = 'span'> = SwitchPartProps<'thumb', As>;
export type SwitchIndicatorProps<As extends PrimitiveNativeTag = 'span'> = SwitchPartProps<
  'indicator',
  As
> & { fallback?: JSX.Element };
export type SwitchThumbIndicatorProps<As extends PrimitiveNativeTag = 'span'> = SwitchPartProps<
  'thumbIndicator',
  As
> & { fallback?: JSX.Element };
