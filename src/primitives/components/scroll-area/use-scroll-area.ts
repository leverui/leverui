import * as scrollArea from '@zag-js/scroll-area';
import { type PropTypes, normalizeProps, useMachine } from '@zag-js/solid';
import { type Accessor, createMemo, createUniqueId } from 'solid-js';
import { useEnvironmentContext, useLocaleContext } from '../../providers/index';
import type { Optional } from '../../types';

export type UseScrollAreaProps = Optional<Omit<scrollArea.Props, 'dir' | 'getRootNode'>, 'id'>;

export type UseScrollAreaReturn = Accessor<scrollArea.Api<PropTypes>>;

/** Create the scroll area state and return its API. */
export const useScrollArea = (props: UseScrollAreaProps = {}): UseScrollAreaReturn => {
  const id = createUniqueId();
  const locale = useLocaleContext();
  const environment = useEnvironmentContext();

  const machineProps = createMemo(() => ({
    id,
    dir: locale().dir,
    getRootNode: environment().getRootNode,
    ...props,
  }));

  const service = useMachine(scrollArea.machine, machineProps);
  return createMemo(() => scrollArea.connect<PropTypes>(service, normalizeProps));
};
