import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';

export interface EditablePresentation {
  unstyled: Accessor<boolean>;
}

const EditablePresentationContext = createOptionalContext<EditablePresentation>();

/** Share a root's authored-presentation choice with its Editable parts. */
export const EditablePresentationProvider = EditablePresentationContext;

/** Require the nearest Editable root before rendering a public part. */
export function useEditablePresentation(): EditablePresentation {
  const state = useOptionalContext(EditablePresentationContext);
  if (!state) throw new Error('Editable parts must be inside EditableRoot.');
  return state;
}
