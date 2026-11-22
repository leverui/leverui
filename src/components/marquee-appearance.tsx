import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';

export interface MarqueeAppearanceState {
  unstyled: Accessor<boolean>;
}

const MarqueeAppearanceContext = createOptionalContext<MarqueeAppearanceState>();

/** Share root presentation state without changing the primitive's Marquee machine. */
export const MarqueeAppearanceProvider = MarqueeAppearanceContext;

/** Read the nearest Marquee root's unstyled choice for a public part. */
export function useMarqueeAppearance(): MarqueeAppearanceState {
  const state = useOptionalContext(MarqueeAppearanceContext);
  if (!state) throw new Error('Marquee parts require MarqueeRoot or RootProvider.');
  return state;
}
