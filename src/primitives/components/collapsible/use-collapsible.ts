import * as collapsible from '@zag-js/collapsible';
import { type PropTypes, normalizeProps, useMachine } from '@zag-js/solid';
import { type Accessor, createEffect, createMemo, createSignal, createUniqueId } from 'solid-js';
import { useEnvironmentContext, useLocaleContext } from '../../providers/index';
import type { MaybeAccessor } from '../../types';
import { type RenderStrategyProps, splitRenderStrategyProps } from '../../utils/render-strategy';
import { runIfFn } from '../../utils/run-if-fn';

export type UseCollapsibleProps = Omit<collapsible.Props, 'dir' | 'getRootNode' | 'id'> & {
  /** The machine id. A generated id is used when it is missing or undefined. */
  id?: string | undefined;
} & RenderStrategyProps;

export type UseCollapsibleReturn = Accessor<
  collapsible.Api<PropTypes> & {
    /**
     * Whether the content is unmounted
     */
    unmounted?: boolean | undefined;
  }
>;

/** Create the collapsible state and return its API. */
export const useCollapsible = (
  props: MaybeAccessor<UseCollapsibleProps> = {},
): UseCollapsibleReturn => {
  const id = createUniqueId();
  const locale = useLocaleContext();
  const environment = useEnvironmentContext();
  const [renderStrategyProps, collapsibleProps] = splitRenderStrategyProps(runIfFn(props));

  const machineProps = createMemo(() => ({
    dir: locale().dir,
    getRootNode: environment().getRootNode,
    ...collapsibleProps,
    id: collapsibleProps.id ?? id,
  }));

  const service = useMachine(collapsible.machine, machineProps);
  const [wasVisible, setWasVisible] = createSignal(false);

  const api = createMemo(() => collapsible.connect(service, normalizeProps));

  createEffect(
    () => api().visible,
    (isPresent) => {
      if (isPresent) setWasVisible(true);
    },
  );

  return createMemo(() => ({
    ...api(),
    unmounted:
      (!api().visible && !wasVisible() && renderStrategyProps.lazyMount) ||
      (renderStrategyProps.unmountOnExit && !api().visible && wasVisible()),
  }));
};
