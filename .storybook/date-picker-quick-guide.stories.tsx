import { parseDate } from '@internationalized/date';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { DatePicker, Field, InputGroup } from '../src';

/** Open from the input and navigate directly with native month and year selects. */
function InputNavigationPicker(): JSX.Element {
  return (
    <>
      <DatePicker.Root openOnClick defaultFocusedValue={parseDate('2026-03-14')}>
        <DatePicker.Label>Date</DatePicker.Label>
        <DatePicker.Control>
          <DatePicker.Input data-testid="date-picker-click-input" />
        </DatePicker.Control>
        <DatePicker.Positioner>
          <DatePicker.Content>
            <DatePicker.View view="day">
              <DatePicker.ViewControl>
                <DatePicker.PrevTrigger />
                <DatePicker.MonthSelect data-testid="date-picker-month-select" />
                <DatePicker.YearSelect data-testid="date-picker-year-select" />
                <DatePicker.NextTrigger />
              </DatePicker.ViewControl>
              <DatePicker.DayTable data-testid="date-picker-click-days" />
            </DatePicker.View>
          </DatePicker.Content>
        </DatePicker.Positioner>
      </DatePicker.Root>
    </>
  );
}

const meta = {
  title: 'Components/DatePicker/Quick Guide',
  component: InputNavigationPicker,
} satisfies Meta<typeof InputNavigationPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InputNavigation: Story = { render: InputNavigationPicker };

/** Delegate the footer action to the current primitive and Zag machine. */
function TodayAction(): JSX.Element {
  const picker = DatePicker.useDatePickerContext();

  /** Select the calendar's current day using its time zone. */
  function selectToday(): void {
    picker().selectToday();
  }

  return (
    <button type="button" onClick={selectToday}>
      Today
    </button>
  );
}

/** Compose a today shortcut with the regular calendar value. */
function TodayPicker(): JSX.Element {
  return (
    <>
      <DatePicker.Root inline defaultFocusedValue={parseDate('2026-03-14')}>
        <DatePicker.Label>Current date</DatePicker.Label>
        <DatePicker.Control>
          <DatePicker.Input data-testid="date-picker-today-input" />
        </DatePicker.Control>
        <DatePicker.Context>
          {
            /** Expose the selected calendar day independently of locale formatting. */
            (api) => (
              <output data-testid="date-picker-today-value">{api().value[0]?.toString()}</output>
            )
          }
        </DatePicker.Context>
        <DatePicker.Content>
          <DatePicker.View view="day">
            <DatePicker.Header />
            <DatePicker.DayTable />
            <TodayAction />
          </DatePicker.View>
        </DatePicker.Content>
      </DatePicker.Root>
    </>
  );
}

export const Today: Story = { render: TodayPicker };

/** Bridge Field state to DatePicker until native Field wiring exists. */
function FieldPicker(): JSX.Element {
  const [invalid, setInvalid] = createSignal(false);

  /** Toggle the Field state without rebuilding its nested date machine. */
  function toggleInvalid(): void {
    setInvalid(!invalid());
  }

  return (
    <>
      <button type="button" onClick={toggleInvalid}>
        Toggle invalid
      </button>
      <Field.Root invalid={invalid()}>
        <Field.Label>Date of birth</Field.Label>
        <Field.Context>
          {
            /** Reuse the Field label and control IDs on the date input. */
            (context) => (
              <DatePicker.Root
                invalid={context().invalid}
                ids={{
                  /** Keep the Field label associated with the primitive's input. */
                  label: () => context().ids.label,
                  /** Share the Field control ID with the primitive's editable input. */
                  input: () => context().ids.control,
                }}
              >
                <DatePicker.Control>
                  <DatePicker.Input
                    data-testid="date-picker-field-input"
                    aria-describedby={context().ariaDescribedby}
                  />
                  <DatePicker.Trigger aria-label="Open date of birth calendar" />
                </DatePicker.Control>
              </DatePicker.Root>
            )
          }
        </Field.Context>
        <Field.ErrorText>Date of birth is required</Field.ErrorText>
      </Field.Root>
    </>
  );
}

export const FieldIntegration: Story = { render: FieldPicker };

/** Mark the Date Picker input for Input Group's authored CSS padding. */
function GroupedDateInput(): JSX.Element {
  return (
    <DatePicker.Input class="leverui-input-group__field" data-testid="date-picker-grouped-input" />
  );
}

/** Compose a decorative icon, trigger, and clear action around one input. */
function AdornedPicker(): JSX.Element {
  return (
    <>
      <DatePicker.Root defaultFocusedValue={parseDate('2026-03-14')}>
        <DatePicker.Label>Adorned date</DatePicker.Label>
        <DatePicker.Control>
          <InputGroup
            startElement="📅"
            endElement={
              <DatePicker.Trigger aria-label="Open adorned calendar">Choose</DatePicker.Trigger>
            }
          >
            <GroupedDateInput />
          </InputGroup>
          <DatePicker.ClearTrigger aria-label="Clear adorned date" />
        </DatePicker.Control>
        <DatePicker.Positioner>
          <DatePicker.Content>
            <DatePicker.View view="day">
              <DatePicker.Header />
              <DatePicker.DayTable data-testid="date-picker-grouped-days" />
            </DatePicker.View>
          </DatePicker.Content>
        </DatePicker.Positioner>
      </DatePicker.Root>
    </>
  );
}

export const Adorned: Story = { render: AdornedPicker };
