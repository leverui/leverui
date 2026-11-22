import type { Demo, DemoMeta } from './demo-types';
import { withComponentInset } from './examples/example-frame';
import {
  DateInputBasic,
  DateInputDefaultValue,
  DateInputDisabled,
  DateInputGranularity,
  DateInputInvalid,
  DateInputMinMax,
  DateInputReadOnly,
  DateInputSizes,
  DateInputVariants,
} from './examples/date-input-basic-examples';
import {
  DateInputLeadingZeros,
  DateInputLocale,
  DateInputRange,
  DateInputRtl,
  DateInputTimeOnly,
} from './examples/date-input-format-examples';
import { DateInputWithHookForm } from './examples/date-input-form-example';
import { DateInputWithDatePicker } from './examples/date-input-picker-example';
import {
  DateInputControlled,
  DateInputTimeZone,
  DateInputWithClearTrigger,
} from './examples/date-input-state-examples';

export const meta = {
  component: DateInputBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

/** Attach a guide description to one example. */
function guide(description: string): Story['parameters'] {
  return { guide: { description } };
}

export const Basic: Story = { name: 'Basic', render: DateInputBasic };
export const Sizes: Story = {
  name: 'Sizes',
  render: DateInputSizes,
  parameters: guide('Use the `size` prop to change the size of the date input.'),
};
export const Variants: Story = {
  name: 'Variants',
  render: DateInputVariants,
  parameters: guide('Use the `variant` prop to change the appearance of the date input.'),
};
export const Disabled: Story = {
  name: 'Disabled',
  render: DateInputDisabled,
  parameters: guide('Use the `disabled` prop to prevent user interaction with the date input.'),
};
export const Invalid: Story = {
  name: 'Invalid',
  render: DateInputInvalid,
  parameters: guide('Use the `invalid` prop to indicate that the date input value is invalid.'),
};
export const ReadOnly: Story = {
  name: 'ReadOnly',
  render: DateInputReadOnly,
  parameters: guide(
    'Use the `readOnly` prop to prevent modification while keeping the value visible.',
  ),
};
export const Controlled: Story = {
  name: 'Controlled',
  render: DateInputControlled,
  parameters: guide('Use the `value` and `onValueChange` props to control the date value.'),
};
export const DefaultValue: Story = {
  name: 'DefaultValue',
  render: DateInputDefaultValue,
  parameters: guide('Use the `defaultValue` prop to set an initial date without controlling it.'),
};
export const MinMax: Story = {
  name: 'MinMax',
  render: DateInputMinMax,
  parameters: guide('Use the `min` and `max` props to restrict the range of accepted dates.'),
};
export const LeadingZeros: Story = {
  name: 'LeadingZeros',
  render: DateInputLeadingZeros,
  parameters: guide(
    'Use the `shouldForceLeadingZeros` prop to always render two-digit day and month segments.',
  ),
};
export const Granularity: Story = {
  name: 'Granularity',
  render: DateInputGranularity,
  parameters: guide(
    'Use the `granularity` prop to control which fields are shown. Set it to `hour`, `minute` or `second` to enter a time alongside the date.',
  ),
};
export const TimeOnly: Story = {
  name: 'TimeOnly',
  render: DateInputTimeOnly,
  parameters: guide('Use the `granularity` and `formatter` props to compose a time-only input.'),
};
export const TimeZone: Story = {
  name: 'TimeZone',
  render: DateInputTimeZone,
  parameters: guide(
    'A `ZonedDateTime` value renders a time zone segment. Use `hourCycle` to switch between 12 and 24 hour time, and `hideTimeZone` to hide the segment.',
  ),
};
export const Range: Story = {
  name: 'Range',
  render: DateInputRange,
  parameters: guide(
    'Set the `selectionMode` prop to `"range"` to enter a start and end date. Pass the `index` prop to `DateInput.Segments` and `DateInput.HiddenInput` to target each date in the range.',
  ),
};
export const WithClearTrigger: Story = {
  name: 'WithClearTrigger',
  render: DateInputWithClearTrigger,
  parameters: guide(
    'Combine the `useDateInputContext` hook with the `clearValue` method to render a clear trigger when a value is present.',
  ),
};
export const WithDatePicker: Story = {
  name: 'WithDatePicker',
  render: DateInputWithDatePicker,
  parameters: guide(
    'Compose the date input with the `DatePicker` component using the `useDateInput` hook and the `DateInput.RootProvider` component. This provides a segmented keyboard input alongside a calendar trigger.',
  ),
};
export const WithHookForm: Story = {
  name: 'WithHookForm',
  render: DateInputWithHookForm,
  parameters: guide(
    'Hold the value in Solid signals and validate it on submit, passing `value`, `onValueChange`, and `invalid` to the `DateInput.Root`.',
  ),
};
export const Locale: Story = {
  name: 'Locale',
  render: DateInputLocale,
  parameters: guide('Use the `locale` prop to change the order and format of the segments.'),
};
export const Rtl: Story = {
  name: 'Rtl',
  render: DateInputRtl,
  parameters: guide(
    'Wrap the date input in `LocaleProvider` to set the locale and text direction together. Pass `dir="rtl"` directly to override direction on its own.',
  ),
};
