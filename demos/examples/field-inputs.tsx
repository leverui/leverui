import { type JSX } from '@solidjs/web';
import { Badge, Field, Input, Textarea } from '../../src';

/** Show the labeled email input. */
export function FieldBasic(): JSX.Element {
  return (
    <Field.Root>
      <Field.Label>Email</Field.Label>
      <Input placeholder="me@example.com" />
    </Field.Root>
  );
}

/** Disable the field and its native input together. */
export function FieldWithDisabled(): JSX.Element {
  return (
    <Field.Root disabled>
      <Field.Label>Email</Field.Label>
      <Input placeholder="me@example.com" />
    </Field.Root>
  );
}

/** Include the error icon before its message. */
export function FieldWithErrorIcon(): JSX.Element {
  return (
    <Field.Root invalid>
      <Field.Label>Email</Field.Label>
      <Input placeholder="me@example.com" />
      <Field.ErrorText style={{ width: '100%' }}>
        <Field.ErrorIcon />
        Enter a valid email address.
      </Field.ErrorText>
    </Field.Root>
  );
}

/** Show a validation message beneath the invalid input. */
export function FieldWithErrorText(): JSX.Element {
  return (
    <Field.Root invalid>
      <Field.Label>Email</Field.Label>
      <Input placeholder="me@example.com" />
      <Field.ErrorText>Enter a valid email address.</Field.ErrorText>
    </Field.Root>
  );
}

/** Add supporting copy beneath the email input. */
export function FieldWithHelperText(): JSX.Element {
  return (
    <Field.Root>
      <Field.Label>Email</Field.Label>
      <Input placeholder="me@example.com" />
      <Field.HelperText>We only use your email to sign you in.</Field.HelperText>
    </Field.Root>
  );
}

/** Associate the field label with a multiline control. */
export function FieldWithTextarea(): JSX.Element {
  return (
    <Field.Root>
      <Field.Label>Message</Field.Label>
      <Textarea placeholder="Write your message" />
    </Field.Root>
  );
}

/** Show an optional badge in the required-indicator slot. */
export function FieldWithOptional(): JSX.Element {
  return (
    <Field.Root>
      <Field.Label>
        Email
        <Field.RequiredIndicator
          fallback={
            <Badge size="xs" variant="surface">
              Optional
            </Badge>
          }
        />
      </Field.Label>
      <Input placeholder="me@example.com" />
    </Field.Root>
  );
}

/** Mark the input required through Field and its label indicator. */
export function FieldWithRequired(): JSX.Element {
  return (
    <Field.Root required>
      <Field.Label>
        Email
        <Field.RequiredIndicator />
      </Field.Label>
      <Input placeholder="me@example.com" />
    </Field.Root>
  );
}
