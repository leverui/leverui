import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';

const EmptyStateContext = createOptionalContext<boolean>();

/** Scope native Empty State parts to their nearest root. */
export const EmptyStateContextProvider = EmptyStateContext;

/** Require a root before rendering one of its public parts. */
export function requireEmptyStateRoot(): void {
  if (!useOptionalContext(EmptyStateContext)) {
    throw new Error('Empty State parts must be inside EmptyStateRoot.');
  }
}
