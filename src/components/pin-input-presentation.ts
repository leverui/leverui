import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import type { InputChoice, InputSize, InputVariant } from './input-appearance-options';

export interface PinInputPresentation {
  size: Accessor<InputChoice<InputSize> | undefined>;
  variant: Accessor<InputChoice<InputVariant> | undefined>;
  unstyled: Accessor<boolean>;
}

const PinInputPresentationContext = createOptionalContext<PinInputPresentation>();

/** Share root appearance with indexed fields without changing the primitive behavior. */
export const PinInputPresentationProvider = PinInputPresentationContext;

/** Require a Pin Input root before rendering a public part. */
export function usePinInputPresentation(): PinInputPresentation {
  const state = useOptionalContext(PinInputPresentationContext);
  if (!state)
    throw new Error('Pin Input parts must be inside PinInputRoot or PinInputRootProvider.');
  return state;
}
