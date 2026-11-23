# Date Picker

A date field that opens a calendar for picking a date or a range.

```tsx
import { DatePicker, Portal } from '@leverui/components';
```

```tsx
<DatePicker.Root>
  <DatePicker.Label />
  <DatePicker.Control>
    <DatePicker.Input />
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
```

## Date Value

Dates are
[`@internationalized/date`](https://react-aria.adobe.com/internationalized/date/)
objects. Install that package to use its functions, such as `parseDate`.
`DatePicker` also exports `DatePicker.parseDate` and `DatePicker.DateValue`.

The [Temporal API](https://tc39.es/proposal-temporal/docs/) will replace this
package once most browsers support it.

## Guides

### Custom grids

`DayTable`, `MonthTable`, and `YearTable` are built from smaller table parts.
For your own grid, use `Table`, `TableHead`, `TableBody`, `TableRow`,
`TableCell`, and `TableCellTrigger`.

`TableCellTrigger` and `RangeText` render a `div`. The trigger acts as an
accessible calendar cell, not a real `button`.

`Table.columns` and `TableCell.columns` set the calendar's logic, not the
layout. Use `style` for CSS columns. `Header` holds the previous control, the
range and view control, and the next control.

`DayTable` takes `offset`, for showing more than one month, and
`weekNumberLabel`. `showWeekNumbers` on the root shows the week number columns.

Each table's accessible name is the range of dates on screen, in the current
locale. Pass `aria-label` or `aria-labelledby` to change it.

### Form values

With `name` set, the selected date is sent with the form as text, formatted for
the current locale.

### Machine access

To control a date picker from outside, create it with
`DatePicker.useDatePicker` and pass the result to `DatePicker.RootProvider`.

`DatePicker.PropsProvider` sets default props for the roots inside it. The
defaults can change over time. `DatePicker.Context` and `useDatePickerContext`
read the state of the nearest date picker.

## Props

### Root

| Prop                   | Default   | Type                                                                                                                                                                                                                                                          | Description                                                                                         |
| ---------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `closeOnSelect`        | `true`    | `boolean`                                                                                                                                                                                                                                                     | Close the calendar on pick. No effect when `selectionMode` is `multiple`.                           |
| `defaultView`          | `day`     | `DateView`                                                                                                                                                                                                                                                    | View the calendar opens in.                                                                         |
| `locale`               | `en-US`   | `string`                                                                                                                                                                                                                                                      | Locale for formatting, as a BCP 47 tag.                                                             |
| `maxView`              | `year`    | `DateView`                                                                                                                                                                                                                                                    | Largest view the calendar can switch to.                                                            |
| `minView`              | `day`     | `DateView`                                                                                                                                                                                                                                                    | Smallest view the calendar can switch to.                                                           |
| `selectionMode`        | `single`  | `SelectionMode`                                                                                                                                                                                                                                               | How many dates can be picked: `single`, `multiple`, or `range` (a start and an end).                |
| `timeZone`             | `UTC`     | `string`                                                                                                                                                                                                                                                      | Time zone to use.                                                                                   |
| `colorPalette`         | —         | `string`                                                                                                                                                                                                                                                      | Color palette, built in or your own.                                                                |
| `size`                 | `md`      | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`                                                                                                                                                                                                                        | Date picker size.                                                                                   |
| `variant`              | `outline` | `'outline' \| 'subtle' \| 'flushed'`                                                                                                                                                                                                                          | Date picker style.                                                                                  |
| `as`                   | `div`     | Native tag                                                                                                                                                                                                                                                    | HTML tag to render.                                                                                 |
| `asChild`              | —         | Solid render function                                                                                                                                                                                                                                         | Render your own element with the part's props.                                                      |
| `unstyled`             | —         | `boolean`                                                                                                                                                                                                                                                     | Turn off the Lever UI styles.                                                                       |
| `createCalendar`       | —         | `(identifier: CalendarIdentifier) => Calendar`                                                                                                                                                                                                                | Returns a `Calendar` for an identifier. Adds other calendars, such as Persian, Buddhist or Islamic. |
| `defaultFocusedValue`  | —         | `DateValue`                                                                                                                                                                                                                                                   | Date focused at first.                                                                              |
| `defaultOpen`          | —         | `boolean`                                                                                                                                                                                                                                                     | Start open.                                                                                         |
| `defaultValue`         | —         | `DateValue[]`                                                                                                                                                                                                                                                 | Dates selected at first.                                                                            |
| `disabled`             | —         | `boolean`                                                                                                                                                                                                                                                     | Disable the calendar.                                                                               |
| `fixedWeeks`           | —         | `boolean`                                                                                                                                                                                                                                                     | Always show 6 weeks, not 5 or 6 by month.                                                           |
| `focusedValue`         | —         | `DateValue`                                                                                                                                                                                                                                                   | Focused date, when you control it.                                                                  |
| `format`               | —         | `(date: DateValue, details: LocaleDetails) => string`                                                                                                                                                                                                         | Turns a date into the input text.                                                                   |
| `id`                   | —         | `string`                                                                                                                                                                                                                                                      | Unique id for the date picker.                                                                      |
| `ids`                  | —         | `Partial<{ root: string; label: (index: number) => string; table: (id: string) => string; tableHeader: (id: string) => string; tableBody: (id: string) => string; tableRow: (id: string) => string; content: string; ... 10 more ...; positioner: string; }>` | Ids of the elements in the date picker.                                                             |
| `immediate`            | —         | `boolean`                                                                                                                                                                                                                                                     | Apply a change to `present` right away, not on the next frame.                                      |
| `inline`               | —         | `boolean`                                                                                                                                                                                                                                                     | Render inline, directly on the page.                                                                |
| `invalid`              | —         | `boolean`                                                                                                                                                                                                                                                     | Mark the date picker as invalid.                                                                    |
| `isDateUnavailable`    | —         | `(date: DateValue, locale: string) => boolean`                                                                                                                                                                                                                | Returns whether a date is unavailable.                                                              |
| `lazyMount`            | `false`   | `boolean`                                                                                                                                                                                                                                                     | Render the calendar only when first opened.                                                         |
| `max`                  | —         | `DateValue`                                                                                                                                                                                                                                                   | Latest date that can be picked.                                                                     |
| `maxSelectedDates`     | —         | `number`                                                                                                                                                                                                                                                      | Most dates that can be picked. Only when `selectionMode` is `multiple`.                             |
| `min`                  | —         | `DateValue`                                                                                                                                                                                                                                                   | Earliest date that can be picked.                                                                   |
| `name`                 | —         | `string`                                                                                                                                                                                                                                                      | `name` attribute of the input.                                                                      |
| `numOfMonths`          | —         | `number`                                                                                                                                                                                                                                                      | Months to show at once.                                                                             |
| `onExitComplete`       | —         | `VoidFunction`                                                                                                                                                                                                                                                | Called when the closing animation ends.                                                             |
| `onFocusChange`        | —         | `(details: FocusChangeDetails) => void`                                                                                                                                                                                                                       | Called when the focused date changes.                                                               |
| `onOpenChange`         | —         | `(details: OpenChangeDetails) => void`                                                                                                                                                                                                                        | Called when the calendar opens or closes.                                                           |
| `onValueChange`        | —         | `(details: ValueChangeDetails) => void`                                                                                                                                                                                                                       | Called when the value changes.                                                                      |
| `onViewChange`         | —         | `(details: ViewChangeDetails) => void`                                                                                                                                                                                                                        | Called when the view changes.                                                                       |
| `onVisibleRangeChange` | —         | `(details: VisibleRangeChangeDetails) => void`                                                                                                                                                                                                                | Called when the dates on screen change.                                                             |
| `open`                 | —         | `boolean`                                                                                                                                                                                                                                                     | Open state, when you control it.                                                                    |
| `openOnClick`          | `false`   | `boolean`                                                                                                                                                                                                                                                     | Open the calendar when the input is clicked.                                                        |
| `outsideDaySelectable` | `false`   | `boolean`                                                                                                                                                                                                                                                     | Let people pick days outside the range on screen.                                                   |
| `parse`                | —         | `(value: string, details: LocaleDetails) => DateValue \| undefined`                                                                                                                                                                                           | Turns the input text into a `DateValue`.                                                            |
| `placeholder`          | —         | `string`                                                                                                                                                                                                                                                      | Placeholder text in the input.                                                                      |
| `positioning`          | —         | `PositioningOptions`                                                                                                                                                                                                                                          | Where the calendar is placed.                                                                       |
| `present`              | —         | `boolean`                                                                                                                                                                                                                                                     | Whether the calendar is present, when you control it.                                               |
| `readOnly`             | —         | `boolean`                                                                                                                                                                                                                                                     | Make the calendar read-only.                                                                        |
| `required`             | —         | `boolean`                                                                                                                                                                                                                                                     | Mark the date picker as required.                                                                   |
| `showWeekNumbers`      | —         | `boolean`                                                                                                                                                                                                                                                     | Show a week number column in the day view.                                                          |
| `skipAnimationOnMount` | `false`   | `boolean`                                                                                                                                                                                                                                                     | Skip the opening animation on first render.                                                         |
| `startOfWeek`          | —         | `number`                                                                                                                                                                                                                                                      | First day of the week, `0` (Sunday) to `6` (Saturday).                                              |
| `translations`         | —         | `IntlTranslations`                                                                                                                                                                                                                                            | Translated messages to use.                                                                         |
| `unmountOnExit`        | `false`   | `boolean`                                                                                                                                                                                                                                                     | Remove the calendar from the page when it closes.                                                   |
| `value`                | —         | `DateValue[]`                                                                                                                                                                                                                                                 | Selected dates, when you control them.                                                              |
| `view`                 | —         | `DateView`                                                                                                                                                                                                                                                    | Calendar view, when you control it.                                                                 |
| `hideOutsideDays`      | —         | `boolean`                                                                                                                                                                                                                                                     | Hide days outside the current month. Responsive.                                                    |

### Input

| Prop        | Default | Type                  | Description                                    |
| ----------- | ------- | --------------------- | ---------------------------------------------- |
| `fixOnBlur` | `true`  | `boolean`             | Correct the input value on blur.               |
| `as`        | `input` | Native tag            | HTML tag to render.                            |
| `asChild`   | —       | Solid render function | Render your own element with the part's props. |
| `index`     | —       | `number`              | Index of the input to focus.                   |

### View

| Prop              | Default | Type                  | Description                                    |
| ----------------- | ------- | --------------------- | ---------------------------------------------- |
| `view` (required) | —       | `DateView`            |                                                |
| `as`              | `div`   | Native tag            | HTML tag to render.                            |
| `asChild`         | —       | Solid render function | Render your own element with the part's props. |

### TableCell

| Prop               | Default | Type                  | Description                                    |
| ------------------ | ------- | --------------------- | ---------------------------------------------- |
| `value` (required) | —       | `number \| DateValue` |                                                |
| `as`               | `td`    | Native tag            | HTML tag to render.                            |
| `asChild`          | —       | Solid render function | Render your own element with the part's props. |
| `columns`          | —       | `number`              |                                                |
| `disabled`         | —       | `boolean`             |                                                |
| `visibleRange`     | —       | `VisibleRange`        |                                                |

### PresetTrigger

| Prop               | Default  | Type                  | Description                                    |
| ------------------ | -------- | --------------------- | ---------------------------------------------- |
| `value` (required) | —        | `PresetTriggerValue`  |                                                |
| `as`               | `button` | Native tag            | HTML tag to render.                            |
| `asChild`          | —        | Solid render function | Render your own element with the part's props. |

## Customize with CSS

Import `@leverui/components/styles.css` for the default look. `size`,
`variant`, and `hideOutsideDays` take a value per screen size.

Classes: `.lui-date-picker__<slot>` on the root and each part. Attributes:
`data-size`, `data-variant`, and the supported breakpoint attributes. Content
rendered in a portal gets the same values.

Variables: set `--lui-date-picker-*` on `:root`, on a theme wrapper, or on
a single picker. Parts accept `class`, `style`, `unstyled`, `as`, and
`asChild`.

## Explorer

Click a part name to highlight it in the preview.
