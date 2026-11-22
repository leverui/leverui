import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useDatePickerContext } from './use-date-picker-context';
import { useDatePickerTableContext } from './use-date-picker-table-props-context';

export type DatePickerWeekNumberHeaderCellBaseProps = PolymorphicProps<'th'>;
export type DatePickerWeekNumberHeaderCellProps = Assign<
  HTMLProps<'th'>,
  DatePickerWeekNumberHeaderCellBaseProps
>;

/** Render the DatePicker week number header cell. */
export const DatePickerWeekNumberHeaderCell = (props: DatePickerWeekNumberHeaderCellProps) => {
  const api = useDatePickerContext();
  const tableProps = useDatePickerTableContext();
  const mergedProps = mergeProps(() => api().getWeekNumberHeaderCellProps(tableProps), props);

  return <primitive.th {...mergedProps} />;
};
