import { Fieldset as PrimitiveFieldset } from '../primitives/components/fieldset';
import { primitive } from '../primitives/components/factory';
import { type JSX } from '@solidjs/web';
import { renderFieldsetPart } from './fieldset-part';
import type {
  FieldsetContentProps,
  FieldsetErrorTextProps,
  FieldsetHelperTextProps,
  FieldsetLegendProps,
} from './fieldset-props';

/** Render the accessible native legend with its public CSS hook. */
export function FieldsetLegend(props: FieldsetLegendProps): JSX.Element {
  return renderFieldsetPart(PrimitiveFieldset.Legend, 'legend', props);
}

/** Render descriptive helper text beneath a Fieldset. */
export function FieldsetHelperText(props: FieldsetHelperTextProps): JSX.Element {
  return renderFieldsetPart(PrimitiveFieldset.HelperText, 'helperText', props);
}

/** Render validation text only while the Fieldset is invalid. */
export function FieldsetErrorText(props: FieldsetErrorTextProps): JSX.Element {
  return renderFieldsetPart(PrimitiveFieldset.ErrorText, 'errorText', props);
}

/** Group Fieldset controls inside the styled native content part. */
export function FieldsetContent(props: FieldsetContentProps): JSX.Element {
  return renderFieldsetPart(primitive.div, 'content', props);
}
