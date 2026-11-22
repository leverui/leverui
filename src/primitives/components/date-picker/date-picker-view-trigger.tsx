import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useDatePickerContext } from './use-date-picker-context';
import { useDatePickerViewContext } from './use-date-picker-view-props-context';

export type DatePickerViewTriggerBaseProps = PolymorphicProps<'button'>;
export type DatePickerViewTriggerProps = Assign<
  HTMLProps<'button'>,
  DatePickerViewTriggerBaseProps
>;

/** Render the DatePicker view trigger. */
export const DatePickerViewTrigger = (props: DatePickerViewTriggerProps) => {
  const api = useDatePickerContext();
  const viewProps = useDatePickerViewContext();
  const mergedProps = mergeProps(() => api().getViewTriggerProps(viewProps), props);

  return <primitive.button {...mergedProps} />;
};
