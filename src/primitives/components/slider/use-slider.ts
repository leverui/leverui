import * as slider from '@zag-js/slider';
import { type PropTypes, normalizeProps, useMachine } from '@zag-js/solid';
import { type Accessor, createMemo, createUniqueId } from 'solid-js';
import { useEnvironmentContext, useLocaleContext } from '../../providers/index';
import type { MaybeAccessor, Optional } from '../../types';
import { runIfFn } from '../../utils/run-if-fn';

export type UseSliderProps = Optional<Omit<slider.Props, 'dir' | 'getRootNode'>, 'id'>;
export type UseSliderReturn = Accessor<slider.Api<PropTypes>>;

/** Create the slider state and return its API. */
export const useSlider = (props?: MaybeAccessor<UseSliderProps>): UseSliderReturn => {
  const id = createUniqueId();
  const locale = useLocaleContext();
  const environment = useEnvironmentContext();

  const machineProps = createMemo<slider.Props>(() => ({
    id,
    dir: locale().dir,
    getRootNode: environment().getRootNode,
    ...runIfFn(props),
  }));

  const service = useMachine(slider.machine, machineProps);
  return createMemo(() => slider.connect(service, normalizeProps));
};
