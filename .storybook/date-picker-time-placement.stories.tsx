import { CalendarDateTime, parseDate } from '@internationalized/date';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { DatePicker } from '../src';

/** Keep calendar selection and a native time input in one controlled value. */
function DateTimePicker(): JSX.Element {
  const [value, setValue] = createSignal([new CalendarDateTime(2026, 3, 14, 14, 30)]);

  /** Carry the current time into a newly selected calendar day. */
  function recordDate(details: DatePicker.ValueChangeDetails): void {
    const selected = details.value[0];
    if (!selected) {
      setValue([]);
      return;
    }
    const previous = value()[0];
    setValue([
      new CalendarDateTime(
        selected.year,
        selected.month,
        selected.day,
        previous?.hour ?? 0,
        previous?.minute ?? 0,
      ),
    ]);
  }

  /** Update the time segment without changing the selected day. */
  function recordTime(event: Event & { currentTarget: HTMLInputElement }): void {
    const [hour, minute] = event.currentTarget.value.split(':').map(Number);
    if (hour === undefined || minute === undefined) return;
    const current = value()[0] ?? new CalendarDateTime(2026, 3, 14, 0, 0);
    setValue([current.set({ hour, minute })]);
  }

  /** Expose an empty controlled value for the time-first composition check. */
  function clearDateTime(): void {
    setValue([]);
  }

  /** Format the selected time for the native input. */
  function timeValue(): string {
    const current = value()[0];
    if (!current) return '';
    return `${String(current.hour).padStart(2, '0')}:${String(current.minute).padStart(2, '0')}`;
  }

  return (
    <>
      <button type="button" onClick={clearDateTime}>
        Clear date and time
      </button>
      <DatePicker.Root
        inline
        value={value()}
        onValueChange={recordDate}
        closeOnSelect={false}
        defaultFocusedValue={parseDate('2026-03-14')}
      >
        <DatePicker.Label>Date and time</DatePicker.Label>
        <output data-testid="date-picker-time-value">{value()[0]?.toString() ?? ''}</output>
        <DatePicker.Content>
          <DatePicker.View view="day">
            <DatePicker.Header />
            <DatePicker.DayTable data-testid="date-picker-time-days" />
            <label for="date-picker-time-input">Time</label>
            <input
              id="date-picker-time-input"
              data-testid="date-picker-time-input"
              type="time"
              value={timeValue()}
              onChange={recordTime}
            />
          </DatePicker.View>
        </DatePicker.Content>
      </DatePicker.Root>
    </>
  );
}

const meta = {
  title: 'Components/DatePicker/Time and Placement',
  component: DateTimePicker,
} satisfies Meta<typeof DateTimePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithTime: Story = { render: DateTimePicker };

/** Position a popup above the trigger through the primitive's positioning option. */
function TopPlacementPicker(): JSX.Element {
  return (
    <>
      <div style={{ 'padding-top': '320px' }}>
        <DatePicker.Root
          positioning={{ placement: 'top-start' }}
          defaultFocusedValue={parseDate('2026-03-14')}
        >
          <DatePicker.Label>Travel date</DatePicker.Label>
          <DatePicker.Control>
            <DatePicker.Input />
            <DatePicker.Trigger aria-label="Open travel calendar">📅</DatePicker.Trigger>
          </DatePicker.Control>
          <DatePicker.Positioner data-testid="date-picker-top-positioner">
            <DatePicker.Content>
              <DatePicker.View view="day">
                <DatePicker.Header />
                <DatePicker.DayTable data-testid="date-picker-top-days" />
              </DatePicker.View>
            </DatePicker.Content>
          </DatePicker.Positioner>
        </DatePicker.Root>
      </div>
    </>
  );
}

export const TopPlacement: Story = { render: TopPlacementPicker };
