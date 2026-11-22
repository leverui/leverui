import * as accordion from '@zag-js/accordion';
import { type PropTypes, normalizeProps, useMachine } from '@zag-js/solid';
import { type Accessor, createMemo, createUniqueId } from 'solid-js';
import { useEnvironmentContext, useLocaleContext } from '../../providers/index';
import type { MaybeAccessor, Optional } from '../../types';
import { runIfFn } from '../../utils/run-if-fn';

export type UseAccordionProps = Optional<Omit<accordion.Props, 'dir' | 'getRootNode'>, 'id'>;
export type UseAccordionReturn = Accessor<accordion.Api<PropTypes>>;

/** Create the accordion state and return its API. */
export const useAccordion = (props?: MaybeAccessor<UseAccordionProps>): UseAccordionReturn => {
  const id = createUniqueId();
  const locale = useLocaleContext();
  const environment = useEnvironmentContext();

  const machineProps = createMemo<accordion.Props>(() => ({
    id,
    dir: locale().dir,
    getRootNode: environment().getRootNode,
    ...runIfFn(props),
  }));

  const service = useMachine(accordion.machine, machineProps);
  return createMemo(() => accordion.connect(service, normalizeProps));
};
