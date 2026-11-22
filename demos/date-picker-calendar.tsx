import type { Demo, DemoMeta } from './demo-types';
import { withComponentInset } from './examples/example-frame';
import {
  DatePickerCalendarBasic,
  DatePickerCalendarDefaultValue,
  DatePickerCalendarHideOutsideDays,
  DatePickerCalendarLocale,
  DatePickerCalendarMaxSelected,
  DatePickerCalendarMinMax,
  DatePickerCalendarMultiSelection,
  DatePickerCalendarRangeSelection,
  DatePickerCalendarUnavailableDates,
  DatePickerCalendarWeekNumbers,
} from './examples/date-picker-calendar-basic-examples';
import {
  DatePickerCalendarControlled,
  DatePickerCalendarMultipleMonths,
  DatePickerCalendarSizes,
} from './examples/date-picker-calendar-state-examples';
import { DatePickerCalendarTimeGrid } from './examples/date-picker-calendar-time-grid';

export const meta = {
  component: DatePickerCalendarBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

export const Basic: Story = {
  render: DatePickerCalendarBasic,
};
export const Sizes: Story = {
  render: DatePickerCalendarSizes,
  parameters: {
    guide: { description: 'Use the `size` prop to control the calendar cell and control sizes.' },
  },
};
export const HideOutsideDays: Story = {
  render: DatePickerCalendarHideOutsideDays,
  parameters: {
    guide: {
      description:
        'Set the `hideOutsideDays` prop to hide dates that fall outside the current month.',
    },
  },
};
export const Controlled: Story = {
  render: DatePickerCalendarControlled,
  parameters: {
    guide: {
      description: 'Use the `value` and `onValueChange` props to control the inline calendar.',
    },
  },
};
export const DefaultValue: Story = {
  render: DatePickerCalendarDefaultValue,
  parameters: {
    guide: { description: 'Use the `defaultValue` prop to set the initially selected date.' },
  },
};
export const RangeSelection: Story = {
  render: DatePickerCalendarRangeSelection,
  parameters: {
    guide: {
      description: 'Set the `selectionMode` prop to `"range"` to allow selecting a date range.',
    },
  },
};
export const MultiSelection: Story = {
  render: DatePickerCalendarMultiSelection,
  parameters: {
    guide: {
      description:
        'Set the `selectionMode` prop to `"multiple"` to allow selecting multiple dates.',
    },
  },
};
export const MinMax: Story = {
  render: DatePickerCalendarMinMax,
  parameters: {
    guide: { description: 'Use the `min` and `max` props to restrict the selectable date range.' },
  },
};
export const UnavailableDates: Story = {
  render: DatePickerCalendarUnavailableDates,
  parameters: {
    guide: {
      description:
        'Use the `isDateUnavailable` prop to disable specific dates based on custom logic.',
    },
  },
};
export const MultipleMonths: Story = {
  render: DatePickerCalendarMultipleMonths,
  parameters: {
    guide: { description: 'Use the `numOfMonths` prop to display multiple months side by side.' },
  },
};
export const Locale: Story = {
  render: DatePickerCalendarLocale,
  parameters: {
    guide: {
      description:
        'Use the `locale` prop to customize for different languages and regional formats.',
    },
  },
};
export const MaxSelected: Story = {
  render: DatePickerCalendarMaxSelected,
  parameters: {
    guide: {
      description:
        'Use the `maxSelectedDates` prop with `selectionMode="multiple"` to limit the number of dates that can be selected.',
    },
  },
};
export const WeekNumbers: Story = {
  render: DatePickerCalendarWeekNumbers,
  parameters: {
    guide: {
      description:
        'Use the `showWeekNumbers` prop to display ISO week numbers alongside the calendar rows.',
    },
  },
};
export const TimeGrid: Story = {
  render: DatePickerCalendarTimeGrid,
  parameters: {
    guide: {
      description:
        "Here's an example of a Calendly-style booking interface with an inline calendar and a scrollable time slot grid.",
    },
  },
};
