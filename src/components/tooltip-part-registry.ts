import { Tooltip as PrimitiveTooltip } from '../primitives/components/tooltip';

/** Bind public parts to their default native elements. */
export const tooltipPartTags = {
  trigger: 'button',
  positioner: 'div',
  content: 'div',
  arrow: 'div',
  arrowTip: 'div',
} as const;

export type TooltipPartSlot = keyof typeof tooltipPartTags;

/** Keep the primitive's machine-owned parts at one rendering boundary. */
export const tooltipPartComponents = {
  trigger: PrimitiveTooltip.Trigger,
  positioner: PrimitiveTooltip.Positioner,
  content: PrimitiveTooltip.Content,
  arrow: PrimitiveTooltip.Arrow,
  arrowTip: PrimitiveTooltip.ArrowTip,
} as const;
