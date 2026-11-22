import { createComponent } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { Editable as EditableExport, UseEditableReturn } from '../src';

export type EditableHydrationComponents = {
  Editable: typeof EditableExport;
};

/** Build identical native Editable controls for server and browser hydration. */
export function renderEditableHydrationTree({
  Editable,
}: EditableHydrationComponents): JSX.Element {
  /** Display the first machine value separately from its native input. */
  function renderInputValue(context: UseEditableReturn): JSX.Element {
    return createComponent(Dynamic, {
      component: 'output',
      'data-testid': 'hydrated-input-machine-value',
      /** Follow the hydrated single-line machine value. */
      get children() {
        return context().value;
      },
    });
  }

  /** Display the second machine value separately from its textarea. */
  function renderTextareaValue(context: UseEditableReturn): JSX.Element {
    return createComponent(Dynamic, {
      component: 'output',
      'data-testid': 'hydrated-textarea-machine-value',
      /** Follow the hydrated multiline machine value. */
      get children() {
        return context().value;
      },
    });
  }

  return [
    createComponent(Editable.Root, {
      id: 'hydrated-editable-single',
      defaultValue: 'Server input',
      /** Give the single-line control a stable label and visible draft. */
      get children() {
        return [
          createComponent(Editable.Label, { children: 'Hydrated input' }),
          createComponent(Editable.Context, { children: renderInputValue }),
          createComponent(Editable.Preview, {
            as: 'span' as const,
            'data-testid': 'hydrated-input-preview',
          }),
          createComponent(Editable.Input, {
            as: 'input' as const,
            'data-testid': 'hydrated-editable-input',
          }),
        ];
      },
    }),
    createComponent(Editable.Root, {
      id: 'hydrated-editable-multiline',
      defaultValue: 'Server textarea',
      /** Render the initial textarea text before client JavaScript loads. */
      get children() {
        return [
          createComponent(Editable.Label, { children: 'Hydrated textarea' }),
          createComponent(Editable.Context, { children: renderTextareaValue }),
          createComponent(Editable.Preview, {
            as: 'span' as const,
            'data-testid': 'hydrated-textarea-preview',
          }),
          createComponent(Editable.Textarea, {
            as: 'textarea' as const,
            'data-testid': 'hydrated-editable-textarea',
          }),
        ];
      },
    }),
  ];
}
