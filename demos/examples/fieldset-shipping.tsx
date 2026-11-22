import { type JSX } from '@solidjs/web';
import { Field, Fieldset, Input, Textarea } from '../../src';
import { CountryField } from './fieldset-form';

/** Show the shipping fields disabled by their parent fieldset. */
export function FieldsetWithDisabled(): JSX.Element {
  return (
    <Fieldset.Root size="lg" disabled>
      <Fieldset.Legend>Shipping details</Fieldset.Legend>
      <Field.Root>
        <Field.Label>Street address</Field.Label>
        <Input name="address" />
      </Field.Root>
      <CountryField />
      <Field.Root>
        <Field.Label>Delivery notes</Field.Label>
        <Textarea name="notes" />
      </Field.Root>
    </Fieldset.Root>
  );
}

/** Show invalid shipping fields with a shared error message. */
export function FieldsetWithInvalid(): JSX.Element {
  return (
    <Fieldset.Root size="lg" invalid>
      <Fieldset.Legend>Shipping details</Fieldset.Legend>
      <Fieldset.Content>
        <Field.Root>
          <Field.Label>Street address</Field.Label>
          <Input name="address" />
        </Field.Root>
        <CountryField invalid />
        <Field.Root invalid>
          <Field.Label>Notes</Field.Label>
          <Textarea name="notes" />
        </Field.Root>
      </Fieldset.Content>
      <Fieldset.ErrorText>Some fields are invalid. Please check them.</Fieldset.ErrorText>
    </Fieldset.Root>
  );
}
