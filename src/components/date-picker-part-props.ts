import type { NativeHtmlAliases } from '../styled-system/native-html-aliases';
import type {
  PrimitiveNativeElementProps,
  PrimitiveNativeTag,
} from './primitive-native-element-props';
import type { DatePickerPartBehavior } from './date-picker-part-behavior';
import type { datePickerPartTags, DatePickerPartSlot } from './date-picker-part-registry';

export type DatePickerPartProps<
  Slot extends DatePickerPartSlot,
  As extends PrimitiveNativeTag = (typeof datePickerPartTags)[Slot],
> = PrimitiveNativeElementProps<
  (typeof datePickerPartTags)[Slot],
  DatePickerPartBehavior<Slot> &
    NativeHtmlAliases & { className?: string | undefined; unstyled?: boolean | undefined },
  As
>;

export type DatePickerClearTriggerProps<As extends PrimitiveNativeTag = 'button'> =
  DatePickerPartProps<'clearTrigger', As>;
export type DatePickerContentProps<As extends PrimitiveNativeTag = 'div'> = DatePickerPartProps<
  'content',
  As
>;
export type DatePickerControlProps<As extends PrimitiveNativeTag = 'div'> = DatePickerPartProps<
  'control',
  As
>;
export type DatePickerIndicatorGroupProps<As extends PrimitiveNativeTag = 'div'> =
  DatePickerPartProps<'indicatorGroup', As>;
export type DatePickerInputProps<As extends PrimitiveNativeTag = 'input'> = DatePickerPartProps<
  'input',
  As
>;
export type DatePickerLabelProps<As extends PrimitiveNativeTag = 'label'> = DatePickerPartProps<
  'label',
  As
>;
export type DatePickerMonthSelectProps<As extends PrimitiveNativeTag = 'select'> =
  DatePickerPartProps<'monthSelect', As>;
export type DatePickerNextTriggerProps<As extends PrimitiveNativeTag = 'button'> =
  DatePickerPartProps<'nextTrigger', As>;
export type DatePickerPositionerProps<As extends PrimitiveNativeTag = 'div'> = DatePickerPartProps<
  'positioner',
  As
>;
export type DatePickerPresetTriggerProps<As extends PrimitiveNativeTag = 'button'> =
  DatePickerPartProps<'presetTrigger', As>;
export type DatePickerPrevTriggerProps<As extends PrimitiveNativeTag = 'button'> =
  DatePickerPartProps<'prevTrigger', As>;
export type DatePickerRangeTextProps<As extends PrimitiveNativeTag = 'div'> = DatePickerPartProps<
  'rangeText',
  As
>;
export type DatePickerTableProps<As extends PrimitiveNativeTag = 'table'> = DatePickerPartProps<
  'table',
  As
>;
export type DatePickerTableBodyProps<As extends PrimitiveNativeTag = 'tbody'> = DatePickerPartProps<
  'tableBody',
  As
>;
export type DatePickerTableCellProps<As extends PrimitiveNativeTag = 'td'> = DatePickerPartProps<
  'tableCell',
  As
>;
export type DatePickerTableCellTriggerProps<As extends PrimitiveNativeTag = 'div'> =
  DatePickerPartProps<'tableCellTrigger', As>;
export type DatePickerTableHeadProps<As extends PrimitiveNativeTag = 'thead'> = DatePickerPartProps<
  'tableHead',
  As
>;
export type DatePickerTableHeaderProps<As extends PrimitiveNativeTag = 'th'> = DatePickerPartProps<
  'tableHeader',
  As
>;
export type DatePickerTableRowProps<As extends PrimitiveNativeTag = 'tr'> = DatePickerPartProps<
  'tableRow',
  As
>;
export type DatePickerTriggerProps<As extends PrimitiveNativeTag = 'button'> = DatePickerPartProps<
  'trigger',
  As
>;
export type DatePickerValueTextProps<As extends PrimitiveNativeTag = 'span'> = DatePickerPartProps<
  'valueText',
  As
>;
export type DatePickerViewProps<As extends PrimitiveNativeTag = 'div'> = DatePickerPartProps<
  'view',
  As
>;
export type DatePickerViewControlProps<As extends PrimitiveNativeTag = 'div'> = DatePickerPartProps<
  'viewControl',
  As
>;
export type DatePickerViewTriggerProps<As extends PrimitiveNativeTag = 'button'> =
  DatePickerPartProps<'viewTrigger', As>;
export type DatePickerWeekNumberCellProps<As extends PrimitiveNativeTag = 'td'> =
  DatePickerPartProps<'weekNumberCell', As>;
export type DatePickerWeekNumberCellTextProps<As extends PrimitiveNativeTag = 'span'> =
  DatePickerPartProps<'weekNumberCellText', As>;
export type DatePickerWeekNumberHeaderCellProps<As extends PrimitiveNativeTag = 'th'> =
  DatePickerPartProps<'weekNumberHeaderCell', As>;
export type DatePickerYearSelectProps<As extends PrimitiveNativeTag = 'select'> =
  DatePickerPartProps<'yearSelect', As>;
