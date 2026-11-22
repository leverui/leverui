import * as TooltipParts from './tooltip';
import { TooltipShortcut } from './tooltip-shortcut';

/**
 * Render `<Tooltip content="…">` for the common case, or compose `Tooltip.Root`,
 * `Tooltip.Trigger`, and the other parts for full control.
 */
export const Tooltip: typeof TooltipShortcut & typeof TooltipParts = Object.assign(
  TooltipShortcut,
  TooltipParts,
);
