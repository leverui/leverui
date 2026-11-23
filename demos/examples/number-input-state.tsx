import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Button, Field, NumberInput, type NumberInputValueChangeDetails } from '../../src';
import { NumberInputExampleControl } from './number-input-standard';

/** Keep the number in a caller-owned Solid signal. */
export function NumberInputControlled(): JSX.Element {
  const [value, setValue] = createSignal<number | null>(10);

  /** Copy the machine's number into caller state. */
  function updateValue(details: NumberInputValueChangeDetails): void {
    setValue(details.value);
  }

  return (
    <NumberInput.Root style={{ 'max-width': '200px' }} value={value()} onValueChange={updateValue}>
      <NumberInputExampleControl />
    </NumberInput.Root>
  );
}

/** Recreate the form's required number field with Solid state. */
export function NumberInputHookForm(): JSX.Element {
  const [value, setValue] = createSignal<number | null>(null);
  const [error, setError] = createSignal('');

  /** Update the controlled field and clear an old submit error. */
  function updateValue(details: NumberInputValueChangeDetails): void {
    setValue(details.value);
    setError('');
  }

  /** Validate the required number before submitting it. */
  function submit(event: SubmitEvent): void {
    event.preventDefault();
    if (value() === null) {
      setError('Number is required');
      return;
    }
    console.log({ number: value() });
  }

  return (
    <form onSubmit={submit}>
      <Field.Root invalid={Boolean(error())}>
        <Field.Label>Number</Field.Label>
        <NumberInput.Root name="number" value={value()} onValueChange={updateValue}>
          <NumberInputExampleControl />
        </NumberInput.Root>
        <Field.ErrorText>{error()}</Field.ErrorText>
      </Field.Root>
      <Button size="sm" type="submit" style={{ 'margin-top': 'var(--lui-spacing-4)' }}>
        Submit
      </Button>
    </form>
  );
}
