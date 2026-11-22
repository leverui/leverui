import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useDatePickerContext } from './use-date-picker-context';
import { useDatePickerTableContext } from './use-date-picker-table-props-context';

export type DatePickerTableHeaderBaseProps = PolymorphicProps<'th'>;
export type DatePickerTableHeaderProps = Assign<HTMLProps<'th'>, DatePickerTableHeaderBaseProps>;

/** Render the DatePicker table header. */
export const DatePickerTableHeader = (props: DatePickerTableHeaderProps) => {
  const api = useDatePickerContext();
  const tableProps = useDatePickerTableContext();
  const mergedProps = mergeProps(() => api().getTableHeaderProps(tableProps), props);

  return <primitive.th {...mergedProps} />;
};
