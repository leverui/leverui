import { type Accessor, type Setter } from 'solid-js';
import { type JSX } from '@solidjs/web';

export interface UseFieldsetProps {
  id?: string;
  disabled?: boolean;
  invalid?: boolean;
}

type FieldsetDataAttribute = '' | undefined;

export interface FieldsetContextState {
  refs: { rootRef: Setter<HTMLFieldSetElement | undefined> };
  ids: { legend: string; errorText: string; helperText: string };
  disabled: boolean;
  invalid: boolean;
  /** Connect the group to its legend and mounted descriptions. */
  getRootProps(): {
    disabled: boolean;
    'data-disabled': FieldsetDataAttribute;
    'data-invalid': FieldsetDataAttribute;
    'aria-labelledby': string;
    'aria-describedby': string | undefined;
  };
  /** Identify the fieldset legend and reflect its state. */
  getLegendProps(): {
    id: string;
    'data-disabled': FieldsetDataAttribute;
    'data-invalid': FieldsetDataAttribute;
  };
  /** Identify helper text for the group's description. */
  getHelperTextProps(): { id: string };
  /** Identify the conditional validation message. */
  getErrorTextProps(): { id: string; 'aria-live': string };
}

export type UseFieldsetReturn = Accessor<FieldsetContextState>;
export type UseFieldsetContext = UseFieldsetReturn;

export interface FieldsetContextProps {
  /** Render custom content with the nearest reactive Fieldset accessor. */
  children: (context: UseFieldsetContext) => JSX.Element;
}
