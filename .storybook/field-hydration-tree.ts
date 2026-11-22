import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Button as ButtonExport, Field as FieldExport, Input as InputExport } from '../src';

export interface FieldHydrationComponents {
  Button: typeof ButtonExport;
  Field: typeof FieldExport;
  Input: typeof InputExport;
}

/** Build the same public Field tree for server output and browser hydration. */
export function renderFieldHydrationTree({
  Button,
  Field,
  Input,
}: FieldHydrationComponents): JSX.Element {
  const [invalid, setInvalid] = createSignal(false);

  /** Reveal the conditional error after the server markup is hydrated. */
  function validate(): void {
    setInvalid(true);
  }

  return [
    createComponent(Field.Root, {
      /** Update validation without remounting the control. */
      get invalid() {
        return invalid();
      },
      /** Render the generated label and description IDs on both sides. */
      get children() {
        return [
          createComponent(Field.Label, { children: 'Hydrated email' }),
          createComponent(Input, {
            'data-testid': 'hydrated-field-input',
            defaultValue: 'draft',
          }),
          createComponent(Field.HelperText, { children: 'Field help' }),
          createComponent(Field.ErrorText, { children: 'Field error' }),
        ];
      },
    }),
    createComponent(Button, {
      type: 'button' as const,
      onClick: validate,
      'data-testid': 'hydrated-field-validate',
      children: 'Validate',
    }),
  ];
}
