import type { Assign } from '../../types';
import type { StageTriggerProps, StageTriggerState } from '@zag-js/floating-panel';
import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useFloatingPanelContext } from './use-floating-panel-context';

export type FloatingPanelStageTriggerState = StageTriggerState;

export type FloatingPanelStageTriggerBaseProps = PolymorphicProps<
  'button',
  FloatingPanelStageTriggerState
> &
  StageTriggerProps;
export type FloatingPanelStageTriggerProps = Assign<
  HTMLProps<'button'>,
  FloatingPanelStageTriggerBaseProps
>;

/** Render the FloatingPanel stage trigger. */
export const FloatingPanelStageTrigger = (props: FloatingPanelStageTriggerProps) => {
  const [stage, localProps] = createSplitProps<StageTriggerProps>()(props, ['stage']);
  const floatingPanel = useFloatingPanelContext();
  const mergedProps = mergeProps(() => floatingPanel().getStageTriggerProps(stage), localProps);

  return <primitive.button {...mergedProps} state={floatingPanel().getStageTriggerState(stage)} />;
};
