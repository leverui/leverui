import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';

const FloatingPanelUnstyledContext = createOptionalContext<Accessor<boolean>>();

/** Carry the root's unstyled choice through a panel portal. */
export const FloatingPanelStylesProvider = FloatingPanelUnstyledContext;

/** Read whether the nearest Floating Panel root disables authored presentation. */
export function useFloatingPanelUnstyled(): Accessor<boolean> {
  const unstyled = useOptionalContext(FloatingPanelUnstyledContext);
  if (!unstyled) throw new Error('Floating Panel parts require FloatingPanelRoot.');
  return unstyled;
}
