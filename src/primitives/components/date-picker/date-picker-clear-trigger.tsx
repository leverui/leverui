import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useDatePickerContext } from './use-date-picker-context';

export type DatePickerClearTriggerBaseProps = PolymorphicProps<'button'>;
export type DatePickerClearTriggerProps = Assign<
  HTMLProps<'button'>,
  DatePickerClearTriggerBaseProps
>;

/** Render the DatePicker clear trigger. */
export const DatePickerClearTrigger = (props: DatePickerClearTriggerProps) => {
  const api = useDatePickerContext();
  const mergedProps = mergeProps(() => api().getClearTriggerProps(), props);

  return <primitive.button {...mergedProps} />;
};
