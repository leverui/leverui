import type { Assign } from '../../types';
import type { RootState as ControlState } from '@zag-js/date-input';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useDateInputContext } from './use-date-input-context';

export type DateInputControlState = ControlState;

export type DateInputControlBaseProps = PolymorphicProps<'div', DateInputControlState>;
export type DateInputControlProps = Assign<HTMLProps<'div'>, DateInputControlBaseProps>;

/** Render the DateInput control. */
export const DateInputControl = (props: DateInputControlProps) => {
  const api = useDateInputContext();
  const mergedProps = mergeProps(() => api().getControlProps(), props);
  return <primitive.div {...mergedProps} state={api().getRootState()} />;
};
