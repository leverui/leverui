import { type PropTypes, normalizeProps, useMachine } from '@zag-js/solid';
import * as toggle from '@zag-js/toggle';
import { type Accessor, createMemo, createUniqueId } from 'solid-js';
import { useEnvironmentContext } from '../../providers/index';
import type { Optional } from '../../types';

export type UseToggleProps = Optional<Omit<toggle.Props, 'getRootNode'>, 'id'>;

export type UseToggleReturn = Accessor<toggle.Api<PropTypes>>;

/** Create the toggle state and return its API. */
export function useToggle(props: UseToggleProps = {}): UseToggleReturn {
  const id = createUniqueId();
  const environment = useEnvironmentContext();
  const machineProps = createMemo(() => ({ id, getRootNode: environment().getRootNode, ...props }));
  const service = useMachine(toggle.machine, machineProps);
  return createMemo(() => toggle.connect(service, normalizeProps));
}
