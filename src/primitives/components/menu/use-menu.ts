import * as menu from '@zag-js/menu';
import { type PropTypes, normalizeProps, useMachine } from '@zag-js/solid';
import { type Accessor, createMemo, createUniqueId } from 'solid-js';
import { useEnvironmentContext, useLocaleContext } from '../../providers/index';
import type { MaybeAccessor, Optional } from '../../types';
import { runIfFn } from '../../utils/run-if-fn';

export type UseMenuProps = Optional<Omit<menu.Props, 'dir' | 'getRootNode' | 'menubar'>, 'id'>;
export interface UseMenuReturn {
  api: Accessor<menu.Api<PropTypes>>;
  service: menu.Service;
}

/** Create the menu state and return its API. */
export const useMenu = (props?: MaybeAccessor<UseMenuProps>): UseMenuReturn => {
  const id = createUniqueId();
  const locale = useLocaleContext();
  const environment = useEnvironmentContext();

  const machineProps = createMemo(() => ({
    id,
    dir: locale().dir,
    getRootNode: environment().getRootNode,
    ...runIfFn(props),
  }));

  const service = useMachine(menu.machine, machineProps);
  const api = createMemo(() => menu.connect(service, normalizeProps));

  return {
    api,
    service,
  };
};
