import { mergeProps } from '../../utils/merge-part-props';
import type { PanelProps } from '@zag-js/splitter';
import type { Assign } from '../../types';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useSplitterContext } from './use-splitter-context';

export type SplitterPanelBaseProps = PanelProps & PolymorphicProps<'div'>;
export type SplitterPanelProps = Assign<HTMLProps<'div'>, SplitterPanelBaseProps>;

/** Render the Splitter panel. */
export const SplitterPanel = (props: SplitterPanelProps) => {
  const [panelProps, restProps] = createSplitProps<PanelProps>()(props, ['id']);
  const api = useSplitterContext();
  const mergedProps = mergeProps(() => api().getPanelProps(panelProps), restProps);

  return <primitive.div {...mergedProps} />;
};
