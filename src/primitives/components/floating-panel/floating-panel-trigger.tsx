import type { Assign } from '../../types';
import type { TriggerState } from '@zag-js/floating-panel';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { usePresenceContext } from '../presence/index';
import { useFloatingPanelContext } from './use-floating-panel-context';

export type FloatingPanelTriggerState = TriggerState;

export type FloatingPanelTriggerBaseProps = PolymorphicProps<'button', FloatingPanelTriggerState>;
export type FloatingPanelTriggerProps = Assign<HTMLProps<'button'>, FloatingPanelTriggerBaseProps>;

/** Render the FloatingPanel trigger. */
export const FloatingPanelTrigger = (props: FloatingPanelTriggerProps) => {
  const floatingPanel = useFloatingPanelContext();
  const presence = usePresenceContext();
  const mergedProps = mergeProps(() => {
    const triggerProps = floatingPanel().getTriggerProps();
    return {
      ...triggerProps,
      'aria-controls': presence().unmounted ? undefined : triggerProps['aria-controls'],
    };
  }, props);

  return <primitive.button {...mergedProps} state={floatingPanel().getTriggerState()} />;
};
