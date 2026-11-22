import { parseDate } from '@internationalized/date';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { DatePicker } from '../src';

/** Render each calendar view under the same date machine. */
function Views(props: { children?: JSX.Element }): JSX.Element {
  return (
    <DatePicker.Content>
      {props.children}
      <DatePicker.View view="day">
        <DatePicker.Header />
        <DatePicker.DayTable data-testid="date-picker-state-days" />
      </DatePicker.View>
      <DatePicker.View view="month">
        <DatePicker.Header />
        <DatePicker.MonthTable data-testid="date-picker-state-months" />
      </DatePicker.View>
      <DatePicker.View view="year">
        <DatePicker.Header />
        <DatePicker.YearTable data-testid="date-picker-state-years" />
      </DatePicker.View>
    </DatePicker.Content>
  );
}

/** Mark one in-range Saturday unavailable to separate it from min/max limits. */
function isUnavailable(date: DatePicker.DateValue): boolean {
  return date.month === 3 && date.day === 14;
}

/** Show machine restrictions in the visible day grid. */
function ConstrainedPicker(): JSX.Element {
  return (
    <>
      <DatePicker.Root
        inline
        defaultFocusedValue={parseDate('2026-03-14')}
        min={parseDate('2026-03-10')}
        max={parseDate('2026-03-20')}
        isDateUnavailable={isUnavailable}
      >
        <DatePicker.Label>Constrained date</DatePicker.Label>
        <Views />
      </DatePicker.Root>
    </>
  );
}

const meta = {
  title: 'Components/DatePicker/State',
  component: ConstrainedPicker,
} satisfies Meta<typeof ConstrainedPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Constrained: Story = { render: ConstrainedPicker };

/** Show disabled and read-only fields with a common visible calendar. */
function InertPicker(): JSX.Element {
  return (
    <>
      <DatePicker.Root disabled defaultFocusedValue={parseDate('2026-03-14')}>
        <DatePicker.Label>Disabled date</DatePicker.Label>
        <DatePicker.Control>
          <DatePicker.Input data-testid="date-picker-disabled-input" />
          <DatePicker.Trigger aria-label="Open disabled calendar" />
        </DatePicker.Control>
      </DatePicker.Root>
      <DatePicker.Root readOnly inline defaultFocusedValue={parseDate('2026-03-14')}>
        <DatePicker.Label>Read-only date</DatePicker.Label>
        <DatePicker.Control>
          <DatePicker.Input data-testid="date-picker-readonly-input" />
        </DatePicker.Control>
        <DatePicker.Content>
          <DatePicker.View view="day">
            <DatePicker.DayTable data-testid="date-picker-readonly-days" />
          </DatePicker.View>
        </DatePicker.Content>
      </DatePicker.Root>
    </>
  );
}

export const Inert: Story = { render: InertPicker };

/** Keep open and view state owned by Solid signals. */
function ControlledPicker(): JSX.Element {
  const [open, setOpen] = createSignal(false);
  const [view, setView] = createSignal<DatePicker.DateView>('day');

  /** Synchronize changes from the primitive's open state machine. */
  function recordOpen(details: DatePicker.OpenChangeDetails): void {
    setOpen(details.open);
  }

  /** Synchronize changes from the primitive's calendar view machine. */
  function recordView(details: DatePicker.ViewChangeDetails): void {
    setView(details.view);
  }

  /** Open the controlled calendar from outside its root. */
  function openCalendar(): void {
    setOpen(true);
  }

  /** Change the controlled view from outside its root. */
  function showYear(): void {
    setView('year');
  }

  return (
    <>
      <DatePicker.Root
        open={open()}
        onOpenChange={recordOpen}
        view={view()}
        onViewChange={recordView}
        defaultFocusedValue={parseDate('2026-03-14')}
      >
        <button type="button" onClick={openCalendar}>
          Open externally
        </button>
        <output data-testid="date-picker-controlled-state">{`${open()} ${view()}`}</output>
        <DatePicker.Label>Controlled date</DatePicker.Label>
        <DatePicker.Control>
          <DatePicker.Input data-testid="date-picker-controlled-input" />
          <DatePicker.Trigger aria-label="Open controlled calendar" />
        </DatePicker.Control>
        <DatePicker.Positioner>
          <Views>
            <button type="button" onClick={showYear}>
              Show year externally
            </button>
          </Views>
        </DatePicker.Positioner>
      </DatePicker.Root>
    </>
  );
}

export const Controlled: Story = { render: ControlledPicker };

/** Render two offset months and a machine-owned range preset. */
function MultiMonthPicker(): JSX.Element {
  return (
    <>
      <DatePicker.Root
        inline
        selectionMode="range"
        numOfMonths={2}
        defaultFocusedValue={parseDate('2026-03-14')}
      >
        <DatePicker.Label>Trip range</DatePicker.Label>
        <DatePicker.PresetTrigger value="thisMonth">This month</DatePicker.PresetTrigger>
        <DatePicker.Context>
          {
            /** Expose the machine's range for preset verification. */
            (api) => (
              <output data-testid="date-picker-preset-value">
                {api().value.length}: {api().valueAsString}
              </output>
            )
          }
        </DatePicker.Context>
        <DatePicker.Content>
          <DatePicker.View view="day">
            <DatePicker.Header />
            <DatePicker.DayTable data-testid="date-picker-first-month" />
            <DatePicker.DayTable offset={1} data-testid="date-picker-second-month" />
          </DatePicker.View>
        </DatePicker.Content>
      </DatePicker.Root>
    </>
  );
}

export const MultiMonth: Story = { render: MultiMonthPicker };
