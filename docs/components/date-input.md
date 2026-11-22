# Date Input

A text field for typing a date, with a separate part for the day, month, and
year.

```tsx
import { DateInput } from '@leverui/components';
```

```tsx
<DateInput.Root>
  <DateInput.Label />
  <DateInput.Control>
    <DateInput.SegmentGroup>
      <DateInput.Segment />
    </DateInput.SegmentGroup>
  </DateInput.Control>
  <DateInput.HiddenInput />
</DateInput.Root>
```

## Shortcuts

### DateInput.Segments

Renders a segment group with every segment the current `granularity` and
`formatter` produce. These two are the same.

```tsx
<DateInput.SegmentGroup>
  <For each={dateInput().getSegments()}>{(segment) => <DateInput.Segment segment={segment} />}</For>
</DateInput.SegmentGroup>
```

```tsx
<DateInput.Segments />
```

## Date Value

Dates are objects from
[`@internationalized/date`](https://react-aria.adobe.com/internationalized/date/).
Install it in your app if you call its date constructors.
`DateInput.DateValue` is the accepted date type. Values are arrays, holding one
date or a range.

The [Temporal API](https://tc39.es/proposal-temporal/docs/) will replace this
library once most browsers support it.

## Guides

### Limits

`min` and `max` limit the values you supply, one calendar segment at a time.
Keyboard stepping through a segment can still move a complete date past them.
For a strict range, validate the date on submit.

### Form values

Render one `DateInput.HiddenInput` per date. They submit values formatted for
the locale. `shouldForceLeadingZeros` pads the month and day in both the
segments and the form value. Locale and time zone change both too. To clear
both, call `useDateInputContext().clearValue()` from your own button.

### Machine access

Call `DateInput.useDateInput` and pass the accessor it returns to
`DateInput.RootProvider`. `DateInput.PropsProvider` sets default props for the
roots inside it. They can be reactive. `DateInput.Context` and
`useDateInputContext` give the nearest date input's machine. `LocaleProvider`
sets the text direction and locale for the date inputs inside it.

## Props

### Root

| Prop                      | Default   | Type                                                                                                                                                                                                                                      | Description                                                                                             |
| ------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `dir`                     | `ltr`     | `'ltr' \| 'rtl'`                                                                                                                                                                                                                          | Text direction.                                                                                         |
| `granularity`             | `day`     | `DateGranularity`                                                                                                                                                                                                                         | Smallest unit shown.                                                                                    |
| `locale`                  | `en-US`   | `string`                                                                                                                                                                                                                                  | Locale for formatting, as a BCP 47 language tag.                                                        |
| `selectionMode`           | `single`  | `SelectionMode`                                                                                                                                                                                                                           | `single` for one date. `range` for a start and an end date.                                             |
| `timeZone`                | `UTC`     | `string`                                                                                                                                                                                                                                  | Time zone.                                                                                              |
| `colorPalette`            | —         | `string`                                                                                                                                                                                                                                  | Color palette, named or your own.                                                                       |
| `size`                    | `md`      | `'2xs' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl'`                                                                                                                                                                                  | Date input size.                                                                                        |
| `variant`                 | `outline` | `'outline' \| 'subtle' \| 'flushed'`                                                                                                                                                                                                      | Date input style.                                                                                       |
| `as`                      | `div`     | Native tag                                                                                                                                                                                                                                | HTML tag to render.                                                                                     |
| `asChild`                 | —         | Solid render function                                                                                                                                                                                                                     | Render your own element with the part's props.                                                          |
| `unstyled`                | —         | `boolean`                                                                                                                                                                                                                                 | Turn off the Lever UI styles.                                                                           |
| `allSegments`             | —         | `Partial<{ year: boolean month: boolean day: boolean hour: boolean minute: boolean second: boolean dayPeriod: boolean era: boolean literal: boolean timeZoneName: boolean weekday: boolean unknown: boolean fractionalSecond: boolean }>` | Map of the segments the formatter produces.                                                             |
| `createCalendar`          | —         | `(identifier: CalendarIdentifier) => Calendar`                                                                                                                                                                                            | Create a calendar for an identifier. For non-Gregorian calendars such as Persian, Islamic, or Buddhist. |
| `defaultPlaceholderValue` | —         | `DateValue`                                                                                                                                                                                                                               | Placeholder date on first render.                                                                       |
| `defaultValue`            | —         | `DateValue[]`                                                                                                                                                                                                                             | Selected date or dates on first render.                                                                 |
| `disabled`                | —         | `boolean`                                                                                                                                                                                                                                 | Disable the date input.                                                                                 |
| `form`                    | —         | `string`                                                                                                                                                                                                                                  | `form` attribute of the hidden input.                                                                   |
| `format`                  | —         | `(date: DateValue, details: FormatDateDetails) => string`                                                                                                                                                                                 | Turn a `DateValue` into a string.                                                                       |
| `formatter`               | —         | `DateFormatter`                                                                                                                                                                                                                           | Date formatter.                                                                                         |
| `hideTimeZone`            | `false`   | `boolean`                                                                                                                                                                                                                                 | Hide the time zone segment of a `ZonedDateTime` value.                                                  |
| `hourCycle`               | —         | `HourCycle`                                                                                                                                                                                                                               | 12-hour or 24-hour time. Default: the locale decides.                                                   |
| `id`                      | —         | `string`                                                                                                                                                                                                                                  | Unique ID for the date input.                                                                           |
| `ids`                     | —         | `Partial<{ root: string label: (index: number) => string control: string segmentGroup: (index: number) => string hiddenInput: (index: number) => string }>`                                                                               | Your own IDs for the date input's elements.                                                             |
| `invalid`                 | —         | `boolean`                                                                                                                                                                                                                                 | Mark the date input as invalid.                                                                         |
| `isDateUnavailable`       | —         | `(date: DateValue, locale: string) => boolean`                                                                                                                                                                                            | Say whether a date is unavailable. An unavailable date marks the input invalid.                         |
| `max`                     | —         | `DateValue`                                                                                                                                                                                                                               | Latest selectable date.                                                                                 |
| `min`                     | —         | `DateValue`                                                                                                                                                                                                                               | Earliest selectable date.                                                                               |
| `name`                    | —         | `string`                                                                                                                                                                                                                                  | `name` attribute of the input element.                                                                  |
| `onFocusChange`           | —         | `(details: FocusChangeDetails) => void`                                                                                                                                                                                                   | Called when the date input gains or loses focus.                                                        |
| `onPlaceholderChange`     | —         | `(details: PlaceholderChangeDetails) => void`                                                                                                                                                                                             | Called when the placeholder value changes.                                                              |
| `onValueChange`           | —         | `(details: ValueChangeDetails) => void`                                                                                                                                                                                                   | Called when the value changes.                                                                          |
| `placeholderValue`        | —         | `DateValue`                                                                                                                                                                                                                               | Placeholder date, when you control it.                                                                  |
| `readOnly`                | —         | `boolean`                                                                                                                                                                                                                                 | Make the date input read-only.                                                                          |
| `required`                | —         | `boolean`                                                                                                                                                                                                                                 | Mark the date input as required.                                                                        |
| `shouldForceLeadingZeros` | `false`   | `boolean`                                                                                                                                                                                                                                 | Always show leading zeros in month, day, and hour. When `false`, the locale decides.                    |
| `translations`            | —         | `IntlTranslations`                                                                                                                                                                                                                        | Translated messages.                                                                                    |
| `value`                   | —         | `DateValue[]`                                                                                                                                                                                                                             | Selected date or dates, when you control them.                                                          |

### RootProvider

| Prop               | Default | Type                      | Description                                    |
| ------------------ | ------- | ------------------------- | ---------------------------------------------- |
| `value` (required) | —       | `DateInputApi<PropTypes>` | Date input state from `useDateInput`.          |
| `as`               | `div`   | Native tag                | HTML tag to render.                            |
| `asChild`          | —       | Solid render function     | Render your own element with the part's props. |

### Segments

| Prop      | Default | Type                  | Description                                                       |
| --------- | ------- | --------------------- | ----------------------------------------------------------------- |
| `index`   | —       | `number`              | Index of the date value to show, when `selectionMode` is `range`. |
| `as`      | `div`   | Native tag            | HTML tag to render.                                               |
| `asChild` | —       | Solid render function | Render your own element with the part's props.                    |

### Segment

| Prop                 | Default | Type                  | Description                                               |
| -------------------- | ------- | --------------------- | --------------------------------------------------------- |
| `segment` (required) | —       | `DateSegment`         | Part of the date to show, such as the day, month or year. |
| `as`                 | `span`  | Native tag            | HTML tag to render.                                       |
| `asChild`            | —       | Solid render function | Render your own element with the part's props.            |

### HiddenInput

| Prop      | Default | Type                  | Description                                    |
| --------- | ------- | --------------------- | ---------------------------------------------- |
| `as`      | `input` | Native tag            | HTML tag to render.                            |
| `asChild` | —       | Solid render function | Render your own element with the part's props. |
| `index`   | —       | `number`              | Index of the date value to submit.             |
| `name`    | —       | `string`              | Name submitted with the form.                  |

## Customize with CSS

Load the Lever UI stylesheet before your own CSS. `size` and `variant` are
responsive. Each part has a class, such as
`.leverui-date-input__segmentGroup`. Style the classes or set
`--leverui-date-input-root-gap`, `--leverui-date-input-border-color`,
`--leverui-date-input-focus-color`, `--leverui-date-input-error-color`, and
`--leverui-date-input-segment-focus-background`.

Every part accepts `class`, `style`, HTML attributes, event handlers, refs,
`as`, and `asChild`. `unstyled` on the root or a part turns off its Lever UI
styles and keeps its behavior.
