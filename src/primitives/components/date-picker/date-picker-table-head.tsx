import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useDatePickerContext } from './use-date-picker-context';
import { useDatePickerTableContext } from './use-date-picker-table-props-context';

export type DatePickerTableHeadBaseProps = PolymorphicProps<'thead'>;
export type DatePickerTableHeadProps = Assign<HTMLProps<'thead'>, DatePickerTableHeadBaseProps>;

/** Render the DatePicker table head. */
export const DatePickerTableHead = (props: DatePickerTableHeadProps) => {
  const api = useDatePickerContext();
  const tableProps = useDatePickerTableContext();
  const mergedProps = mergeProps(() => api().getTableHeadProps(tableProps), props);

  return <primitive.thead {...mergedProps} />;
};
