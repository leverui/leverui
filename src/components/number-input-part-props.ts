import type {
  PrimitiveNativeElementProps,
  PrimitiveNativeTag,
} from './primitive-native-element-props';
import type { numberInputPartTags, NumberInputPartSlot } from './number-input-part-registry';

export type NumberInputPartProps<
  Slot extends NumberInputPartSlot,
  As extends PrimitiveNativeTag = (typeof numberInputPartTags)[Slot],
> = PrimitiveNativeElementProps<
  (typeof numberInputPartTags)[Slot],
  { unstyled?: boolean | undefined; className?: string | undefined },
  As
>;

export type NumberInputControlProps<As extends PrimitiveNativeTag = 'div'> = NumberInputPartProps<
  'control',
  As
>;
export type NumberInputDecrementTriggerProps<As extends PrimitiveNativeTag = 'button'> =
  NumberInputPartProps<'decrementTrigger', As>;
export type NumberInputIncrementTriggerProps<As extends PrimitiveNativeTag = 'button'> =
  NumberInputPartProps<'incrementTrigger', As>;
export type NumberInputHiddenInputProps<As extends PrimitiveNativeTag = 'input'> =
  NumberInputPartProps<'hiddenInput', As>;
export type NumberInputInputProps<As extends PrimitiveNativeTag = 'input'> = NumberInputPartProps<
  'input',
  As
>;
export type NumberInputLabelProps<As extends PrimitiveNativeTag = 'label'> = NumberInputPartProps<
  'label',
  As
>;
export type NumberInputScrubberProps<As extends PrimitiveNativeTag = 'div'> = NumberInputPartProps<
  'scrubber',
  As
>;
export type NumberInputValueTextProps<As extends PrimitiveNativeTag = 'span'> =
  NumberInputPartProps<'valueText', As>;
