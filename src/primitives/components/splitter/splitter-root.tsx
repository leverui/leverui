import { mergeProps } from '../../utils/merge-part-props';
import type { Assign } from '../../types';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { type UseSplitterProps, useSplitter } from './use-splitter';
import { SplitterProvider } from './use-splitter-context';

export type SplitterRootBaseProps = UseSplitterProps & PolymorphicProps<'div'>;
export type SplitterRootProps = Assign<HTMLProps<'div'>, SplitterRootBaseProps>;

/** Render the Splitter root. */
export const SplitterRoot = (props: SplitterRootProps) => {
  const [useSplitterProps, localProps] = createSplitProps<UseSplitterProps>()(props, [
    'defaultSize',
    'disabled',
    'id',
    'ids',
    'keyboardResizeBy',
    'nonce',
    'onCollapse',
    'onExpand',
    'onResize',
    'onResizeEnd',
    'onResizeStart',
    'orientation',
    'panels',
    'size',
    'registry',
  ]);
  const api = useSplitter(useSplitterProps);
  const mergedProps = mergeProps(() => api().getRootProps(), localProps);

  return (
    <SplitterProvider value={api}>
      <primitive.div {...mergedProps} />
    </SplitterProvider>
  );
};
