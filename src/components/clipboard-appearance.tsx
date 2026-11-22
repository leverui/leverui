import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';

export interface ClipboardAppearance {
  /** Suppress authored presentation while keeping copy behavior. */
  unstyled?: boolean | undefined;
}

export interface ClipboardAppearanceState {
  unstyled: Accessor<boolean>;
}

const ClipboardAppearanceContext = createOptionalContext<ClipboardAppearanceState>();

/** Share the nearest root's current appearance choice. */
export const ClipboardAppearanceProvider = ClipboardAppearanceContext;

/** Read the nearest Clipboard root's appearance choice. */
export function useClipboardAppearance(): ClipboardAppearanceState {
  const state = useOptionalContext(ClipboardAppearanceContext);
  if (!state) throw new Error('Clipboard parts must be inside ClipboardRoot.');
  return state;
}
