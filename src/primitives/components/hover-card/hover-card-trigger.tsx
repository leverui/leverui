import type { TriggerProps, TriggerState } from '@zag-js/hover-card';
import { mergeProps } from '../../utils/merge-part-props';
import type { Assign } from '../../types';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useHoverCardContext } from './use-hover-card-context';

export type HoverCardTriggerState = TriggerState;

export type HoverCardTriggerBaseProps = TriggerProps &
  PolymorphicProps<'button', HoverCardTriggerState>;
export type HoverCardTriggerProps = Assign<HTMLProps<'button'>, HoverCardTriggerBaseProps>;

/** Render the HoverCard trigger. */
export const HoverCardTrigger = (props: HoverCardTriggerProps) => {
  const [triggerProps, localProps] = createSplitProps<TriggerProps>()(props, ['value']);
  const hoverCard = useHoverCardContext();
  const mergedProps = mergeProps(() => hoverCard().getTriggerProps(triggerProps), localProps);

  return <primitive.button {...mergedProps} state={hoverCard().getTriggerState(triggerProps)} />;
};
