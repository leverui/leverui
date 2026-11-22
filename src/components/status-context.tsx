import { createContext } from 'solid-js';
import { useOptionalContext } from '../primitives/utils/optional-context';

const StatusContext = createContext(false);

/** Mark descendants as belonging to the nearest Status root. */
export const StatusContextProvider = StatusContext;

/** Reject an indicator mounted outside its required root. */
export function requireStatusRoot(): void {
  if (!useOptionalContext(StatusContext))
    throw new Error('Status parts must be inside StatusRoot.');
}
