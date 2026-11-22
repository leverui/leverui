import { Collapsible as PrimitiveCollapsible } from '../primitives/components/collapsible';

/** Bind each Collapsible slot to its native element. */
export const collapsiblePartTags = {
  trigger: 'button',
  content: 'div',
  indicator: 'div',
} as const;

export type CollapsiblePartSlot = keyof typeof collapsiblePartTags;

/** Keep disclosure behavior in the primitive while Lever UI supplies slot styling. */
export const collapsiblePartComponents = {
  trigger: PrimitiveCollapsible.Trigger,
  content: PrimitiveCollapsible.Content,
  indicator: PrimitiveCollapsible.Indicator,
} as const;
