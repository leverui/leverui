import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Button, Field, Fieldset, Input, NativeSelect, Stack } from '../../src';
import './fieldset-examples.css';

const countries = ['United Kingdom', 'Canada', 'United States'] as const;

/** Render one country option in the native select. */
function renderCountryOption(country: (typeof countries)[number]): JSX.Element {
  return <option value={country}>{country}</option>;
}

/** Render the country field shared by the Fieldset examples. */
export function CountryField(props: { invalid?: boolean }): JSX.Element {
  return (
    <Field.Root invalid={Boolean(props.invalid)}>
      <Field.Label>Country</Field.Label>
      <NativeSelect.Root>
        <NativeSelect.Field name="country">
          <For each={countries}>{renderCountryOption}</For>
        </NativeSelect.Field>
        <NativeSelect.Indicator />
      </NativeSelect.Root>
    </Field.Root>
  );
}

/** Show the contact details fieldset with three fields. */
export function FieldsetBasic(): JSX.Element {
  return (
    <Fieldset.Root size="lg" class="example-fieldset-form">
      <Stack>
        <Fieldset.Legend>Contact details</Fieldset.Legend>
        <Fieldset.HelperText>Tell us how to reach you about your order.</Fieldset.HelperText>
      </Stack>
      <Fieldset.Content>
        <Field.Root>
          <Field.Label>Name</Field.Label>
          <Input name="name" />
        </Field.Root>
        <Field.Root>
          <Field.Label>Email address</Field.Label>
          <Input name="email" type="email" />
        </Field.Root>
        <CountryField />
      </Fieldset.Content>
      <Button type="submit" class="example-fieldset-submit">
        Submit
      </Button>
    </Fieldset.Root>
  );
}

/** Render every Fieldset part so the anatomy explorer can highlight each one. */
export function FieldsetExplorerDemo(): JSX.Element {
  return (
    <Fieldset.Root size="lg" invalid class="example-fieldset-form">
      <Stack>
        <Fieldset.Legend>Contact details</Fieldset.Legend>
        <Fieldset.HelperText>Tell us how to reach you about your order.</Fieldset.HelperText>
      </Stack>
      <Fieldset.Content>
        <Field.Root>
          <Field.Label>Name</Field.Label>
          <Input placeholder="Iris Calder" />
        </Field.Root>
        <Field.Root invalid>
          <Field.Label>Email address</Field.Label>
          <Input type="email" placeholder="me@example.com" />
          <Fieldset.ErrorText>Enter a valid email address.</Fieldset.ErrorText>
        </Field.Root>
        <CountryField />
      </Fieldset.Content>
      <Button type="submit" class="example-fieldset-submit">
        Submit
      </Button>
    </Fieldset.Root>
  );
}
