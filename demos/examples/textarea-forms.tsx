import { createSignal, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Button, Field, Input, Stack, Textarea } from '../../src';

/** Show the issue-details form. */
export function TextareaWithForm(): JSX.Element {
  /** Keep the story in place after a native form submission. */
  function submitForm(event: SubmitEvent): void {
    event.preventDefault();
    console.log('submitted');
  }

  return (
    <form onSubmit={submitForm}>
      <Stack gap="4" style={{ 'max-width': 'var(--lui-sizes-sm)' }}>
        <Field.Root>
          <Field.Label>Issue details</Field.Label>
          <Textarea placeholder="Type your message here..." />
          <Field.HelperText>
            You can @mention people and refer to issues and pull requests.
          </Field.HelperText>
        </Field.Root>
        <Button
          style={{ 'align-self': 'flex-start', 'margin-top': 'var(--lui-spacing-3)' }}
          variant="solid"
          type="submit"
        >
          Submit
        </Button>
      </Stack>
    </form>
  );
}

/** Mirror the two-field required form with native Solid state. */
export function TextareaWithHookForm(): JSX.Element {
  const [usernameError, setUsernameError] = createSignal(false);
  const [bioError, setBioError] = createSignal(false);
  const [submitted, setSubmitted] = createSignal(false);

  /** Revalidate the username after the first submit attempt. */
  function updateUsername(event: InputEvent & { currentTarget: HTMLInputElement }): void {
    if (submitted()) setUsernameError(!event.currentTarget.value.trim());
  }

  /** Revalidate the bio after the first submit attempt. */
  function updateBio(event: InputEvent & { currentTarget: HTMLTextAreaElement }): void {
    if (submitted()) setBioError(!event.currentTarget.value.trim());
  }

  /** Validate both native values before reporting submitted data. */
  function submitForm(event: SubmitEvent): void {
    event.preventDefault();
    const data = new FormData(event.currentTarget as HTMLFormElement);
    const username = String(data.get('username') ?? '').trim();
    const bio = String(data.get('bio') ?? '').trim();
    setSubmitted(true);
    setUsernameError(!username);
    setBioError(!bio);
    if (username && bio) console.log({ username, bio });
  }

  return (
    <form onSubmit={submitForm}>
      <Stack gap="4" align="flex-start" style={{ 'max-width': 'var(--lui-sizes-sm)' }}>
        <Field.Root invalid={usernameError()}>
          <Field.Label>Username</Field.Label>
          <Input name="username" placeholder="@username" onInput={updateUsername} />
          <Show when={usernameError()}>
            <Field.ErrorText>Username is required</Field.ErrorText>
          </Show>
        </Field.Root>
        <Field.Root invalid={bioError()}>
          <Field.Label>Profile bio</Field.Label>
          <Textarea name="bio" placeholder="I am ..." onInput={updateBio} />
          <Field.HelperText>A short description of yourself</Field.HelperText>
          <Show when={bioError()}>
            <Field.ErrorText>Bio is required</Field.ErrorText>
          </Show>
        </Field.Root>
        <Button type="submit">Submit</Button>
      </Stack>
    </form>
  );
}
