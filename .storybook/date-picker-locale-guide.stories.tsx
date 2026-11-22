import { CalendarDate, PersianCalendar, parseDate } from '@internationalized/date';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { DatePicker } from '../src';

/** Format a calendar date with day-first, two-digit year notation. */
function formatDayFirst(date: DatePicker.DateValue): string {
  return `${String(date.day).padStart(2, '0')}/${String(date.month).padStart(2, '0')}/${String(date.year % 100).padStart(2, '0')}`;
}

/** Reject invalid day-first input before passing it to the date machine. */
function parseDayFirst(value: string): DatePicker.DateValue | undefined {
  const match = /^(0?[1-9]|[12]\d|3[01])\/(0?[1-9]|1[0-2])\/(\d{2})$/.exec(value);
  if (!match) return undefined;
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = 2000 + Number(match[3]);
  const date = new CalendarDate(year, month, day);
  return date.day === day ? date : undefined;
}

/** Provide the Persian calendar requested by the fa-IR date formatter. */
function createPersianCalendar(identifier: string): PersianCalendar {
  if (identifier !== 'persian') throw new Error(`Unsupported calendar: ${identifier}`);
  return new PersianCalendar();
}

/** Keep the parser and formatter visible as the user edits the native input. */
function FormatParsePicker(): JSX.Element {
  return (
    <>
      <DatePicker.Root
        inline
        defaultValue={[parseDate('2026-03-14')]}
        defaultFocusedValue={parseDate('2026-03-14')}
        format={formatDayFirst}
        parse={parseDayFirst}
        placeholder="dd/mm/yy"
      >
        <DatePicker.Label>Day-first date</DatePicker.Label>
        <DatePicker.Control>
          <DatePicker.Input data-testid="date-picker-format-input" />
        </DatePicker.Control>
        <DatePicker.Context>
          {
            /** Show parsed calendar values apart from the display string. */
            (api) => (
              <output data-testid="date-picker-format-value">{api().value[0]?.toString()}</output>
            )
          }
        </DatePicker.Context>
        <DatePicker.Content>
          <DatePicker.View view="day">
            <DatePicker.Header />
            <DatePicker.DayTable data-testid="date-picker-format-days" />
          </DatePicker.View>
        </DatePicker.Content>
      </DatePicker.Root>
    </>
  );
}

const meta = {
  title: 'Components/DatePicker/Locale Guide',
  component: FormatParsePicker,
} satisfies Meta<typeof FormatParsePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FormatParse: Story = { render: FormatParsePicker };

/** Render a Jalali calendar through the primitive's calendar creation hook. */
function PersianPicker(): JSX.Element {
  return (
    <>
      <DatePicker.Root
        inline
        locale="fa-IR"
        createCalendar={createPersianCalendar}
        startOfWeek={6}
        defaultFocusedValue={parseDate('2026-03-14')}
      >
        <DatePicker.Label>تاریخ را انتخاب کنید</DatePicker.Label>
        <DatePicker.Control>
          <DatePicker.Input data-testid="date-picker-persian-input" />
        </DatePicker.Control>
        <DatePicker.Content>
          <DatePicker.View view="day">
            <DatePicker.Header />
            <DatePicker.DayTable data-testid="date-picker-persian-days" />
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
      </DatePicker.Root>
    </>
  );
}

export const Persian: Story = { render: PersianPicker };

/** Toggle fixed week rows without reconstructing the picker machine. */
function FixedWeeksPicker(): JSX.Element {
  const [fixed, setFixed] = createSignal(false);

  /** Change the visible week count through a reactive machine prop. */
  function toggleWeeks(): void {
    setFixed(!fixed());
  }

  return (
    <>
      <button type="button" onClick={toggleWeeks}>
        Toggle fixed weeks
      </button>
      <output data-testid="date-picker-fixed-state">{String(fixed())}</output>
      <DatePicker.Root inline fixedWeeks={fixed()} defaultFocusedValue={parseDate('2026-02-14')}>
        <DatePicker.Content>
          <DatePicker.View view="day">
            <DatePicker.DayTable data-testid="date-picker-fixed-days" />
          </DatePicker.View>
        </DatePicker.Content>
      </DatePicker.Root>
    </>
  );
}

export const FixedWeeks: Story = { render: FixedWeeksPicker };
