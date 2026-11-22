import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useFloatingPanelContext } from './use-floating-panel-context';

export type FloatingPanelHeaderBaseProps = PolymorphicProps<'div'>;
export type FloatingPanelHeaderProps = Assign<HTMLProps<'div'>, FloatingPanelHeaderBaseProps>;

/** Render the FloatingPanel header. */
export const FloatingPanelHeader = (props: FloatingPanelHeaderProps) => {
  const floatingPanel = useFloatingPanelContext();
  const mergedProps = mergeProps(() => floatingPanel().getHeaderProps(), props);

  return <primitive.div {...mergedProps} />;
};
