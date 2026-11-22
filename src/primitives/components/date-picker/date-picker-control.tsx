import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useDatePickerContext } from './use-date-picker-context';

export type DatePickerControlBaseProps = PolymorphicProps<'div'>;
export type DatePickerControlProps = Assign<HTMLProps<'div'>, DatePickerControlBaseProps>;

/** Render the DatePicker control. */
export const DatePickerControl = (props: DatePickerControlProps) => {
  const api = useDatePickerContext();
  const mergedProps = mergeProps(() => api().getControlProps(), props);

  return <primitive.div {...mergedProps} />;
};
