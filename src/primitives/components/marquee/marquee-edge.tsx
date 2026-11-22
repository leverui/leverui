import type { Assign } from '../../types';
import type { EdgeProps } from '@zag-js/marquee';
import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useMarqueeContext } from './use-marquee-context';

export type MarqueeEdgeBaseProps = EdgeProps & PolymorphicProps<'div'>;
export type MarqueeEdgeProps = Assign<HTMLProps<'div'>, MarqueeEdgeBaseProps>;

/** Render the Marquee edge. */
export const MarqueeEdge = (props: MarqueeEdgeProps) => {
  const [edgeProps, localProps] = createSplitProps<EdgeProps>()(props, ['side']);
  const context = useMarqueeContext();
  const mergedProps = mergeProps(() => context().getEdgeProps(edgeProps), localProps);
  return <primitive.div {...mergedProps} />;
};
