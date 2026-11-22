import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type {
  Button as ButtonExport,
  Field as FieldExport,
  Fieldset as FieldsetExport,
  Input as InputExport,
} from '../src';

export interface FieldsetHydrationComponents {
  Button: typeof ButtonExport;
  Field: typeof FieldExport;
  Fieldset: typeof FieldsetExport;
  Input: typeof InputExport;
}

/** Build one public Fieldset tree for server rendering and client hydration. */
export function renderFieldsetHydrationTree({
  Button,
  Field,
  Fieldset,
  Input,
}: FieldsetHydrationComponents): JSX.Element {
  const [invalid, setInvalid] = createSignal(false);

  /** Exercise both directions of conditional group validation. */
  function toggleValidation(): void {
    setInvalid(!invalid());
  }

  return [
    createComponent(Fieldset.Root, {
      id: 'hydrated-group',
      'data-testid': 'hydrated-fieldset',
      /** Follow validation without replacing the native group. */
      get invalid() {
        return invalid();
      },
      /** Keep all associated group parts inside the native fieldset. */
      get children() {
        return [
          createComponent(Fieldset.Legend, { children: 'Hydrated contact' }),
          createComponent(Fieldset.HelperText, { children: 'Group help' }),
          createComponent(Fieldset.Content, {
            /** Give the control its own accessible field label. */
            get children() {
              return createComponent(Field.Root, {
                id: 'hydrated-control',
                /** Render a stable native input beneath its label. */
                get children() {
                  return [
                    createComponent(Field.Label, { children: 'Email' }),
                    createComponent(Input, {
                      'data-testid': 'hydrated-fieldset-input',
                      defaultValue: 'draft',
                    }),
                  ];
                },
              });
            },
          }),
          createComponent(Fieldset.ErrorText, { children: 'Group error' }),
        ];
      },
    }),
    createComponent(Button, {
      type: 'button' as const,
      onClick: toggleValidation,
      'data-testid': 'hydrated-fieldset-toggle',
      children: 'Toggle validation',
    }),
  ];
}
