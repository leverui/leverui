import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useDatePickerContext } from './use-date-picker-context';
import { useDatePickerViewContext } from './use-date-picker-view-props-context';

export type DatePickerPreviousTriggerBaseProps = PolymorphicProps<'button'>;
export type DatePickerPreviousTriggerProps = Assign<
  HTMLProps<'button'>,
  DatePickerPreviousTriggerBaseProps
>;

/** Render the DatePicker previous trigger. */
export const DatePickerPreviousTrigger = (props: DatePickerPreviousTriggerProps) => {
  const api = useDatePickerContext();
  const viewProps = useDatePickerViewContext();
  const mergedProps = mergeProps(() => api().getPreviousTriggerProps(viewProps), props);

  return <primitive.button {...mergedProps} />;
};
