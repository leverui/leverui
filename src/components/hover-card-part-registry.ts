import { HoverCard as PrimitiveHoverCard } from '../primitives/components/hover-card';

/** Bind public parts to their default native elements. */
export const hoverCardPartTags = {
  trigger: 'button',
  positioner: 'div',
  content: 'div',
  arrow: 'div',
  arrowTip: 'div',
} as const;

export type HoverCardPartSlot = keyof typeof hoverCardPartTags;

/** Keep the primitive's machine-owned parts at one rendering boundary. */
export const hoverCardPartComponents = {
  trigger: PrimitiveHoverCard.Trigger,
  positioner: PrimitiveHoverCard.Positioner,
  content: PrimitiveHoverCard.Content,
  arrow: PrimitiveHoverCard.Arrow,
  arrowTip: PrimitiveHoverCard.ArrowTip,
} as const;
