import { DatePicker as PrimitiveDatePicker } from '../primitives/components/date-picker';
import { primitive, type PolymorphicProps } from '../primitives/components/factory';
import { type JSX } from '@solidjs/web';

/** Render the additional indicator slot as an owned native element. */
function IndicatorGroupElement(
  props: JSX.HTMLAttributes<HTMLDivElement> & PolymorphicProps<'div'>,
): JSX.Element {
  return <primitive.div {...props} />;
}

/** Render the styled week-number text slot inside a primitive cell. */
function WeekNumberCellTextElement(
  props: JSX.HTMLAttributes<HTMLSpanElement> & PolymorphicProps<'span'>,
): JSX.Element {
  return <primitive.span {...props} />;
}

/** Bind every public primitive to the primitive's date behavior or an owned slot. */
export const datePickerPartComponents = {
  clearTrigger: PrimitiveDatePicker.ClearTrigger,
  content: PrimitiveDatePicker.Content,
  control: PrimitiveDatePicker.Control,
  indicatorGroup: IndicatorGroupElement,
  input: PrimitiveDatePicker.Input,
  label: PrimitiveDatePicker.Label,
  monthSelect: PrimitiveDatePicker.MonthSelect,
  nextTrigger: PrimitiveDatePicker.NextTrigger,
  positioner: PrimitiveDatePicker.Positioner,
  presetTrigger: PrimitiveDatePicker.PresetTrigger,
  prevTrigger: PrimitiveDatePicker.PreviousTrigger,
  rangeText: PrimitiveDatePicker.RangeText,
  table: PrimitiveDatePicker.Table,
  tableBody: PrimitiveDatePicker.TableBody,
  tableCell: PrimitiveDatePicker.TableCell,
  tableCellTrigger: PrimitiveDatePicker.TableCellTrigger,
  tableHead: PrimitiveDatePicker.TableHead,
  tableHeader: PrimitiveDatePicker.TableHeader,
  tableRow: PrimitiveDatePicker.TableRow,
  trigger: PrimitiveDatePicker.Trigger,
  valueText: PrimitiveDatePicker.ValueText,
  view: PrimitiveDatePicker.View,
  viewControl: PrimitiveDatePicker.ViewControl,
  viewTrigger: PrimitiveDatePicker.ViewTrigger,
  weekNumberCell: PrimitiveDatePicker.WeekNumberCell,
  weekNumberCellText: WeekNumberCellTextElement,
  weekNumberHeaderCell: PrimitiveDatePicker.WeekNumberHeaderCell,
  yearSelect: PrimitiveDatePicker.YearSelect,
} as const;

/** Match each primitive's actual default native element. */
export const datePickerPartTags = {
  clearTrigger: 'button',
  content: 'div',
  control: 'div',
  indicatorGroup: 'div',
  input: 'input',
  label: 'label',
  monthSelect: 'select',
  nextTrigger: 'button',
  positioner: 'div',
  presetTrigger: 'button',
  prevTrigger: 'button',
  rangeText: 'div',
  table: 'table',
  tableBody: 'tbody',
  tableCell: 'td',
  tableCellTrigger: 'div',
  tableHead: 'thead',
  tableHeader: 'th',
  tableRow: 'tr',
  trigger: 'button',
  valueText: 'span',
  view: 'div',
  viewControl: 'div',
  viewTrigger: 'button',
  weekNumberCell: 'td',
  weekNumberCellText: 'span',
  weekNumberHeaderCell: 'th',
  yearSelect: 'select',
} as const;

export type DatePickerPartSlot = keyof typeof datePickerPartComponents;
