import * as asyncList from '@zag-js/async-list';
import { useMachine } from '@zag-js/solid';
import { type Accessor, createMemo } from 'solid-js';
import type { MaybeAccessor } from '../../types';
import { runIfFn } from '../../utils/run-if-fn';

export type UseAsyncListProps<T, C = string> = asyncList.Props<T, C>;
export type UseAsyncListReturn<T, C = string> = Accessor<asyncList.Api<T, C>>;

/** Create the async list state and return its API. */
export const useAsyncList = <T, C = string>(
  props?: MaybeAccessor<UseAsyncListProps<T, C>>,
): UseAsyncListReturn<T, C> => {
  const machineProps = createMemo(() => runIfFn(props) as asyncList.Props<T, C>);

  const service = useMachine(asyncList.machine as asyncList.Machine<T, C>, machineProps);
  return createMemo(() => asyncList.connect(service));
};
