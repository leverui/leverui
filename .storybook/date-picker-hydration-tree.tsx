import { parseDate } from '@internationalized/date';
import { type JSX } from '@solidjs/web';
import type { DatePicker as DatePickerExport } from '../src';

export type DatePickerHydrationComponents = {
  DatePicker: typeof DatePickerExport;
};

/** Render the same full day calendar from published server and browser entries. */
export function renderDatePickerHydrationTree({
  DatePicker,
}: DatePickerHydrationComponents): JSX.Element {
  const Root = DatePicker.Root;
  const Label = DatePicker.Label;
  const Control = DatePicker.Control;
  const Input = DatePicker.Input;
  const Content = DatePicker.Content;
  const View = DatePicker.View;
  const Header = DatePicker.Header;
  const DayTable = DatePicker.DayTable;

  return (
    <>
      <Root
        id="hydrated-date-picker"
        name="hydrated-date-picker"
        inline
        defaultFocusedValue={parseDate('2026-03-14')}
        defaultValue={[parseDate('2026-03-14')]}
      >
        <Label>Hydrated calendar</Label>
        <Control>
          <Input />
        </Control>
        <Content>
          <View view="day">
            <Header />
            <DayTable />
          </View>
        </Content>
      </Root>
    </>
  );
}
