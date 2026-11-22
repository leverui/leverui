import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { createMemo } from 'solid-js';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useDatePickerContext } from './use-date-picker-context';
import {
  DatePickerTableCellProvider,
  type UseDatePickerTableCellContext,
} from './use-date-picker-table-cell-props-context';
import { useDatePickerViewContext } from './use-date-picker-view-props-context';

export type DatePickerTableCellBaseProps = UseDatePickerTableCellContext & PolymorphicProps<'td'>;
export type DatePickerTableCellProps = Assign<HTMLProps<'td'>, DatePickerTableCellBaseProps>;

/** Render the DatePicker table cell. */
export const DatePickerTableCell = (props: DatePickerTableCellProps) => {
  const [cellProps, localProps] = createSplitProps<UseDatePickerTableCellContext>()(props, [
    'disabled',
    'value',
    'visibleRange',
    'columns',
  ]);
  const api = useDatePickerContext();
  const viewProps = useDatePickerViewContext();
  const tableCellProps = createMemo(() => {
    // Month and year cells hold a number; day cells hold a date.
    const value = cellProps.value;
    if (typeof value === 'number') {
      const numericCell = { value, disabled: cellProps.disabled, columns: cellProps.columns };
      return viewProps.view === 'year'
        ? api().getYearTableCellProps(numericCell)
        : api().getMonthTableCellProps(numericCell);
    }
    return api().getDayTableCellProps({
      value,
      disabled: cellProps.disabled,
      visibleRange: cellProps.visibleRange,
    });
  });

  const mergedProps = mergeProps(tableCellProps, localProps);

  return (
    <DatePickerTableCellProvider value={cellProps}>
      <primitive.td {...mergedProps} />
    </DatePickerTableCellProvider>
  );
};
