import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';

export interface SegmentGroupAppearanceState {
  unstyled: Accessor<boolean>;
}

const SegmentGroupAppearanceContext = createOptionalContext<SegmentGroupAppearanceState>();

/** Share unstyled state with parts without owning their primitive behavior. */
export const SegmentGroupAppearanceProvider = SegmentGroupAppearanceContext;

/** Read the nearest Segment Group's presentation state. */
export function useSegmentGroupAppearance(): SegmentGroupAppearanceState {
  const state = useOptionalContext(SegmentGroupAppearanceContext);
  if (!state) throw new Error('Segment Group parts require SegmentGroupRoot or RootProvider.');
  return state;
}
