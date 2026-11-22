import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useDateInputContext } from './use-date-input-context';

export type DateInputLabelBaseProps = PolymorphicProps<'label'>;
export type DateInputLabelProps = Assign<HTMLProps<'label'>, DateInputLabelBaseProps>;

/** Render the DateInput label. */
export const DateInputLabel = (props: DateInputLabelProps) => {
  const api = useDateInputContext();
  const mergedProps = mergeProps(() => api().getLabelProps(), props);
  return <primitive.label {...mergedProps} />;
};
