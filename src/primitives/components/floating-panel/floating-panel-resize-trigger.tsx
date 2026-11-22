import type { Assign } from '../../types';
import type { ResizeTriggerProps, ResizeTriggerState } from '@zag-js/floating-panel';
import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useFloatingPanelContext } from './use-floating-panel-context';

export type FloatingPanelResizeTriggerState = ResizeTriggerState;

export type FloatingPanelResizeTriggerBaseProps = ResizeTriggerProps &
  PolymorphicProps<'div', FloatingPanelResizeTriggerState>;
export type FloatingPanelResizeTriggerProps = Assign<
  HTMLProps<'div'>,
  FloatingPanelResizeTriggerBaseProps
>;

/** Render the FloatingPanel resize trigger. */
export const FloatingPanelResizeTrigger = (props: FloatingPanelResizeTriggerProps) => {
  const [resizeProps, localProps] = createSplitProps<ResizeTriggerProps>()(props, ['placement']);
  const floatingPanel = useFloatingPanelContext();
  const mergedProps = mergeProps(
    () => floatingPanel().getResizeTriggerProps(resizeProps),
    localProps,
  );

  return (
    <primitive.div {...mergedProps} state={floatingPanel().getResizeTriggerState(resizeProps)} />
  );
};
