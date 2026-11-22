import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';

export interface SplitterAppearanceState {
  unstyled: Accessor<boolean>;
}

const SplitterAppearanceContext = createOptionalContext<SplitterAppearanceState>();

/** Share root presentation state without changing the primitive's splitter machine. */
export const SplitterAppearanceProvider = SplitterAppearanceContext;

/** Read the nearest root's unstyled choice for a public part. */
export function useSplitterAppearance(): SplitterAppearanceState {
  const state = useOptionalContext(SplitterAppearanceContext);
  if (!state) throw new Error('Splitter parts require SplitterRoot or RootProvider.');
  return state;
}
