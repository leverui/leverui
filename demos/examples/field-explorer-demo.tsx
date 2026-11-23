import { type JSX } from '@solidjs/web';
import { Button, Field, Input, NativeSelect, Textarea, VStack } from '../../src';

/** Render every Field part so the anatomy explorer can highlight each one. */
export function FieldExplorerDemo(): JSX.Element {
  return (
    <VStack
      gap="6"
      style={{
        'align-items': 'stretch',
        'max-width': '500px',
        'margin-inline': 'auto',
        padding: 'var(--lui-spacing-6)',
      }}
    >
      <Field.Root required invalid>
        <Field.Label>
          Email address
          <Field.RequiredIndicator />
        </Field.Label>
        <Input placeholder="you@example.com" />
        <Field.HelperText>We will never share your email.</Field.HelperText>
        <Field.ErrorText>Enter a valid email address.</Field.ErrorText>
      </Field.Root>
      <Field.Root>
        <Field.Label>Topic</Field.Label>
        <NativeSelect.Root>
          <NativeSelect.Field>
            <option value="billing">Billing</option>
            <option value="support">Support</option>
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
      </Field.Root>
      <Field.Root>
        <Field.Label>Message</Field.Label>
        <Textarea placeholder="How can we help?" style={{ 'min-height': '100px' }} />
        <Field.HelperText>Optional. You can leave this empty.</Field.HelperText>
      </Field.Root>
      <Button>Submit</Button>
    </VStack>
  );
}
