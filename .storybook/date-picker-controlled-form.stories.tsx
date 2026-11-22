import { parseDate } from '@internationalized/date';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { DatePicker } from '../src';

/** Bind a required DatePicker to Solid form state and native FormData. */
function ControlledFormPicker(): JSX.Element {
  const [value, setValue] = createSignal<DatePicker.DateValue[]>([]);
  const [submitted, setSubmitted] = createSignal('');

  /** Keep the form controller's date synchronized with the primitive's machine. */
  function recordValue(details: DatePicker.ValueChangeDetails): void {
    setValue(details.value);
  }

  /** Compare the caller-owned date with the browser's submitted value. */
  function submitForm(event: SubmitEvent & { currentTarget: HTMLFormElement }): void {
    event.preventDefault();
    const formValue = new FormData(event.currentTarget).get('reservation');
    setSubmitted(`${value()[0]?.toString() ?? ''}|${String(formValue ?? '')}`);
  }

  return (
    <>
      <form onSubmit={submitForm}>
        <DatePicker.Root
          name="reservation"
          required
          value={value()}
          onValueChange={recordValue}
          defaultFocusedValue={parseDate('2026-03-14')}
        >
          <DatePicker.Label>Reservation date</DatePicker.Label>
          <DatePicker.Control>
            <DatePicker.Input data-testid="date-picker-controlled-form-input" />
            <DatePicker.Trigger aria-label="Open reservation calendar" />
          </DatePicker.Control>
          <DatePicker.Positioner>
            <DatePicker.Content>
              <DatePicker.View view="day">
                <DatePicker.Header />
                <DatePicker.DayTable data-testid="date-picker-controlled-form-days" />
              </DatePicker.View>
            </DatePicker.Content>
          </DatePicker.Positioner>
        </DatePicker.Root>
        <button type="submit">Submit reservation</button>
      </form>
      <output data-testid="date-picker-controlled-form-result">{submitted()}</output>
    </>
  );
}

const meta = {
  title: 'Components/DatePicker/Controlled Form',
  component: ControlledFormPicker,
} satisfies Meta<typeof ControlledFormPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = { render: ControlledFormPicker };
