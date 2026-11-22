import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Box, Button, Field, HStack, Input, Stack } from '../../src';
import './field-layout.css';

/** Pair an email input with the required error. */
export function InputErrorText(): JSX.Element {
  return (
    <Field.Root invalid>
      <Field.Label>Email</Field.Label>
      <Input placeholder="Enter your email" />
      <Field.ErrorText>This field is required</Field.ErrorText>
    </Field.Root>
  );
}

/** Compare subtle and outline fields with required indicators. */
export function InputField(): JSX.Element {
  return (
    <HStack gap="10" style={{ width: '100%' }}>
      <Field.Root required>
        <Field.Label>
          Email <Field.RequiredIndicator />
        </Field.Label>
        <Input placeholder="me@example.com" variant="subtle" />
      </Field.Root>
      <Field.Root required>
        <Field.Label>
          Email <Field.RequiredIndicator />
        </Field.Label>
        <Input placeholder="me@example.com" variant="outline" />
      </Field.Root>
    </HStack>
  );
}

/** Explain the required email field below its control. */
export function InputHelperText(): JSX.Element {
  return (
    <Field.Root required>
      <Field.Label>
        Email <Field.RequiredIndicator />
      </Field.Label>
      <Input placeholder="Enter your email" />
      <Field.HelperText>We'll never share your email.</Field.HelperText>
    </Field.Root>
  );
}

/** Compare custom focus and error colors across three variants. */
export function InputFocusErrorColor(): JSX.Element {
  return (
    <Stack gap="4">
      <Field.Root>
        <Field.Label>focusColor=lime</Field.Label>
        <Input placeholder="Focus me" style={{ '--leverui-input-focus-color': 'lime' }} />
      </Field.Root>
      <Field.Root invalid>
        <Field.Label>errorColor=green</Field.Label>
        <Input placeholder="Email" style={{ '--leverui-input-error-color': 'green' }} />
      </Field.Root>
      <Field.Root invalid>
        <Field.Label>errorColor=blue</Field.Label>
        <Input placeholder="Password" style={{ '--leverui-input-error-color': 'blue' }} />
      </Field.Root>
      <Field.Root invalid>
        <Field.Label>variant=outline,focusColor=error</Field.Label>
        <Input placeholder="Focus me" variant="outline" />
      </Field.Root>
      <Field.Root invalid>
        <Field.Label>variant=subtle,focusColor=error</Field.Label>
        <Input placeholder="Focus me" variant="subtle" />
      </Field.Root>
      <Field.Root invalid>
        <Field.Label>variant=flushed,focusColor=error</Field.Label>
        <Input placeholder="Focus me" variant="flushed" />
      </Field.Root>
    </Stack>
  );
}

/** Float the email label while the native input has focus or text. */
export function InputFloatingLabel(): JSX.Element {
  const [value, setValue] = createSignal('');
  const [focused, setFocused] = createSignal(false);

  /** Track native edits without losing the caller-owned input value. */
  function updateValue(event: InputEvent & { currentTarget: HTMLInputElement }): void {
    setValue(event.currentTarget.value);
  }

  /** Move the label when the input gains focus. */
  function focus(): void {
    setFocused(true);
  }

  /** Restore the resting label only when the input is empty. */
  function blur(): void {
    setFocused(false);
  }

  /** Follow both the focus state and entered value. */
  function shouldFloat(): boolean {
    return Boolean(value() || focused());
  }

  return (
    <Field.Root>
      <Box class="field-example-floating-host">
        <Input
          value={value()}
          onInput={updateValue}
          onFocus={focus}
          onBlur={blur}
          data-float={shouldFloat() || undefined}
        />
        <Field.Label data-float={shouldFloat() || undefined} class="field-example-floating-label">
          Email
        </Field.Label>
      </Box>
      <Field.ErrorText>This field is required</Field.ErrorText>
    </Field.Root>
  );
}

/** Submit the two unvalidated fields from the Hook Form example. */
export function InputHookForm(): JSX.Element {
  /** Log native fields without inventing validation rules absent. */
  function submit(event: SubmitEvent): void {
    event.preventDefault();
    const form = event.currentTarget;
    if (!(form instanceof HTMLFormElement)) throw new TypeError('Expected a form.');
    const data = new FormData(form);
    console.log({ firstName: data.get('firstName'), lastName: data.get('lastName') });
  }

  return (
    <form onSubmit={submit}>
      <Stack gap="4" align="flex-start" style={{ 'max-width': 'var(--leverui-sizes-sm)' }}>
        <Field.Root>
          <Field.Label>First name</Field.Label>
          <Input name="firstName" />
          <Field.ErrorText />
        </Field.Root>
        <Field.Root>
          <Field.Label>Last name</Field.Label>
          <Input name="lastName" />
          <Field.ErrorText />
        </Field.Root>
        <Button type="submit">Submit</Button>
      </Stack>
    </form>
  );
}
