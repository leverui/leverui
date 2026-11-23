import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { CalendarIcon } from '@lucide/solid';
import { Button, DatePicker, Field, Input, Portal, Stack } from '../../src';

/** Submit the picker's native named input through a form. */
export function DatePickerForm(): JSX.Element {
  /** Show the serialized date after a valid submission. */
  function submit(event: SubmitEvent): void {
    event.preventDefault();
    const form = new FormData(event.currentTarget as HTMLFormElement);
    alert(JSON.stringify({ date: form.get('date') }));
  }

  return (
    <form onSubmit={submit}>
      <Stack gap="4" align="flex-start" style={{ 'max-width': 'var(--lui-sizes-sm)' }}>
        <DatePicker.Root name="date">
          <DatePicker.Label>Appointment date</DatePicker.Label>
          <DatePicker.Control>
            <DatePicker.Input required />
            <DatePicker.IndicatorGroup>
              <DatePicker.Trigger>
                <CalendarIcon />
              </DatePicker.Trigger>
            </DatePicker.IndicatorGroup>
          </DatePicker.Control>
          <Portal>
            <DatePicker.Positioner>
              <DatePicker.Content>
                <DatePicker.View view="day">
                  <DatePicker.Header />
                  <DatePicker.DayTable />
                </DatePicker.View>
                <DatePicker.View view="month">
                  <DatePicker.Header />
                  <DatePicker.MonthTable />
                </DatePicker.View>
                <DatePicker.View view="year">
                  <DatePicker.Header />
                  <DatePicker.YearTable />
                </DatePicker.View>
              </DatePicker.Content>
            </DatePicker.Positioner>
          </Portal>
        </DatePicker.Root>
        <Button size="sm" type="submit">
          Submit
        </Button>
      </Stack>
    </form>
  );
}

/** Validate a first name and caller-owned date selection. */
export function DatePickerHookForm(): JSX.Element {
  const [firstName, setFirstName] = createSignal('');
  const [dob, setDob] = createSignal<DatePicker.DateValue[]>([]);
  const [submitted, setSubmitted] = createSignal(false);

  /** Keep the native text field synchronized with Solid state. */
  function updateName(event: InputEvent & { currentTarget: HTMLInputElement }): void {
    setFirstName(event.currentTarget.value);
  }

  /** Keep the selected date synchronized with Solid state. */
  function updateDob(details: DatePicker.ValueChangeDetails): void {
    setDob(details.value);
  }

  /** Report validation errors or show the submitted payload. */
  function submit(event: SubmitEvent): void {
    event.preventDefault();
    setSubmitted(true);
    const selected = dob()[0];
    if (firstName().trim() && selected) {
      alert(JSON.stringify({ firstName: firstName(), dob: selected.toString() }));
    }
  }

  return (
    <form onSubmit={submit}>
      <Stack gap="4" align="flex-start" style={{ 'max-width': 'var(--lui-sizes-sm)' }}>
        <Field.Root invalid={submitted() && !firstName().trim()}>
          <Field.Label>First name</Field.Label>
          <Input value={firstName()} onInput={updateName} />
          <Field.ErrorText>First name is required</Field.ErrorText>
        </Field.Root>
        <Field.Root invalid={submitted() && dob().length === 0}>
          <DatePicker.Root
            value={dob()}
            onValueChange={updateDob}
            invalid={submitted() && dob().length === 0}
          >
            <DatePicker.Label>Date of birth</DatePicker.Label>
            <DatePicker.Control>
              <DatePicker.Input placeholder="Select date" />
              <DatePicker.IndicatorGroup>
                <DatePicker.Trigger>
                  <CalendarIcon />
                </DatePicker.Trigger>
              </DatePicker.IndicatorGroup>
            </DatePicker.Control>
            <Portal>
              <DatePicker.Positioner>
                <DatePicker.Content>
                  <DatePicker.View view="day">
                    <DatePicker.Header />
                    <DatePicker.DayTable />
                  </DatePicker.View>
                  <DatePicker.View view="month">
                    <DatePicker.Header />
                    <DatePicker.MonthTable />
                  </DatePicker.View>
                  <DatePicker.View view="year">
                    <DatePicker.Header />
                    <DatePicker.YearTable />
                  </DatePicker.View>
                </DatePicker.Content>
              </DatePicker.Positioner>
            </Portal>
          </DatePicker.Root>
          <Field.ErrorText>Date of birth is required</Field.ErrorText>
        </Field.Root>
        <Button size="sm" type="submit">
          Submit
        </Button>
      </Stack>
    </form>
  );
}

/** Connect Field label, invalid state, and control ID to Date Picker. */
export function DatePickerField(): JSX.Element {
  const [invalid, setInvalid] = createSignal(false);

  /** Toggle Field validation without resetting the nested picker. */
  function toggleInvalid(): void {
    setInvalid(
      /** Flip the invalid state. */
      (current) => !current,
    );
  }

  return (
    <Stack gap="6" align="flex-start" style={{ 'max-width': '20rem' }}>
      <Button onClick={toggleInvalid} variant="outline" size="sm">
        Toggle invalid
      </Button>
      <Field.Root invalid={invalid()}>
        <Field.Label>Date of birth</Field.Label>
        <Field.Context>
          {
            /** Share Field's accessible label and input IDs with the picker. */
            (context) => (
              <DatePicker.Root
                invalid={context().invalid}
                ids={{
                  /** Resolve the current Field label ID. */
                  label: () => context().ids.label,
                  /** Resolve the current Field control ID. */
                  input: () => context().ids.control,
                }}
              >
                <DatePicker.Control>
                  <DatePicker.Input />
                  <DatePicker.IndicatorGroup>
                    <DatePicker.Trigger>
                      <CalendarIcon />
                    </DatePicker.Trigger>
                  </DatePicker.IndicatorGroup>
                </DatePicker.Control>
                <Portal>
                  <DatePicker.Positioner>
                    <DatePicker.Content>
                      <DatePicker.View view="day">
                        <DatePicker.Header />
                        <DatePicker.DayTable />
                      </DatePicker.View>
                      <DatePicker.View view="month">
                        <DatePicker.Header />
                        <DatePicker.MonthTable />
                      </DatePicker.View>
                      <DatePicker.View view="year">
                        <DatePicker.Header />
                        <DatePicker.YearTable />
                      </DatePicker.View>
                    </DatePicker.Content>
                  </DatePicker.Positioner>
                </Portal>
              </DatePicker.Root>
            )
          }
        </Field.Context>
        <Field.ErrorText>Date of birth is required</Field.ErrorText>
      </Field.Root>
    </Stack>
  );
}
