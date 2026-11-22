import { CalendarDate, parseDate } from '@internationalized/date';
import { Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { DatePicker } from '../src';

type Period = 'month' | 'year';
type SelectionMode = 'single' | 'range';

/** Display a month as a stable numeric value in the input. */
function formatMonth(date: DatePicker.DateValue): string {
  return `${String(date.month).padStart(2, '0')}/${date.year}`;
}

/** Parse a month without accepting malformed or out-of-range values. */
function parseMonth(value: string): DatePicker.DateValue | undefined {
  const match = /^(0?[1-9]|1[0-2])\/(\d{4})$/.exec(value);
  return match ? new CalendarDate(Number(match[2]), Number(match[1]), 1) : undefined;
}

/** Display only the selected year in a year picker. */
function formatYear(date: DatePicker.DateValue): string {
  return String(date.year);
}

/** Parse a four-digit year into its first calendar day. */
function parseYear(value: string): DatePicker.DateValue | undefined {
  return /^\d{4}$/.test(value) ? new CalendarDate(Number(value), 1, 1) : undefined;
}

/** Restrict the machine to a selected period while retaining its native input. */
function PeriodPicker(props: { period: Period; selectionMode: SelectionMode }): JSX.Element {
  return (
    <>
      <DatePicker.Root
        inline
        selectionMode={props.selectionMode}
        defaultView={props.period}
        minView={props.period}
        defaultFocusedValue={parseDate('2026-03-14')}
        format={props.period === 'month' ? formatMonth : formatYear}
        parse={props.period === 'month' ? parseMonth : parseYear}
      >
        <DatePicker.Label>
          {props.selectionMode === 'range' ? 'Select range' : 'Select period'}
        </DatePicker.Label>
        <DatePicker.Control>
          <DatePicker.Input index={0} data-testid="date-picker-period-start" />
          <Show when={props.selectionMode === 'range'}>
            <DatePicker.Input index={1} data-testid="date-picker-period-end" />
          </Show>
        </DatePicker.Control>
        <DatePicker.Context>
          {
            /** Expose machine values independently of input formatting. */
            (api) => (
              <output data-testid="date-picker-period-value">
                {api().value[0]?.toString()} {api().value[1]?.toString()}
              </output>
            )
          }
        </DatePicker.Context>
        <DatePicker.Content>
          <Show when={props.period === 'month'}>
            <DatePicker.View view="month">
              <DatePicker.Header />
              <DatePicker.MonthTable data-testid="date-picker-period-months" />
            </DatePicker.View>
          </Show>
          <DatePicker.View view="year">
            <DatePicker.Header />
            <DatePicker.YearTable data-testid="date-picker-period-years" />
          </DatePicker.View>
        </DatePicker.Content>
      </DatePicker.Root>
    </>
  );
}

const meta = {
  title: 'Components/DatePicker/Period Guide',
  component: PeriodPicker,
} satisfies Meta<typeof PeriodPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Month: Story = { args: { period: 'month', selectionMode: 'single' } };
export const MonthRange: Story = { args: { period: 'month', selectionMode: 'range' } };
export const Year: Story = { args: { period: 'year', selectionMode: 'single' } };
export const YearRange: Story = { args: { period: 'year', selectionMode: 'range' } };

/** Keep restricted period selection inside a dismissible popup. */
function PopupPeriodPicker(props: { period: Period }): JSX.Element {
  return (
    <>
      <DatePicker.Root
        defaultView={props.period}
        minView={props.period}
        closeOnSelect={false}
        defaultFocusedValue={parseDate('2026-03-14')}
        format={props.period === 'month' ? formatMonth : formatYear}
        parse={props.period === 'month' ? parseMonth : parseYear}
      >
        <DatePicker.Label>Choose {props.period}</DatePicker.Label>
        <DatePicker.Control>
          <DatePicker.Input data-testid="date-picker-popup-period-input" />
          <DatePicker.Trigger aria-label={`Open ${props.period} picker`} />
        </DatePicker.Control>
        <DatePicker.Positioner>
          <DatePicker.Content data-testid="date-picker-popup-period-content">
            <DatePicker.View view={props.period}>
              <DatePicker.Header />
              <Show
                when={props.period === 'month'}
                fallback={<DatePicker.YearTable data-testid="date-picker-popup-period-years" />}
              >
                <DatePicker.MonthTable data-testid="date-picker-popup-period-months" />
              </Show>
            </DatePicker.View>
          </DatePicker.Content>
        </DatePicker.Positioner>
      </DatePicker.Root>
    </>
  );
}

/** Render the popup period contract with concrete Storybook args. */
function MonthPopupPicker(): JSX.Element {
  return <PopupPeriodPicker period="month" />;
}

/** Render the year-only popup contract with concrete Storybook args. */
function YearPopupPicker(): JSX.Element {
  return <PopupPeriodPicker period="year" />;
}

export const MonthPopup: Story = {
  args: { period: 'month', selectionMode: 'single' },
  render: MonthPopupPicker,
};
export const YearPopup: Story = {
  args: { period: 'year', selectionMode: 'single' },
  render: YearPopupPicker,
};
