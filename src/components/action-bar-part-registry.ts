import { Popover as PrimitivePopover } from '../primitives/components/popover';
import { primitiveNativeParts } from './primitive-native-parts';

/** Bind Action Bar recipe slots to their native elements. */
export const actionBarPartTags = {
  positioner: 'div',
  content: 'div',
  separator: 'div',
  selectionTrigger: 'button',
  closeTrigger: 'button',
} as const;

export type ActionBarPartSlot = keyof typeof actionBarPartTags;

/** Keep primitive-owned content and close behavior beside plain layout parts. */
export const actionBarPartComponents = {
  positioner: primitiveNativeParts.div,
  content: PrimitivePopover.Content,
  separator: primitiveNativeParts.div,
  selectionTrigger: primitiveNativeParts.button,
  closeTrigger: PrimitivePopover.CloseTrigger,
} as const;
