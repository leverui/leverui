import type { Assign } from '../../types';
import type { PositionerState } from '@zag-js/hover-card';
import { mergeProps } from '../../utils/merge-part-props';
import { Show } from 'solid-js';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { usePresenceContext } from '../presence/index';
import { useHoverCardContext } from './use-hover-card-context';

export type HoverCardPositionerState = PositionerState;

export type HoverCardPositionerBaseProps = PolymorphicProps<'div', HoverCardPositionerState>;
export type HoverCardPositionerProps = Assign<HTMLProps<'div'>, HoverCardPositionerBaseProps>;

/** Render the HoverCard positioner. */
export const HoverCardPositioner = (props: HoverCardPositionerProps) => {
  const api = useHoverCardContext();
  const presenceApi = usePresenceContext();
  const mergedProps = mergeProps(() => api().getPositionerProps(), props);

  return (
    <Show when={!presenceApi().unmounted}>
      <primitive.div {...mergedProps} state={api().getPositionerState()} />
    </Show>
  );
};
