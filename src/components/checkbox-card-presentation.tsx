import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import type { CheckboxCardChoices } from './checkbox-card-choices';

export interface CheckboxCardPresentation {
  choices: CheckboxCardChoices;
  unstyled: boolean;
}

const CheckboxCardPresentationContext = createOptionalContext<Accessor<CheckboxCardPresentation>>();

/** Scope Card appearance selections to the nearest Checkbox Card root. */
export function CheckboxCardPresentationProvider(props: {
  value: Accessor<CheckboxCardPresentation>;
  children: JSX.Element;
}): JSX.Element {
  /** Follow the root's current presentation without replacing context. */
  function readPresentation(): CheckboxCardPresentation {
    return props.value();
  }

  return (
    <CheckboxCardPresentationContext value={readPresentation}>
      {props.children}
    </CheckboxCardPresentationContext>
  );
}

/** Read the nearest Card's current finite CSS selections. */
export function useCheckboxCardPresentation(): Accessor<CheckboxCardPresentation> {
  const value = useOptionalContext(CheckboxCardPresentationContext);
  if (!value) throw new Error('Checkbox Card parts must be inside CheckboxCardRoot.');
  return value;
}
