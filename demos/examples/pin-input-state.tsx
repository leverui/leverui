import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import {
  Button,
  ButtonGroup,
  Field,
  PinInput,
  Stack,
  Text,
  usePinInput,
  type PinInputValueChangeDetails,
} from '../../src';

/** Keep all four code characters in a caller-owned Solid signal. */
export function PinInputControlled(): JSX.Element {
  const [value, setValue] = createSignal(['', '', '', '']);
  return (
    <PinInput.Root
      count={4}
      value={value()}
      onValueChange={
        /** Copy the machine's complete indexed value into caller state. */
        (details) => setValue(details.value)
      }
    >
      <PinInput.HiddenInput />
      <PinInput.Control>
        <PinInput.Input index={0} />
        <PinInput.Input index={1} />
        <PinInput.Input index={2} />
        <PinInput.Input index={3} />
      </PinInput.Control>
    </PinInput.Root>
  );
}

/** Expose a caller-owned machine with set and clear actions. */
export function PinInputWithStore(): JSX.Element {
  const store = usePinInput({ count: 4 });

  /** Replace the current code with the example value. */
  function setCode(): void {
    store().setValue(['1', '2', '3', '4']);
  }

  /** Clear each indexed field through the external machine. */
  function clearCode(): void {
    store().clearValue();
  }

  return (
    <Stack align="flex-start">
      <PinInput.RootProvider value={store}>
        <PinInput.Control>
          <PinInput.Input index={0} />
          <PinInput.Input index={1} />
          <PinInput.Input index={2} />
          <PinInput.Input index={3} />
        </PinInput.Control>
      </PinInput.RootProvider>
      <ButtonGroup variant="outline" size="sm">
        <Button onClick={setCode}>Set value</Button>
        <Button onClick={clearCode}>Clear value</Button>
      </ButtonGroup>
    </Stack>
  );
}

/** Validate a four digit code in an idiomatic Solid form. */
export function PinInputWithHookForm(): JSX.Element {
  const [value, setValue] = createSignal(['', '', '', '']);
  const [error, setError] = createSignal('');
  const [invalid, setInvalid] = createSignal(false);

  /** Copy the current code into form state and clear an old error. */
  function updateValue(details: PinInputValueChangeDetails): void {
    setValue(details.value);
    setError('');
    if (details.value.every(Boolean)) setInvalid(false);
  }

  /** Match the schema's untouched and partial validation states. */
  function submit(event: SubmitEvent): void {
    event.preventDefault();
    const digits = value().filter(Boolean);
    if (digits.length < 4) {
      setInvalid(true);
      setError(digits.length === 0 ? 'Enter all 4 digits.' : '');
      return;
    }
    setInvalid(false);
    console.log({ pin: value() });
  }

  return (
    <form onSubmit={submit}>
      <Stack gap="4" align="flex-start" style={{ 'max-width': 'var(--leverui-sizes-sm)' }}>
        <Field.Root invalid={invalid()}>
          <PinInput.Root count={4} value={value()} onValueChange={updateValue}>
            <PinInput.HiddenInput />
            <PinInput.Control>
              <PinInput.Input index={0} />
              <PinInput.Input index={1} />
              <PinInput.Input index={2} />
              <PinInput.Input index={3} />
            </PinInput.Control>
          </PinInput.Root>
          <Field.ErrorText>{error()}</Field.ErrorText>
        </Field.Root>
        <Button type="submit">Submit</Button>
      </Stack>
    </form>
  );
}

/** Show when filling the fourth field submits its enclosing form. */
export function PinInputAutoSubmit(): JSX.Element {
  const [submitted, setSubmitted] = createSignal(false);

  /** Record a native submit without navigating away from the example. */
  function submit(event: SubmitEvent): void {
    event.preventDefault();
    setSubmitted(true);
  }

  /** Reset the status when an edit leaves the code incomplete. */
  function resetStatus(details: PinInputValueChangeDetails): void {
    if (
      details.value.some(
        /** Find an empty slot. */
        (digit) => !digit,
      )
    )
      setSubmitted(false);
  }

  return (
    <form onSubmit={submit}>
      <Stack gap="3">
        <PinInput.Root count={4} autoSubmit onValueChange={resetStatus}>
          <PinInput.HiddenInput name="pin" />
          <PinInput.Control>
            <PinInput.Input index={0} />
            <PinInput.Input index={1} />
            <PinInput.Input index={2} />
            <PinInput.Input index={3} />
          </PinInput.Control>
        </PinInput.Root>
        <Text
          textStyle="sm"
          style={{
            color: submitted()
              ? 'var(--leverui-colors-fg-success)'
              : 'var(--leverui-colors-fg-muted)',
          }}
        >
          {submitted()
            ? 'The form was submitted.'
            : 'The form submits when all digits are entered.'}
        </Text>
      </Stack>
    </form>
  );
}
