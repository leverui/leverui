import type { Assign } from '../../types';
import type { ContentState } from '@zag-js/hover-card';
import { mergeProps } from '../../utils/merge-part-props';
import { Show } from 'solid-js';
import { composeRefGetters } from '../../utils/compose-refs';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { usePresenceContext } from '../presence/index';
import { useHoverCardContext } from './use-hover-card-context';

export type HoverCardContentState = ContentState;

export type HoverCardContentBaseProps = PolymorphicProps<'div', HoverCardContentState>;
export type HoverCardContentProps = Assign<HTMLProps<'div'>, HoverCardContentBaseProps>;

/** Render the HoverCard content. */
export const HoverCardContent = (props: HoverCardContentProps) => {
  const api = useHoverCardContext();
  const presenceApi = usePresenceContext();
  const mergedProps = mergeProps(
    () => api().getContentProps(),
    () => presenceApi().presenceProps,
    props,
  );

  return (
    <Show when={!presenceApi().unmounted}>
      <primitive.div
        {...mergedProps}
        ref={composeRefGetters(
          () => presenceApi().ref,
          () => props.ref,
        )}
        state={api().getContentState()}
      />
    </Show>
  );
};
