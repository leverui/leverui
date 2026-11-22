import type { NativeHtmlAliases } from '../styled-system/native-html-aliases';
import type {
  PrimitiveNativeElementProps,
  PrimitiveNativeTag,
} from './primitive-native-element-props';
import type { pinInputPartTags, PinInputPartSlot } from './pin-input-part-registry';

type PinInputBehavior<Slot extends PinInputPartSlot> = Slot extends 'input'
  ? { index: number }
  : object;

type PinInputPartAppearance = {
  unstyled?: boolean | undefined;
  className?: string | undefined;
} & NativeHtmlAliases;

export type PinInputPartProps<
  Slot extends PinInputPartSlot,
  As extends PrimitiveNativeTag = (typeof pinInputPartTags)[Slot],
> = PrimitiveNativeElementProps<
  (typeof pinInputPartTags)[Slot],
  PinInputBehavior<Slot> & PinInputPartAppearance,
  As
>;

export type PinInputControlProps<As extends PrimitiveNativeTag = 'div'> = PinInputPartProps<
  'control',
  As
>;
export type PinInputInputProps<As extends PrimitiveNativeTag = 'input'> = PinInputPartProps<
  'input',
  As
>;
export type PinInputLabelProps<As extends PrimitiveNativeTag = 'label'> = PinInputPartProps<
  'label',
  As
>;
