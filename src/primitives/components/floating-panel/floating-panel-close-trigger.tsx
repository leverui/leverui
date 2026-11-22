import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useFloatingPanelContext } from './use-floating-panel-context';

export type FloatingPanelCloseTriggerBaseProps = PolymorphicProps<'button'>;
export type FloatingPanelCloseTriggerProps = Assign<
  HTMLProps<'button'>,
  FloatingPanelCloseTriggerBaseProps
>;

/** Render the FloatingPanel close trigger. */
export const FloatingPanelCloseTrigger = (props: FloatingPanelCloseTriggerProps) => {
  const floatingPanel = useFloatingPanelContext();
  const mergedProps = mergeProps(() => floatingPanel().getCloseTriggerProps(), props);

  return <primitive.button {...mergedProps} />;
};
