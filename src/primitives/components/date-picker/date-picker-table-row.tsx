import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useDatePickerContext } from './use-date-picker-context';
import { useDatePickerTableContext } from './use-date-picker-table-props-context';

export type DatePickerTableRowBaseProps = PolymorphicProps<'tr'>;
export type DatePickerTableRowProps = Assign<HTMLProps<'tr'>, DatePickerTableRowBaseProps>;

/** Render the DatePicker table row. */
export const DatePickerTableRow = (props: DatePickerTableRowProps) => {
  const api = useDatePickerContext();
  const tableProps = useDatePickerTableContext();
  const mergedProps = mergeProps(() => api().getTableRowProps(tableProps), props);

  return <primitive.tr {...mergedProps} />;
};
