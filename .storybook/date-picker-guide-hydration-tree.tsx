import { PersianCalendar, parseDate } from '@internationalized/date';
import { type JSX } from '@solidjs/web';
import type { DatePicker as DatePickerExport } from '../src';

export type DatePickerGuideHydrationComponents = {
  DatePicker: typeof DatePickerExport;
};

/** Construct the calendar selected by the Persian locale on both runtimes. */
function createPersianCalendar(identifier: string): PersianCalendar {
  if (identifier !== 'persian') throw new Error(`Unsupported calendar: ${identifier}`);
  return new PersianCalendar();
}

/** Share one Jalali calendar tree between published SSR and browser entries. */
export function renderDatePickerGuideHydrationTree({
  DatePicker,
}: DatePickerGuideHydrationComponents): JSX.Element {
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
        id="hydrated-jalali-picker"
        inline
        locale="fa-IR"
        createCalendar={createPersianCalendar}
        startOfWeek={6}
        defaultFocusedValue={parseDate('2026-03-14')}
        defaultValue={[parseDate('2026-03-14')]}
      >
        <Label>تاریخ را انتخاب کنید</Label>
        <Control>
          <Input data-testid="hydrated-jalali-input" />
        </Control>
        <Content>
          <View view="day">
            <Header />
            <DayTable data-testid="hydrated-jalali-days" />
          </View>
        </Content>
      </Root>
    </>
  );
}
