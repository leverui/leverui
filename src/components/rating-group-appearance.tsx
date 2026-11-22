import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';

export interface RatingGroupAppearanceState {
  unstyled: Accessor<boolean>;
}

const RatingGroupAppearanceContext = createOptionalContext<RatingGroupAppearanceState>();

/** Share the nearest Rating Group root's live appearance choice. */
export const RatingGroupAppearanceProvider = RatingGroupAppearanceContext;

/** Require parts to belong to an active Rating Group root. */
export function useRatingGroupAppearance(): RatingGroupAppearanceState {
  const state = useOptionalContext(RatingGroupAppearanceContext);
  if (!state) throw new Error('Rating Group parts require RatingGroupRoot or RootProvider.');
  return state;
}
