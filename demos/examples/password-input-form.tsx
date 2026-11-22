import { type JSX } from '@solidjs/web';
import { Button, Field, Input, PasswordInput, Stack } from '../../src';

/** Reproduce the username and password form with native submission. */
export function PasswordInputWithHookForm(): JSX.Element {
  /** Report both native values without leaving the gallery. */
  function submitForm(event: SubmitEvent): void {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const values = new FormData(form);
    console.log({ username: values.get('username'), password: values.get('password') });
  }

  return (
    <form onSubmit={submitForm}>
      <Stack gap="4" align="flex-start" style={{ 'max-width': 'var(--leverui-sizes-sm)' }}>
        <Field.Root>
          <Field.Label>Username</Field.Label>
          <Input name="username" />
          <Field.ErrorText />
        </Field.Root>
        <Field.Root>
          <Field.Label>Password</Field.Label>
          <PasswordInput name="password" />
          <Field.ErrorText />
        </Field.Root>
        <Button type="submit">Submit</Button>
      </Stack>
    </form>
  );
}
