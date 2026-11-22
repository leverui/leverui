import type { Assign } from '../../types';
import type { PositionerState } from '@zag-js/popover';
import { mergeProps } from '../../utils/merge-part-props';
import { Show } from 'solid-js';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { usePresenceContext } from '../presence/index';
import { usePopoverContext } from './use-popover-context';

export type PopoverPositionerState = PositionerState;

export type PopoverPositionerBaseProps = PolymorphicProps<'div', PopoverPositionerState>;
export type PopoverPositionerProps = Assign<HTMLProps<'div'>, PopoverPositionerBaseProps>;

/** Render the Popover positioner. */
export const PopoverPositioner = (props: PopoverPositionerProps) => {
  const api = usePopoverContext();
  const presenceApi = usePresenceContext();
  const mergedProps = mergeProps(() => api().getPositionerProps(), props);

  return (
    <Show when={!presenceApi().unmounted}>
      <primitive.div {...mergedProps} state={api().getPositionerState()} />
    </Show>
  );
};
