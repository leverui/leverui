import { createSignal, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Button, Fieldset, RadioGroup } from '../../src';
import { RadioChoices } from './radio-choices';

/** Match the form's validation with a native Solid form. */
export function RadioWithHookForm(): JSX.Element {
  const [value, setValue] = createSignal<string | null>(null);
  const [invalid, setInvalid] = createSignal(false);

  /** Keep radio selection and validation in sync. */
  function updateValue(details: { value: string | null }): void {
    setValue(details.value);
    setInvalid(false);
  }

  /** Report a missing selection without navigating away. */
  function submitForm(event: SubmitEvent): void {
    event.preventDefault();
    if (!value()) {
      setInvalid(true);
      return;
    }
    console.log({ value: value() });
  }

  return (
    <form onSubmit={submitForm}>
      <Fieldset.Root invalid={invalid()}>
        <Fieldset.Legend>Delivery method</Fieldset.Legend>
        <RadioGroup.Root name="value" value={value()} onValueChange={updateValue}>
          <RadioChoices />
        </RadioGroup.Root>
        <Show when={invalid()}>
          <Fieldset.ErrorText>Choose a delivery method</Fieldset.ErrorText>
        </Show>
        <Button size="sm" type="submit" style={{ 'align-self': 'flex-start' }}>
          Submit
        </Button>
      </Fieldset.Root>
    </form>
  );
}
