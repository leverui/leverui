import { createContext } from 'solid-js';
import { useOptionalContext } from '../primitives/utils/optional-context';

const StatContext = createContext(false);

/** Mark descendants as belonging to the nearest Stat root. */
export const StatContextProvider = StatContext;

/** Reject a Stat part mounted outside its required root. */
export function requireStatRoot(): void {
  if (!useOptionalContext(StatContext)) throw new Error('Stat parts must be inside StatRoot.');
}
