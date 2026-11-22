import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';

const PaginationAppearanceContext = createOptionalContext<Accessor<boolean>>();

/** Share the root's unstyled choice with nested Pagination parts. */
export const PaginationAppearanceProvider = PaginationAppearanceContext;

/** Read whether the nearest Pagination root suppresses default presentation. */
export function usePaginationUnstyled(): Accessor<boolean> {
  const unstyled = useOptionalContext(PaginationAppearanceContext);
  if (!unstyled)
    throw new Error('Pagination parts require PaginationRoot or PaginationRootProvider.');
  return unstyled;
}
