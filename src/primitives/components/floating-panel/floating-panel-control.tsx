import type { Assign } from '../../types';
import type { ControlState } from '@zag-js/floating-panel';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useFloatingPanelContext } from './use-floating-panel-context';

export type FloatingPanelControlState = ControlState;

export type FloatingPanelControlBaseProps = PolymorphicProps<'div', FloatingPanelControlState>;
export type FloatingPanelControlProps = Assign<HTMLProps<'div'>, FloatingPanelControlBaseProps>;

/** Render the FloatingPanel control. */
export const FloatingPanelControl = (props: FloatingPanelControlProps) => {
  const floatingPanel = useFloatingPanelContext();
  const mergedProps = mergeProps(() => floatingPanel().getControlProps(), props);

  return <primitive.div {...mergedProps} state={floatingPanel().getControlState()} />;
};
