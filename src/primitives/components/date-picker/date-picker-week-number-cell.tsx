import type { Assign } from '../../types';
import type { DateValue, WeekNumberCellProps } from '@zag-js/date-picker';
import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useDatePickerContext } from './use-date-picker-context';
import { type JSX } from '@solidjs/web';

export interface DatePickerWeekNumberCellBaseProps extends PolymorphicProps<'td'> {
  weekIndex: number;
  week: DateValue[];
}
export interface DatePickerWeekNumberCellProps extends Assign<
  HTMLProps<'td'>,
  DatePickerWeekNumberCellBaseProps
> {
  children?: JSX.Element;
}

const splitWeekNumberCellProps = createSplitProps<WeekNumberCellProps>();

/** Render the DatePicker week number cell. */
export const DatePickerWeekNumberCell = (props: DatePickerWeekNumberCellProps) => {
  const [cellProps, localProps] = splitWeekNumberCellProps(props, ['weekIndex', 'week']);
  const datePicker = useDatePickerContext();
  const mergedProps = mergeProps(() => datePicker().getWeekNumberCellProps(cellProps), localProps);

  return <primitive.td {...mergedProps} />;
};
