import { type JSX } from '@solidjs/web';
import { DatePicker } from '../../src';

/** Render the three views of an inline calendar. */
export function CalendarContent(): JSX.Element {
  return (
    <DatePicker.Content unstyled>
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
  );
}

/** Supply the inline layout around a calendar configuration. */
export function CalendarExample(props: { rootProps?: DatePicker.RootProps }): JSX.Element {
  return (
    <DatePicker.Root inline style={{ width: 'fit-content' }} {...props.rootProps}>
      <CalendarContent />
    </DatePicker.Root>
  );
}
