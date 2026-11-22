import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';

export interface ScrollAreaAppearanceState {
  unstyled: Accessor<boolean>;
}

const ScrollAreaAppearanceContext = createOptionalContext<ScrollAreaAppearanceState>();

/** Share the nearest Scroll Area root's live appearance choice. */
export const ScrollAreaAppearanceProvider = ScrollAreaAppearanceContext;

/** Require visible parts to belong to an active Scroll Area root. */
export function useScrollAreaAppearance(): ScrollAreaAppearanceState {
  const state = useOptionalContext(ScrollAreaAppearanceContext);
  if (!state) throw new Error('Scroll Area parts require ScrollAreaRoot or RootProvider.');
  return state;
}
