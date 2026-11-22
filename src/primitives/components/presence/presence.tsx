import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { Show } from 'solid-js';
import { composeRefGetters } from '../../utils/compose-refs';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { splitPresenceProps } from './split-presence-props';
import { type UsePresenceProps, usePresence } from './use-presence';

export type PresenceBaseProps = UsePresenceProps & PolymorphicProps<'div'>;
export type PresenceProps = Assign<HTMLProps<'div'>, PresenceBaseProps>;

/** Render the Presence root. */
export const Presence = (props: PresenceProps) => {
  const [presenceProps, localProps] = splitPresenceProps(props);
  const api = usePresence(presenceProps);
  const mergedProps = mergeProps(() => api().presenceProps, localProps);

  return (
    <Show when={!api().unmounted}>
      <primitive.div
        {...mergedProps}
        ref={composeRefGetters(
          () => api().ref,
          () => props.ref,
        )}
        data-presence-root=""
      />
    </Show>
  );
};
