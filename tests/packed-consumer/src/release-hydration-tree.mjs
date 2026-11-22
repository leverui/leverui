import { Button, Field, Input } from '@leverui/components';
import { createComponent, createSignal } from 'solid-js';

/** Build one primitive-backed field and a reactive action for server and client. */
export function renderReleaseHydrationTree() {
  const [invalid, setInvalid] = createSignal(false);

  /** Reveal the field error after the hydrated button is activated. */
  function validate() {
    setInvalid(true);
  }

  return [
    createComponent(Field.Root, {
      id: 'release-email',
      /** Track the validation state after hydration. */
      get invalid() {
        return invalid();
      },
      /** Render the same labeled input and messages on both sides. */
      get children() {
        return [
          createComponent(Field.Label, { children: 'Release email' }),
          createComponent(Input, { 'data-testid': 'release-input', defaultValue: 'draft' }),
          createComponent(Field.HelperText, { children: 'Release help' }),
          createComponent(Field.ErrorText, { children: 'Release error' }),
        ];
      },
    }),
    createComponent(Button, {
      type: 'button',
      onClick: validate,
      'data-testid': 'release-validate',
      children: 'Validate release field',
    }),
  ];
}
