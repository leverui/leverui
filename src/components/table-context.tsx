import { createContext } from 'solid-js';
import { useOptionalContext } from '../primitives/utils/optional-context';

const TableContext = createContext(false);

/** Scope Table parts to their nearest semantic root. */
export const TableContextProvider = TableContext;

/** Reject a Table part rendered without its root. */
export function requireTableRoot(): void {
  if (!useOptionalContext(TableContext)) throw new Error('Table parts must be inside TableRoot.');
}
