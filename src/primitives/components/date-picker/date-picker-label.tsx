import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useDatePickerContext } from './use-date-picker-context';

export type DatePickerLabelBaseProps = PolymorphicProps<'label'>;
export type DatePickerLabelProps = Assign<HTMLProps<'label'>, DatePickerLabelBaseProps>;

/** Render the DatePicker label. */
export const DatePickerLabel = (props: DatePickerLabelProps) => {
  const api = useDatePickerContext();
  const mergedProps = mergeProps(() => api().getLabelProps(), props);

  return <primitive.label {...mergedProps} />;
};
