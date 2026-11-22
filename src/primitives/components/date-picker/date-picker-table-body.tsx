import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useDatePickerContext } from './use-date-picker-context';
import { useDatePickerTableContext } from './use-date-picker-table-props-context';

export type DatePickerTableBodyBaseProps = PolymorphicProps<'tbody'>;
export type DatePickerTableBodyProps = Assign<HTMLProps<'tbody'>, DatePickerTableBodyBaseProps>;

/** Render the DatePicker table body. */
export const DatePickerTableBody = (props: DatePickerTableBodyProps) => {
  const api = useDatePickerContext();
  const tableProps = useDatePickerTableContext();
  const mergedProps = mergeProps(() => api().getTableBodyProps(tableProps), props);

  return <primitive.tbody {...mergedProps} />;
};
