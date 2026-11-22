import { mergeProps } from '../../utils/merge-part-props';
import type { TriggerProps, TriggerState } from '@zag-js/tooltip';
import type { Assign } from '../../types';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useTooltipContext } from './use-tooltip-context';

export type TooltipTriggerState = TriggerState;

export type TooltipTriggerBaseProps = TriggerProps &
  PolymorphicProps<'button', TooltipTriggerState>;
export type TooltipTriggerProps = Assign<HTMLProps<'button'>, TooltipTriggerBaseProps>;

/** Render the Tooltip trigger. */
export const TooltipTrigger = (props: TooltipTriggerProps) => {
  const [triggerProps, localProps] = createSplitProps<TriggerProps>()(props, ['value']);
  const api = useTooltipContext();
  const mergedProps = mergeProps(() => api().getTriggerProps(triggerProps), localProps);

  return <primitive.button {...mergedProps} state={api().getTriggerState(triggerProps)} />;
};
