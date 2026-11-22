import * as segmentGroup from '@zag-js/radio-group';
import { type PropTypes, normalizeProps, useMachine } from '@zag-js/solid';
import { type Accessor, createMemo, createUniqueId } from 'solid-js';
import { useEnvironmentContext, useLocaleContext } from '../../providers/index';
import type { MaybeAccessor, Optional } from '../../types';
import { runIfFn } from '../../utils/run-if-fn';

export type UseSegmentGroupProps = Optional<Omit<segmentGroup.Props, 'dir' | 'getRootNode'>, 'id'>;
export type UseSegmentGroupReturn = Accessor<segmentGroup.Api<PropTypes>>;

/** Create the segment group state and return its API. */
export const useSegmentGroup = (
  props?: MaybeAccessor<UseSegmentGroupProps>,
): UseSegmentGroupReturn => {
  const id = createUniqueId();
  const locale = useLocaleContext();
  const environment = useEnvironmentContext();

  const machineProps = createMemo<segmentGroup.Props>(() => ({
    id,
    dir: locale().dir,
    getRootNode: environment().getRootNode,
    ...runIfFn(props),
  }));

  const service = useMachine(segmentGroup.machine, machineProps);
  return createMemo(() => segmentGroup.connect(service, normalizeProps));
};
