import { Field as PrimitiveField } from '../primitives/components/field';
import { type JSX } from '@solidjs/web';
import { renderFieldPart } from './field-part';
import type {
  FieldErrorTextProps,
  FieldHelperTextProps,
  FieldLabelProps,
  FieldRequiredIndicatorProps,
} from './field-props';

/** Render the accessible Field label and its recipe slot. */
export function FieldLabel(props: FieldLabelProps): JSX.Element {
  return renderFieldPart(PrimitiveField.Label, 'label', props);
}

/** Render helper text linked to the nearest Field control. */
export function FieldHelperText(props: FieldHelperTextProps): JSX.Element {
  return renderFieldPart(PrimitiveField.HelperText, 'helperText', props);
}

/** Render validation text only while the nearest Field is invalid. */
export function FieldErrorText(props: FieldErrorTextProps): JSX.Element {
  return renderFieldPart(PrimitiveField.ErrorText, 'errorText', props);
}

/** Render the required mark or the supplied optional fallback. */
export function FieldRequiredIndicator(props: FieldRequiredIndicatorProps): JSX.Element {
  return renderFieldPart(PrimitiveField.RequiredIndicator, 'requiredIndicator', props);
}
