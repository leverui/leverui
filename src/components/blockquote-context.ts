import { createContext } from 'solid-js';
import { useOptionalContext } from '../primitives/utils/optional-context';

const BlockquoteContext = createContext(false);

/** Mark descendants as belonging to a Blockquote root. */
export const BlockquoteContextProvider = BlockquoteContext;

/** Reject a Blockquote part mounted outside its required root. */
export function requireBlockquoteRoot(): void {
  if (!useOptionalContext(BlockquoteContext)) {
    throw new Error('Blockquote parts must be inside BlockquoteRoot.');
  }
}
