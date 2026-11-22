import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';

export interface ProgressAppearanceState {
  unstyled: Accessor<boolean>;
}

const ProgressAppearanceContext = createOptionalContext<ProgressAppearanceState>();

/** Share the nearest Progress root's current presentation choice. */
export const ProgressAppearanceProvider = ProgressAppearanceContext;

/** Read the nearest Progress root's presentation choice. */
export function useProgressAppearance(): ProgressAppearanceState {
  const state = useOptionalContext(ProgressAppearanceContext);
  if (!state) throw new Error('Progress parts require ProgressRoot or ProgressRootProvider.');
  return state;
}
