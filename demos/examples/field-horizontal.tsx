import { type JSX } from '@solidjs/web';
import { Field, Input, Stack, Switch } from '../../src';

/** Align two inputs and a switch beside 96px labels. */
export function FieldHorizontal(): JSX.Element {
  return (
    <Stack
      gap="8"
      style={{ 'max-width': 'var(--leverui-sizes-sm)', '--leverui-field-label-width': '96px' }}
    >
      <Field.Root orientation="horizontal">
        <Field.Label>Name</Field.Label>
        <Input placeholder="Mara Ellison" style={{ flex: '1' }} />
      </Field.Root>
      <Field.Root orientation="horizontal">
        <Field.Label>Email</Field.Label>
        <Input placeholder="me@example.com" style={{ flex: '1' }} />
      </Field.Root>
      <Field.Root orientation="horizontal">
        <Field.Label>Hide email</Field.Label>
        <Switch.Root>
          <Switch.HiddenInput />
          <Switch.Control />
        </Switch.Root>
      </Field.Root>
    </Stack>
  );
}
