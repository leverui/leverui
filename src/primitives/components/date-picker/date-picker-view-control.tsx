import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useDatePickerContext } from './use-date-picker-context';
import { useDatePickerViewContext } from './use-date-picker-view-props-context';

export type DatePickerViewControlBaseProps = PolymorphicProps<'div'>;
export type DatePickerViewControlProps = Assign<HTMLProps<'div'>, DatePickerViewControlBaseProps>;

/** Render the DatePicker view control. */
export const DatePickerViewControl = (props: DatePickerViewControlProps) => {
  const api = useDatePickerContext();
  const viewProps = useDatePickerViewContext();
  const mergedProps = mergeProps(() => api().getViewControlProps(viewProps), props);

  return <primitive.div {...mergedProps} />;
};
