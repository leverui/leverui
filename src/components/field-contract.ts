import { type Accessor, type Setter } from 'solid-js';
import { type JSX } from '@solidjs/web';

export interface FieldElementIds {
  root?: string;
  control?: string;
  label?: string;
  errorText?: string;
  helperText?: string;
}

export interface UseFieldProps {
  id?: string;
  ids?: FieldElementIds;
  required?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  readOnly?: boolean;
  target?: string;
}

type FieldBooleanAttribute = boolean | 'true' | 'false';

interface FieldStateAttributes {
  'data-disabled': FieldBooleanAttribute;
  'data-invalid': FieldBooleanAttribute;
  'data-readonly': FieldBooleanAttribute;
}

interface FieldControlAttributes {
  'aria-describedby': string | undefined;
  'aria-invalid': 'true' | undefined;
  'data-invalid': FieldBooleanAttribute;
  'data-required': FieldBooleanAttribute;
  'data-readonly': FieldBooleanAttribute;
  id: string;
  required: boolean;
  disabled: boolean;
  readonly: true | undefined;
}

export interface FieldContextState {
  ariaDescribedby: string | undefined;
  ids: { control: string; label: string; errorText: string; helperText: string };
  refs: { rootRef: Setter<HTMLDivElement | undefined> };
  disabled: boolean;
  invalid: boolean;
  readOnly: boolean;
  required: boolean;
  /** Associate the nearest label with the selected control. */
  getLabelProps(): FieldStateAttributes & {
    'data-required': FieldBooleanAttribute;
    id: string;
    for: string;
  };
  /** Mark the field group with its current state. */
  getRootProps(): FieldStateAttributes & { id: string; role: string };
  /** Apply accessible Field state to a native input. */
  getInputProps(): FieldControlAttributes;
  /** Apply accessible Field state to a native textarea. */
  getTextareaProps(): FieldControlAttributes;
  /** Apply accessible Field state to a native select. */
  getSelectProps(): FieldControlAttributes;
  /** Identify helper text for the control description. */
  getHelperTextProps(): {
    id: string;
    'data-disabled': FieldBooleanAttribute;
  };
  /** Identify the conditional validation message. */
  getErrorTextProps(): { id: string; 'aria-live': string };
  /** Hide the required marker from assistive technology. */
  getRequiredIndicatorProps(): { 'aria-hidden': 'true' };
}

export type UseFieldReturn = Accessor<FieldContextState>;
export type UseFieldContext = UseFieldReturn;

export interface FieldContextProps {
  /** Render a custom part with the nearest reactive Field accessor. */
  children: (context: UseFieldContext) => JSX.Element;
}
