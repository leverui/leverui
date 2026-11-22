import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';

export interface FieldsetPresentation {
  unstyled: Accessor<boolean>;
}

const FieldsetPresentationContext = createOptionalContext<FieldsetPresentation>();

/** Scope the root's presentation choice to its primitive-owned parts. */
export const FieldsetPresentationProvider = FieldsetPresentationContext;

/** Require the nearest Fieldset root before rendering a part. */
export function useFieldsetPresentation(): FieldsetPresentation {
  const state = useOptionalContext(FieldsetPresentationContext);
  if (!state) throw new Error('Fieldset parts must be inside FieldsetRoot.');
  return state;
}
