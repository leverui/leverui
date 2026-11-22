import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';

export interface TooltipAppearanceState {
  unstyled: Accessor<boolean>;
  /** The root's machine `aria-label`, used to label its content. */
  ariaLabel?: Accessor<string | undefined>;
}

const TooltipAppearanceContext = createOptionalContext<TooltipAppearanceState>();

/** Carry one Tooltip root's presentation choice through Solid portals. */
export const TooltipAppearanceProvider = TooltipAppearanceContext;

/** Read the nearest Tooltip root's presentation choice. */
export function useTooltipAppearance(): TooltipAppearanceState {
  const state = useOptionalContext(TooltipAppearanceContext);
  if (!state) throw new Error('Tooltip parts require TooltipRoot or TooltipRootProvider.');
  return state;
}
