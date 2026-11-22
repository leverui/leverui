import { createContext } from 'solid-js';
import { useOptionalContext } from '../primitives/utils/optional-context';

const DataListContext = createContext(false);

/** Mark descendants as belonging to the nearest Data List root. */
export const DataListContextProvider = DataListContext;

/** Reject a Data List part mounted outside its required root. */
export function requireDataListRoot(): void {
  if (!useOptionalContext(DataListContext))
    throw new Error('Data List parts must be inside DataListRoot.');
}
