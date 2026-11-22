import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { For } from 'solid-js';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useDatePickerContext } from './use-date-picker-context';

export type DatePickerYearSelectBaseProps = PolymorphicProps<'select'>;
export type DatePickerYearSelectProps = Assign<HTMLProps<'select'>, DatePickerYearSelectBaseProps>;

/** Render the DatePicker year select. */
export const DatePickerYearSelect = (props: DatePickerYearSelectProps) => {
  const datePicker = useDatePickerContext();
  const mergedProps = mergeProps(() => datePicker().getYearSelectProps(), props);

  return (
    <primitive.select {...mergedProps}>
      <For keyed={false} each={datePicker().getYears()}>
        {(year) => <primitive.option value={year().value}>{year().label}</primitive.option>}
      </For>
    </primitive.select>
  );
};
