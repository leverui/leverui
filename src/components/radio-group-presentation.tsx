import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import type { RadioGroupChoices } from './radio-group-choices';

export interface RadioGroupPresentation {
  choices: RadioGroupChoices;
  unstyled: boolean;
}

const RadioGroupPresentationContext = createOptionalContext<Accessor<RadioGroupPresentation>>();

/** Scope responsive appearance to the nearest radio machine root. */
export function RadioGroupPresentationProvider(props: {
  value: Accessor<RadioGroupPresentation>;
  children: JSX.Element;
}): JSX.Element {
  /** Follow the current root without replacing the context value. */
  function readPresentation(): RadioGroupPresentation {
    return props.value();
  }

  return (
    <RadioGroupPresentationContext value={readPresentation}>
      {props.children}
    </RadioGroupPresentationContext>
  );
}

/** Read the nearest Radio Group's live finite presentation choices. */
export function useRadioGroupPresentation(): Accessor<RadioGroupPresentation> {
  const state = useOptionalContext(RadioGroupPresentationContext);
  if (!state) throw new Error('Radio Group parts must be inside RadioGroupRoot.');
  return state;
}
