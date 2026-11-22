import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';

export interface CollapsibleAppearance {
  /** Suppress authored presentation while preserving disclosure behavior. */
  unstyled?: boolean | undefined;
}

export interface CollapsibleAppearanceState {
  unstyled: Accessor<boolean>;
}

const CollapsibleAppearanceContext = createOptionalContext<CollapsibleAppearanceState>();

/** Share the nearest root's current unstyled choice with its parts. */
export const CollapsibleAppearanceProvider = CollapsibleAppearanceContext;

/** Read the nearest Collapsible root's presentation choice. */
export function useCollapsibleAppearance(): CollapsibleAppearanceState {
  const state = useOptionalContext(CollapsibleAppearanceContext);
  if (!state) throw new Error('Collapsible parts must be inside CollapsibleRoot.');
  return state;
}
