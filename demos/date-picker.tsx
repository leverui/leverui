import type { Demo, DemoMeta } from './demo-types';
import { datePickerGuide as g } from './examples/date-picker-guide-text';
import { withComponentInset } from './examples/example-frame';
import {
  DatePickerBasic,
  DatePickerSizes,
  DatePickerVariants,
  DatePickerDisabled,
} from './examples/date-picker-basic-examples';
import {
  DatePickerReadOnly,
  DatePickerDefaultValue,
  DatePickerDefaultView,
} from './examples/date-picker-value-examples';
import {
  DatePickerRangeSelection,
  DatePickerMinMax,
  DatePickerUnavailableDates,
} from './examples/date-picker-limit-examples';
import {
  DatePickerControlled,
  DatePickerStore,
  DatePickerMultipleSelection,
} from './examples/date-picker-state-examples';
import {
  DatePickerMonthPicker,
  DatePickerMonthRange,
  DatePickerYearPicker,
  DatePickerYearRange,
} from './examples/date-picker-period-examples';
import {
  DatePickerFormatParse,
  DatePickerLocalization,
  DatePickerPersianCalendar,
} from './examples/date-picker-locale-examples';
import {
  DatePickerFixedWeeks,
  DatePickerOpenOnClick,
  DatePickerPlacement,
} from './examples/date-picker-display-examples';
import {
  DatePickerButtonTrigger,
  DatePickerOutsideIcon,
  DatePickerInputGroup,
} from './examples/date-picker-trigger-examples';
import {
  DatePickerClearIcon,
  DatePickerHeaderLayout,
  DatePickerMonthYearSelect,
} from './examples/date-picker-header-examples';
import {
  DatePickerPresets,
  DatePickerPresetsSidebar,
} from './examples/date-picker-presets-examples';
import {
  DatePickerMultipleMonths,
  DatePickerTodayButton,
  DatePickerWithTime,
} from './examples/date-picker-feature-examples';
import {
  DatePickerForm,
  DatePickerHookForm,
  DatePickerField,
} from './examples/date-picker-form-examples';

export const meta = {
  component: DatePickerBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

export const Basic: Story = { render: DatePickerBasic };
export const Sizes: Story = { render: DatePickerSizes, parameters: g.Sizes };
export const Variants: Story = { render: DatePickerVariants, parameters: g.Variants };
export const Disabled: Story = { render: DatePickerDisabled, parameters: g.Disabled };
export const ReadOnly: Story = { render: DatePickerReadOnly, parameters: g.ReadOnly };
export const Controlled: Story = { render: DatePickerControlled, parameters: g.Controlled };
export const Store: Story = { render: DatePickerStore, parameters: g.Store };
export const DefaultValue: Story = { render: DatePickerDefaultValue, parameters: g.DefaultValue };
export const DefaultView: Story = { render: DatePickerDefaultView, parameters: g.DefaultView };
export const RangeSelection: Story = {
  render: DatePickerRangeSelection,
  parameters: g.RangeSelection,
};
export const MultipleSelection: Story = {
  render: DatePickerMultipleSelection,
  parameters: g.MultipleSelection,
};
export const MonthPicker: Story = { render: DatePickerMonthPicker, parameters: g.MonthPicker };
export const MonthRange: Story = { render: DatePickerMonthRange, parameters: g.MonthRange };
export const YearPicker: Story = { render: DatePickerYearPicker, parameters: g.YearPicker };
export const YearRange: Story = { render: DatePickerYearRange, parameters: g.YearRange };
export const MinMax: Story = { render: DatePickerMinMax, parameters: g.MinMax };
export const UnavailableDates: Story = {
  render: DatePickerUnavailableDates,
  parameters: g.UnavailableDates,
};
export const FormatParse: Story = { render: DatePickerFormatParse, parameters: g.FormatParse };
export const Localization: Story = { render: DatePickerLocalization, parameters: g.Localization };
export const PersianCalendar: Story = {
  render: DatePickerPersianCalendar,
  parameters: g.PersianCalendar,
};
export const ButtonTrigger: Story = {
  render: DatePickerButtonTrigger,
  parameters: g.ButtonTrigger,
};
export const OutsideIcon: Story = { render: DatePickerOutsideIcon, parameters: g.OutsideIcon };
export const InputGroup: Story = { render: DatePickerInputGroup, parameters: g.InputGroup };
export const ClearIcon: Story = { render: DatePickerClearIcon, parameters: g.ClearIcon };
export const Placement: Story = { render: DatePickerPlacement, parameters: g.Placement };
export const HeaderLayout: Story = { render: DatePickerHeaderLayout, parameters: g.HeaderLayout };
export const MonthYearSelect: Story = {
  render: DatePickerMonthYearSelect,
  parameters: g.MonthYearSelect,
};
export const MultipleMonths: Story = {
  render: DatePickerMultipleMonths,
  parameters: g.MultipleMonths,
};
export const Presets: Story = { render: DatePickerPresets, parameters: g.Presets };
export const PresetsSidebar: Story = {
  render: DatePickerPresetsSidebar,
  parameters: g.PresetsSidebar,
};
export const TodayButton: Story = { render: DatePickerTodayButton, parameters: g.TodayButton };
export const WithTime: Story = { render: DatePickerWithTime, parameters: g.WithTime };
export const Form: Story = { render: DatePickerForm, parameters: g.Form };
export const HookForm: Story = { render: DatePickerHookForm, parameters: g.HookForm };
export const Field: Story = { render: DatePickerField, parameters: g.Field };
export const FixedWeeks: Story = { render: DatePickerFixedWeeks, parameters: g.FixedWeeks };
export const OpenOnClick: Story = { render: DatePickerOpenOnClick, parameters: g.OpenOnClick };
