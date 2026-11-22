import { type PropTypes, normalizeProps, useMachine } from '@zag-js/solid';
import * as tabs from '@zag-js/tabs';
import { type Accessor, createMemo, createUniqueId } from 'solid-js';
import { useEnvironmentContext, useLocaleContext } from '../../providers/index';
import type { MaybeAccessor, Optional } from '../../types';
import { runIfFn } from '../../utils/run-if-fn';

export type UseTabsProps = Optional<Omit<tabs.Props, 'dir' | 'getRootNode'>, 'id'>;
export type UseTabsReturn = Accessor<tabs.Api<PropTypes>>;

/** Create the tabs state and return its API. */
export const useTabs = (props?: MaybeAccessor<UseTabsProps>): UseTabsReturn => {
  const id = createUniqueId();
  const locale = useLocaleContext();
  const environment = useEnvironmentContext();

  const machineProps = createMemo<tabs.Props>(() => ({
    id,
    dir: locale().dir,
    getRootNode: environment().getRootNode,
    ...runIfFn(props),
  }));

  const service = useMachine(tabs.machine, machineProps);
  return createMemo(() => tabs.connect(service, normalizeProps));
};
