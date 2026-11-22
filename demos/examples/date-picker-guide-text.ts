/** descriptions for the Date Picker guide's examples. */
/** Attach one description to an example. */
function guide(description: string) {
  return {
    guide: {
      description,
    },
  };
}

export const datePickerGuide = {
  Sizes: guide('Use the `size` prop to change the size of the date picker.'),
  Variants: guide('Use the `variant` prop to change the visual style of the date picker.'),
  Disabled: guide('Use the `disabled` prop to prevent user interaction with the date picker.'),
  ReadOnly: guide(
    'Use the `readOnly` prop to prevent modification while keeping the value visible.',
  ),
  Controlled: guide('Use the `value` and `onValueChange` props to control the selected date.'),
  Store: guide(
    'An alternative way to control the date picker is to use the `RootProvider` component and the `useDatePicker` store hook.',
  ),
  DefaultValue: guide('Use the `defaultValue` prop to set the initially selected date.'),
  DefaultView: guide(
    'Use the `defaultView` prop to set the initial calendar view to `"day"`, `"month"`, or `"year"`.',
  ),
  RangeSelection: guide(
    'Set the `selectionMode` prop to `"range"` to allow selecting a start and end date.',
  ),
  MultipleSelection: guide(
    'Set the `selectionMode` prop to `"multiple"` to allow selecting multiple dates.',
  ),
  MonthPicker: guide(
    'Set the `defaultView` and `minView` props to `"month"` to restrict the picker to month selection only.',
  ),
  MonthRange: guide(
    'Set the `selectionMode` prop to `"range"` and `minView` to `"month"` to select a month range.',
  ),
  YearPicker: guide(
    'Set the `defaultView` and `minView` props to `"year"` to restrict the picker to year selection only.',
  ),
  YearRange: guide(
    'Set the `selectionMode` prop to `"range"` and `minView` to `"year"` to select a year range.',
  ),
  MinMax: guide('Use the `min` and `max` props to restrict date selection to a specific range.'),
  UnavailableDates: guide(
    'Use the `isDateUnavailable` prop to disable specific dates (e.g., weekends, holidays).',
  ),
  FormatParse: guide(
    'Use the `format` and `parse` props to control how dates are displayed and interpreted.',
  ),
  Localization: guide(
    'Use the `locale` prop to display the calendar in different languages and regional formats.',
  ),
  PersianCalendar: guide(
    'Use the `createCalendar` prop with `locale="fa-IR"` to render the Persian (Jalali) calendar.',
  ),
  ButtonTrigger: guide('Replace the default trigger with a styled custom button.'),
  OutsideIcon: guide('Place the trigger icon outside the input field.'),
  InputGroup: guide('Integrate with InputGroup for custom input layouts with start/end elements.'),
  ClearIcon: guide('Add a clear trigger to reset the selection.'),
  Placement: guide('Use the `positioning` prop to control the placement of the calendar popover.'),
  HeaderLayout: guide(
    "Here's an example of customizing the header layout with `RangeText` and navigation buttons.",
  ),
  MonthYearSelect: guide(
    'Render the `DatePicker.MonthSelect` and `DatePicker.YearSelect` components for quick month/year navigation.',
  ),
  MultipleMonths: guide('Use the `numOfMonths` prop to display multiple months side by side.'),
  Presets: guide(
    'Render the `DatePicker.PresetTrigger` component to provide quick date selection options.',
  ),
  PresetsSidebar: guide(
    "Here's an example of a task-management style picker with presets sidebar and calendar side by side.",
  ),
  TodayButton: guide(
    "Here's an example of adding a footer button to quickly jump to today's date.",
  ),
  WithTime: guide(
    "Here's an example of combining date selection with a time input for datetime picking.",
  ),
  Form: guide("Here's an example of integrating with native form validation."),
  HookForm: guide(
    "Here's an example of integrating form state held in Solid signals with the date picker, validated on submit.",
  ),
  Field: guide(
    'The `DatePicker` does not natively integrate with the `Field` component yet. Use `Field.Context` to wire up the field state manually. Native support will be added in a future version.',
  ),
  FixedWeeks: guide(
    'Use the `fixedWeeks` prop to always display 6 weeks in the calendar, ensuring a consistent height regardless of the month.',
  ),
  OpenOnClick: guide(
    'Use the `openOnClick` prop to open the calendar when clicking the input field, removing the need for a separate trigger button.',
  ),
} as const;
