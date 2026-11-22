import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { createMemo } from 'solid-js';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useDatePickerContext } from './use-date-picker-context';
import { useDatePickerTableCellContext } from './use-date-picker-table-cell-props-context';
import { useDatePickerViewContext } from './use-date-picker-view-props-context';

export type DatePickerTableCellTriggerBaseProps = PolymorphicProps<'div'>;
export type DatePickerTableCellTriggerProps = Assign<
  HTMLProps<'div'>,
  DatePickerTableCellTriggerBaseProps
>;

/** Render the DatePicker table cell trigger. */
export const DatePickerTableCellTrigger = (props: DatePickerTableCellTriggerProps) => {
  const api = useDatePickerContext();
  const cellProps = useDatePickerTableCellContext();
  const viewProps = useDatePickerViewContext();

  const triggerProps = createMemo(() => {
    // Month and year cells hold a number; day cells hold a date.
    const value = cellProps.value;
    if (typeof value === 'number') {
      const numericCell = { value, disabled: cellProps.disabled, columns: cellProps.columns };
      return viewProps.view === 'year'
        ? api().getYearTableCellTriggerProps(numericCell)
        : api().getMonthTableCellTriggerProps(numericCell);
    }
    return api().getDayTableCellTriggerProps({
      value,
      disabled: cellProps.disabled,
      visibleRange: cellProps.visibleRange,
    });
  });

  const mergedProps = mergeProps(triggerProps, props);

  return <primitive.div {...mergedProps} />;
};
