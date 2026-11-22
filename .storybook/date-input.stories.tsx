import { parseDate } from '@internationalized/date';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { DateInput } from '../src';
import './date-input-consumer.css';

/** Show labeled segments and their synchronized native form input. */
function BasicDateInputStory(): JSX.Element {
  return (
    <>
      <DateInput.Root name="birthday" defaultValue={[parseDate('2026-03-14')]}>
        <DateInput.Label>Date of birth</DateInput.Label>
        <DateInput.Control>
          <DateInput.Segments data-testid="date-input-basic-segments" />
        </DateInput.Control>
        <DateInput.HiddenInput data-testid="date-input-basic-hidden" />
      </DateInput.Root>
    </>
  );
}

const meta = {
  title: 'Components/DateInput',
  component: BasicDateInputStory,
} satisfies Meta<typeof BasicDateInputStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = { render: BasicDateInputStory };

/** Keep signal-owned dates synchronized with the primitive's segmented editor. */
function ControlledDateInputStory(): JSX.Element {
  const [value, setValue] = createSignal<DateInput.DateValue[]>([parseDate('2026-03-14')]);

  /** Apply a machine date change to the owning Solid signal. */
  function recordValue(details: DateInput.ValueChangeDetails): void {
    setValue(details.value);
  }

  /** Verify an external signal change updates every segment. */
  function setNextDate(): void {
    setValue([parseDate('2026-04-05')]);
  }

  return (
    <>
      <button type="button" onClick={setNextDate}>
        Set next date
      </button>
      <DateInput.Root name="controlled-date" value={value()} onValueChange={recordValue}>
        <DateInput.Label>Controlled date</DateInput.Label>
        <DateInput.Control>
          <DateInput.Segments data-testid="date-input-controlled-segments" />
        </DateInput.Control>
        <DateInput.HiddenInput data-testid="date-input-controlled-hidden" />
      </DateInput.Root>
      <output data-testid="date-input-controlled-value">
        {value()
          .map(
            /** Display each machine value without changing its calendar data. */
            (date) => date.toString(),
          )
          .join(', ')}
      </output>
    </>
  );
}

export const Controlled: Story = { render: ControlledDateInputStory };

/** Keep two indexed segment groups and hidden inputs on one range machine. */
function RangeDateInputStory(): JSX.Element {
  return (
    <>
      <DateInput.Root
        name="trip"
        selectionMode="range"
        defaultValue={[parseDate('2026-03-14'), parseDate('2026-03-20')]}
      >
        <DateInput.Label>Trip duration</DateInput.Label>
        <DateInput.Control class="date-input-example-range">
          <DateInput.Segments index={0} data-testid="date-input-range-start" />
          <span aria-hidden="true">→</span>
          <DateInput.Segments index={1} data-testid="date-input-range-end" />
        </DateInput.Control>
        <DateInput.HiddenInput index={0} data-testid="date-input-range-hidden-start" />
        <DateInput.HiddenInput index={1} data-testid="date-input-range-hidden-end" />
      </DateInput.Root>
    </>
  );
}

export const Range: Story = { render: RangeDateInputStory };

/** Expose disabled, invalid, and read-only machine states. */
function StatesDateInputStory(): JSX.Element {
  return (
    <>
      <DateInput.Root disabled defaultValue={[parseDate('2026-03-14')]}>
        <DateInput.Label>Disabled date</DateInput.Label>
        <DateInput.Control>
          <DateInput.Segments data-testid="date-input-disabled-segments" />
        </DateInput.Control>
      </DateInput.Root>
      <DateInput.Root invalid defaultValue={[parseDate('2026-03-14')]}>
        <DateInput.Label>Invalid date</DateInput.Label>
        <DateInput.Control>
          <DateInput.Segments data-testid="date-input-invalid-segments" />
        </DateInput.Control>
      </DateInput.Root>
      <DateInput.Root readOnly defaultValue={[parseDate('2026-03-14')]}>
        <DateInput.Label>Read-only date</DateInput.Label>
        <DateInput.Control>
          <DateInput.Segments data-testid="date-input-readonly-segments" />
        </DateInput.Control>
      </DateInput.Root>
    </>
  );
}

export const States: Story = { render: StatesDateInputStory };
