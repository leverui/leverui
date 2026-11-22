import { type JSX } from '@solidjs/web';
import type { ComponentIntrinsicElement } from './component-element-props';
import { renderDatePickerPart } from './date-picker-part';
import type {
  DatePickerTableBodyProps,
  DatePickerTableCellProps,
  DatePickerTableCellTriggerProps,
  DatePickerTableHeadProps,
  DatePickerTableHeaderProps,
  DatePickerTableProps,
  DatePickerTableRowProps,
  DatePickerViewProps,
  DatePickerWeekNumberCellProps,
  DatePickerWeekNumberCellTextProps,
  DatePickerWeekNumberHeaderCellProps,
} from './date-picker-part-props';

/** Render one day, month, or year grid. */
export function DatePickerTable<As extends ComponentIntrinsicElement = 'table'>(
  props: DatePickerTableProps<As>,
): JSX.Element {
  return renderDatePickerPart({ slot: 'table', props });
}

/** Group the visible calendar grid rows. */
export function DatePickerTableBody<As extends ComponentIntrinsicElement = 'tbody'>(
  props: DatePickerTableBodyProps<As>,
): JSX.Element {
  return renderDatePickerPart({ slot: 'tableBody', props });
}

/** Scope a date value to its table cell and selection trigger. */
export function DatePickerTableCell<As extends ComponentIntrinsicElement = 'td'>(
  props: DatePickerTableCellProps<As>,
): JSX.Element {
  return renderDatePickerPart({ slot: 'tableCell', props });
}

/** Select the date represented by the surrounding cell. */
export function DatePickerTableCellTrigger<As extends ComponentIntrinsicElement = 'div'>(
  props: DatePickerTableCellTriggerProps<As>,
): JSX.Element {
  return renderDatePickerPart({ slot: 'tableCellTrigger', props });
}

/** Group weekday labels above a day grid. */
export function DatePickerTableHead<As extends ComponentIntrinsicElement = 'thead'>(
  props: DatePickerTableHeadProps<As>,
): JSX.Element {
  return renderDatePickerPart({ slot: 'tableHead', props });
}

/** Render one weekday or column heading. */
export function DatePickerTableHeader<As extends ComponentIntrinsicElement = 'th'>(
  props: DatePickerTableHeaderProps<As>,
): JSX.Element {
  return renderDatePickerPart({ slot: 'tableHeader', props });
}

/** Group cells into one calendar grid row. */
export function DatePickerTableRow<As extends ComponentIntrinsicElement = 'tr'>(
  props: DatePickerTableRowProps<As>,
): JSX.Element {
  return renderDatePickerPart({ slot: 'tableRow', props });
}

/** Show one calendar view while the primitive hides inactive views. */
export function DatePickerView<As extends ComponentIntrinsicElement = 'div'>(
  props: DatePickerViewProps<As>,
): JSX.Element {
  return renderDatePickerPart({ slot: 'view', props });
}

/** Render the week number for one day-grid row. */
export function DatePickerWeekNumberCell<As extends ComponentIntrinsicElement = 'td'>(
  props: DatePickerWeekNumberCellProps<As>,
): JSX.Element {
  return renderDatePickerPart({ slot: 'weekNumberCell', props });
}

/** Style the week-number text within its table cell. */
export function DatePickerWeekNumberCellText<As extends ComponentIntrinsicElement = 'span'>(
  props: DatePickerWeekNumberCellTextProps<As>,
): JSX.Element {
  return renderDatePickerPart({ slot: 'weekNumberCellText', props });
}

/** Reserve the header column for displayed week numbers. */
export function DatePickerWeekNumberHeaderCell<As extends ComponentIntrinsicElement = 'th'>(
  props: DatePickerWeekNumberHeaderCellProps<As>,
): JSX.Element {
  return renderDatePickerPart({ slot: 'weekNumberHeaderCell', props });
}
