import { createContext } from 'solid-js';
import { useOptionalContext } from '../primitives/utils/optional-context';

const ListContext = createContext(false);

/** Mark descendants as belonging to the nearest semantic List root. */
export const ListContextProvider = ListContext;

/** Reject a List part mounted without its required root. */
export function requireListRoot(): void {
  if (!useOptionalContext(ListContext)) throw new Error('List parts must be inside ListRoot.');
}
