import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useFloatingPanelContext } from './use-floating-panel-context';

export type FloatingPanelDragTriggerBaseProps = PolymorphicProps<'div'>;
export type FloatingPanelDragTriggerProps = Assign<
  HTMLProps<'div'>,
  FloatingPanelDragTriggerBaseProps
>;

/** Render the FloatingPanel drag trigger. */
export const FloatingPanelDragTrigger = (props: FloatingPanelDragTriggerProps) => {
  const floatingPanel = useFloatingPanelContext();
  const mergedProps = mergeProps(() => floatingPanel().getDragTriggerProps(), props);

  return <primitive.div {...mergedProps} />;
};
