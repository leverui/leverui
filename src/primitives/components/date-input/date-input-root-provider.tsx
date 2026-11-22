import type { Assign } from '../../types';
import type { RootState } from '@zag-js/date-input';
import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import type { UseDateInputReturn } from './use-date-input';
import { DateInputProvider } from './use-date-input-context';

interface RootProviderProps {
  value: UseDateInputReturn;
}

export type DateInputRootProviderState = RootState;

export type DateInputRootProviderBaseProps = RootProviderProps &
  PolymorphicProps<'div', DateInputRootProviderState>;
export type DateInputRootProviderProps = Assign<HTMLProps<'div'>, DateInputRootProviderBaseProps>;

/** Provide the DateInput root provider to its children. */
export const DateInputRootProvider = (props: DateInputRootProviderProps) => {
  const [{ value: dateInput }, localProps] = createSplitProps<RootProviderProps>()(props, [
    'value',
  ]);
  const mergedProps = mergeProps(() => dateInput().getRootProps(), localProps);

  return (
    <DateInputProvider value={dateInput}>
      <primitive.div {...mergedProps} state={dateInput().getRootState()} />
    </DateInputProvider>
  );
};
