import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { For } from 'solid-js';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useDatePickerContext } from './use-date-picker-context';

export type DatePickerMonthSelectBaseProps = PolymorphicProps<'select'>;
export type DatePickerMonthSelectProps = Assign<
  HTMLProps<'select'>,
  DatePickerMonthSelectBaseProps
>;

/** Render the DatePicker month select. */
export const DatePickerMonthSelect = (props: DatePickerMonthSelectProps) => {
  const datePicker = useDatePickerContext();
  const mergedProps = mergeProps(() => datePicker().getMonthSelectProps(), props);

  return (
    <primitive.select {...mergedProps}>
      <For keyed={false} each={datePicker().getMonths()}>
        {(month) => <primitive.option value={month().value}>{month().label}</primitive.option>}
      </For>
    </primitive.select>
  );
};
