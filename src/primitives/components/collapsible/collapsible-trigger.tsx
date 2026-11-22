import type { Assign } from '../../types';
import type { RootState as TriggerState } from '@zag-js/collapsible';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useCollapsibleContext } from './use-collapsible-context';

export type CollapsibleTriggerState = TriggerState;

export type CollapsibleTriggerBaseProps = PolymorphicProps<'button', CollapsibleTriggerState>;
export type CollapsibleTriggerProps = Assign<HTMLProps<'button'>, CollapsibleTriggerBaseProps>;

/** Render the Collapsible trigger. */
export const CollapsibleTrigger = (props: CollapsibleTriggerProps) => {
  const api = useCollapsibleContext();
  const mergedProps = mergeProps(() => api().getTriggerProps(), props);
  return <primitive.button {...mergedProps} state={api().getRootState()} />;
};
