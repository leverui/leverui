import { parseDate } from '@internationalized/date';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { DatePicker } from '../src';

/** Submit the primitive's native hidden date field through a regular HTML form. */
function DatePickerForm(): JSX.Element {
  const [submitted, setSubmitted] = createSignal('');

  /** Read the same FormData entry a consumer receives on submit. */
  function submitForm(event: SubmitEvent & { currentTarget: HTMLFormElement }): void {
    event.preventDefault();
    setSubmitted(String(new FormData(event.currentTarget).get('arrival') ?? ''));
  }

  return (
    <>
      <form onSubmit={submitForm}>
        <DatePicker.Root name="arrival" defaultFocusedValue={parseDate('2026-03-14')}>
          <DatePicker.Label>Arrival date</DatePicker.Label>
          <DatePicker.Control>
            <DatePicker.Input data-testid="date-picker-form-input" />
            <DatePicker.Trigger aria-label="Open arrival calendar" />
          </DatePicker.Control>
          <DatePicker.Positioner>
            <DatePicker.Content>
              <DatePicker.View view="day">
                <DatePicker.Header />
                <DatePicker.DayTable data-testid="date-picker-form-days" />
              </DatePicker.View>
            </DatePicker.Content>
          </DatePicker.Positioner>
        </DatePicker.Root>
        <button type="submit">Submit arrival</button>
      </form>
      <output data-testid="date-picker-form-result">{submitted()}</output>
    </>
  );
}

const meta = {
  title: 'Components/DatePicker/Form',
  component: DatePickerForm,
} satisfies Meta<typeof DatePickerForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = { render: DatePickerForm };
