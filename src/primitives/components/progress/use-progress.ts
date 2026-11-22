import * as progress from '@zag-js/progress';
import { type PropTypes, normalizeProps, useMachine } from '@zag-js/solid';
import { type Accessor, createMemo, createUniqueId } from 'solid-js';
import { useEnvironmentContext, useLocaleContext } from '../../providers/index';
import type { MaybeAccessor, Optional } from '../../types';
import { runIfFn } from '../../utils/run-if-fn';

export type UseProgressProps = Optional<Omit<progress.Props, 'dir' | 'getRootNode'>, 'id'>;
export type UseProgressReturn = Accessor<progress.Api<PropTypes>>;

/** Create the progress state and return its API. */
export const useProgress = (props?: MaybeAccessor<UseProgressProps>): UseProgressReturn => {
  const id = createUniqueId();
  const locale = useLocaleContext();
  const environment = useEnvironmentContext();

  const machineProps = createMemo<progress.Props>(() => ({
    id,
    dir: locale().dir,
    locale: locale().locale,
    getRootNode: environment().getRootNode,
    ...runIfFn(props),
  }));

  const service = useMachine(progress.machine, machineProps);
  return createMemo(() => progress.connect(service, normalizeProps));
};
