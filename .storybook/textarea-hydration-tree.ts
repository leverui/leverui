import { createComponent } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Field as FieldExport, Textarea as TextareaExport } from '../src';

export type TextareaHydrationComponents = {
  Field: typeof FieldExport;
  Textarea: typeof TextareaExport;
};

/** Build identical Textarea and selected-input Field trees on server and client. */
export function renderTextareaHydrationTree({
  Field,
  Textarea,
}: TextareaHydrationComponents): JSX.Element {
  return [
    createComponent(Field.Root, {
      id: 'hydrated-notes',
      required: true,
      /** Associate native textarea text and helper content. */
      get children() {
        return [
          createComponent(Field.Label, { children: 'Hydrated notes' }),
          createComponent(Textarea, {
            'data-testid': 'hydrated-textarea',
            defaultValue: 'Server draft',
          }),
          createComponent(Field.HelperText, { children: 'Notes help' }),
        ];
      },
    }),
    createComponent(Field.Root, {
      id: 'hydrated-selected-input',
      /** Associate a selected native input with its Field. */
      get children() {
        return [
          createComponent(Field.Label, { children: 'Selected input' }),
          createComponent(Textarea, {
            as: 'input' as const,
            'data-testid': 'hydrated-selected-input',
            defaultValue: 'Selected draft',
          }),
          createComponent(Field.HelperText, { children: 'Selected help' }),
        ];
      },
    }),
  ];
}
