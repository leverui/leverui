import type {
  PrimitiveNativeElementProps,
  PrimitiveNativeTag,
} from './primitive-native-element-props';
import type { actionBarPartTags, ActionBarPartSlot } from './action-bar-part-registry';

type ActionBarPartAppearance = { unstyled?: boolean | undefined; className?: string | undefined };

export type ActionBarPartProps<
  Slot extends ActionBarPartSlot,
  As extends PrimitiveNativeTag = (typeof actionBarPartTags)[Slot],
> = PrimitiveNativeElementProps<(typeof actionBarPartTags)[Slot], ActionBarPartAppearance, As>;

export type ActionBarPositionerProps<As extends PrimitiveNativeTag = 'div'> = ActionBarPartProps<
  'positioner',
  As
>;
export type ActionBarContentProps<As extends PrimitiveNativeTag = 'div'> = ActionBarPartProps<
  'content',
  As
>;
export type ActionBarSeparatorProps<As extends PrimitiveNativeTag = 'div'> = ActionBarPartProps<
  'separator',
  As
>;
export type ActionBarSelectionTriggerProps<As extends PrimitiveNativeTag = 'button'> =
  ActionBarPartProps<'selectionTrigger', As>;
export type ActionBarCloseTriggerProps<As extends PrimitiveNativeTag = 'button'> =
  ActionBarPartProps<'closeTrigger', As>;
