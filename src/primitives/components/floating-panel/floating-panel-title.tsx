import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useFloatingPanelContext } from './use-floating-panel-context';

export type FloatingPanelTitleBaseProps = PolymorphicProps<'h2'>;
export type FloatingPanelTitleProps = Assign<HTMLProps<'h2'>, FloatingPanelTitleBaseProps>;

/** Render the FloatingPanel title. */
export const FloatingPanelTitle = (props: FloatingPanelTitleProps) => {
  const floatingPanel = useFloatingPanelContext();
  const mergedProps = mergeProps(() => floatingPanel().getTitleProps(), props);

  return <primitive.h2 {...mergedProps} />;
};
