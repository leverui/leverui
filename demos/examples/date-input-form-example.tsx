import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Button, DateInput, Field, Input, Stack } from '../../src';
import { DateInputParts } from './date-input-common';
import './date-input-examples.css';

/** Validate a name and date through native Solid-owned form state. */
export function DateInputWithHookForm(): JSX.Element {
  const [name, setName] = createSignal('');
  const [date, setDate] = createSignal<DateInput.DateValue[]>([]);
  const [submitted, setSubmitted] = createSignal(false);

  /** Keep the name field synchronized with its validation value. */
  function updateName(event: InputEvent & { currentTarget: HTMLInputElement }): void {
    setName(event.currentTarget.value);
  }

  /** Keep the selected date synchronized with its validation value. */
  function updateDate(details: DateInput.ValueChangeDetails): void {
    setDate(details.value);
  }

  /** Validate both fields before logging the submitted values. */
  function submit(event: SubmitEvent): void {
    event.preventDefault();
    setSubmitted(true);
    if (name().trim() && date().length > 0) {
      console.log({ name: name(), dob: date() });
    }
  }

  return (
    <form onSubmit={submit}>
      <Stack gap="4" align="flex-start" class="example-date-input">
        <Field.Root invalid={submitted() && !name().trim()}>
          <Field.Label>Name</Field.Label>
          <Input placeholder="Enter your name" value={name()} onInput={updateName} />
          <Field.ErrorText>Name is required</Field.ErrorText>
        </Field.Root>
        <Field.Root invalid={submitted() && date().length === 0}>
          <DateInput.Root
            value={date()}
            onValueChange={updateDate}
            invalid={submitted() && date().length === 0}
          >
            <DateInputParts label="Date of birth" />
          </DateInput.Root>
          <Field.ErrorText>Date of birth is required</Field.ErrorText>
        </Field.Root>
        <Button type="submit">Submit</Button>
      </Stack>
    </form>
  );
}
