import type { Assign } from '../../types';
import type { TriggerState } from '@zag-js/date-picker';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useDatePickerContext } from './use-date-picker-context';

export type DatePickerTriggerState = TriggerState;

export type DatePickerTriggerBaseProps = PolymorphicProps<'button', DatePickerTriggerState>;
export type DatePickerTriggerProps = Assign<HTMLProps<'button'>, DatePickerTriggerBaseProps>;

/** Render the DatePicker trigger. */
export const DatePickerTrigger = (props: DatePickerTriggerProps) => {
  const api = useDatePickerContext();
  const mergedProps = mergeProps(() => api().getTriggerProps(), props);

  return <primitive.button {...mergedProps} state={api().getTriggerState()} />;
};
