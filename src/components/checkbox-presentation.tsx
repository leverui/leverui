import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import type { CheckmarkChoices } from './checkmark-choices';

export interface CheckboxPresentation {
  choices: CheckmarkChoices;
  unstyled: boolean;
}

const CheckboxPresentationContext = createOptionalContext<Accessor<CheckboxPresentation>>();

/** Scope finite Checkbox presentation choices to its nearest root. */
export function CheckboxPresentationProvider(props: {
  value: Accessor<CheckboxPresentation>;
  children: JSX.Element;
}): JSX.Element {
  /** Follow a root's current presentation accessor without replacing context. */
  function readPresentation(): CheckboxPresentation {
    return props.value();
  }

  return (
    <CheckboxPresentationContext value={readPresentation}>
      {props.children}
    </CheckboxPresentationContext>
  );
}

/** Read the nearest root's CSS selections for a Checkbox part. */
export function useCheckboxPresentation(): Accessor<CheckboxPresentation> {
  const value = useOptionalContext(CheckboxPresentationContext);
  if (!value) throw new Error('Checkbox parts must be inside CheckboxRoot.');
  return value;
}
