import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { Show } from 'solid-js';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { usePresenceContext } from '../presence/index';
import { useTooltipContext } from './use-tooltip-context';

export type TooltipPositionerBaseProps = PolymorphicProps<'div'>;
export type TooltipPositionerProps = Assign<HTMLProps<'div'>, TooltipPositionerBaseProps>;

/** Render the Tooltip positioner. */
export const TooltipPositioner = (props: TooltipPositionerProps) => {
  const api = useTooltipContext();
  const presenceApi = usePresenceContext();
  const mergedProps = mergeProps(() => api().getPositionerProps(), props);

  return (
    <Show when={!presenceApi().unmounted}>
      <primitive.div {...mergedProps} />
    </Show>
  );
};
