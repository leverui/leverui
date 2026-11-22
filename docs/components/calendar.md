# Calendar

A month grid for picking a date or a range of dates.

```tsx
import { DatePicker } from '@leverui/components';
```

```tsx
<DatePicker.Root inline>
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
</DatePicker.Root>
```

The Unavailable Dates and Booking Time Grid examples use
`@internationalized/date`. Install it if you copy them.

## Props

`DatePicker` with `inline` on `DatePicker.Root`: no input, no positioner. Same
root props and parts as [DatePicker](date-picker.md). There is no separate
`Calendar` export.
