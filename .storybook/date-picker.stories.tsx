import { parseDate } from '@internationalized/date';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Portal } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { DatePicker } from '../src';

/** Compose all three views around one date machine. */
function CalendarViews(): JSX.Element {
  return (
    <Portal>
      <DatePicker.Positioner>
        <DatePicker.Content data-testid="date-picker-content">
          <DatePicker.View view="day">
            <DatePicker.Header />
            <DatePicker.DayTable data-testid="date-picker-days" />
          </DatePicker.View>
          <DatePicker.View view="month">
            <DatePicker.Header />
            <DatePicker.MonthTable data-testid="date-picker-months" />
          </DatePicker.View>
          <DatePicker.View view="year">
            <DatePicker.Header />
            <DatePicker.YearTable data-testid="date-picker-years" />
          </DatePicker.View>
        </DatePicker.Content>
      </DatePicker.Positioner>
    </Portal>
  );
}

/** Show the labeled input and keyboard-accessible popup calendar. */
function BasicDatePickerStory(): JSX.Element {
  return (
    <>
      <DatePicker.Root name="birthday" defaultFocusedValue={parseDate('2026-03-14')}>
        <DatePicker.Label>Date of birth</DatePicker.Label>
        <DatePicker.Control>
          <DatePicker.Input data-testid="date-picker-input" />
          <DatePicker.IndicatorGroup>
            <DatePicker.Trigger aria-label="Open calendar">📅</DatePicker.Trigger>
            <DatePicker.ClearTrigger aria-label="Clear date" />
          </DatePicker.IndicatorGroup>
        </DatePicker.Control>
        <CalendarViews />
      </DatePicker.Root>
    </>
  );
}

const meta = {
  title: 'Components/DatePicker',
  component: BasicDatePickerStory,
} satisfies Meta<typeof BasicDatePickerStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = { render: BasicDatePickerStory };

/** Expose week numbers and locale-specific weekday labels. */
function WeekNumbersDatePickerStory(): JSX.Element {
  return (
    <>
      <DatePicker.Root
        locale="de-DE"
        showWeekNumbers
        defaultOpen
        defaultFocusedValue={parseDate('2026-03-14')}
      >
        <DatePicker.Label>Datum</DatePicker.Label>
        <DatePicker.Control>
          <DatePicker.Input />
          <DatePicker.Trigger>Kalender</DatePicker.Trigger>
        </DatePicker.Control>
        <DatePicker.Positioner>
          <DatePicker.Content>
            <DatePicker.View view="day">
              <DatePicker.Header />
              <DatePicker.DayTable data-testid="date-picker-week-days" />
            </DatePicker.View>
          </DatePicker.Content>
        </DatePicker.Positioner>
      </DatePicker.Root>
    </>
  );
}

export const WeekNumbers: Story = { render: WeekNumbersDatePickerStory };

/** Keep a caller-owned range signal synchronized with the calendar. */
function ControlledRangeDatePickerStory(): JSX.Element {
  const [value, setValue] = createSignal<DatePicker.DateValue[]>([
    parseDate('2026-03-14'),
    parseDate('2026-03-20'),
  ]);

  /** Apply a range change emitted by the primitive and Zag. */
  function recordValue(details: DatePicker.ValueChangeDetails): void {
    setValue(details.value);
  }

  /** Demonstrate external changes to a controlled calendar. */
  function setNextRange(): void {
    setValue([parseDate('2026-04-05'), parseDate('2026-04-12')]);
  }

  return (
    <>
      <button type="button" onClick={setNextRange}>
        Set next range
      </button>
      <DatePicker.Root selectionMode="range" value={value()} onValueChange={recordValue}>
        <DatePicker.Label>Travel dates</DatePicker.Label>
        <DatePicker.Control>
          <DatePicker.Input index={0} data-testid="date-picker-range-start" />
          <DatePicker.Input index={1} data-testid="date-picker-range-end" />
          <DatePicker.Trigger>Calendar</DatePicker.Trigger>
        </DatePicker.Control>
        <output data-testid="date-picker-range-value">
          {value()
            .map(
              /** Display each date without changing its calendar value. */
              (date) => date.toString(),
            )
            .join(', ')}
        </output>
        <CalendarViews />
      </DatePicker.Root>
    </>
  );
}

export const ControlledRange: Story = { render: ControlledRangeDatePickerStory };
