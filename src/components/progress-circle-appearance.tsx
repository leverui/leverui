import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';

export interface ProgressCircleAppearanceState {
  unstyled: Accessor<boolean>;
}

const ProgressCircleAppearanceContext = createOptionalContext<ProgressCircleAppearanceState>();

/** Share the nearest Circle root's current appearance choice. */
export const ProgressCircleAppearanceProvider = ProgressCircleAppearanceContext;

/** Require Circle parts to belong to an active root. */
export function useProgressCircleAppearance(): ProgressCircleAppearanceState {
  const state = useOptionalContext(ProgressCircleAppearanceContext);
  if (!state)
    throw new Error('Progress Circle parts require a ProgressCircleRoot or RootProvider.');
  return state;
}
