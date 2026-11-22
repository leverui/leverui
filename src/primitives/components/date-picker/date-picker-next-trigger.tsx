import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useDatePickerContext } from './use-date-picker-context';
import { useDatePickerViewContext } from './use-date-picker-view-props-context';

export type DatePickerNextTriggerBaseProps = PolymorphicProps<'button'>;
export type DatePickerNextTriggerProps = Assign<
  HTMLProps<'button'>,
  DatePickerNextTriggerBaseProps
>;

/** Render the DatePicker next trigger. */
export const DatePickerNextTrigger = (props: DatePickerNextTriggerProps) => {
  const api = useDatePickerContext();
  const viewProps = useDatePickerViewContext();
  const mergedProps = mergeProps(() => api().getNextTriggerProps(viewProps), props);

  return <primitive.button {...mergedProps} />;
};
