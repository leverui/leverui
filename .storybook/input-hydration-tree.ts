import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Field as FieldExport, Input as InputExport } from '../src';

type InputHydrationComponents = {
  Field: typeof FieldExport;
  Input: typeof InputExport;
};

/** Build identical fields and Input value paths on server and client. */
export function renderInputHydrationTree({ Field, Input }: InputHydrationComponents): JSX.Element {
  const [value, setValue] = createSignal('controlled draft');

  /** Keep the controlled signal aligned with native input events. */
  function updateValue(event: InputEvent & { currentTarget: HTMLInputElement }): void {
    setValue(event.currentTarget.value);
  }

  return [
    createComponent(Field.Root, {
      /** Connect the generated label and description IDs to the control. */
      get children() {
        return [
          createComponent(Field.Label, { children: 'Hydrated draft' }),
          createComponent(Input, {
            'data-testid': 'hydrated-uncontrolled',
            defaultValue: 'uncontrolled draft',
          }),
          createComponent(Field.HelperText, { children: 'Draft help' }),
        ];
      },
    }),
    createComponent(Field.Root, {
      /** Connect a second generated field ID to a controlled control. */
      get children() {
        return [
          createComponent(Field.Label, { children: 'Hydrated controlled' }),
          createComponent(Input, {
            'data-testid': 'hydrated-controlled',
            /** Read the current controlled value during hydration and updates. */
            get value() {
              return value();
            },
            onInput: updateValue,
          }),
          createComponent(Field.HelperText, { children: 'Controlled help' }),
        ];
      },
    }),
  ];
}
