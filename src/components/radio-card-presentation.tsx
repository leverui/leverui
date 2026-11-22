import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import type { RadioCardChoices } from './radio-card-choices';

export interface RadioCardPresentation {
  choices: RadioCardChoices;
  unstyled: boolean;
}

const RadioCardPresentationContext = createOptionalContext<Accessor<RadioCardPresentation>>();

/** Scope Card appearance to the nearest radio machine root. */
export function RadioCardPresentationProvider(props: {
  value: Accessor<RadioCardPresentation>;
  children: JSX.Element;
}): JSX.Element {
  /** Follow the root's changing presentation without replacing its context. */
  function readPresentation(): RadioCardPresentation {
    return props.value();
  }

  return (
    <RadioCardPresentationContext value={readPresentation}>
      {props.children}
    </RadioCardPresentationContext>
  );
}

/** Read the nearest Card's live finite CSS selections. */
export function useRadioCardPresentation(): Accessor<RadioCardPresentation> {
  const value = useOptionalContext(RadioCardPresentationContext);
  if (!value) throw new Error('Radio Card parts must be inside RadioCardRoot.');
  return value;
}
