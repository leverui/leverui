import { type JSX } from '@solidjs/web';
import { CalendarIcon, ChevronsUpDownIcon } from '@lucide/solid';
import { Button, DatePicker, IconButton, InputGroup, Portal } from '../../src';

/** Replace the input with a full-width button trigger. */
export function DatePickerButtonTrigger(): JSX.Element {
  return (
    <DatePicker.Root style={{ 'max-width': '20rem' }}>
      <DatePicker.Label>Date of birth</DatePicker.Label>
      <DatePicker.Control>
        <DatePicker.Trigger
          asChild={
            /** Render the machine's button props on a wide outline trigger. */
            (getProps) => (
              <Button
                {...getProps()}
                variant="outline"
                style={{ width: '100%', 'justify-content': 'flex-start' }}
              >
                <DatePicker.ValueText placeholder="Select date" />
              </Button>
            )
          }
          unstyled
        />
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
  );
}

/** Put the calendar icon outside the input border. */
export function DatePickerOutsideIcon(): JSX.Element {
  return (
    <DatePicker.Root style={{ 'max-width': '20rem' }}>
      <DatePicker.Label>Date of birth</DatePicker.Label>
      <DatePicker.Control>
        <DatePicker.Input />
        <DatePicker.Trigger
          asChild={
            /** Render the machine's trigger props on a separate icon button. */
            (getProps) => (
              <IconButton {...getProps()} variant="outline" aria-label="Open date calendar">
                <CalendarIcon />
              </IconButton>
            )
          }
          unstyled
        />
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
  );
}

/** Put a decorative calendar and opening action inside the input. */
export function DatePickerInputGroup(): JSX.Element {
  return (
    <DatePicker.Root style={{ 'max-width': '20rem' }}>
      <DatePicker.Label>Date</DatePicker.Label>
      <DatePicker.Control>
        <InputGroup
          startElement={<CalendarIcon />}
          endElement={
            <DatePicker.Trigger>
              <ChevronsUpDownIcon />
            </DatePicker.Trigger>
          }
          endElementProps={{ style: { 'pointer-events': 'all' } }}
        >
          <DatePicker.Input class="leverui-input-group__field" />
        </InputGroup>
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
  );
}
