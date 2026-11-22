import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useFloatingPanelContext } from './use-floating-panel-context';

export type FloatingPanelBodyBaseProps = PolymorphicProps<'div'>;
export type FloatingPanelBodyProps = Assign<HTMLProps<'div'>, FloatingPanelBodyBaseProps>;

/** Render the FloatingPanel body. */
export const FloatingPanelBody = (props: FloatingPanelBodyProps) => {
  const floatingPanel = useFloatingPanelContext();
  const mergedProps = mergeProps(() => floatingPanel().getBodyProps(), props);
  return <primitive.div {...mergedProps} />;
};
