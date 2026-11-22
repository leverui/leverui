import { mergeProps } from '../../utils/merge-part-props';
import type { TriggerProps, TriggerState } from '@zag-js/tabs';
import type { Assign } from '../../types';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useTabsContext } from './use-tabs-context';

export type TabTriggerState = TriggerState;

export type TabTriggerBaseProps = TriggerProps & PolymorphicProps<'button', TabTriggerState>;
export type TabTriggerProps = Assign<HTMLProps<'button'>, TabTriggerBaseProps>;

/** Render the Tabs tab trigger. */
export const TabTrigger = (props: TabTriggerProps) => {
  const [triggerProps, localProps] = createSplitProps<TriggerProps>()(props, ['disabled', 'value']);
  const api = useTabsContext();
  const mergedProps = mergeProps(() => api().getTriggerProps(triggerProps), localProps);

  return <primitive.button {...mergedProps} state={api().getTriggerState(triggerProps)} />;
};
