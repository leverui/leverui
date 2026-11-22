import { createContext } from 'solid-js';
import { useOptionalContext } from '../primitives/utils/optional-context';

const TagContext = createContext(false);

/** Mark descendants as belonging to the nearest Tag root. */
export const TagContextProvider = TagContext;

/** Reject a Tag part mounted outside its required root. */
export function requireTagRoot(): void {
  if (!useOptionalContext(TagContext)) throw new Error('Tag parts must be inside TagRoot.');
}
