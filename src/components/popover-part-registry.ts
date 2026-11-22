import { primitiveNativeParts } from './primitive-native-parts';
import { Popover as PrimitivePopover } from '../primitives/components/popover';

/** Bind public Popover parts to their native elements. */
export const popoverPartTags = {
  anchor: 'div',
  trigger: 'button',
  positioner: 'div',
  content: 'div',
  arrow: 'div',
  arrowTip: 'div',
  closeTrigger: 'button',
  title: 'h2',
  description: 'div',
  header: 'header',
  body: 'div',
  footer: 'footer',
} as const;

export type PopoverPartSlot = keyof typeof popoverPartTags;

/** Keep the primitive behavior and native layout parts at one rendering boundary. */
export const popoverPartComponents = {
  anchor: PrimitivePopover.Anchor,
  trigger: PrimitivePopover.Trigger,
  positioner: PrimitivePopover.Positioner,
  content: PrimitivePopover.Content,
  arrow: PrimitivePopover.Arrow,
  arrowTip: PrimitivePopover.ArrowTip,
  closeTrigger: PrimitivePopover.CloseTrigger,
  title: PrimitivePopover.Title,
  description: PrimitivePopover.Description,
  header: primitiveNativeParts.header,
  body: primitiveNativeParts.div,
  footer: primitiveNativeParts.footer,
} as const;
