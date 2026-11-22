import * as avatar from '@zag-js/avatar';
import { type PropTypes, normalizeProps, useMachine } from '@zag-js/solid';
import { type Accessor, createMemo, createUniqueId } from 'solid-js';
import { useEnvironmentContext, useLocaleContext } from '../../providers/index';
import type { MaybeAccessor, Optional } from '../../types';
import { runIfFn } from '../../utils/run-if-fn';

export type UseAvatarProps = Optional<Omit<avatar.Props, 'dir' | 'getRootNode'>, 'id'>;
export type UseAvatarReturn = Accessor<avatar.Api<PropTypes>>;

/** Create the avatar state and return its API. */
export const useAvatar = (props?: MaybeAccessor<UseAvatarProps>): UseAvatarReturn => {
  const locale = useLocaleContext();
  const environment = useEnvironmentContext();
  const id = createUniqueId();

  const machineProps = createMemo<avatar.Props>(() => ({
    id,
    dir: locale().dir,
    getRootNode: environment().getRootNode,
    ...runIfFn(props),
  }));

  const service = useMachine(avatar.machine, machineProps);
  return createMemo(() => avatar.connect(service, normalizeProps));
};
