import type {
  PrimitiveNativeElementProps,
  PrimitiveNativeTag,
} from './primitive-native-element-props';
import type { collapsiblePartTags, CollapsiblePartSlot } from './collapsible-part-registry';

export type CollapsiblePartProps<
  Slot extends CollapsiblePartSlot,
  As extends PrimitiveNativeTag = (typeof collapsiblePartTags)[Slot],
> = PrimitiveNativeElementProps<
  (typeof collapsiblePartTags)[Slot],
  { unstyled?: boolean | undefined },
  As
>;

export type CollapsibleTriggerProps<As extends PrimitiveNativeTag = 'button'> =
  CollapsiblePartProps<'trigger', As>;
export type CollapsibleContentProps<As extends PrimitiveNativeTag = 'div'> = CollapsiblePartProps<
  'content',
  As
>;
export type CollapsibleIndicatorProps<As extends PrimitiveNativeTag = 'div'> = CollapsiblePartProps<
  'indicator',
  As
>;
