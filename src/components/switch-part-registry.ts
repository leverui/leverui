import { Switch as PrimitiveSwitch } from '../primitives/components/switch';
import { primitiveNativeParts } from './primitive-native-parts';

/** Bind each Switch part to its native tag. */
export const switchPartTags = {
  control: 'span',
  label: 'span',
  thumb: 'span',
  indicator: 'span',
  thumbIndicator: 'span',
} as const;

export type SwitchPartSlot = keyof typeof switchPartTags;

/** Keep machine-owned and presentation-only parts in one registry. */
export const switchPartComponents = {
  control: PrimitiveSwitch.Control,
  label: PrimitiveSwitch.Label,
  thumb: PrimitiveSwitch.Thumb,
  indicator: primitiveNativeParts.span,
  thumbIndicator: primitiveNativeParts.span,
} as const;
