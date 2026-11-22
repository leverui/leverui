import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import type { ContentState } from '@zag-js/tooltip';
import { Show } from 'solid-js';
import { composeRefGetters } from '../../utils/compose-refs';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { usePresenceContext } from '../presence/index';
import { useTooltipContext } from './use-tooltip-context';

export type TooltipContentState = ContentState;

export type TooltipContentBaseProps = PolymorphicProps<'div', TooltipContentState>;
export type TooltipContentProps = Assign<HTMLProps<'div'>, TooltipContentBaseProps>;

/** Render the Tooltip content. */
export const TooltipContent = (props: TooltipContentProps) => {
  const api = useTooltipContext();
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
