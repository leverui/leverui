import type { TriggerProps, TriggerState } from '@zag-js/popover';
import { mergeProps } from '../../utils/merge-part-props';
import type { Assign } from '../../types';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { usePresenceContext } from '../presence/index';
import { usePopoverContext } from './use-popover-context';

export type PopoverTriggerState = TriggerState;

export type PopoverTriggerBaseProps = TriggerProps &
  PolymorphicProps<'button', PopoverTriggerState>;
export type PopoverTriggerProps = Assign<HTMLProps<'button'>, PopoverTriggerBaseProps>;

/** Render the Popover trigger. */
export const PopoverTrigger = (props: PopoverTriggerProps) => {
  const [triggerProps, localProps] = createSplitProps<TriggerProps>()(props, ['value']);
  const api = usePopoverContext();
  const presenceApi = usePresenceContext();
  const mergedProps = mergeProps(
    () => api().getTriggerProps(triggerProps),
    () => ({ 'aria-controls': presenceApi().unmounted && null }),
    localProps,
  );
  return <primitive.button {...mergedProps} state={api().getTriggerState(triggerProps)} />;
};
