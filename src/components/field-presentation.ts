import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';

export interface FieldPresentation {
  unstyled: Accessor<boolean>;
}

const FieldPresentationContext = createOptionalContext<FieldPresentation>();

/** Share a Field root's unstyled choice with its visible primitive parts. */
export const FieldPresentationProvider = FieldPresentationContext;

/** Require a Field root before rendering a public Field part. */
export function useFieldPresentation(): FieldPresentation {
  const state = useOptionalContext(FieldPresentationContext);
  if (!state) throw new Error('Field parts must be inside FieldRoot or FieldRootProvider.');
  return state;
}
