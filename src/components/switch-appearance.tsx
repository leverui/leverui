import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';

export interface SwitchAppearanceState {
  unstyled: Accessor<boolean>;
}

const SwitchAppearanceContext = createOptionalContext<SwitchAppearanceState>();

/** Share the root's unstyled selection with every public Switch part. */
export const SwitchAppearanceProvider = SwitchAppearanceContext;

/** Read the nearest Switch root's appearance selection. */
export function useSwitchAppearance(): SwitchAppearanceState {
  const state = useOptionalContext(SwitchAppearanceContext);
  if (!state) throw new Error('Switch parts require SwitchRoot or SwitchRootProvider.');
  return state;
}
